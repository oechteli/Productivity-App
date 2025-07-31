"use client"

import React from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Navbar } from './navbar'
import { usePathname } from 'next/navigation'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Pages that don't require authentication
  const publicPages = ['/auth']
  const isPublicPage = publicPages.includes(pathname)

  // If user is not authenticated and trying to access private page
  if (!user && !isPublicPage) {
    // Redirect to auth page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth'
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user is authenticated and trying to access auth page
  if (user && isPublicPage) {
    // Redirect to todos page
    if (typeof window !== 'undefined') {
      window.location.href = '/todos'
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Render layout based on authentication status
  if (user && !isPublicPage) {
    // Authenticated layout with navbar
    return (
      <>
        <Navbar />
        <main>{children}</main>
      </>
    )
  }

  // Public page layout without navbar
  return <main>{children}</main>
} 