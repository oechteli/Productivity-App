"use client"

import React, { useState } from 'react'
import { Group, ChevronDown, Users, Calendar, AlertTriangle, Tag, FolderOpen, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTodoStore } from '@/store/todo-store'

export function TodoGroup() {
  const { group, setGroup } = useTodoStore()
  const [isOpen, setIsOpen] = useState(false)

  const groupOptions = [
    { value: 'none', label: 'Keine Gruppierung', icon: <Group className="h-4 w-4" /> },
    { value: 'priority', label: 'Nach Priorität', icon: <Star className="h-4 w-4" /> },
    { value: 'due_date', label: 'Nach Due Date', icon: <AlertTriangle className="h-4 w-4" /> },
    { value: 'assignees', label: 'Nach Assignees', icon: <Users className="h-4 w-4" /> },
    { value: 'start_date', label: 'Nach Datum', icon: <Calendar className="h-4 w-4" /> },
    { value: 'area', label: 'Nach Area', icon: <Tag className="h-4 w-4" /> },
    { value: 'project', label: 'Nach Project', icon: <FolderOpen className="h-4 w-4" /> },
  ]

  const handleGroupChange = (field: string) => {
    setGroup({ field: field as any })
    setIsOpen(false)
  }

  const getCurrentGroupLabel = () => {
    const option = groupOptions.find(opt => opt.value === group.field)
    return option?.label || 'Gruppierung'
  }

  const getCurrentGroupIcon = () => {
    const option = groupOptions.find(opt => opt.value === group.field)
    return option?.icon || <Group className="h-4 w-4" />
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm hover:bg-gray-50"
      >
        {getCurrentGroupIcon()}
        {getCurrentGroupLabel()}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-52">
          {groupOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleGroupChange(option.value)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${
                group.field === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 