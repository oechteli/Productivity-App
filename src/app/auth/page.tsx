"use client"

import React, { useState } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  // Check if Supabase is configured
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              FocusFlow
            </h1>
            <p className="text-gray-600 mb-6">
              Ihre intelligente Todo-App für mehr Produktivität
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-800 font-medium mb-2">Setup erforderlich</h3>
              <p className="text-yellow-700 text-sm">
                Bitte konfigurieren Sie Ihre Supabase-Umgebungsvariablen in der .env.local Datei:
              </p>
              <ul className="text-yellow-700 text-xs mt-2 text-left">
                <li>• NEXT_PUBLIC_SUPABASE_URL</li>
                <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                <li>• SUPABASE_SERVICE_ROLE_KEY</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            FocusFlow
          </h1>
          <p className="text-gray-600">
            Ihre intelligente Todo-App für mehr Produktivität
          </p>
        </div>

        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
} 