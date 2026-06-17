import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function ExecutiveInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#0f172a'

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-[#fafafa] text-slate-900 max-w-[800px] mx-auto text-[13px] font-serif relative shadow-sm min-h-[1056px] flex flex-col p-16">
      
      {/* Outer Border Box */}
      <div className="absolute inset-4 border border-slate-300 pointer-events-none"></div>
      <div className="absolute inset-5 border border-slate-200 pointer-events-none"></div>

      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-900 pb-8 mb-12">
          <div className="w-1/2">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto object-contain object-left mb-4" />
            ) : (
              <h2 className="text-2xl tracking-widest uppercase text-slate-900 mb-2">{data.agencyName}</h2>
            )}
            <p className="text-[10px] text-slate-500 tracking-[0.2em] uppercase font-sans">{data.agencyWebsite || 'Luxury Services'}</p>
          </div>

          <div className="text-right w-1/2">
            <h1 className="text-3xl tracking-[0.3em] uppercase text-slate-900 mb-6">Invoice</h1>
            <table className="w-full text-right text-[11px] font-sans tracking-widest text-slate-500 uppercase">
              <tbody>
                <tr>
                  <td className="py-1">Reference No.</td>
                  <td className="py-1 text-slate-900">{data.number}</td>
                </tr>
                <tr>
                  <td className="py-1">Date of Issue</td>
                  <td className="py-1 text-slate-900">{formatDate(data.issueDate)}</td>
                </tr>
                {data.dueDate && (
                  <tr>
                    <td className="py-1">Date Due</td>
                    <td className="py-1 text-slate-900">{formatDate(data.dueDate)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Info */}
        <div className="flex gap-16 mb-16 font-sans">
          <div className="w-1/2">
            <h3 className="text-[9px] uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 pb-2 mb-4">Invoiced To</h3>
            <h4 className="text-base font-medium text-slate-900 tracking-wider mb-1">{data.clientName}</h4>
            {data.clientCompany && <p className="text-xs text-slate-600 mb-2">{data.clientCompany}</p>}
          </div>
          <div className="w-1/2">
            <h3 className="text-[9px] uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 pb-2 mb-4">Payable To</h3>
            <h4 className="text-base font-medium text-slate-900 tracking-wider mb-1">{data.agencyName}</h4>
            {data.agencyEmail && <p className="text-[11px] text-slate-500 leading-relaxed whitespace-pre-wrap mb-2">{data.agencyEmail}</p>}
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-16 font-sans flex-1">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-3 text-[9px] uppercase tracking-[0.3em] text-slate-400 border-b border-slate-900 font-normal">Description</th>
                <th className="py-3 text-[9px] uppercase tracking-[0.3em] text-slate-400 border-b border-slate-900 font-normal text-center">Qty</th>
                <th className="py-3 text-[9px] uppercase tracking-[0.3em] text-slate-400 border-b border-slate-900 font-normal text-right">Unit Price</th>
                <th className="py-3 text-[9px] uppercase tracking-[0.3em] text-slate-400 border-b border-slate-900 font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-5 border-b border-slate-200">
                    <p className="text-[13px] text-slate-900 tracking-wide">{item.description}</p>
                  </td>
                  <td className="py-5 border-b border-slate-200 text-center text-[12px] text-slate-500">
                    {item.qty}
                  </td>
                  <td className="py-5 border-b border-slate-200 text-right text-[12px] text-slate-500">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                  </td>
                  <td className="py-5 border-b border-slate-200 text-right text-[13px] text-slate-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Signature */}
        <div className="flex justify-between items-end gap-12 font-sans">
          
          <div className="flex-1">
            {data.notes && (
              <div className="mb-6">
                <h3 className="text-[9px] uppercase tracking-[0.3em] text-slate-400 mb-2 border-b border-slate-200 pb-2 inline-block">Terms & Conditions</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed whitespace-pre-wrap">{data.notes}</p>
              </div>
            )}
            
            {/* Signature Block */}
            <div className="mt-12 w-48 border-t border-slate-900 pt-3 text-center">
              <h4 className="text-[9px] uppercase tracking-[0.3em] text-slate-900">Authorized Signatory</h4>
            </div>
          </div>

          <div className="w-[300px]">
            <table className="w-full text-[12px]">
              <tbody>
                <tr>
                  <td className="py-3 text-slate-500 tracking-widest uppercase text-[10px]">Subtotal</td>
                  <td className="py-3 text-right text-slate-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}</td>
                </tr>
                {data.discountAmount > 0 && (
                  <tr>
                    <td className="py-3 text-slate-500 tracking-widest uppercase text-[10px] border-t border-slate-100">Discount</td>
                    <td className="py-3 text-right text-slate-900 border-t border-slate-100">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}</td>
                  </tr>
                )}
                {data.taxAmount > 0 && (
                  <tr>
                    <td className="py-3 text-slate-500 tracking-widest uppercase text-[10px] border-t border-slate-100">Tax</td>
                    <td className="py-3 text-right text-slate-900 border-t border-slate-100">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-5 text-slate-900 tracking-widest uppercase text-[12px] font-medium border-t border-slate-900 border-b-4 border-b-slate-900">Total Due</td>
                  <td className="py-5 text-right text-slate-900 text-xl tracking-wider border-t border-slate-900 border-b-4 border-b-slate-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center font-sans">
          <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400">Thank you for your valued business</p>
        </div>

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
  name: 'Executive Minimal',
  description: 'A refined, minimalist luxury layout with high-fashion aesthetics and serif typography.',
  component: ExecutiveInvoiceErrorBoundary,
  primaryColor: '#0f172a',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
