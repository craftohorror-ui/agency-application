import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { InvoiceHeader } from './components/InvoiceHeader'
import { InvoiceClientSection } from './components/InvoiceClientSection'
import { InvoiceInfoCard } from './components/InvoiceInfoCard'
import { InvoiceLineItemsTable } from './components/InvoiceLineItemsTable'
import { InvoiceSummaryCard } from './components/InvoiceSummaryCard'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function CreativeStudioInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#14b8a6' // Teal default
  const accentColor = '#ccfbf1'

  return (
    <div className="bg-white text-slate-900 max-w-[800px] mx-auto text-sm flex">
      {/* Left Accent Column */}
      <div className="w-12 shrink-0 min-h-full" style={{ backgroundColor: primaryColor }}></div>
      
      {/* Main Content */}
      <div className="flex-1 p-8 md:p-12 pl-8 md:pl-12">
        <InvoiceHeader 
          data={data} 
          layout="split" 
          primaryColor={primaryColor} 
        />
        
        <div className="mt-16 mb-16">
          <InvoiceClientSection 
            data={data} 
            labelColor={primaryColor}
            layout="horizontal"
          />
        </div>

        <div className="mb-12 border-l-4 pl-6 py-2" style={{ borderColor: primaryColor }}>
          <InvoiceInfoCard 
            data={data} 
            style="minimal" 
          />
        </div>

        <InvoiceLineItemsTable 
          data={data} 
          style="minimal" 
        />
        
        <div className="mt-8 border-t-2 border-slate-100 pt-8">
          <InvoiceSummaryCard 
            data={data} 
            style="modern" 
            primaryColor={primaryColor} 
          />
        </div>

        {(data.notes || data.paymentInstructions) && (
          <div className="mt-16 page-break-inside-avoid text-slate-600">
            {data.notes && (
              <div className="mb-6">
                <strong className="block text-slate-900 mb-1">Notes</strong>
                <p className="whitespace-pre-wrap break-words">{data.notes}</p>
              </div>
            )}
            {data.paymentInstructions && (
              <div>
                <strong className="block text-slate-900 mb-1">Payment info</strong>
                <p className="whitespace-pre-wrap break-words">{data.paymentInstructions}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function CreativeStudioInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<fallbackConfig.component data={props.data} />}>
      <CreativeStudioInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const creativeStudioInvoiceConfig: InvoiceTemplateConfig = {
  id: 'consulting-invoice', // Replaces consulting-invoice per user request but is named Creative Studio
  name: 'Creative Studio',
  description: 'Premium agency design. Modern split layouts with a strong focus on service descriptions.',
  component: CreativeStudioInvoiceErrorBoundary,
  primaryColor: '#14b8a6',
  secondaryColor: '#ccfbf1',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
