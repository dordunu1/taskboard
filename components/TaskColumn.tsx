"use client"

import * as React from 'react'
import { useDrop } from 'react-dnd'
import { TaskCard } from './TaskCard'
import { Task, TaskStatus } from '../lib/types'
import { updateTask } from '../lib/tasks'

const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.IDEATION]: 'Ideation',
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.COMPLETED]: 'Completed',
}

interface TaskColumnProps {
  status: TaskStatus
  tasks: Task[]
  onEditTask: (task: Task) => void
}

export function TaskColumn({ status, tasks, onEditTask }: TaskColumnProps) {
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
      className={`flex flex-col min-h-[300px] sm:min-h-[500px] rounded-lg border bg-card p-3 sm:p-4 ${
        isOver ? 'ring-2 ring-primary/20' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-1 sm:px-2">
        <h2 className="text-sm sm:text-base font-semibold">{statusLabels[status]}</h2>
        <span className="text-xs font-normal text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>
      <div className="flex-1 space-y-2 sm:space-y-3 overflow-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  )
} 