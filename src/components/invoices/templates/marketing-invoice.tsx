import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { InvoiceHeader } from './components/InvoiceHeader'
import { InvoiceClientSection } from './components/InvoiceClientSection'
import { InvoiceInfoCard } from './components/InvoiceInfoCard'
import { InvoiceLineItemsTable } from './components/InvoiceLineItemsTable'
import { InvoiceSummaryCard } from './components/InvoiceSummaryCard'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function MarketingInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#ec4899' // Pink default for marketing
  const accentColor = '#fdf2f8'

  return (
    <div className="bg-white text-slate-900 mx-auto max-w-[800px] overflow-hidden text-sm border-t-8" style={{ borderTopColor: primaryColor }}>
      <div className="p-8 md:p-12 pb-0">
        <InvoiceHeader 
          data={data} 
          layout="split" 
          primaryColor={primaryColor} 
        />
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mt-12 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <InvoiceClientSection 
            data={data} 
            labelColor={primaryColor}
            textColor="#0f172a"
          />
          <InvoiceInfoCard 
            data={data} 
            style="minimal" 
            primaryColor={primaryColor} 
          />
        </div>
      </div>

      <div className="px-8 md:px-12">
        <InvoiceLineItemsTable 
          data={data} 
          style="bordered" 
          primaryColor={primaryColor} 
        />
      </div>
      
      <div className="px-8 md:px-12 mt-8">
        <InvoiceSummaryCard 
          data={data} 
          style="modern" 
          primaryColor={primaryColor} 
        />
      </div>

      {(data.notes || data.paymentInstructions) && (
        <div className="p-8 md:p-12 mt-8 bg-slate-50 page-break-inside-avoid">
          {data.notes && (
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>Notes</h4>
              <p className="text-slate-700 whitespace-pre-wrap break-words">{data.notes}</p>
            </div>
          )}
          {data.paymentInstructions && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>Payment Details</h4>
              <p className="text-slate-700 whitespace-pre-wrap break-words">{data.paymentInstructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function MarketingInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<fallbackConfig.component data={props.data} />}>
      <MarketingInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const marketingInvoiceConfig: InvoiceTemplateConfig = {
  id: 'marketing-invoice',
  name: 'Marketing Agency',
  description: 'Vibrant creative style. Brand color accents, bold sections, and strong visual hierarchy.',
  component: MarketingInvoiceErrorBoundary,
  primaryColor: '#ec4899',
  secondaryColor: '#fdf2f8',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
