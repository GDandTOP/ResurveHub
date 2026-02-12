'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'

export function RootLayoutWrapper ({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // admin 페이지는 자체 Header/Footer 사용
  const isAdminPage = pathname?.startsWith('/admin')

  if (isAdminPage) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
