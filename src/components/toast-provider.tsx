'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

export function ToastProvider() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success) {
      toast.success(success)
    }
    if (error) {
      toast.error(error)
    }

    if (success || error) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete('success')
      newParams.delete('error')
      const query = newParams.toString()
      router.replace(`${pathname}${query ? `?${query}` : ''}`)
    }
  }, [searchParams, pathname, router])

  return null
}
