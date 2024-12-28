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
      className={`flex flex-col min-h-[500px] rounded-lg border bg-card p-4 ${
        isOver ? 'ring-2 ring-primary/20' : ''
      }`}
    >
      <h2 className="text-base font-semibold px-2 mb-4 flex items-center gap-2">
        {statusLabels[status]}
        <span className="text-xs font-normal text-muted-foreground ml-auto">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </h2>
      <div className="flex-1 space-y-3 overflow-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  )
} 