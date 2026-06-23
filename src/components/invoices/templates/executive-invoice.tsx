import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'

function ExecutiveInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#111827'

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-white text-slate-900 max-w-[850px] mx-auto font-serif shadow-sm min-h-[1100px] print:min-h-0 flex flex-col print:block border-x border-slate-200">
      
      {/* Luxury Dark Header */}
      <div className="text-white p-16 flex flex-col justify-between" style={{ backgroundColor: primaryColor }}>
        
        <div className="flex justify-between items-start mb-16">
          <div className="text-center md:text-left">
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-16 object-contain" />
            ) : (
              <div className="text-2xl tracking-[0.3em] uppercase font-light text-white/90">
                {data.agencyName}
              </div>
            )}
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-light tracking-[0.2em] uppercase text-white mb-2">Invoice</h1>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50">Confidential</p>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Prepared For</p>
              <h2 className="text-2xl font-medium text-white tracking-wide">{data.clientCompany || data.clientName}</h2>
              <p className="text-sm text-white/70 mt-1 font-sans">{data.clientName}</p>
            </div>
          </div>
          
          <div className="text-right flex gap-12 text-sm font-sans">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-2">Invoice No.</p>
              <p className="text-white tracking-widest">{data.number}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-2">Date</p>
              <p className="text-white tracking-widest">{formatDate(data.issueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-16 flex-1 flex flex-col print:block bg-white">
        
        {/* Status & Due Date */}
        <div className="flex justify-between items-center mb-16 pb-8 border-b border-slate-200">
          <div className="flex gap-16 font-sans">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Payment Status</p>
              <p className="text-sm font-semibold tracking-widest text-slate-900 uppercase">{data.status || 'DRAFT'}</p>
            </div>
            {data.dueDate && (
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Due Date</p>
                <p className="text-sm font-medium tracking-widest text-slate-900">{formatDate(data.dueDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Minimalist Line Items */}
        <div className="mb-16">
          <h3 className="text-lg font-light tracking-wide uppercase mb-6 border-b pb-4 border-slate-200">Financial Overview</h3>
          
          <table className="w-full text-left font-sans text-sm">
            <thead className="border-b-2 border-slate-900">
              <tr>
                <th className="py-4 font-semibold uppercase tracking-wider text-slate-500 text-[11px]">Service Area</th>
                <th className="py-4 font-semibold uppercase tracking-wider text-slate-500 text-[11px] text-center">Qty</th>
                <th className="py-4 font-semibold uppercase tracking-wider text-slate-500 text-[11px] text-right">Rate</th>
                <th className="py-4 font-semibold uppercase tracking-wider text-slate-500 text-[11px] text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.length > 0 ? (
                data.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-6 pr-4 text-slate-800 font-medium text-sm">{item.description}</td>
                    <td className="py-6 px-4 text-center text-slate-500">{item.qty}</td>
                    <td className="py-6 px-4 text-right text-slate-500 font-mono tracking-tighter">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                    </td>
                    <td className="py-6 text-right font-semibold text-slate-900 font-mono tracking-tighter">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 italic">No line items specified.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Executive Totals */}
          <div className="flex justify-end pt-8 border-t-2 border-slate-900">
            <div className="w-80 space-y-4 font-sans">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500 tracking-wider uppercase">Subtotal</span>
                <span className="font-mono text-slate-700">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}</span>
              </div>
              {data.discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm text-red-600">
                  <span className="font-medium tracking-wider uppercase">Discount</span>
                  <span className="font-mono">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}</span>
                </div>
              )}
              {data.taxAmount > 0 && (
                <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-200">
                  <span className="font-medium text-slate-500 tracking-wider uppercase">Tax</span>
                  <span className="font-mono text-slate-700">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-end pt-2">
                <span className="font-semibold tracking-wider uppercase text-slate-900">Invoice Total</span>
                <span className="font-light text-xl font-serif text-slate-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-4">
                <span className="font-medium text-green-600 tracking-wider uppercase">Amount Paid</span>
                <span className="font-mono text-green-600">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.amountPaid)}</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t-2 border-slate-900 mt-4">
                <span className="font-semibold tracking-wider uppercase text-slate-900">Balance Due</span>
                <span className="font-light text-3xl font-serif text-slate-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.balanceDue)}
                </span>
              </div>
            </div>
          </div>
        </div>
{/* Footer info */}
        <div className="mt-auto print:mt-12 pt-16 border-t border-slate-200 grid grid-cols-2 gap-16 font-sans">
          <div>
            {data.paymentInstructions && (
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Payment Terms</h4>
                <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{data.paymentInstructions}</p>
              </div>
            )}
          </div>
          <div>
            {data.notes && (
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Additional Notes</h4>
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{data.notes}</p>
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-600">{data.agencyName}</p>
              {data.agencyEmail && <p>{data.agencyEmail}</p>}
              {data.agencyWebsite && <p>{data.agencyWebsite}</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export function ExecutiveInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<div className="p-8 text-center text-red-500">Failed to render Executive template.</div>}>
      <ExecutiveInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const executiveInvoiceConfig: InvoiceTemplateConfig = {
  id: 'executive-invoice',
  name: 'Executive Minimal',
  description: 'Luxury consulting style with exquisite typography, dark cover layout, and elegant spacing.',
  component: ExecutiveInvoiceErrorBoundary,
  primaryColor: '#111827',
  secondaryColor: '#ffffff',
  supportsPdf: true,
  supportsDocx: true,
  version: '3.0.0'
}
