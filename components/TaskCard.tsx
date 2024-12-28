"use client"

import * as React from 'react'
import { useDrag } from 'react-dnd'
import type { Identifier } from 'dnd-core'
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../lib/types'
import { Boxes, FolderIcon, Link2, Pencil, Trash2 } from 'lucide-react'
import { deleteTask } from '../lib/tasks'
import { Timestamp } from 'firebase/firestore'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

const priorityColors: Record<TaskPriority, { bg: string; text: string; darkBg: string; darkText: string }> = {
  [TaskPriority.HIGH]: { 
    bg: 'bg-red-100', 
    text: 'text-red-800',
    darkBg: 'dark:bg-red-500/20',
    darkText: 'dark:text-red-300'
  },
  [TaskPriority.MEDIUM]: { 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-800',
    darkBg: 'dark:bg-yellow-500/20',
    darkText: 'dark:text-yellow-200'
  },
  [TaskPriority.LOW]: { 
    bg: 'bg-green-100', 
    text: 'text-green-800',
    darkBg: 'dark:bg-green-500/20',
    darkText: 'dark:text-green-300'
  },
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
      className={`group relative bg-card p-4 rounded-lg shadow-sm border border-border hover:border-primary hover:shadow-md transition-all cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground group-hover:text-primary">
            {categoryIcons[task.category]}
          </span>
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
                className="p-1 rounded-full hover:bg-accent transition-colors"
                title="Edit task"
              >
                <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-1 rounded-full hover:bg-destructive/10 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
        {task.description}
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {task.dueDate && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="font-medium text-foreground">Due:</span>
                {formatDate(task.dueDate)}
              </div>
            )}
            {task.assignee && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="font-medium text-foreground">Assigned to:</span>
                {task.assignee}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${priorityColor.bg} ${priorityColor.text} ${priorityColor.darkBg} ${priorityColor.darkText}`}>
              {task.priority}
            </span>
            {task.links && Array.isArray(task.links) && task.links.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-1 rounded-full hover:bg-accent transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (task.links && task.links.length === 1) {
                          window.open(task.links[0], '_blank')
                        }
                      }}
                    >
                      <Link2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      {task.links.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm hover:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      {task.status === TaskStatus.IN_PROGRESS && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden rounded-b-lg">
          <div className="h-full bg-primary animate-progress" />
        </div>
      )}
    </div>
  )
} 