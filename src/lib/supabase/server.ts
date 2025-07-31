import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Server client with service role (for admin operations)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// For server-side operations when cookies are available
export const createSupabaseServerClient = (cookieStore?: any) => {
  // For now, we'll use the regular client since we're mainly client-side
  // This can be expanded later for true server-side operations
  return createClient<Database>(
    supabaseUrl, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    }
  )
} 