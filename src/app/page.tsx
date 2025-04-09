'use client';

import { useState, useEffect, useRef } from 'react';

const BACKEND_URL = 'https://casechapterbackend-production.up.railway.app';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'bot', message: string }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/hello`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  // Add new useEffect for auto-scrolling
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput;
    setChatInput('');
    setIsLoading(true);

    // Add user message
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: { role: 'user', content: userMessage }
        }),
      });

      const data = await response.json();

      // Add bot response from the backend
      setChatHistory(prev => [...prev, { type: 'bot', message: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message to chat
      setChatHistory(prev => [...prev, { type: 'bot', message: 'Sorry, there was an error processing your message.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main content container */}
      <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/40">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Chat Assistant
          </h1>

          {/* Chat messages display */}
          <div
            ref={chatContainerRef}
            className="mb-4 h-[500px] overflow-y-auto rounded-2xl p-6 bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-sm shadow-inner"
          >
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-6 flex flex-col ${chat.type === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Message header */}
                <div className={`text-sm font-medium mb-2 px-4 py-1.5 rounded-full ${chat.type === 'user'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-purple-100 text-purple-700'
                  }`}>
                  {chat.type === 'user' ? '👤 You' : '🤖 AI Assistant'}
                </div>
                {/* Message content */}
                <div
                  className={`p-4 rounded-2xl max-w-[80%] shadow-md ${chat.type === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                    : 'bg-white border border-purple-100'
                    }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {chat.message}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start mb-6">
                <div className="text-sm font-medium mb-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700">
                  🤖 AI Assistant
                </div>
                <div className="p-4 rounded-2xl max-w-[80%] shadow-md bg-white border border-purple-100">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSubmit} className="flex gap-4 mt-6">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 p-4 border border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 text-gray-800 placeholder-gray-400 transition-all duration-200"
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !chatInput.trim()}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:active:scale-100"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
} 