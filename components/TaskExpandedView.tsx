"use client"

import * as React from 'react'
import { Task, Comment } from '../lib/types'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { MessageCircle, Send } from 'lucide-react'
import { addComment, getComments } from '../lib/tasks'
import { Timestamp } from 'firebase/firestore'
import dynamic from 'next/dynamic'

interface TaskExpandedViewProps {
  task: Task
  isOpen: boolean
  onClose: () => void
}

const TaskExpandedView = dynamic(
  () => Promise.resolve(function TaskExpandedViewComponent({ task, isOpen, onClose }: TaskExpandedViewProps) {
    const [comments, setComments] = React.useState<Comment[]>([])
    const [newComment, setNewComment] = React.useState('')
    const [userName, setUserName] = React.useState('')
    const [showNameInput, setShowNameInput] = React.useState(false)

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

    const handleAddComment = async () => {
      if (!userName) {
        setShowNameInput(true)
        return
      }

      if (newComment.trim() && userName.trim()) {
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
                        <span className="font-medium text-foreground">{comment.userName}</span>
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

            <div className="border-t p-4">
              {showNameInput && !userName ? (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground"
                  />
                  <Button
                    onClick={() => setShowNameInput(false)}
                    disabled={!userName.trim()}
                  >
                    Continue
                  </Button>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }),
  {
    ssr: false
  }
)

export { TaskExpandedView } 