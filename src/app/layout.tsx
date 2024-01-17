import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JS/TS Console',
  description: 'Simple JavaScript / TypeScript playground',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
