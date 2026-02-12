'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserWithRole() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  return {
    ...user,
    role: userProfile?.role || 'customer'
  }
}

export async function isAdmin() {
  const user = await getUserWithRole()
  return user?.role === 'admin'
}
