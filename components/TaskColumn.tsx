"use client"

import * as React from 'react'
import { useDrop } from 'react-dnd'
import { TaskCard } from './TaskCard'
import { Task, TaskStatus } from '../lib/types'
import { updateTask } from '../lib/tasks'

interface TaskColumnProps {
  title: string
  status: TaskStatus
  tasks: Task[]
  onEditTask?: (task: Task) => void
}

export function TaskColumn({ title, status, tasks, onEditTask }: TaskColumnProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: async (item: { id: string }) => {
      await updateTask(item.id, { status })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [status])

  drop(ref)

  return (
    <div
      ref={ref}
      className={`h-full p-4 rounded-lg bg-card/50 border border-border ${
        isOver ? 'ring-2 ring-primary ring-opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <span className="text-sm font-medium text-muted-foreground">{tasks.length}</span>
      </div>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-16rem)]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  )
} 