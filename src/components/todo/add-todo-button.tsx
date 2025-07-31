"use client"

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddTodoModal } from './add-todo-modal'

export function AddTodoButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="text-white rounded-lg h-10 px-4"
        style={{ backgroundColor: '#2d4bff' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3bff'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2d4bff'}
      >
        <Plus className="h-5 w-5 mr-2" />
        Neue Aufgabe
      </Button>

      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
} 