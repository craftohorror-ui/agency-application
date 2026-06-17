import React from 'react'
import { InvoiceTemplateData } from '@/lib/invoice-template-registry'

interface InvoiceHeaderProps {
  data: InvoiceTemplateData
  layout?: 'split' | 'centered' | 'modern'
  primaryColor?: string
  accentColor?: string
}

export function InvoiceHeader({ data, layout = 'split', primaryColor = '#1e40af', accentColor = '#0f172a' }: InvoiceHeaderProps) {
  const hasLogo = !!data.agencyLogo

  if (layout === 'centered') {
    return (
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        {hasLogo && (
          <img 
            src={data.agencyLogo} 
            alt={data.agencyName} 
            className="h-16 w-auto object-contain"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>{data.agencyName}</h1>
          <div className="text-sm text-slate-500 mt-1 whitespace-pre-wrap">
            {[data.agencyEmail, data.agencyPhone, data.agencyWebsite].filter(Boolean).join(' • ')}
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'modern') {
    return (
      <div className="flex flex-col mb-8 border-l-4 pl-4" style={{ borderColor: primaryColor }}>
        {hasLogo && (
          <img 
            src={data.agencyLogo} 
            alt={data.agencyName} 
            className="h-12 w-auto object-contain mb-4"
          />
        )}
        <h1 className="text-2xl font-bold text-slate-900">{data.agencyName}</h1>
        <div className="text-sm text-slate-500 mt-2 flex flex-col gap-1 whitespace-pre-wrap">
          {data.agencyEmail && <span>{data.agencyEmail}</span>}
          {data.agencyPhone && <span>{data.agencyPhone}</span>}
          {data.agencyWebsite && <span>{data.agencyWebsite}</span>}
        </div>
      </div>
    )
  }

  // Default Split Layout
  return (
    <div className="flex justify-between items-start mb-8 gap-8">
      <div className="flex flex-col max-w-[50%]">
        {hasLogo && (
          <img 
            src={data.agencyLogo} 
            alt={data.agencyName} 
            className="h-12 w-auto object-contain mb-4"
          />
        )}
        <h1 className="text-xl font-bold" style={{ color: primaryColor }}>{data.agencyName}</h1>
      </div>
      <div className="text-right text-sm text-slate-500 flex flex-col gap-1 max-w-[50%] whitespace-pre-wrap">
        {data.agencyEmail && <span>{data.agencyEmail}</span>}
        {data.agencyPhone && <span>{data.agencyPhone}</span>}
        {data.agencyWebsite && <span>{data.agencyWebsite}</span>}
      </div>
    </div>
  )
}
