import * as React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientLayout } from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Get Your Stuff Done!',
  description: 'A simple, efficient way to organize and track your tasks',
  openGraph: {
    title: 'Get Your Stuff Done!',
    description: 'A simple, efficient way to organize and track your tasks',
    images: [
      {
        url: '/done.jpg',
        width: 1200,
        height: 630,
        alt: 'Get Your Stuff Done! - Task Management Made Simple'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Your Stuff Done!',
    description: 'A simple, efficient way to organize and track your tasks',
    images: ['/done.jpg'],
    creator: '@realchriswilder'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
} 