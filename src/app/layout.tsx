import './global.css'

export const metadata = {
  title: 'AI Chat Assistant',
  description: 'AI Chat Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
