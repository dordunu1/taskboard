"use client"

import * as React from 'react'
import { Task, TaskCategory, TaskPriority } from '../lib/types'
import { Boxes, FolderIcon } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onDragStart: (e: React.DragEvent, taskId: string) => void
}

const priorityColors: Record<TaskPriority, { bg: string; text: string }> = {
  [TaskPriority.HIGH]: { bg: 'bg-red-100', text: 'text-red-800' },
  [TaskPriority.MEDIUM]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  [TaskPriority.LOW]: { bg: 'bg-green-100', text: 'text-green-800' },
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  const categoryIcons = {
    [TaskCategory.BLOCKCHAIN]: <Boxes className="w-4 h-4" />,
    [TaskCategory.GENERAL]: <FolderIcon className="w-4 h-4" />,
  }

  const priorityColor = priorityColors[task.priority]

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="group bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-move"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${priorityColor.bg} ${priorityColor.text}`}>
            {task.priority}
          </span>
          <span className="text-gray-500 group-hover:text-blue-500">
            {categoryIcons[task.category]}
          </span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {task.description}
      </p>
      <div className="space-y-1">
        {task.dueDate && (
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span className="font-medium">Due:</span>
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        {task.assignee && (
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span className="font-medium">Assigned to:</span>
            {task.assignee}
          </div>
        )}
      </div>
    </div>
  )
} 