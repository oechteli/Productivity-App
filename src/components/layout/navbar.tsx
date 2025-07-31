"use client"

"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckSquare, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'

export function Navbar() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/auth'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
                      <Link href="/todos" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">FocusFlow</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/todos">
                <CheckSquare className="h-4 w-4 mr-2" />
                Todos
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Einstellungen
              </Link>
            </Button>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {user.user_metadata?.name || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Abmelden
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 