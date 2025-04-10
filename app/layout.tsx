import * as React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientLayout } from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Get Your Stuff Done!',
  description: 'A simple, efficient way to organize and track your tasks',
  icons: {
    icon: [
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
      },
    ],
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'Get Your Stuff Done!',
    description: 'A simple, efficient way to organize and track your tasks',
    images: [
      {
        url: '/done.png',
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
    images: ['/done.png'],
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
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
} 