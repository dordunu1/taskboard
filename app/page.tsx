"use client"

import * as React from 'react'
import { TaskBoard } from '../components/TaskBoard'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { useTasks } from '../lib/TaskContext'

export default function Home() {
  const { loading } = useTasks()

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <TaskBoard />
        )}
      </div>
    </ProtectedRoute>
  )
} 