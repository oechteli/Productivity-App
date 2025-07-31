import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Todo, Category, Project, Area, FilterOptions, SortOptions, GroupOptions } from '@/types'

interface TodoState {
  todos: Todo[]
  categories: Category[]
  projects: Project[]
  areas: Area[]
  filters: FilterOptions
  sort: SortOptions
  group: GroupOptions
  isLoading: boolean
  error: string | null

  // Actions
  addTodo: (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  reorderTodos: (startIndex: number, endIndex: number) => void
  
  addCategory: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  
  // Area Actions
  addArea: (area: Omit<Area, 'id' | 'created_at' | 'updated_at'>) => void
  updateArea: (id: string, updates: Partial<Area>) => void
  deleteArea: (id: string) => void
  
  setFilters: (filters: Partial<FilterOptions>) => void
  setSort: (sort: Partial<SortOptions>) => void
  setGroup: (group: Partial<GroupOptions>) => void
  clearFilters: () => void
  
  // Computed
  filteredTodos: Todo[]
  getTodoById: (id: string) => Todo | undefined
  getCategoryById: (id: string) => Category | undefined
  getProjectById: (id: string) => Project | undefined
  getAreaById: (id: string) => Area | undefined
}

// Mock data
const mockCategories: Category[] = [
  {
    id: 'cat-1',
    user_id: 'user-1',
    name: 'Arbeit',
    color: '#4F80FF',
    icon: '💼',
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    user_id: 'user-1',
    name: 'Persönlich',
    color: '#FF6B6B',
    icon: '👤',
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    user_id: 'user-1',
    name: 'Einkaufen',
    color: '#4ECDC4',
    icon: '🛒',
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    user_id: 'user-1',
    name: 'Gesundheit',
    color: '#45B7D1',
    icon: '🏥',
    position: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    user_id: 'user-1',
    name: 'Projektmanagement 2024',
    color: 'bg-blue-100 text-blue-700',
    allowedAssignees: ['Max Hoffmann', 'Anna Lutz', 'Isabel Jansen'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    user_id: 'user-1',
    name: 'Website Redesign',
    color: 'bg-green-100 text-green-700',
    allowedAssignees: ['Tom Weber', 'Sarah Klein'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    user_id: 'user-1',
    name: 'Marketing Campaign',
    color: 'bg-orange-100 text-orange-700',
    allowedAssignees: ['Anna Lutz', 'Max Hoffmann'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockAreas: Area[] = [
  {
    id: 'area-1',
    user_id: 'user-1',
    name: 'Business',
    color: 'bg-orange-100 text-orange-700',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'area-2',
    user_id: 'user-1',
    name: 'Personal',
    color: 'bg-blue-100 text-blue-700',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'area-3',
    user_id: 'user-1',
    name: 'Gesundheit',
    color: 'bg-pink-100 text-pink-700',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockTodos: Todo[] = [
  {
    id: 'todo-1',
    user_id: 'user-1',
    title: 'E-Mail an Kunden beantworten',
    description: 'Wichtige Anfrage bezüglich Projektstatus',
    completed: false,
    priority: 2,
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    due_time: '14:00',
    start_date: new Date().toISOString(),
    start_time: '09:00',
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignees: ['Max Hoffmann', 'Anna Lutz'],
    area: 'Kundenbetreuung',
    project: 'Projektmanagement 2024',
    category_id: 'cat-1',
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'todo-2',
    user_id: 'user-1',
    title: 'Einkaufsliste erstellen',
    description: 'Für Wochenendeinkauf',
    completed: true,
    priority: 1,
    due_date: new Date().toISOString(),
    due_time: undefined,
    start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    start_time: '10:30',
    assignees: ['Anna Weber'],
    area: 'Haushalt',
    project: 'Wochenplanung',
    category_id: 'cat-3',
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'todo-3',
    user_id: 'user-1',
    title: 'Arzttermin vereinbaren',
    description: 'Jährliche Vorsorgeuntersuchung',
    completed: false,
    priority: 3,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    due_time: undefined,
    start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    start_time: '14:00',
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignees: ['Dr. Müller'],
    area: 'Gesundheit',
    project: 'Vorsorge 2024',
    category_id: 'cat-4',
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const useTodoStore = create<TodoState>()(
  devtools(
    (set, get) => ({
      todos: mockTodos,
      categories: mockCategories,
      projects: mockProjects,
      areas: mockAreas,
      filters: {
        status: 'all',
        priorities: [],
        due_dates: [],
        assignees: [],
        start_dates: [],
        areas: [],
        projects: [],
        search: '',
      },
      sort: {
        field: 'created_at',
        direction: 'desc',
      },
      group: {
        field: 'none',
      },
      isLoading: false,
      error: null,

      addTodo: (todoData) => {
        console.log('addTodo called with:', todoData)
        const newTodo: Todo = {
          id: `todo-${Date.now()}`,
          ...todoData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        console.log('New todo created:', newTodo)
        
        set((state) => {
          console.log('Current todos before adding:', state.todos)
          const newTodos = [...state.todos, newTodo]
          console.log('New todos array:', newTodos)
          return { todos: newTodos }
        })
        
        console.log('Todo added to store')
      },

      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, ...updates, updated_at: new Date().toISOString() }
              : todo
          ),
        }))
      },

      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }))
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed, updated_at: new Date().toISOString() }
              : todo
          ),
        }))
      },

      reorderTodos: (startIndex, endIndex) => {
        set((state) => {
          const newTodos = [...state.todos]
          const [removed] = newTodos.splice(startIndex, 1)
          newTodos.splice(endIndex, 0, removed)
          return { todos: newTodos }
        })
      },

      addCategory: (categoryData) => {
        const newCategory: Category = {
          id: `cat-${Date.now()}`,
          ...categoryData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        set((state) => ({
          categories: [...state.categories, newCategory],
        }))
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? { ...category, ...updates, updated_at: new Date().toISOString() }
              : category
          ),
        }))
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          todos: state.todos.map((todo) =>
            todo.category_id === id ? { ...todo, category_id: undefined } : todo
          ),
        }))
      },

      // Project actions
      addProject: (project) => {
        const now = new Date().toISOString()
        const newProject: Project = {
          ...project,
          id: `proj-${Date.now()}`,
          created_at: now,
          updated_at: now,
        }
        set((state) => ({
          projects: [...state.projects, newProject],
        }))
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((proj) =>
            proj.id === id ? { ...proj, ...updates, updated_at: new Date().toISOString() } : proj
          ),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((proj) => proj.id !== id),
        }))
      },

      // Area actions
      addArea: (area) => {
        const now = new Date().toISOString()
        const newArea: Area = {
          ...area,
          id: `area-${Date.now()}`,
          created_at: now,
          updated_at: now,
        }
        set((state) => ({
          areas: [...state.areas, newArea],
        }))
      },

      updateArea: (id, updates) => {
        set((state) => ({
          areas: state.areas.map((area) =>
            area.id === id ? { ...area, ...updates, updated_at: new Date().toISOString() } : area
          ),
        }))
      },

      deleteArea: (id) => {
        set((state) => ({
          areas: state.areas.filter((area) => area.id !== id),
        }))
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }))
      },

      setSort: (sort) => {
        set((state) => ({
          sort: { ...state.sort, ...sort },
        }))
      },

      setGroup: (group) => {
        set((state) => ({
          group: { ...state.group, ...group },
        }))
      },

      clearFilters: () => {
        set({
          filters: {
            status: 'all',
            priorities: [],
            due_dates: [],
            assignees: [],
            start_dates: [],
            areas: [],
            projects: [],
            search: '',
          },
        })
      },

      get filteredTodos() {
        const state = get()
        let filtered = [...state.todos]

        // Filter by status
        if (state.filters.status === 'pending') {
          filtered = filtered.filter((todo) => !todo.completed)
        } else if (state.filters.status === 'completed') {
          filtered = filtered.filter((todo) => todo.completed)
        }

        // Filter by priorities
        if (state.filters.priorities && state.filters.priorities.length > 0) {
          filtered = filtered.filter((todo) => state.filters.priorities.includes(todo.priority))
        }

        // Filter by areas
        if (state.filters.areas && state.filters.areas.length > 0) {
          filtered = filtered.filter((todo) => todo.area && state.filters.areas.includes(todo.area))
        }

        // Filter by projects
        if (state.filters.projects && state.filters.projects.length > 0) {
          filtered = filtered.filter((todo) => todo.project && state.filters.projects.includes(todo.project))
        }

        // Filter by due dates
        if (state.filters.due_dates && state.filters.due_dates.length > 0) {
          filtered = filtered.filter((todo) => {
            if (!todo.due_date) return false
            const dueDate = new Date(todo.due_date).toDateString()
            return state.filters.due_dates.some(filterDate => {
              return new Date(filterDate).toDateString() === dueDate
            })
          })
        }

        // Filter by assignees
        if (state.filters.assignees && state.filters.assignees.length > 0) {
          filtered = filtered.filter((todo) => {
            if (!todo.assignees || todo.assignees.length === 0) return false
            return state.filters.assignees.some(filterAssignee => 
              todo.assignees!.includes(filterAssignee)
            )
          })
        }

        // Filter by start dates
        if (state.filters.start_dates && state.filters.start_dates.length > 0) {
          filtered = filtered.filter((todo) => {
            if (!todo.start_date) return false
            const startDate = new Date(todo.start_date).toDateString()
            return state.filters.start_dates.some(filterDate => {
              return new Date(filterDate).toDateString() === startDate
            })
          })
        }





        // Filter by search
        if (state.filters.search) {
          const searchLower = state.filters.search.toLowerCase()
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(searchLower) ||
              (todo.description && todo.description.toLowerCase().includes(searchLower))
          )
        }

        // Sort
        filtered.sort((a, b) => {
          const aValue = a[state.sort.field as keyof Todo]
          const bValue = b[state.sort.field as keyof Todo]

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return state.sort.direction === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }

          if (aValue instanceof Date && bValue instanceof Date) {
            return state.sort.direction === 'asc'
              ? aValue.getTime() - bValue.getTime()
              : bValue.getTime() - aValue.getTime()
          }

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return state.sort.direction === 'asc' ? aValue - bValue : bValue - aValue
          }

          return 0
        })

        return filtered
      },

      getTodoById: (id) => {
        const state = get()
        return state.todos.find((todo) => todo.id === id)
      },

      getCategoryById: (id) => {
        const state = get()
        return state.categories.find((category) => category.id === id)
      },

      getProjectById: (id) => {
        const state = get()
        return state.projects.find((proj) => proj.id === id)
      },

      getAreaById: (id) => {
        const state = get()
        return state.areas.find((area) => area.id === id)
      },
    }),
    {
      name: 'todo-store',
    }
  )
) 