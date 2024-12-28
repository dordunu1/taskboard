"use client"

import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TaskColumn } from './TaskColumn'
import { TaskDialog } from './TaskDialog'
import { Task, TaskStatus } from '../lib/types'
import { useTasks } from '../lib/TaskContext'
import { Plus } from 'lucide-react'

export function TaskBoard() {
  const { tasks } = useTasks()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | undefined>()

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(undefined)
    setIsDialogOpen(true)
  }

  const tasksByStatus = React.useMemo(() => {
    const grouped = {
      [TaskStatus.IDEATION]: [] as Task[],
      [TaskStatus.TODO]: [] as Task[],
      [TaskStatus.IN_PROGRESS]: [] as Task[],
      [TaskStatus.COMPLETED]: [] as Task[],
    }

    tasks.forEach((task) => {
      if (task.status in grouped) {
        grouped[task.status].push(task)
      }
    })

    return grouped
  }, [tasks])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <button
            onClick={handleCreateTask}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4 h-[calc(100vh-8rem)]">
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <TaskColumn
              key={status}
              status={status as TaskStatus}
              tasks={tasks}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
        <TaskDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false)
            setSelectedTask(undefined)
          }}
          task={selectedTask}
        />
      </div>
    </DndProvider>
  )
} 