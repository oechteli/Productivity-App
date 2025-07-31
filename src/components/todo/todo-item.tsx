"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Edit, Trash2, MoreVertical, Calendar, Clock, CalendarDays, MapPin, FolderOpen, Users, ChevronDown, AlertTriangle, Tag } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Todo, Category } from '@/types'
import { useTodoStore } from '@/store/todo-store'
import { formatRelativeTime } from '@/lib/utils'
import { AddTodoModal } from './add-todo-modal'

interface TodoItemProps {
  todo: Todo
  category?: Category
}

const priorityIcons = {
  1: '!',
  2: '!!',
  3: '!!!',
  4: '!!!!',
}

const priorityColors = {
  1: 'text-gray-500',
  2: 'text-blue-500',
  3: 'text-orange-500',
  4: 'text-red-500',
}

// Area and Project color mappings from the form
const getAreaColor = (area: string) => {
  const areaColors: { [key: string]: string } = {
    'Business': 'bg-orange-100 text-orange-700',
    'Personal': 'bg-blue-100 text-blue-700',
    'Education': 'bg-green-100 text-green-700',
    'Health': 'bg-pink-100 text-pink-700',
    'Finance': 'bg-purple-100 text-purple-700',
    'Kundenbetreuung': 'bg-orange-100 text-orange-700',
    'Haushalt': 'bg-blue-100 text-blue-700',
    'Gesundheit': 'bg-pink-100 text-pink-700',
  }
  return areaColors[area] || 'bg-gray-100 text-gray-700'
}

const getProjectColor = (project: string) => {
  const projectColors: { [key: string]: string } = {
    'Product Launch': 'bg-blue-100 text-blue-700',
    'Website Redesign': 'bg-green-100 text-green-700',
    'Marketing Campaign': 'bg-orange-100 text-orange-700',
    'Mobile App': 'bg-purple-100 text-purple-700',
    'Brand Strategy': 'bg-pink-100 text-pink-700',
    'Projektmanagement 2024': 'bg-blue-100 text-blue-700',
    'Wochenplanung': 'bg-green-100 text-green-700',
    'Vorsorge 2024': 'bg-pink-100 text-pink-700',
  }
  return projectColors[project] || 'bg-gray-100 text-gray-700'
}

const getAssigneeColor = (assigneeName: string) => {
  const availableAssignees = [
    { id: 'OA', name: 'Oliver Ackermann', color: 'bg-orange-100 text-orange-700' },
    { id: 'AL', name: 'Anna Lutz', color: 'bg-purple-100 text-purple-700' },
    { id: 'IJ', name: 'Isabel Jansen', color: 'bg-green-100 text-green-700' },
    { id: 'MH', name: 'Max Hoffmann', color: 'bg-blue-100 text-blue-700' },
    { id: 'SK', name: 'Sarah Klein', color: 'bg-pink-100 text-pink-700' },
    { id: 'TW', name: 'Tom Weber', color: 'bg-indigo-100 text-indigo-700' },
  ]
  const assignee = availableAssignees.find(a => a.name === assigneeName)
  return assignee?.color || 'bg-gray-100 text-gray-700'
}

export function TodoItem({ todo, category }: TodoItemProps) {
  const { toggleTodo, deleteTodo, updateTodo, group } = useTodoStore()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleToggle = () => {
    toggleTodo(todo.id)
  }

  const handleDelete = () => {
    deleteTodo(todo.id)
  }

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const isOverdue = todo.due_date && !todo.completed && new Date(todo.due_date) < new Date()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className="group"
    >
      <Card className={`transition-all duration-200 hover:shadow-md rounded-xl ${
        todo.completed ? 'opacity-60' : ''
      } ${isOverdue ? 'border-red-200 bg-red-50 dark:bg-red-900/20' : ''}`}>
        <CardContent className="p-4 relative">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <div className="pt-1">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggle}
                className="h-5 w-5"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className={`text-lg font-medium ${
                    todo.completed ? 'line-through text-muted-foreground' : ''
                  }`}>
                    {todo.title}
                  </h3>

                  {/* Description */}
                  {todo.description && (
                    <p className={`text-sm text-muted-foreground mt-1 ${
                      todo.completed ? 'line-through' : ''
                    }`}>
                      {todo.description}
                    </p>
                  )}

                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {/* Project - hide if grouped by project */}
                    {todo.project && group.field !== 'project' && (
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getProjectColor(todo.project)} flex items-center gap-1`}>
                        <FolderOpen className="h-3 w-3" />
                        {todo.project}
                      </span>
                    )}

                    {/* Area - hide if grouped by area */}
                    {todo.area && group.field !== 'area' && (
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getAreaColor(todo.area)} flex items-center gap-1`}>
                        <Tag className="h-3 w-3" />
                        {todo.area}
                      </span>
                    )}

                    {/* Priority - hide if grouped by priority */}
                    {group.field !== 'priority' && (
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          color: todo.priority === 1 ? '#1d4ed8' : todo.priority === 2 ? '#ca8a04' : todo.priority === 3 ? '#ea580c' : '#dc2626',
                          backgroundColor: todo.priority === 1 ? '#dbeafe' : todo.priority === 2 ? '#fef3c7' : todo.priority === 3 ? '#fed7aa' : '#fecaca'
                        }}
                      >
                        {todo.priority === 1 ? 'Low' : todo.priority === 2 ? 'Medium' : todo.priority === 3 ? 'High' : 'Urgent'}
                      </span>
                    )}
                  </div>

                  {/* Date and Time Information */}
                  <div className="flex items-center gap-6 mt-3 text-sm text-gray-700">
                    {/* Start Date and Time Range - hide if grouped by start_date */}
                    {todo.start_date && group.field !== 'start_date' && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(todo.start_date).toLocaleDateString('de-DE', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                          {todo.start_time && todo.due_time && ` ${todo.start_time}-${todo.due_time}`}
                        </span>
                      </div>
                    )}

                    {/* Due Date - hide if grouped by due_date */}
                    {todo.due_date && group.field !== 'due_date' && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                          {new Date(todo.due_date).toLocaleDateString('de-DE', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Assignee Avatar - Bottom Right - hide if grouped by assignees */}
          {todo.assignees && todo.assignees.length > 0 && group.field !== 'assignees' && (
            <div className="absolute bottom-4 right-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${getAssigneeColor(todo.assignees[0])}`}>
                {todo.assignees[0].split(' ').map(n => n[0]).join('').substring(0, 2)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <AddTodoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editTodo={todo}
      />
    </motion.div>
  )
} 