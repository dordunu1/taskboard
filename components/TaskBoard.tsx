"use client"

import * as React from 'react'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TaskDialog } from './TaskDialog'
import { TaskColumn } from './TaskColumn'
import { useTasks } from '../lib/TaskContext'
import { Task, TaskStatus } from '../lib/types'

export function TaskBoard() {
  const { tasks, loading } = useTasks()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>()

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(undefined)
    setIsDialogOpen(true)
  }

  const tasksByStatus = {
    [TaskStatus.IDEATION]: tasks.filter((task) => task.status === TaskStatus.IDEATION),
    [TaskStatus.TODO]: tasks.filter((task) => task.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.COMPLETED]: tasks.filter((task) => task.status === TaskStatus.COMPLETED),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          <button
            onClick={handleCreateTask}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TaskColumn
            status={TaskStatus.IDEATION}
            tasks={tasksByStatus[TaskStatus.IDEATION]}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            status={TaskStatus.TODO}
            tasks={tasksByStatus[TaskStatus.TODO]}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            status={TaskStatus.IN_PROGRESS}
            tasks={tasksByStatus[TaskStatus.IN_PROGRESS]}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            status={TaskStatus.COMPLETED}
            tasks={tasksByStatus[TaskStatus.COMPLETED]}
            onEditTask={handleEditTask}
          />
        </div>

        <TaskDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          task={selectedTask}
        />
      </div>
    </DndProvider>
  )
} 