"use client"

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Circle } from 'lucide-react'
import { useTodoStore } from '@/store/todo-store'
import { TodoItem } from './todo-item'

export function TodoList() {
  const todos = useTodoStore((state) => state.todos)
  const filters = useTodoStore((state) => state.filters)
  const sort = useTodoStore((state) => state.sort)
  const group = useTodoStore((state) => state.group)
  const getCategoryById = useTodoStore((state) => state.getCategoryById)

  // Helper function to get group key for a todo
  const getGroupKey = (todo: any, groupField: string): string => {
    switch (groupField) {
      case 'priority':
        const priorityLabels = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Urgent' }
        return priorityLabels[todo.priority as keyof typeof priorityLabels] || 'Unbekannt'
      case 'due_date':
        if (!todo.due_date) return 'Kein Due Date'
        const dueDate = new Date(todo.due_date)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)
        
        if (dueDate.toDateString() === today.toDateString()) return 'Heute'
        if (dueDate.toDateString() === tomorrow.toDateString()) return 'Morgen'
        if (dueDate < today) return 'Überfällig'
        return dueDate.toLocaleDateString('de-DE')
      case 'assignees':
        return todo.assignees && todo.assignees.length > 0 ? todo.assignees[0] : 'Nicht zugewiesen'
      case 'start_date':
        return todo.start_date ? new Date(todo.start_date).toLocaleDateString('de-DE') : 'Kein Datum'
      case 'area':
        return todo.area || 'Keine Area'
      case 'project':
        return todo.project || 'Kein Project'
      default:
        return 'Alle'
    }
  }

  // Helper function to get group order
  const getGroupOrder = (groupKey: string, groupField: string): number => {
    switch (groupField) {
      case 'priority':
        const priorityOrder = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3, 'Unbekannt': 4 }
        return priorityOrder[groupKey as keyof typeof priorityOrder] || 5
      case 'due_date':
        const dueDateOrder = { 'Überfällig': 0, 'Heute': 1, 'Morgen': 2 }
        if (dueDateOrder[groupKey as keyof typeof dueDateOrder] !== undefined) {
          return dueDateOrder[groupKey as keyof typeof dueDateOrder]
        }
        if (groupKey === 'Kein Due Date') return 999
        return 10 // Andere Daten
      default:
        return groupKey.localeCompare('')
    }
  }

  // Compute filtered + sorted + grouped todos locally to avoid infinite loop with getter
  const processedTodos = useMemo(() => {
    let result = [...todos]

    // Status filter
    if (filters.status === 'pending') {
      result = result.filter((t) => !t.completed)
    } else if (filters.status === 'completed') {
      result = result.filter((t) => t.completed)
    }

    // Priority filter
    if (filters.priorities.length > 0) {
      result = result.filter((t) => filters.priorities.includes(t.priority))
    }

    // Due Date filter
    if (filters.due_dates.length > 0) {
      result = result.filter((t) => {
        if (!t.due_date) return false
        const dueDate = new Date(t.due_date).toDateString()
        return filters.due_dates.some((d) => new Date(d).toDateString() === dueDate)
      })
    }

    // Assignees filter
    if (filters.assignees.length > 0) {
      result = result.filter((t) => {
        if (!t.assignees || t.assignees.length === 0) return false
        return filters.assignees.some((a) => t.assignees!.includes(a))
      })
    }

    // Start dates filter
    if (filters.start_dates.length > 0) {
      result = result.filter((t) => {
        if (!t.start_date) return false
        const sDate = new Date(t.start_date).toDateString()
        return filters.start_dates.some((d) => new Date(d).toDateString() === sDate)
      })
    }



    // Area filter
    if (filters.areas.length > 0) {
      result = result.filter((t) => t.area && filters.areas.includes(t.area))
    }

    // Project filter
    if (filters.projects.length > 0) {
      result = result.filter((t) => t.project && filters.projects.includes(t.project))
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          (t.description && t.description.toLowerCase().includes(searchLower))
      )
    }

    // Sorting
    result.sort((a, b) => {
      const field = sort.field
      const direction = sort.direction
      let aVal: any = a[field as keyof typeof a]
      let bVal: any = b[field as keyof typeof b]
      
      // Handle date fields
      if (field === 'due_date' || field === 'start_date' || field === 'created_at') {
        aVal = aVal ? new Date(aVal).getTime() : 0
        bVal = bVal ? new Date(bVal).getTime() : 0
      }
      
      // Handle missing values (put them at the end)
      if (!aVal && !bVal) return 0
      if (!aVal) return direction === 'asc' ? 1 : -1
      if (!bVal) return direction === 'asc' ? -1 : 1
      
      let comp = 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comp = aVal.localeCompare(bVal)
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comp = aVal - bVal
      }
      
      return direction === 'asc' ? comp : -comp
    })

    // Grouping
    if (group.field === 'none') {
      return { ungrouped: result }
    }

    const grouped = result.reduce((acc, todo) => {
      const groupKey = getGroupKey(todo, group.field)
      if (!acc[groupKey]) {
        acc[groupKey] = []
      }
      acc[groupKey].push(todo)
      return acc
    }, {} as { [key: string]: typeof result })

    // Sort groups by logical order
    const sortedGroups = Object.keys(grouped).sort((a, b) => {
      const orderA = getGroupOrder(a, group.field)
      const orderB = getGroupOrder(b, group.field)
      if (typeof orderA === 'number' && typeof orderB === 'number') {
        return orderA - orderB
      }
      return a.localeCompare(b)
    })

    const sortedGroupedResult: { [key: string]: typeof result } = {}
    sortedGroups.forEach(key => {
      sortedGroupedResult[key] = grouped[key]
    })

    return sortedGroupedResult
  }, [todos, filters, sort, group])

  const allTodos = Object.values(processedTodos).flat()
  
  if (allTodos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-muted-foreground mb-4">
          <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Keine Aufgaben gefunden</h3>
          <p className="text-sm">
            {filters.search ? 'Versuche andere Suchbegriffe' : 'Füge deine erste Aufgabe hinzu!'}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      <motion.div layout className="space-y-6">
        <AnimatePresence mode="popLayout">
          {Object.entries(processedTodos).map(([groupKey, groupTodos]) => (
            <motion.div
              key={groupKey}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              {group.field !== 'none' && (
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">{groupKey}</h3>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {groupTodos.length}
                  </span>
                </div>
              )}
              
              <div className="space-y-2">
                {groupTodos.map((todo) => {
                  const category = todo.category_id ? getCategoryById(todo.category_id) : undefined
                  return (
                    <motion.div
                      key={todo.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 1 }}
                    >
                      <TodoItem todo={todo} category={category} />
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
} 