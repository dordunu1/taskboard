"use client"

import * as React from 'react'
import { useDrag } from 'react-dnd'
import { Task, TaskPriority } from '../lib/types'

interface TaskCardProps {
  task: Task
  onEdit: () => void
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task.id])

  React.useEffect(() => {
    if (cardRef.current) {
      drag(cardRef.current)
    }
  }, [drag])

  return (
    <div
      ref={cardRef}
      className={`bg-white border rounded-lg shadow-sm p-4 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {task.assignee && (
            <span className="inline-flex items-center">
              <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-1">
                {task.assignee.charAt(0).toUpperCase()}
              </span>
              {task.assignee}
            </span>
          )}
        </div>
        {task.dueDate && (
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
        className="mt-4 w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Edit
      </button>
    </div>
  )
} 