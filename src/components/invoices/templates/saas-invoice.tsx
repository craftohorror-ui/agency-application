import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { InvoiceHeader } from './components/InvoiceHeader'
import { InvoiceClientSection } from './components/InvoiceClientSection'
import { InvoiceInfoCard } from './components/InvoiceInfoCard'
import { InvoiceLineItemsTable } from './components/InvoiceLineItemsTable'
import { InvoiceSummaryCard } from './components/InvoiceSummaryCard'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function SaaSInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#6366f1' // Indigo
  const accentColor = '#e0e7ff'

  return (
    <div className="bg-slate-50 text-slate-900 p-8 md:p-12 max-w-[800px] mx-auto text-sm min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <InvoiceHeader 
          data={data} 
          layout="modern" 
          primaryColor={primaryColor} 
        />
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mt-8 pt-8 border-t border-slate-100">
          <InvoiceClientSection 
            data={data} 
            labelColor={primaryColor}
          />
          <InvoiceInfoCard 
            data={data} 
            style="cards" 
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <InvoiceLineItemsTable 
          data={data} 
          style="classic" 
        />
        
        <InvoiceSummaryCard 
          data={data} 
          style="minimal" 
        />
      </div>

      {(data.notes || data.paymentInstructions) && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 page-break-inside-avoid">
          {data.notes && (
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Additional Notes</h4>
              <p className="text-slate-700 whitespace-pre-wrap break-words bg-slate-50 p-4 rounded-lg">{data.notes}</p>
            </div>
          )}
          {data.paymentInstructions && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">How to Pay</h4>
              <p className="text-slate-700 whitespace-pre-wrap break-words bg-slate-50 p-4 rounded-lg">{data.paymentInstructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function SaaSInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<fallbackConfig.component data={props.data} />}>
      <SaaSInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const saasInvoiceConfig: InvoiceTemplateConfig = {
  id: 'saas-invoice',
  name: 'SaaS Invoice',
  description: 'Technology-focused design. Dashboard-inspired cards and clean modern aesthetics.',
  component: SaaSInvoiceErrorBoundary,
  primaryColor: '#6366f1',
  secondaryColor: '#e0e7ff',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
