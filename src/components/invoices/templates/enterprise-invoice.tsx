import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { InvoiceHeader } from './components/InvoiceHeader'
import { InvoiceClientSection } from './components/InvoiceClientSection'
import { InvoiceInfoCard } from './components/InvoiceInfoCard'
import { InvoiceLineItemsTable } from './components/InvoiceLineItemsTable'
import { InvoiceSummaryCard } from './components/InvoiceSummaryCard'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function EnterpriseInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#020617' // Dark slate default
  const accentColor = '#334155'

  return (
    <div className="bg-white text-slate-900 p-8 md:p-12 max-w-[800px] mx-auto text-xs font-sans">
      <div className="border border-slate-300 p-6 mb-8">
        <InvoiceHeader 
          data={data} 
          layout="split" 
          primaryColor={primaryColor} 
        />
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8 border border-slate-300 p-6">
        <InvoiceClientSection 
          data={data} 
          labelColor={accentColor}
        />
        <div className="w-[1px] bg-slate-300 self-stretch hidden md:block"></div>
        <InvoiceInfoCard 
          data={data} 
          style="grid" 
        />
      </div>

      <div className="border border-slate-300 p-6 mb-8">
        <InvoiceLineItemsTable 
          data={data} 
          style="bordered" 
          primaryColor={primaryColor} 
        />
        
        <div className="border-t border-slate-300 pt-6 mt-6">
          <InvoiceSummaryCard 
            data={data} 
            style="classic" 
          />
        </div>
      </div>

      {(data.notes || data.paymentInstructions) && (
        <div className="border border-slate-300 p-6 page-break-inside-avoid">
          {data.notes && (
            <div className="mb-4">
              <h4 className="font-bold uppercase tracking-wider mb-1">Standard Terms</h4>
              <p className="text-slate-700 whitespace-pre-wrap break-words">{data.notes}</p>
            </div>
          )}
          {data.paymentInstructions && (
            <div>
              <h4 className="font-bold uppercase tracking-wider mb-1">Remittance Information</h4>
              <p className="text-slate-700 whitespace-pre-wrap break-words">{data.paymentInstructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function EnterpriseInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<fallbackConfig.component data={props.data} />}>
      <EnterpriseInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const enterpriseInvoiceConfig: InvoiceTemplateConfig = {
  id: 'enterprise-invoice',
  name: 'Enterprise Invoice',
  description: 'Formal procurement layout. Dense structural outlines and traditional corporate documentation style.',
  component: EnterpriseInvoiceErrorBoundary,
  primaryColor: '#020617',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
