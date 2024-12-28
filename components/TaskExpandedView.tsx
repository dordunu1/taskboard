"use client"

import * as React from "react"
import { Task, Comment } from '../lib/types'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { MessageCircle, Send, User } from 'lucide-react'
import { addComment, getComments } from '../lib/tasks'
import { Timestamp } from 'firebase/firestore'

interface TaskExpandedViewProps {
  task: Task
  isOpen: boolean
  onClose: () => void
}

function generateProfileColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 70%, 40%)`
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function TaskExpandedView({ task, isOpen, onClose }: TaskExpandedViewProps) {
  const [comments, setComments] = React.useState<Comment[]>([])
  const [newComment, setNewComment] = React.useState('')
  const [userName, setUserName] = React.useState('')
  const [isSubmittingName, setIsSubmittingName] = React.useState(false)
  const [tempUserName, setTempUserName] = React.useState('')

  React.useEffect(() => {
    if (isOpen && task.id) {
      const loadComments = async () => {
        try {
          const taskComments = await getComments(task.id)
          setComments(taskComments)
        } catch (error) {
          console.error('Error loading comments:', error)
        }
      }
      loadComments()
    }
  }, [isOpen, task.id])

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempUserName.trim().length >= 2) {
      setUserName(tempUserName.trim())
      setIsSubmittingName(true)
    }
  }

  const handleAddComment = async () => {
    if (!userName.trim() || !isSubmittingName) {
      return
    }

    if (newComment.trim()) {
      try {
        await addComment(task.id, {
          text: newComment.trim(),
          userName: userName.trim(),
          createdAt: Timestamp.now(),
        })

        const updatedComments = await getComments(task.id)
        setComments(updatedComments)
        setNewComment('')
      } catch (error) {
        console.error('Error adding comment:', error)
      }
    }
  }

  const formatDate = (timestamp: Timestamp) => {
    try {
      return timestamp.toDate().toLocaleString()
    } catch (error) {
      return ''
    }
  }

  const ProfileIcon = ({ name }: { name: string }) => (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
      style={{ backgroundColor: generateProfileColor(name) }}
    >
      {getInitials(name)}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="text-2xl font-bold text-foreground">
          {task.title}
        </DialogTitle>
        <div className="flex flex-col h-[80vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="text-muted-foreground">{task.description}</p>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5" />
                Comments
              </h3>
              
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-foreground flex items-center gap-2">
                        <ProfileIcon name={comment.userName} />
                        {comment.userName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t p-4 space-y-4">
            {!isSubmittingName ? (
              <form onSubmit={handleSubmitName} className="flex flex-col gap-2">
                <label htmlFor="userName" className="text-sm font-medium text-foreground">
                  Enter your name to comment
                </label>
                <div className="flex gap-2">
                  <input
                    id="userName"
                    type="text"
                    value={tempUserName}
                    onChange={(e) => setTempUserName(e.target.value)}
                    placeholder="Your name (minimum 2 characters)"
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground"
                    minLength={2}
                    required
                  />
                  <Button type="submit" disabled={tempUserName.trim().length < 2}>
                    Continue
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ProfileIcon name={userName} />
                  <span className="text-sm text-muted-foreground">
                    Commenting as <span className="font-medium text-foreground">{userName}</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsSubmittingName(false)
                      setTempUserName('')
                    }}
                    className="ml-auto text-xs"
                  >
                    Change name
                  </Button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleAddComment()
                      }
                    }}
                  />
                  <Button onClick={handleAddComment}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 