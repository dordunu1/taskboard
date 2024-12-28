"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Web3 Task Board
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your Web3 development tasks efficiently
          </p>
        </div>

        {user ? (
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Logged in as {user.email}
            </p>
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  ← Back to Sign In
                </button>
                <ResetPasswordForm />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
} 