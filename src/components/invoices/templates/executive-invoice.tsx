import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { InvoiceHeader } from './components/InvoiceHeader'
import { InvoiceClientSection } from './components/InvoiceClientSection'
import { InvoiceInfoCard } from './components/InvoiceInfoCard'
import { InvoiceLineItemsTable } from './components/InvoiceLineItemsTable'
import { InvoiceSummaryCard } from './components/InvoiceSummaryCard'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function ExecutiveInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#0f172a'
  const accentColor = '#334155'

  return (
    <div className="bg-white text-slate-900 p-8 md:p-12 max-w-[800px] mx-auto text-base font-serif">
      <div className="border-b-2 pb-8 mb-12" style={{ borderBottomColor: primaryColor }}>
        <InvoiceHeader 
          data={data} 
          layout="centered" 
          primaryColor={primaryColor} 
          accentColor={accentColor} 
        />
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <InvoiceClientSection 
          data={data} 
          labelColor={accentColor}
          textColor="#000000"
        />
        <InvoiceInfoCard 
          data={data} 
          style="minimal" 
        />
      </div>

      <InvoiceLineItemsTable 
        data={data} 
        style="minimal" 
        primaryColor={primaryColor} 
      />
      
      <div className="mt-8 border-t border-slate-300 pt-8">
        <InvoiceSummaryCard 
          data={data} 
          style="minimal" 
        />
      </div>

      {(data.notes || data.paymentInstructions) && (
        <div className="mt-16 page-break-inside-avoid">
          {data.notes && (
            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 border-b pb-2">Terms & Notes</h4>
              <p className="text-slate-800 whitespace-pre-wrap break-words leading-relaxed">{data.notes}</p>
            </div>
          )}
          {data.paymentInstructions && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 border-b pb-2">Payment Details</h4>
              <p className="text-slate-800 whitespace-pre-wrap break-words leading-relaxed">{data.paymentInstructions}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-24 text-center text-sm text-slate-400 uppercase tracking-widest page-break-inside-avoid">
        Thank you for your business
      </div>
    </div>
  )
}

export function ExecutiveInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<fallbackConfig.component data={props.data} />}>
      <ExecutiveInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const executiveInvoiceConfig: InvoiceTemplateConfig = {
  id: 'executive-invoice',
  name: 'Executive Invoice',
  description: 'Luxury consulting style. Minimalist with large typography and a high-end corporate appearance.',
  component: ExecutiveInvoiceErrorBoundary,
  primaryColor: '#0f172a',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
