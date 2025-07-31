// Export all Supabase related modules
export * from './client'
export * from './database'
export * from './types'

// Re-export commonly used types
export type { User, Session } from '@supabase/supabase-js'

// Export server operations only when needed
export { supabaseAdmin } from './server' 