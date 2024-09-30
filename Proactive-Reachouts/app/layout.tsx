import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Proactive Reachout Manager',
  description: 'Manage your reachout data efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}