import './globals.css'

export const metadata = {
  title: 'OpenClaw Executive Dashboard',
  description: 'Executive dashboard for managing Smarty/Optimus system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}