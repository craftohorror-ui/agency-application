import React from 'react'
import { InvoiceTemplateData } from '@/lib/invoice-template-registry'

interface InvoiceClientSectionProps {
  data: InvoiceTemplateData
  labelColor?: string
  textColor?: string
  layout?: 'default' | 'horizontal'
}

export function InvoiceClientSection({ 
  data, 
  labelColor = '#64748b', 
  textColor = '#0f172a',
  layout = 'default'
}: InvoiceClientSectionProps) {
  
  if (layout === 'horizontal') {
    return (
      <div className="flex gap-12 mb-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
            Bill To
          </h3>
          <div className="flex flex-col gap-1 whitespace-pre-wrap break-words max-w-[300px]">
            <strong className="text-base" style={{ color: textColor }}>{data.clientName}</strong>
            {data.clientCompany && (
              <span className="text-sm" style={{ color: textColor }}>{data.clientCompany}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
        Bill To
      </h3>
      <div className="flex flex-col gap-1 whitespace-pre-wrap break-words max-w-[300px]">
        <strong className="text-base" style={{ color: textColor }}>{data.clientName}</strong>
        {data.clientCompany && (
          <span className="text-sm" style={{ color: textColor }}>{data.clientCompany}</span>
        )}
      </div>
    </div>
  )
}
