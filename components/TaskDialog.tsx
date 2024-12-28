"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Task, TaskStatus, TaskPriority, TaskCategory } from '../lib/types'
import { createTask, updateTask } from '../lib/tasks'
import { useAuth } from '../lib/AuthContext'
import { Timestamp } from 'firebase/firestore'

interface TaskDialogProps {
  isOpen: boolean
  onClose: () => void
  task?: Task
}

export function TaskDialog({ isOpen, onClose, task }: TaskDialogProps) {
  const { user } = useAuth()
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [status, setStatus] = React.useState<TaskStatus>(TaskStatus.TODO)
  const [priority, setPriority] = React.useState<TaskPriority>(TaskPriority.MEDIUM)
  const [category, setCategory] = React.useState<TaskCategory>(TaskCategory.GENERAL)
  const [dueDate, setDueDate] = React.useState<string>('')
  const [assignee, setAssignee] = React.useState('')
  const [links, setLinks] = React.useState<string[]>([])
  const [linkInput, setLinkInput] = React.useState('')

  // Update form state when task changes or dialog opens
  React.useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title)
        setDescription(task.description)
        setStatus(task.status)
        setPriority(task.priority)
        setCategory(task.category)
        setDueDate(task.dueDate ? task.dueDate.toDate().toISOString().split('T')[0] : '')
        setAssignee(task.assignee || '')
        setLinks(task.links || [])
      } else {
        // Reset form for new task
        setTitle('')
        setDescription('')
        setStatus(TaskStatus.TODO)
        setPriority(TaskPriority.MEDIUM)
        setCategory(TaskCategory.GENERAL)
        setDueDate('')
        setAssignee('')
        setLinks([])
      }
      setLinkInput('')
    }
  }, [isOpen, task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const taskData = {
      title,
      description,
      status,
      priority,
      category,
      dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : undefined,
      assignee,
      links: links.filter(link => link.trim() !== ''),
      createdBy: user.uid,
    }

    try {
      if (task) {
        await updateTask(task.id, taskData)
      } else {
        await createTask(taskData)
      }
      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const addLink = () => {
    if (linkInput.trim() && !links.includes(linkInput.trim())) {
      setLinks([...links, linkInput.trim()])
      setLinkInput('')
    }
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              >
                {Object.values(TaskStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              >
                {Object.values(TaskPriority).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              >
                {Object.values(TaskCategory).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Assignee</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Links</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="Enter URL"
                className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground"
              />
              <button
                type="button"
                onClick={addLink}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            {links.length > 0 && (
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index} className="flex items-center justify-between gap-2 text-sm">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                      {link}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 