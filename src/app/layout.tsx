import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { Suspense } from 'react'
import { ToastProvider } from '@/components/toast-provider'
import { Inter, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'AgencyOS', template: '%s - AgencyOS' },
  description: 'The operating system for modern agencies.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${inter.variable} ${sourceSerif.variable}`}>
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
