"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Calendar, Clock, Tag, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTodoStore } from '@/store/todo-store'

export function QuickAdd() {
  const { addTodo, categories } = useTodoStore()
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const parseNaturalLanguage = (text: string) => {
    const result = {
      title: text,
      description: '',
      priority: 1 as 1 | 2 | 3 | 4,
      due_date: undefined as string | undefined,
      due_time: undefined as string | undefined,
      category_id: undefined as string | undefined,
    }

    // Parse priority (!, !!, !!!, !!!!)
    const priorityMatch = text.match(/(!{1,4})\s*/)
    if (priorityMatch) {
      result.priority = (priorityMatch[1].length as 1 | 2 | 3 | 4)
      result.title = text.replace(priorityMatch[0], '').trim()
    }

    // Parse category (#category)
    const categoryMatch = text.match(/#(\w+)/)
    if (categoryMatch) {
      const categoryName = categoryMatch[1].toLowerCase()
      const category = categories.find(cat => 
        cat.name.toLowerCase().includes(categoryName) ||
        categoryName.includes(cat.name.toLowerCase())
      )
      if (category) {
        result.category_id = category.id
        result.title = text.replace(categoryMatch[0], '').trim()
      }
    }

    // Parse date (tomorrow, today, next week, etc.)
    const tomorrowMatch = text.match(/tomorrow|morgen/i)
    if (tomorrowMatch) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      result.due_date = tomorrow.toISOString()
      result.title = text.replace(tomorrowMatch[0], '').trim()
    }

    const todayMatch = text.match(/today|heute/i)
    if (todayMatch) {
      const today = new Date()
      result.due_date = today.toISOString()
      result.title = text.replace(todayMatch[0], '').trim()
    }

    const nextWeekMatch = text.match(/next week|nächste woche/i)
    if (nextWeekMatch) {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      result.due_date = nextWeek.toISOString()
      result.title = text.replace(nextWeekMatch[0], '').trim()
    }

    // Parse time (at 3pm, um 15:00, etc.)
    const timeMatch = text.match(/(?:at|um)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm|uhr)?/i)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1])
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
      const period = timeMatch[3]?.toLowerCase()

      if (period === 'pm' && hours < 12) hours += 12
      if (period === 'am' && hours === 12) hours = 0

      result.due_time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      result.title = text.replace(timeMatch[0], '').trim()
    }

    return result
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted!', { input })
    
    if (!input.trim()) {
      console.log('Input is empty')
      return
    }

    const parsed = parseNaturalLanguage(input)
    console.log('Parsed result:', parsed)
    
    if (parsed.title.trim()) {
      console.log('Adding todo:', parsed)
      
      // Get current state before adding
      const currentTodos = useTodoStore.getState().todos
      console.log('Current todos in store before adding:', currentTodos.length)
      
      addTodo({
        user_id: 'user-1',
        title: parsed.title.trim(),
        description: parsed.description,
        completed: false,
        priority: parsed.priority,
        due_date: parsed.due_date,
        due_time: parsed.due_time,
        category_id: parsed.category_id,
        position: 0,
      })
      
      // Check state after adding
      setTimeout(() => {
        const newTodos = useTodoStore.getState().todos
        console.log('Todos in store after adding:', newTodos.length)
        console.log('Latest todo:', newTodos[newTodos.length - 1])
      }, 100)
      
      console.log('Todo added successfully')
      setInput('')
      setIsExpanded(false)
    } else {
      console.log('No title after parsing')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('Enter pressed')
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setIsExpanded(false)
      setInput('')
    }
  }

  return (
    <div className="mb-6">
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : '60px' }}
        className="overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder="Was muss erledigt werden? (z.B. 'Call mom tomorrow at 3pm #personal !high')"
              className="h-14 text-lg pr-12"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0"
              disabled={!input.trim()}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 p-4 bg-muted/50 rounded-lg"
              >
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Tipps für natürliche Sprache:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3" />
                      <span>! !! !!! !!!! für Priorität</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      <span>#kategorie für Kategorien</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>tomorrow, today, next week</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>at 3pm, um 15:00</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(prev => `${prev} #${category.name.toLowerCase()}`)}
                      className="text-xs"
                      style={{ borderColor: category.color, color: category.color }}
                    >
                      {category.icon} {category.name}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  )
} 