import { supabase } from './client'
import type { Database } from './types'

type Todo = Database['public']['Tables']['todos']['Row']
type TodoInsert = Database['public']['Tables']['todos']['Insert']
type TodoUpdate = Database['public']['Tables']['todos']['Update']

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

type Area = Database['public']['Tables']['areas']['Row']
type AreaInsert = Database['public']['Tables']['areas']['Insert']
type AreaUpdate = Database['public']['Tables']['areas']['Update']

// ====== TODO OPERATIONS ======

export const todoOperations = {
  // Get all todos for a user
  async getAll(userId: string): Promise<Todo[]> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Create a new todo
  async create(todo: TodoInsert): Promise<Todo> {
    const { data, error } = await supabase
      .from('todos')
      .insert(todo)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a todo
  async update(id: string, updates: TodoUpdate): Promise<Todo> {
    const { data, error } = await supabase
      .from('todos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a todo
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Toggle todo completion
  async toggle(id: string): Promise<Todo> {
    // First get the current state
    const { data: current, error: fetchError } = await supabase
      .from('todos')
      .select('completed')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Toggle the completion state
    const { data, error } = await supabase
      .from('todos')
      .update({ 
        completed: !current.completed,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// ====== PROJECT OPERATIONS ======

export const projectOperations = {
  // Get all projects for a user
  async getAll(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Create a new project
  async create(project: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a project
  async update(id: string, updates: ProjectUpdate): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a project
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get project by ID
  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }
}

// ====== AREA OPERATIONS ======

export const areaOperations = {
  // Get all areas for a user
  async getAll(userId: string): Promise<Area[]> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Create a new area
  async create(area: AreaInsert): Promise<Area> {
    const { data, error } = await supabase
      .from('areas')
      .insert(area)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update an area
  async update(id: string, updates: AreaUpdate): Promise<Area> {
    const { data, error } = await supabase
      .from('areas')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete an area
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('areas')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get area by ID
  async getById(id: string): Promise<Area | null> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }
}

// ====== AUTH OPERATIONS ======

export const authOperations = {
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Sign in with email
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign up with email
  async signUpWithEmail(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || ''
        }
      }
    })
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
} 