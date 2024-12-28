"use client"

import * as React from 'react'
import { AuthProvider } from '../lib/AuthContext'
import { TaskProvider } from '../lib/TaskContext'
import { useAuth } from '../lib/AuthContext'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '../components/ThemeToggle'

function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <header className="bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-foreground">Web3 Task Board</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Signed in as:</span>
              <span className="text-sm font-medium text-foreground">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 inline-flex items-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <ThemeToggle />
        </div>
      </TaskProvider>
    </AuthProvider>
  )
} 