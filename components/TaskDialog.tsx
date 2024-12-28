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
import { FileUp, Loader2, X } from "lucide-react"
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
  const [title, setTitle] = React.useState(task?.title || "")
  const [description, setDescription] = React.useState(task?.description || "")
  const [status, setStatus] = React.useState<TaskStatus>(task?.status || TaskStatus.TODO)
  const [priority, setPriority] = React.useState<TaskPriority>(task?.priority || TaskPriority.MEDIUM)
  const [category, setCategory] = React.useState<TaskCategory>(task?.category || TaskCategory.GENERAL)
  const [dueDate, setDueDate] = React.useState(task?.dueDate ? new Date(task.dueDate.toDate()) : null)
  const [links, setLinks] = React.useState<string[]>(task?.links || [])
  const [newLink, setNewLink] = React.useState("")
  const [attachments, setAttachments] = React.useState<MediaAttachment[]>(task?.attachments || [])
  const [isUploading, setIsUploading] = React.useState(false)
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

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="space-y-2">
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
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileUp className="w-4 h-4 mr-2" />
                )}
                {isUploading ? "Uploading..." : "Upload Files"}
              </Button>
              
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-2 border rounded-md bg-muted"
                  >
                    <div className="flex items-center space-x-2">
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline"
                      >
                        {attachment.fileName}
                      </a>
                      <span className="text-xs text-muted-foreground">
                        ({formatFileSize(attachment.fileSize)})
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(attachment.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
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