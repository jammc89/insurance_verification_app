import './globals.css'

export const metadata = {
  title: 'Insurance Verification App',
  description: 'Dental insurance verification made simple',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
