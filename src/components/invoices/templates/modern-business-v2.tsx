import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { InvoiceHeader } from './components/InvoiceHeader'
import { InvoiceClientSection } from './components/InvoiceClientSection'
import { InvoiceInfoCard } from './components/InvoiceInfoCard'
import { InvoiceLineItemsTable } from './components/InvoiceLineItemsTable'
import { InvoiceSummaryCard } from './components/InvoiceSummaryCard'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function ModernBusinessV2Template({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#1e40af'
  const accentColor = '#0f172a'

  return (
    <div className="bg-white text-slate-900 p-8 md:p-12 max-w-[800px] mx-auto text-sm">
      <InvoiceHeader 
        data={data} 
        layout="split" 
        primaryColor={primaryColor} 
        accentColor={accentColor} 
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mt-12 mb-12">
        <InvoiceClientSection 
          data={data} 
          labelColor={primaryColor}
        />
        <InvoiceInfoCard 
          data={data} 
          style="cards" 
          primaryColor={primaryColor} 
        />
      </div>

      <InvoiceLineItemsTable 
        data={data} 
        style="modern" 
        primaryColor={primaryColor} 
      />
      
      <InvoiceSummaryCard 
        data={data} 
        style="modern" 
        primaryColor={primaryColor} 
      />

      {(data.notes || data.paymentInstructions) && (
        <div className="mt-12 pt-8 border-t border-slate-100 page-break-inside-avoid">
          {data.notes && (
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Notes</h4>
              <p className="text-slate-700 whitespace-pre-wrap break-words">{data.notes}</p>
            </div>
          )}
          {data.paymentInstructions && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Payment Instructions</h4>
              <p className="text-slate-700 whitespace-pre-wrap break-words">{data.paymentInstructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ModernBusinessV2ErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<fallbackConfig.component data={props.data} />}>
      <ModernBusinessV2Template data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const modernBusinessInvoiceConfig: InvoiceTemplateConfig = {
  id: 'modern-business',
  name: 'Modern Business',
  description: 'A clean, corporate layout featuring standard grids, blue/white color emphasis, and professional spacing.',
  component: ModernBusinessV2ErrorBoundary,
  primaryColor: '#1e40af',
  secondaryColor: '#f1f5f9',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
