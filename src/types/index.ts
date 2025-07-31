export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  timezone: string
  preferences: UserPreferences
  subscription_tier: 'free' | 'premium' | 'pro'
  created_at: string
}

export interface UserPreferences {
  default_view: 'list' | 'calendar'
  start_of_week: number // 0 = Sunday, 1 = Monday
  date_format: string
  theme: 'light' | 'dark' | 'auto'
  notifications: NotificationSettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  reminders: boolean
  daily_digest: boolean
}

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  icon?: string
  position: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  color: string
  allowedAssignees: string[]
  created_at: string
  updated_at: string
}

export interface Area {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export interface Todo {
  id: string
  user_id: string
  title: string
  description?: string
  completed: boolean
  priority: 1 | 2 | 3 | 4 // 1=low, 4=urgent
  due_date?: string
  due_time?: string
  start_date?: string
  start_time?: string
  end_date?: string
  assignees?: string[]
  area?: string
  project?: string
  category_id?: string
  repeat_pattern?: 'daily' | 'weekly' | 'monthly' | 'custom'
  repeat_config?: RepeatConfig
  position: number
  parent_id?: string // für subtasks
  created_at: string
  updated_at: string
  completed_at?: string
  subtasks?: Todo[]
}

export interface RepeatConfig {
  interval: number
  end_date?: string
  end_after_occurrences?: number
  days_of_week?: number[] // 0=Sunday, 1=Monday, etc.
  day_of_month?: number
}

export interface Event {
  id: string
  user_id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  all_day: boolean
  location?: string
  repeat_pattern?: string
  repeat_config?: RepeatConfig
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content?: string
  todo_id?: string
  created_at: string
  updated_at: string
}

export interface TodoFormData {
  title: string
  description?: string
  priority: 1 | 2 | 3 | 4
  due_date?: string
  due_time?: string
  start_date?: string
  start_time?: string
  end_date?: string
  assignees?: string[]
  area?: string
  project?: string
  category_id?: string
  repeat_pattern?: string
  repeat_config?: RepeatConfig
}

export interface CategoryFormData {
  name: string
  color: string
  icon?: string
}

export interface FilterOptions {
  status: 'all' | 'pending' | 'completed'
  priorities: number[]
  due_dates: string[]
  assignees: string[]
  start_dates: string[]
  areas: string[]
  projects: string[]
  search: string
}

export interface SortOptions {
  field: 'created_at' | 'due_date' | 'priority' | 'title' | 'position' | 'start_date'
  direction: 'asc' | 'desc'
}

export interface GroupOptions {
  field: 'none' | 'priority' | 'due_date' | 'assignees' | 'start_date' | 'area' | 'project'
}

export interface AppState {
  user: User | null
  todos: Todo[]
  categories: Category[]
  events: Event[]
  notes: Note[]
  filters: FilterOptions
  sort: SortOptions
  loading: boolean
  error: string | null
}

export interface ApiResponse<T> {
  data: T
  error: string | null
  success: boolean
}

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
} 