"use client"

import * as React from "react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "../lib/AuthContext"
import { TaskProvider } from "../lib/TaskContext"
import { ThemeToggle } from "../components/ThemeToggle"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <TaskProvider>
          {children}
          <ThemeToggle />
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 