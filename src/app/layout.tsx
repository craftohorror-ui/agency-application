import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { Suspense } from 'react'
import { ToastProvider } from '@/components/toast-provider'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'AgencyOS', template: '%s - AgencyOS' },
  description: 'The operating system for modern agencies.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='min-h-screen'>
        {children}
        <Toaster richColors position="top-right" />
        <Suspense fallback={null}>
          <ToastProvider />
        </Suspense>
      </body>
    </html>
  )
}
