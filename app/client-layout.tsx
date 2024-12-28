"use client"

import * as React from 'react'
import { AuthProvider } from '../lib/AuthContext'
import { TaskProvider } from '../lib/TaskContext'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </AuthProvider>
  )
} 