"use client"

import * as React from 'react'
import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function ResetPasswordForm() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await resetPassword(email)
      setMessage('Password reset email sent. Please check your inbox.')
      setError('')
    } catch (err) {
      setError('Failed to send password reset email. Please try again.')
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground">
          Email address
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
          required
        />
      </div>
      {message && (
        <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full">
        Reset Password
      </Button>
    </form>
  )
} 