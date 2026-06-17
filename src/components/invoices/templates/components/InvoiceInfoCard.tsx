import React from 'react'
import { InvoiceTemplateData } from '@/lib/invoice-template-registry'

interface InvoiceInfoCardProps {
  data: InvoiceTemplateData
  primaryColor?: string
  style?: 'grid' | 'cards' | 'minimal'
}

export function InvoiceInfoCard({ data, primaryColor = '#1e40af', style = 'grid' }: InvoiceInfoCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (style === 'minimal') {
    return (
      <div className="flex flex-col gap-2 text-right mb-8">
        <div className="text-sm">
          <span className="text-slate-500 mr-2">Invoice:</span>
          <strong className="text-slate-900">{data.number}</strong>
        </div>
        <div className="text-sm">
          <span className="text-slate-500 mr-2">Issue Date:</span>
          <span className="text-slate-900">{formatDate(data.issueDate)}</span>
        </div>
        <div className="text-sm">
          <span className="text-slate-500 mr-2">Due Date:</span>
          <span className="text-slate-900">{formatDate(data.dueDate)}</span>
        </div>
      </div>
    )
  }

  if (style === 'cards') {
    return (
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 min-w-[120px]">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Invoice No</div>
          <div className="font-semibold text-slate-900 break-words">{data.number}</div>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 min-w-[120px]">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Issue Date</div>
          <div className="font-semibold text-slate-900">{formatDate(data.issueDate)}</div>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 min-w-[120px]">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Due Date</div>
          <div className="font-semibold text-slate-900">{formatDate(data.dueDate)}</div>
        </div>
      </div>
    )
  }

  // Default Grid Style
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 bg-slate-50 p-4 rounded-lg mb-8 max-w-[400px]">
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Invoice No</div>
        <div className="font-medium text-slate-900 break-words">{data.number}</div>
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</div>
        <div className="font-medium capitalize" style={{ color: primaryColor }}>
          {data.status.replace('_', ' ')}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Issue Date</div>
        <div className="font-medium text-slate-900">{formatDate(data.issueDate)}</div>
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Due Date</div>
        <div className="font-medium text-slate-900">{formatDate(data.dueDate)}</div>
      </div>
    </div>
  )
}
