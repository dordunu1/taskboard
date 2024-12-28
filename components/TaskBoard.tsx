"use client"

import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TaskColumn } from './TaskColumn'
import { Task, TaskStatus } from '../lib/types'
import { TaskDialog } from './TaskDialog'

const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.IDEATION]: 'Ideation',
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.COMPLETED]: 'Completed',
}

interface TaskBoardProps {
  tasks: Task[]
}

export function TaskBoard({ tasks }: TaskBoardProps) {
  const [selectedTask, setSelectedTask] = React.useState<Task | undefined>()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(undefined)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedTask(undefined)
  }

  const tasksByStatus = React.useMemo(() => {
    const grouped = Object.values(TaskStatus).reduce<Record<TaskStatus, Task[]>>((acc, status) => {
      acc[status] = []
      return acc
    }, {} as Record<TaskStatus, Task[]>)

    tasks.forEach((task) => {
      grouped[task.status].push(task)
    })

    return grouped
  }, [tasks])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4 h-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <button
            onClick={handleCreateTask}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Create Task
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[calc(100vh-12rem)]">
          {Object.values(TaskStatus).map((status) => (
            <TaskColumn
              key={status}
              title={statusLabels[status]}
              status={status}
              tasks={tasksByStatus[status]}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      </div>
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        task={selectedTask}
      />
    </DndProvider>
  )
} 