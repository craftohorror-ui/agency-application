import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'

function ModernBusinessV2Template({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#1e3a8a' // Corporate navy

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-white text-slate-800 max-w-[850px] mx-auto font-sans shadow-sm min-h-[1100px] flex flex-col border-x border-slate-200 print:shadow-none print:border-none">
      
      {/* Premium Corporate Header Ribbon */}
      <div className="w-full h-4" style={{ backgroundColor: primaryColor }} />

      <div className="flex-1 flex flex-col p-16">
        
        {/* Header Content */}
        <div className="flex justify-between items-start mb-20 border-b-2 border-slate-100 pb-12">
          <div className="w-1/2">
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-16 w-auto object-contain mb-6" />
            ) : (
              <h1 className="text-4xl font-black tracking-tight mb-6" style={{ color: primaryColor }}>
                {data.agencyName}
              </h1>
            )}
            <div className="text-sm font-medium text-slate-500 space-y-1">
              <p className="font-bold text-slate-800">{data.agencyName}</p>
              {data.agencyEmail && <p>{data.agencyEmail}</p>}
              {data.agencyWebsite && <p>{data.agencyWebsite}</p>}
              {data.agencyPhone && <p>{data.agencyPhone}</p>}
            </div>
          </div>

          <div className="w-1/2 text-right">
            <h2 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6">INVOICE</h2>
            <div className="inline-block border border-slate-200 rounded-lg p-4 bg-slate-50 shadow-sm text-left min-w-[240px]">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Invoice No.</span>
                <span className="font-black text-slate-900">{data.number}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Issue Date</span>
                <span className="font-medium text-slate-900">{formatDate(data.issueDate)}</span>
              </div>
              {data.dueDate && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Due Date</span>
                  <span className="font-medium text-slate-900">{formatDate(data.dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client & Status Section */}
        <div className="grid grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b-2" style={{ borderColor: primaryColor }}>Prepared For</h3>
            <h4 className="text-xl font-bold text-slate-900 mb-1">{data.clientName}</h4>
            {data.clientCompany && <p className="text-sm font-medium text-slate-600">{data.clientCompany}</p>}
          </div>

          <div className="flex flex-col justify-end items-end">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Payment Status</p>
              <div className="inline-block border-2 px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest" style={{ borderColor: primaryColor, color: primaryColor }}>
                {data.status || 'DRAFT'}
              </div>
            </div>
          </div>
        </div>

        {/* Investment Table */}
        <div className="mb-16 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-700">Description</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-700 text-center">Qty</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-700 text-right">Unit Price</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-700 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.items.length > 0 ? (
                data.items.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-5 px-6">
                      <p className="font-semibold text-slate-900 text-sm">{item.description}</p>
                    </td>
                    <td className="py-5 px-6 text-center font-medium text-slate-600">
                      {item.qty}
                    </td>
                    <td className="py-5 px-6 text-right font-medium text-slate-600">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                    </td>
                    <td className="py-5 px-6 text-right font-bold text-slate-900 text-sm">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 px-6 text-center text-slate-500 italic font-medium bg-white">No items specified.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Structured Total Block */}
          <div className="bg-slate-50 border-t border-slate-200 p-8 flex justify-end">
            <div className="w-72 space-y-3 text-sm">
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>Subtotal</span>
                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}</span>
              </div>
              {data.discountAmount > 0 && (
                <div className="flex justify-between items-center text-red-600 font-medium">
                  <span>Discount</span>
                  <span>-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}</span>
                </div>
              )}
              {data.taxAmount > 0 && (
                <div className="flex justify-between items-center text-slate-600 font-medium border-b border-slate-200 pb-3">
                  <span>Tax</span>
                  <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-end pt-2">
                <div>
                  <p className="font-bold text-sm uppercase tracking-widest text-slate-900">Total Investment</p>
                </div>
                <div className="font-black text-3xl" style={{ color: primaryColor }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="grid grid-cols-2 gap-12 mt-auto pt-12 border-t-2 border-slate-100">
          <div>
            {data.paymentInstructions && (
              <div className="bg-slate-50 p-6 rounded border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[10px]">Payment Terms</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{data.paymentInstructions}</p>
              </div>
            )}
          </div>
          <div>
            {data.notes && (
              <div>
                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[10px]">Additional Notes</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{data.notes}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export function ModernBusinessV2ErrorBoundary(props: { data: InvoiceTemplateData }) {
  // Use itself as fallback but with default color if something fails, though normally we'd use a different fallback.
  // Actually we shouldn't use itself. We will just render the template without error boundary for now or use a basic one.
  return (
    <InvoiceErrorBoundary fallbackTemplate={<div className="p-8 text-center text-red-500">Failed to render Modern Business template.</div>}>
      <ModernBusinessV2Template data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const modernBusinessInvoiceConfig: InvoiceTemplateConfig = {
  id: 'modern-business-v2',
  name: 'Premium Corporate',
  description: 'A highly structured, formal layout matching the Corporate Proposal style.',
  component: ModernBusinessV2ErrorBoundary,
  primaryColor: '#1e3a8a',
  secondaryColor: '#f1f5f9',
  supportsPdf: true,
  supportsDocx: true,
  version: '3.0.0'
}
