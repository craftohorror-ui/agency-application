'use client'

import { AlertTriangleIcon } from 'lucide-react'

export default function PublicProposalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border text-center max-w-md w-full">
        <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangleIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-500 mb-6">
          We encountered an unexpected error while trying to load this proposal.
        </p>
        <button
          onClick={() => reset()}
          className="bg-slate-900 text-white px-6 py-2 rounded-md font-medium hover:bg-slate-800 transition-colors w-full"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
