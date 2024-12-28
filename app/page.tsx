"use client"

import * as React from 'react'
import { TaskBoard } from '../components/TaskBoard'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto px-4 py-8">
        <TaskBoard />
      </main>
    </ProtectedRoute>
  )
} 