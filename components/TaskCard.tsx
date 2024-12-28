"use client"

import * as React from 'react'
import { useDrag } from 'react-dnd'
import type { Identifier } from 'dnd-core'
import { Task, TaskCategory, TaskPriority } from '../lib/types'
import { Boxes, FolderIcon, Pencil, Trash2 } from 'lucide-react'
import { deleteTask } from '../lib/tasks'
import { Timestamp } from 'firebase/firestore'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

const priorityColors: Record<TaskPriority, { bg: string; text: string }> = {
  [TaskPriority.HIGH]: { bg: 'bg-red-100', text: 'text-red-800' },
  [TaskPriority.MEDIUM]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  [TaskPriority.LOW]: { bg: 'bg-green-100', text: 'text-green-800' },
}

interface DragItem {
  id: string
  type: string
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const categoryIcons = {
    [TaskCategory.BLOCKCHAIN]: <Boxes className="w-4 h-4" />,
    [TaskCategory.GENERAL]: <FolderIcon className="w-4 h-4" />,
  }

  const priorityColor = priorityColors[task.priority] || priorityColors[TaskPriority.MEDIUM]

  const [{ isDragging }, dragRef] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'task',
    item: { id: task.id, type: 'task' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task.id])

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id)
    }
  }

  const formatDate = (date: Date | Timestamp | undefined) => {
    if (!date) return null
    const dateObj = date instanceof Timestamp ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString()
  }

  dragRef(ref)

  return (
    <div
      ref={ref}
      className={`group bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
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
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Edit task"
              >
                <Pencil className="w-4 h-4 text-gray-500 hover:text-blue-500" />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-1 rounded-full hover:bg-red-100 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {task.description}
      </p>
      <div className="space-y-1">
        {task.dueDate && (
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span className="font-medium">Due:</span>
            {formatDate(task.dueDate)}
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