"use client"

import * as React from "react"
import { Task, TaskStatus, TaskPriority, TaskCategory, MediaAttachment } from "../lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { createTask, updateTask } from "../lib/tasks"
import { useAuth } from "../lib/AuthContext"
import { Timestamp } from "firebase/firestore"
import { uploadTaskMedia } from "../lib/storage"
import { FileUp, Loader2, X, Upload, File } from "lucide-react"
import { cn } from "../lib/utils"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
  onTaskCreated?: () => void
  onTaskUpdated?: () => void
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  onTaskCreated,
  onTaskUpdated,
}: TaskDialogProps) {
  const { user } = useAuth()
  
  // Add effect to reset state when dialog opens/closes
  React.useEffect(() => {
    if (open && task) {
      console.log('Task data in edit mode:', task)
      setTitle(task.title || "")
      setDescription(task.description || "")
      setStatus(task.status || TaskStatus.TODO)
      setPriority(task.priority || TaskPriority.MEDIUM)
      setCategory(task.category || TaskCategory.GENERAL)
      setDueDate(task.dueDate ? new Date(task.dueDate.toDate()) : null)
      setLinks(task.links || [])
      setAttachments(task.attachments || [])
    } else if (!open) {
      // Reset form when closing
      setTitle("")
      setDescription("")
      setStatus(TaskStatus.TODO)
      setPriority(TaskPriority.MEDIUM)
      setCategory(TaskCategory.GENERAL)
      setDueDate(null)
      setLinks([])
      setAttachments([])
    }
  }, [open, task])

  // Initialize state with empty values
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [status, setStatus] = React.useState<TaskStatus>(TaskStatus.TODO)
  const [priority, setPriority] = React.useState<TaskPriority>(TaskPriority.MEDIUM)
  const [category, setCategory] = React.useState<TaskCategory>(TaskCategory.GENERAL)
  const [dueDate, setDueDate] = React.useState<Date | null>(null)
  const [links, setLinks] = React.useState<string[]>([])
  const [newLink, setNewLink] = React.useState("")
  const [attachments, setAttachments] = React.useState<MediaAttachment[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const taskData = {
      title,
      description,
      status,
      priority,
      category,
      dueDate: dueDate ? Timestamp.fromDate(dueDate) : undefined,
      links,
      attachments,
      createdBy: user.uid,
    }

    try {
      if (task) {
        await updateTask(task.id, taskData)
        onTaskUpdated?.()
      } else {
        await createTask(taskData)
        onTaskCreated?.()
      }
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !user) return

    setIsUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const taskId = task?.id || 'temp-' + Date.now()
        return await uploadTaskMedia(file, taskId, user.uid)
      })

      const newAttachments = await Promise.all(uploadPromises)
      setAttachments([...attachments, ...newAttachments])
    } catch (error) {
      console.error("Error uploading files:", error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter(a => a.id !== attachmentId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (!files.length || !user) return

    setIsUploading(true)
    try {
      const uploadPromises = files.map(async (file) => {
        const taskId = task?.id || 'temp-' + Date.now()
        return await uploadTaskMedia(file, taskId, user.uid)
      })

      const newAttachments = await Promise.all(uploadPromises)
      setAttachments([...attachments, ...newAttachments])
    } catch (error) {
      console.error("Error uploading files:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                {Object.values(TaskStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border rounded-md bg-background"
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
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                {Object.values(TaskCategory).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Attachments</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-4 transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                "relative"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                multiple
                className="hidden"
                accept={[
                  'image/*',
                  'application/pdf',
                  'text/plain',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ].join(',')}
              />
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Drag & drop files here or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported files: Images, PDF, Word, Text
                </p>
              </div>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                </div>
              )}
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-2 border rounded-md bg-muted/50 group hover:bg-muted"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <File className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline truncate"
                      >
                        {attachment.fileName}
                      </a>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        ({formatFileSize(attachment.fileSize)})
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(attachment.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      <span className="sr-only">Remove attachment</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Links</Label>
            <div className="flex gap-2">
              <Input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Add a link"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newLink) {
                    setLinks([...links, newLink])
                    setNewLink("")
                  }
                }}
              >
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-md bg-muted"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {link}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setLinks(links.filter((_, i) => i !== index))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 