import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function SaasInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#8b5cf6'

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-[#f8fafc] text-slate-900 max-w-[800px] mx-auto text-[13px] font-sans relative shadow-sm min-h-[1056px] flex flex-col p-12">
      
      {/* Top Banner Area */}
      <div className="absolute top-0 left-0 w-full h-32" style={{ backgroundColor: primaryColor, clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0% 100%)' }}></div>

      <div className="relative z-10 flex-1 flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden mt-6 border border-slate-100">
        
        {/* Header Content */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-10 w-auto object-contain bg-slate-50 rounded-lg p-2 border border-slate-100" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black shadow-sm" style={{ backgroundColor: primaryColor }}>
                {data.agencyName.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="font-bold text-slate-900">{data.agencyName}</h2>
              {data.agencyWebsite && <p className="text-xs text-slate-500">{data.agencyWebsite}</p>}
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-slate-50 py-2 px-3 rounded text-center">
              <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Invoice #</span>
              <span className="font-medium text-slate-900">{data.number}</span>
            </div>
            <div className="bg-slate-50 py-2 px-3 rounded text-center">
              <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Issue Date</span>
              <span className="font-medium text-slate-900">{formatDate(data.issueDate)}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 flex-1 flex flex-col">
          
          <div className="flex justify-between gap-8 mb-10">
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                Billed To
              </h3>
              <h4 className="font-bold text-slate-900 mb-0.5">{data.clientName}</h4>
              {data.clientCompany && <p className="text-sm text-slate-600 mb-2">{data.clientCompany}</p>}
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Status</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                  {data.status || 'DRAFT'}
                </span>
              </div>
              {data.dueDate && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Due Date</span>
                  <span className="font-bold text-slate-900">{formatDate(data.dueDate)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-slate-200 overflow-hidden mb-8">
            <table className="w-full text-left bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Service Description</th>
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Qty</th>
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Rate</th>
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-900 text-sm">{item.description}</p>
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">{item.qty}</span>
                    </td>
                    <td className="py-4 px-4 text-right text-slate-600 font-medium">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-8 items-start">
            <div className="flex-1 space-y-6">
              {data.paymentInstructions && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Payment Details</h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {data.paymentInstructions}
                  </div>
                </div>
              )}
              {data.notes && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Notes</h3>
                  <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">{data.notes}</p>
                </div>
              )}
            </div>

            <div className="w-72 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}</span>
                </div>
                {data.discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-red-500">
                    <span>Discount</span>
                    <span className="font-medium">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}</span>
                  </div>
                )}
                {data.taxAmount > 0 && (
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Tax</span>
                    <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}</span>
                  </div>
                )}
              </div>
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Due</span>
                <span className="text-xl font-black">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto border-t border-slate-200 pt-6 flex justify-between items-center text-[10px] text-slate-500">
            {data.agencyEmail && <p>{data.agencyEmail}</p>}
            <p>This is a computer generated document and does not require a signature.</p>
            {data.agencyWebsite && <p>{data.agencyWebsite}</p>}
          </div>

        </div>
      </div>
    </div>
  )
}

export function SaasInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<fallbackConfig.component data={props.data} />}>
      <SaasInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const saasInvoiceConfig: InvoiceTemplateConfig = {
  id: 'saas-invoice',
  name: 'Tech / SaaS',
  description: 'Clean UI-inspired card layout, perfect for software subscriptions and retainers.',
  component: SaasInvoiceErrorBoundary,
  primaryColor: '#8b5cf6',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
