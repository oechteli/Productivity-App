"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Calendar, Clock, User, Tag, Upload, FolderOpen,
  ChevronDown, AlertTriangle, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTodoStore } from '@/store/todo-store'
import { Todo } from '@/types'

interface AddTodoModalProps {
  isOpen: boolean
  onClose: () => void
  editTodo?: Todo | null
}

export function AddTodoModal({ isOpen, onClose, editTodo }: AddTodoModalProps) {
  const { addTodo, updateTodo, categories, projects, areas } = useTodoStore()
  
  // Form state
  const [title, setTitle] = useState('Neue Aufgabe')
  const [priority, setPriority] = useState<1 | 2 | 3 | 4 | null>(null)
  const [isPriorityOpen, setIsPriorityOpen] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [assignees, setAssignees] = useState<string[]>([])
  const [isAssigneesOpen, setIsAssigneesOpen] = useState(false)
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [area, setArea] = useState('')
  const [isAreaOpen, setIsAreaOpen] = useState(false)
  const [project, setProject] = useState('')
  const [isProjectOpen, setIsProjectOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const priorityOptions = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
    { value: 4, label: 'Urgent' },
  ]

  const availableAssignees = [
    { id: 'OA', name: 'Oliver Ackermann', color: 'bg-orange-100 text-orange-700' },
    { id: 'AL', name: 'Anna Lutz', color: 'bg-purple-100 text-purple-700' },
    { id: 'IJ', name: 'Isabel Jansen', color: 'bg-green-100 text-green-700' },
    { id: 'MH', name: 'Max Hoffmann', color: 'bg-blue-100 text-blue-700' },
    { id: 'SK', name: 'Sarah Klein', color: 'bg-pink-100 text-pink-700' },
    { id: 'TW', name: 'Tom Weber', color: 'bg-indigo-100 text-indigo-700' },
  ]

  // Convert store data to options format
  const areaOptions = areas.map(area => ({
    value: area.name,
    label: area.name,
    color: area.color
  }))

  const projectOptions = projects.map(project => ({
    value: project.name,
    label: project.name,
    color: project.color
  }))

  const selectedPriority = priority ? priorityOptions.find(p => p.value === priority) : null
  const selectedArea = area ? areaOptions.find(a => a.value === area) : null
  const selectedProject = project ? projectOptions.find(p => p.value === project) : null

  const toggleAssignee = (assigneeId: string) => {
    setAssignees(prev => 
      prev.includes(assigneeId) 
        ? prev.filter(id => id !== assigneeId)
        : [...prev, assigneeId]
    )
  }

  const handleFileSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '*/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setSelectedFile(file)
      }
    }
    input.click()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isPriorityOpen) {
        setIsPriorityOpen(false)
      }
      if (isAssigneesOpen) {
        setIsAssigneesOpen(false)
      }
      if (isAreaOpen) {
        setIsAreaOpen(false)
      }
      if (isProjectOpen) {
        setIsProjectOpen(false)
      }
    }

    if (isPriorityOpen || isAssigneesOpen || isAreaOpen || isProjectOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPriorityOpen, isAssigneesOpen, isAreaOpen, isProjectOpen])

  // Reset form when modal opens or load edit data
  useEffect(() => {
    if (isOpen) {
      if (editTodo) {
        // Load existing todo data for editing
        setTitle(editTodo.title)
        setPriority(editTodo.priority)
        setDueDate(editTodo.due_date || '')
        setDate(editTodo.start_date || '')
        setStartTime(editTodo.start_time || '')
        setEndTime(editTodo.due_time || '')
        setArea(editTodo.area || '')
        setProject(editTodo.project || '')
        setDescription(editTodo.description || '')
        // Convert assignee names back to IDs
        const assigneeIds = (editTodo.assignees || []).map(name => {
          const assignee = availableAssignees.find(a => a.name === name)
          return assignee?.id || name
        })
        setAssignees(assigneeIds)
        setSelectedFile(null)
      } else {
        // Reset for new todo
        setTitle('Neue Aufgabe')
        setPriority(null)
        setDueDate('')
        setAssignees([])
        setDate('')
        setStartTime('')
        setEndTime('')
        setArea('')
        setProject('')
        setDescription('')
        setSelectedFile(null)
      }
      // Reset dropdown states
      setIsPriorityOpen(false)
      setIsAssigneesOpen(false)
      setIsAreaOpen(false)
      setIsProjectOpen(false)
    }
  }, [isOpen, editTodo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    const assigneeNames = assignees.map(id => {
      const assignee = availableAssignees.find(a => a.id === id)
      return assignee?.name || id
    })

    if (editTodo) {
      // Update existing todo
      updateTodo(editTodo.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority: priority || 1,
        due_date: dueDate || undefined,
        due_time: endTime || undefined,
        start_date: date || undefined,
        start_time: startTime || undefined,
        end_date: undefined,
        assignees: assigneeNames.length > 0 ? assigneeNames : undefined,
        area: area || undefined,
        project: project || undefined,
      })
    } else {
      // Create new todo
      addTodo({
        user_id: 'user-1',
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        priority: priority || 1,
        due_date: dueDate || undefined,
        due_time: endTime || undefined,
        start_date: date || undefined,
        start_time: startTime || undefined,
        end_date: undefined,
        assignees: assigneeNames.length > 0 ? assigneeNames : undefined,
        area: area || undefined,
        project: project || undefined,
        category_id: undefined,
        position: 0,
      })
    }

    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-lg border border-[#D8D8D8] shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-10 pt-8 pb-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-medium text-gray-900 border-none bg-transparent p-0 focus:ring-0 focus:outline-none shadow-none focus:border-none focus:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none"
              placeholder="Titel eingeben..."
            />
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-400" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-10 pb-4">
            
            {/* Single column layout - everything stacked vertically */}
            <div className="space-y-4">
              
              {/* Priority */}
              <div className="flex items-center">
                <div className="flex items-center text-gray-600 w-32">
                  <ChevronDown className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">Priority</span>
                </div>
                
                <div className="relative ml-10">
                  <button
                    type="button"
                    onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border-none focus:outline-none cursor-pointer"
                    style={{
                      color: priority === 1 ? '#1d4ed8' : priority === 2 ? '#ca8a04' : priority === 3 ? '#ea580c' : '#dc2626',
                      backgroundColor: priority === 1 ? '#dbeafe' : priority === 2 ? '#fef3c7' : priority === 3 ? '#fed7aa' : '#fecaca'
                    }}
                  >
                    <span style={{ color: selectedPriority ? '#374151' : '#9ca3af' }}>
                      {selectedPriority?.label || 'Leer'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isPriorityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 w-auto"
                      >
                        {priorityOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setPriority(option.value as 1 | 2 | 3 | 4)
                              setIsPriorityOpen(false)
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left whitespace-nowrap"
                          >
                            <span className="flex-1 text-left">{option.label}</span>
                            {priority === option.value && (
                              <Check className="h-4 w-4 text-blue-500 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center">
                <div className="flex items-center text-gray-600 w-32">
                  <AlertTriangle className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">Due Date</span>
                </div>
                <div style={{ marginLeft: 'calc(2.5rem + 1px)' }}>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-auto text-sm border-none bg-transparent focus:ring-0 focus:outline-none focus:border-none focus:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none p-0 h-auto m-0"
                  />
                </div>
              </div>

              {/* Assignees */}
              <div className="flex items-center">
                <div className="flex items-center text-gray-600 w-32">
                  <User className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">Asignees</span>
                </div>
                
                <div className="relative ml-10">
                  <button
                    type="button"
                    onClick={() => setIsAssigneesOpen(!isAssigneesOpen)}
                    className="flex gap-1"
                  >
                    {assignees.length > 0 ? (
                      assignees.map((assigneeId) => {
                        const assignee = availableAssignees.find(a => a.id === assigneeId)
                        const initials = assignee?.name 
                          ? assignee.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                          : assigneeId
                        return (
                          <span
                            key={assigneeId}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${assignee?.color || 'bg-gray-100 text-gray-700'}`}
                          >
                            {initials}
                          </span>
                        )
                      })
                    ) : (
                      <span className="text-xs font-medium text-gray-400">Leer</span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isAssigneesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 w-auto"
                      >
                        {availableAssignees.map((assignee) => (
                          <button
                            key={assignee.id}
                            type="button"
                            onClick={() => toggleAssignee(assignee.id)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left whitespace-nowrap"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${assignee.color}`}>
                                {assignee.id}
                              </span>
                              <span className="text-left">{assignee.name}</span>
                            </div>
                            {assignees.includes(assignee.id) && (
                              <Check className="h-4 w-4 text-blue-500 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Datum */}
              <div className="flex items-center">
                <div className="flex items-center text-gray-600 w-32">
                  <Calendar className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">Datum</span>
                </div>
                <div style={{ marginLeft: 'calc(2.5rem + 1px)' }}>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-auto text-sm border-none bg-transparent focus:ring-0 focus:outline-none focus:border-none focus:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none p-0 h-auto m-0"
                  />
                </div>
              </div>

              {/* Startzeit */}
              <div className="flex items-center">
                <div className="flex items-center text-gray-600 w-32">
                  <Clock className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">Startzeit</span>
                </div>
                <div style={{ marginLeft: 'calc(2.5rem + 1px)' }}>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-auto text-sm border-none bg-transparent focus:ring-0 focus:outline-none focus:border-none focus:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none p-0 h-auto m-0"
                  />
                </div>
              </div>

              {/* Endzeit */}
              <div className="flex items-center">
                <div className="flex items-center text-gray-600 w-32">
                  <Clock className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">Endzeit</span>
                </div>
                <div style={{ marginLeft: 'calc(2.5rem + 1px)' }}>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-auto text-sm border-none bg-transparent focus:ring-0 focus:outline-none focus:border-none focus:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none p-0 h-auto m-0"
                  />
                </div>
              </div>

              {/* Area */}
              <div className="flex items-center">
                <div className="flex items-center w-32" style={{ color: '#5a5e67' }}>
                  <Tag className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">Area</span>
                </div>
                
                <div className="relative ml-10">
                  <button
                    type="button"
                    onClick={() => setIsAreaOpen(!isAreaOpen)}
                    className={`px-2 py-1 rounded-md text-xs font-medium border-none focus:outline-none cursor-pointer ${selectedArea?.color || 'bg-gray-100 text-gray-700'}`}
                  >
                    <span style={{ color: selectedArea ? '#374151' : '#9ca3af' }}>
                      {selectedArea?.label || 'Leer'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isAreaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 w-auto"
                      >
                        {areaOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setArea(option.value)
                              setIsAreaOpen(false)
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left whitespace-nowrap"
                          >
                            <span className="flex-1 text-left">{option.label}</span>
                            {area === option.value && (
                              <Check className="h-4 w-4 text-blue-500 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Project */}
              <div className="flex items-center">
                <div className="flex items-center w-32" style={{ color: '#5a5e67' }}>
                  <FolderOpen className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">Project</span>
                </div>
                
                <div className="relative ml-10">
                  <button
                    type="button"
                    onClick={() => setIsProjectOpen(!isProjectOpen)}
                    className={`px-2 py-1 rounded-md text-xs font-medium border-none focus:outline-none cursor-pointer ${selectedProject?.color || 'bg-gray-100 text-gray-700'}`}
                  >
                    <span style={{ color: selectedProject ? '#374151' : '#9ca3af' }}>
                      {selectedProject?.label || 'Leer'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isProjectOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 w-auto"
                      >
                        {projectOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setProject(option.value)
                              setIsProjectOpen(false)
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left whitespace-nowrap"
                          >
                            <span className="flex-1 text-left">{option.label}</span>
                            {project === option.value && (
                              <Check className="h-4 w-4 text-blue-500 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Upload */}
              <div className="flex items-center">
                <div className="flex items-center text-gray-600 w-32">
                  <Upload className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">Upload</span>
                </div>
                <div className="ml-10">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleFileSelect}
                    className="text-xs text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-500 px-2 py-1 h-auto"
                  >
                    {selectedFile ? selectedFile.name : 'Select file'}
                  </Button>
                </div>
              </div>

              {/* Spacer */}
              <div className="h-6"></div>

              {/* Description */}
              <div className="space-y-3 mt-56">
                <Label htmlFor="description" className="text-sm font-medium" style={{ color: '#5a5e67' }}>
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder=""
                  className="min-h-[120px] border-gray-200 resize-none mt-4 focus:ring-0 focus:outline-none focus:border-gray-200 focus-visible:ring-0 focus-visible:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-10 pb-6">
                              <Button type="submit" className="rounded-lg" style={{ backgroundColor: '#2d4bff' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3bff'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2d4bff'}>
                  Create Task
                </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
} 