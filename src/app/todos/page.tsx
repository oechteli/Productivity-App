"use client"

import React from 'react'
import { AddTodoButton } from '@/components/todo/add-todo-button'
import { TodoFilters } from '@/components/todo/todo-filters'
import { TodoList } from '@/components/todo/todo-list'
import { TodoSort } from '@/components/todo/todo-sort'
import { TodoGroup } from '@/components/todo/todo-group'
import { useTodoStore } from '@/store/todo-store'

export default function TodosPage() {

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Aufgaben</h1>
        <AddTodoButton />
      </div>

      {/* Controls Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="flex-1 w-full sm:w-auto">
            <TodoFilters />
          </div>
          <div className="flex gap-2">
            <TodoGroup />
            <TodoSort />
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="max-w-4xl mx-auto px-4">
        <TodoList />
      </div>
    </div>
  )
} 