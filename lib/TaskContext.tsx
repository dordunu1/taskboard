"use client"

import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { Task } from './types'
import { subscribeToTasks } from './tasks'
import { useAuth } from './AuthContext'

interface TaskContextType {
  tasks: Task[]
  loading: boolean
}

const TaskContext = createContext<TaskContextType | null>(null)

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToTasks((tasks) => {
      setTasks(tasks)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const value = {
    tasks,
    loading,
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
} 