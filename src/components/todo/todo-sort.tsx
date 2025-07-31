"use client"

import React, { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTodoStore } from '@/store/todo-store'

export function TodoSort() {
  const { sort, setSort } = useTodoStore()
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { value: 'priority', label: 'Priorität' },
    { value: 'start_date', label: 'Datum' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'created_at', label: 'Erstellt am' },
    { value: 'title', label: 'Titel' },
  ]

  const handleSortChange = (field: string) => {
    if (sort.field === field) {
      // Toggle direction if same field
      setSort({
        field: field as any,
        direction: sort.direction === 'asc' ? 'desc' : 'asc'
      })
    } else {
      // Set new field with default direction
      setSort({
        field: field as any,
        direction: field === 'priority' ? 'desc' : 'asc' // Priority should default to desc (highest first)
      })
    }
    setIsOpen(false)
  }

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sort.field)
    return option?.label || 'Sortierung'
  }

  const getSortIcon = () => {
    if (sort.direction === 'asc') {
      return <ArrowUp className="h-4 w-4" />
    } else {
      return <ArrowDown className="h-4 w-4" />
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm hover:bg-gray-50"
      >
        <ArrowUpDown className="h-4 w-4" />
        {getCurrentSortLabel()}
        {getSortIcon()}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 ${
                sort.field === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span>{option.label}</span>
              {sort.field === option.value && getSortIcon()}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 