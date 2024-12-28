"use client"

import * as React from 'react'
import { AuthProvider } from '../lib/AuthContext'
import { TaskProvider } from '../lib/TaskContext'
import { useAuth } from '../lib/AuthContext'
import { useRouter } from 'next/navigation'

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
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Web3 Task Board</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Signed in as:</span>
              <span className="text-sm font-medium text-gray-900">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </TaskProvider>
    </AuthProvider>
  )
} 