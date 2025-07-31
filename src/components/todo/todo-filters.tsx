"use client"

import React, { useState } from 'react'
import { Search, Filter, X, Check, ChevronDown, AlertTriangle, Users, Calendar, Clock, Tag, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTodoStore } from '@/store/todo-store'

export function TodoFilters() {
  const { filters, setFilters, clearFilters, todos, areas, projects } = useTodoStore()
  const [showFilters, setShowFilters] = useState(false)

  // Get areas and projects from store
  const availableAreas = areas.map(area => area.name)
  const availableProjects = projects.map(project => project.name)
  const uniqueAssignees = Array.from(new Set(todos.flatMap(t => t.assignees || [])))
  const uniqueDueDates = Array.from(new Set(todos.filter(t => t.due_date).map(t => t.due_date!)))
  const uniqueStartDates = Array.from(new Set(todos.filter(t => t.start_date).map(t => t.start_date!)))

  const statusOptions = [
    { value: 'all', label: 'Alle' },
    { value: 'pending', label: 'Offen' },
    { value: 'completed', label: 'Erledigt' },
  ]

  const priorityOptions = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
    { value: 4, label: 'Urgent' },
  ]

  const hasActiveFilters = 
    filters.status !== 'all' ||
    filters.priorities.length > 0 ||
    filters.due_dates.length > 0 ||
    filters.assignees.length > 0 ||
    filters.start_dates.length > 0 ||
    filters.areas.length > 0 ||
    filters.projects.length > 0 ||
    filters.search

  const toggleFilter = (key: keyof typeof filters, value: any) => {
    if (key === 'search') {
      setFilters({ [key]: value })
      return
    }
    
    if (key === 'status') {
      // For status, we use single selection, but need to handle the array format for the dropdown
      const currentStatus = filters.status
      const newStatus = currentStatus === value ? 'all' : value
      setFilters({ [key]: newStatus })
      return
    }
    
    const currentArray = filters[key] as any[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    setFilters({ [key]: newArray })
  }

  const FilterDropdown = ({ 
    title, 
    icon, 
    options, 
    selectedValues, 
    filterKey 
  }: {
    title: string
    icon: React.ReactNode
    options: { value: any, label: string }[]
    selectedValues: any[]
    filterKey: keyof typeof filters
  }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-8 px-2 justify-start gap-1.5 w-full text-left rounded-md border transition-all text-sm ${
            selectedValues.length > 0 
              ? 'border-blue-300 bg-blue-50 text-blue-700' 
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {icon}
          <span className="text-sm">{title}</span>
                      {selectedValues.length > 0 && (
              <span className="ml-auto bg-blue-600 text-white rounded-full px-1 py-0.5 text-xs min-w-[14px] text-center">
                {selectedValues.length}
              </span>
            )}
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-full min-w-[180px] max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleFilter(filterKey, option.value)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-50"
              >
                <span>{option.label}</span>
                {selectedValues.includes(option.value) && (
                  <Check className="h-3 w-3 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Todos durchsuchen..."
            value={filters.search}
            onChange={(e) => toggleFilter('search', e.target.value)}
            className="pl-10 focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-gray-300"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 whitespace-nowrap ${
            hasActiveFilters 
              ? 'border-blue-300 bg-blue-50 text-blue-700' 
              : 'border-gray-200 bg-white text-black hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filter
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white rounded-full px-1.5 py-0.5 text-xs">
              {[
                filters.status !== 'all' ? 1 : 0,
                filters.priorities.length,
                filters.due_dates.length,
                filters.assignees.length,
                filters.start_dates.length,
                filters.areas.length,
                filters.projects.length
              ].reduce((sum, count) => sum + count, 0)}
            </span>
          )}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Filter Grid */}
      {showFilters && (
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-4xl mx-auto">
            
            <FilterDropdown
              title="Status"
              icon={<Check className="h-4 w-4" />}
              options={statusOptions}
              selectedValues={filters.status !== 'all' ? [filters.status] : []}
              filterKey="status"
            />

            <FilterDropdown
              title="Priority"
              icon={<AlertTriangle className="h-4 w-4" />}
              options={priorityOptions}
              selectedValues={filters.priorities}
              filterKey="priorities"
            />

            <FilterDropdown
              title="Due Date"
              icon={<Calendar className="h-4 w-4" />}
              options={uniqueDueDates.map(date => ({ 
                value: date, 
                label: new Date(date).toLocaleDateString('de-DE') 
              }))}
              selectedValues={filters.due_dates}
              filterKey="due_dates"
            />

            <FilterDropdown
              title="Assignees"
              icon={<Users className="h-4 w-4" />}
              options={uniqueAssignees.map(assignee => ({ 
                value: assignee, 
                label: assignee 
              }))}
              selectedValues={filters.assignees}
              filterKey="assignees"
            />

            <FilterDropdown
              title="Area"
              icon={<Tag className="h-4 w-4" />}
              options={availableAreas.map(area => ({ 
                value: area, 
                label: area 
              }))}
              selectedValues={filters.areas}
              filterKey="areas"
            />

            <FilterDropdown
              title="Project"
              icon={<FolderOpen className="h-4 w-4" />}
              options={availableProjects.map(project => ({ 
                value: project, 
                label: project 
              }))}
              selectedValues={filters.projects}
              filterKey="projects"
            />

            <FilterDropdown
              title="Datum"
              icon={<Calendar className="h-4 w-4" />}
              options={uniqueStartDates.map(date => ({ 
                value: date, 
                label: new Date(date).toLocaleDateString('de-DE') 
              }))}
              selectedValues={filters.start_dates}
              filterKey="start_dates"
            />

          </div>
        </div>
      )}
    </div>
  )
} 