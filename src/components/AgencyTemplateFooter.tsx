import React from 'react'

interface AgencyFooterData {
  legalName?: string | null
  agencyName: string
  registrationNumber?: string | null
  taxId?: string | null
  proposalFooter?: string | null
  contractFooter?: string | null
}

interface Props {
  data: AgencyFooterData
  type: 'proposal' | 'contract'
}

export function AgencyTemplateFooter({ data, type }: Props) {
  const footerText = type === 'proposal' ? data.proposalFooter : data.contractFooter
  const displayName = data.legalName || data.agencyName

  if (!footerText && !data.legalName && !data.registrationNumber && !data.taxId) {
    return null
  }

  return (
    <div className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-500 pb-8 print-avoid-break">
      <p className="font-semibold text-slate-700">{displayName}</p>
      
      <div className="flex items-center justify-center gap-2 mt-1 opacity-80">
        {data.registrationNumber && <span>Reg: {data.registrationNumber}</span>}
        {data.registrationNumber && data.taxId && <span>•</span>}
        {data.taxId && <span>Tax ID: {data.taxId}</span>}
      </div>

      {footerText && (
        <p className="mt-4 max-w-3xl mx-auto leading-relaxed opacity-90 whitespace-pre-wrap">
          {footerText}
        </p>
      )}
    </div>
  )
}
