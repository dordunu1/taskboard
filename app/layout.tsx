import * as React from 'react'
import './globals.css'
import { ClientLayout } from './client-layout'

export const metadata = {
  title: 'Web3 Task Board',
  description: 'A task board application for Web3 development workflow management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
} 