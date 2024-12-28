"use client"

import * as React from 'react'
import { useDrop } from 'react-dnd'
import { TaskCard } from './TaskCard'
import { Task, TaskStatus } from '../lib/types'
import { updateTaskStatus } from '../lib/tasks'

interface TaskColumnProps {
  status: TaskStatus
  tasks: Task[]
  onEditTask: (task: Task) => void
}

const statusLabels: Record<TaskStatus, string> = {
  ideation: 'Ideation',
  todo: 'To Do',
  inProgress: 'In Progress',
  completed: 'Completed',
}

export function TaskColumn({ status, tasks, onEditTask }: TaskColumnProps) {
  const columnRef = React.useRef<HTMLDivElement>(null)
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => {
      updateTaskStatus(item.id, status)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [status])

  React.useEffect(() => {
    if (columnRef.current) {
      drop(columnRef.current)
    }
  }, [drop])

  return (
    <div
      ref={columnRef}
      className={`bg-white rounded-lg shadow p-4 ${
        isOver ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {statusLabels[status]}
        </h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
          />
        ))}
      </div>
    </div>
  )
} 