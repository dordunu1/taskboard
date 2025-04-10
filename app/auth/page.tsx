"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { SignInForm } from '../../components/auth/SignInForm'
import { SignUpForm } from '../../components/auth/SignUpForm'
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm'
import { useAuth } from '../../lib/AuthContext'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('signin')
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  const handleResetPassword = () => {
    setActiveTab('reset')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            Web3 Task Board
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your Web3 development tasks efficiently
          </p>
        </div>

        {user ? (
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Logged in as {user.email}
            </p>
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive"
            >
              Logout
            </button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4">
              <SignInForm onResetPassword={handleResetPassword} />
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <SignUpForm />
            </TabsContent>
            <TabsContent value="reset" className="space-y-4">
              <div className="space-y-4">
                <button
                  onClick={() => setActiveTab('signin')}
                  className="text-sm text-primary hover:text-primary/90"
                >
                  ← Back to Sign In
                </button>
                <ResetPasswordForm />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image
              src="/profile.png"
              alt="Chris Wilder"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Built by Chris Wilder</p>
            <a
              href="https://x.com/realchriswilder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/90 flex items-center gap-1"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @realchriswilder
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 