'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// 비밀번호 유효성 검사 함수
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 10) {
    return { valid: false, error: '비밀번호는 최소 10자 이상이어야 합니다.' }
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!hasUpperCase) {
    return { valid: false, error: '비밀번호에 대문자가 포함되어야 합니다.' }
  }

  if (!hasLowerCase) {
    return { valid: false, error: '비밀번호에 소문자가 포함되어야 합니다.' }
  }

  if (!hasNumber) {
    return { valid: false, error: '비밀번호에 숫자가 포함되어야 합니다.' }
  }

  if (!hasSpecialChar) {
    return { valid: false, error: '비밀번호에 특수문자가 포함되어야 합니다.' }
  }

  return { valid: true }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const name = formData.get('name') as string

  // 유효성 검사
  if (!email || !password || !confirmPassword || !name) {
    return { error: '모든 필드를 입력해주세요.' }
  }

  if (password !== confirmPassword) {
    return { error: '비밀번호가 일치하지 않습니다.' }
  }

  // 비밀번호 강도 검사
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    return { error: passwordValidation.error }
  }

  const supabase = await createServerSupabaseClient()

  // Supabase로 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: {
        name: name
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user && !data.user.identities?.length) {
    return { error: '이미 가입된 이메일입니다.' }
  }

  return { success: true }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 유효성 검사
  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.' }
  }

  const supabase = await createServerSupabaseClient()

  // Supabase로 로그인
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    // 이메일 미인증 에러 처리
    if (error.message === 'Email not confirmed') {
      return { error: '이메일 인증이 필요합니다. 메일함을 확인해주세요.' }
    }
    
    // 기타 에러 처리
    if (error.message.includes('Invalid login credentials')) {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }

    return { error: error.message }
  }

  // 캐시 무효화
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  
  // 캐시 무효화
  revalidatePath('/', 'layout')
  redirect('/')
}
