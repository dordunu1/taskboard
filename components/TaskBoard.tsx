"use client"

import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TaskColumn } from './TaskColumn'
import { TaskDialog } from './TaskDialog'
import { Task, TaskStatus } from '../lib/types'
import { useTasks } from '../lib/TaskContext'
import { useAuth } from '../lib/AuthContext'
import { LogOut, Plus, User } from 'lucide-react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export function TaskBoard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { tasks } = useTasks()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | undefined>()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(undefined)
    setIsDialogOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setSelectedTask(undefined)
    }
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
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 sm:h-16 gap-4 sm:gap-0">
            <h1 className="text-xl font-semibold text-foreground">Tasks</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-8 w-full sm:w-auto">
              <Button
                onClick={handleCreateTask}
                className="inline-flex items-center justify-center gap-2"
                size="default"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
              <div className="flex items-center justify-between sm:justify-start gap-2 text-sm text-muted-foreground sm:border-r sm:pr-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">{user?.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-[1600px] mx-auto">
            {Object.entries(tasksByStatus).map(([status, tasks]) => (
              <TaskColumn
                key={status}
                status={status as TaskStatus}
                tasks={tasks}
                onEditTask={handleEditTask}
              />
            ))}
          </div>
        </div>
        <TaskDialog
          open={isDialogOpen}
          onOpenChange={handleDialogChange}
          task={selectedTask}
          onTaskCreated={() => handleDialogChange(false)}
          onTaskUpdated={() => handleDialogChange(false)}
        />
      </div>
    </DndProvider>
  )
} 