import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'

function SaaSInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#3b82f6'

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-slate-50 text-slate-800 max-w-[850px] mx-auto font-sans shadow-sm min-h-[1100px] flex flex-col print:bg-white print:shadow-none border border-slate-200">
      
      {/* SaaS Dashboard Header */}
      <div className="bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center relative overflow-hidden" style={{ borderTopWidth: '6px', borderTopColor: primaryColor }}>
        
        <div className="flex items-center gap-6 relative z-10">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto object-contain" />
          ) : (
            <div className="text-3xl font-extrabold tracking-tight text-slate-900">
              {data.agencyName}
            </div>
          )}
          <div className="hidden sm:block h-10 border-l border-slate-200 pl-6">
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-slate-200">Invoice</span>
          </div>
        </div>

        <div className="text-right relative z-10 flex gap-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</p>
            <span className="inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest border" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor, borderColor: `${primaryColor}30` }}>
              {data.status || 'DRAFT'}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Invoice ID</p>
            <p className="font-mono font-bold text-slate-900">{data.number}</p>
          </div>
        </div>
      </div>

      <div className="px-12 py-12 flex-1 flex flex-col">
        
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Customer</h2>
            </div>
            <div className="ml-11">
              <p className="font-bold text-slate-900 text-lg mb-1">{data.clientName}</p>
              {data.clientCompany && <p className="text-sm text-slate-500 font-medium">{data.clientCompany}</p>}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Billed On</p>
              </div>
              <p className="font-semibold text-slate-900 text-sm ml-6">{formatDate(data.issueDate)}</p>
            </div>
            {data.dueDate && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Due By</p>
                </div>
                <p className="font-semibold text-slate-900 text-sm ml-6">{formatDate(data.dueDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12 flex flex-col">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Plan / Feature</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-center">Seats / Qty</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">Rate</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.length > 0 ? (
                data.items.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 text-slate-900 font-semibold">{item.description}</td>
                    <td className="px-8 py-6 text-center text-slate-500 font-medium">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs">{item.qty}</span>
                    </td>
                    <td className="px-8 py-6 text-right text-slate-500 font-mono text-sm">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-slate-900 font-mono text-sm">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-slate-400 italic">No line items.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="mt-auto border-t border-slate-200 bg-slate-50 flex">
            <div className="flex-1 p-8 border-r border-slate-200 hidden md:block">
              {/* Agency Mini Info */}
              <div className="flex gap-4 items-center h-full opacity-60">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{data.agencyName}</p>
                  {data.agencyEmail && <p className="text-xs text-slate-500">{data.agencyEmail}</p>}
                </div>
              </div>
            </div>
            <div className="w-[350px] p-8 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-500 uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="font-mono font-medium text-slate-700">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}</span>
              </div>
              {data.discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm text-emerald-600">
                  <span className="font-semibold uppercase tracking-widest text-[10px]">Discount</span>
                  <span className="font-mono font-medium">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}</span>
                </div>
              )}
              {data.taxAmount > 0 && (
                <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-200">
                  <span className="font-semibold text-slate-500 uppercase tracking-widest text-[10px]">Tax</span>
                  <span className="font-mono font-medium text-slate-700">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold uppercase tracking-widest text-slate-900 text-xs">Invoice Total</span>
                <span className="font-black text-xl font-mono text-slate-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold uppercase tracking-widest text-emerald-500 text-[10px]">Amount Paid</span>
                <span className="font-bold text-sm font-mono text-emerald-500">
                  -{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.amountPaid)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-2">
                <span className="font-bold uppercase tracking-widest text-slate-900 text-xs">Balance Due</span>
                <span className="font-black text-2xl font-mono" style={{ color: primaryColor }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.balanceDue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notes & Payment */}
        <div className="grid grid-cols-2 gap-8">
          {data.paymentInstructions && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                Payment Details
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{data.paymentInstructions}</p>
            </div>
          )}
          {data.notes && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Notes
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">{data.notes}</p>
            </div>
          )}
        </div>
</div>
    </div>
  )
}

export function SaaSInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<div className="p-8 text-center text-red-500">Failed to render SaaS template.</div>}>
      <SaaSInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const saasInvoiceConfig: InvoiceTemplateConfig = {
  id: 'saas-invoice',
  name: 'Tech SaaS',
  description: 'Clean, dashboard-inspired layout with modern cards and clear data presentation.',
  component: SaaSInvoiceErrorBoundary,
  primaryColor: '#3b82f6',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '3.0.0'
}
