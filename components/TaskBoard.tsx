"use client"

import * as React from 'react'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TaskDialog } from './TaskDialog'
import { TaskColumn } from './TaskColumn'
import { useTasks } from '../lib/TaskContext'
import { Task } from '../lib/types'

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
    ideation: tasks.filter((task) => task.status === 'ideation'),
    todo: tasks.filter((task) => task.status === 'todo'),
    inProgress: tasks.filter((task) => task.status === 'inProgress'),
    completed: tasks.filter((task) => task.status === 'completed'),
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
            status="ideation"
            tasks={tasksByStatus.ideation}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            status="todo"
            tasks={tasksByStatus.todo}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            status="inProgress"
            tasks={tasksByStatus.inProgress}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            status="completed"
            tasks={tasksByStatus.completed}
            onEditTask={handleEditTask}
          />
        </div>

        <TaskDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          task={selectedTask}
        />
      </div>
    </DndProvider>
  )
} 