export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          completed: boolean
          priority: 1 | 2 | 3 | 4
          due_date: string | null
          due_time: string | null
          start_date: string | null
          start_time: string | null
          end_date: string | null
          assignees: string[] | null
          area: string | null
          project: string | null
          category_id: string | null
          position: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: 1 | 2 | 3 | 4
          due_date?: string | null
          due_time?: string | null
          start_date?: string | null
          start_time?: string | null
          end_date?: string | null
          assignees?: string[] | null
          area?: string | null
          project?: string | null
          category_id?: string | null
          position?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: 1 | 2 | 3 | 4
          due_date?: string | null
          due_time?: string | null
          start_date?: string | null
          start_time?: string | null
          end_date?: string | null
          assignees?: string[] | null
          area?: string | null
          project?: string | null
          category_id?: string | null
          position?: number
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          color: string
          allowed_assignees: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          color: string
          allowed_assignees?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          color?: string
          allowed_assignees?: string[]
        }
      }
      areas: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          color: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          color: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          color?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 