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
      className={`flex flex-col h-full rounded-lg bg-muted/50 p-4 ${
        isOver ? 'ring-2 ring-primary' : ''
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">{statusLabels[status]}</h2>
      <div className="flex-1 space-y-4 overflow-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  )
} 