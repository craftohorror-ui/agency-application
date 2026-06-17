import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function MarketingInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#ec4899' // Pink default
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-[#fdfdfd] text-slate-900 max-w-[800px] mx-auto text-[13px] font-sans relative shadow-sm min-h-[1056px] flex flex-col p-10 overflow-hidden">
      
      {/* Decorative Top Shapes */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: primaryColor }}></div>
      <div className="absolute top-10 -left-10 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: primaryColor }}></div>

      <div className="relative z-10">
        
        {/* Header Ribbon */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4 bg-white shadow-sm border border-slate-100 p-4 rounded-3xl pr-8">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg" style={{ backgroundColor: primaryColor }}>
                {data.agencyName.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="font-black tracking-tight text-lg leading-none">{data.agencyName}</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{data.agencyWebsite || 'Marketing Agency'}</p>
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-5xl font-black tracking-tighter" style={{ color: primaryColor }}>INVOICE</h1>
            <div className="inline-block mt-2 px-4 py-1 rounded-full text-white font-bold text-xs shadow-sm" style={{ backgroundColor: primaryColor }}>
              #{data.number}
            </div>
          </div>
        </div>

        {/* Info Cards (Pill/Rounded shape) */}
        <div className="flex gap-6 mb-12">
          <div className="flex-1 bg-white shadow-sm border border-slate-100 p-6 rounded-3xl">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Billed To
            </h3>
            <h4 className="text-xl font-black text-slate-900 mb-1">{data.clientName}</h4>
            {data.clientCompany && <p className="text-sm font-bold text-slate-600 mb-3">{data.clientCompany}</p>}
          </div>

          <div className="flex-1 bg-white shadow-sm border border-slate-100 p-6 rounded-3xl flex flex-col justify-center gap-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Issue Date</span>
              <span className="font-black text-sm">{formatDate(data.issueDate)}</span>
            </div>
            {data.dueDate && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Due Date</span>
                <span className="font-black text-sm" style={{ color: primaryColor }}>{formatDate(data.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Line Items Table (Modern Card style) */}
        <div className="bg-white shadow-sm border border-slate-100 rounded-3xl overflow-hidden mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Service Description</th>
                <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Qty</th>
                <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Rate</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td className="py-5 px-6">
                    <p className="font-bold text-slate-900 text-sm">{item.description}</p>
                  </td>
                  <td className="py-5 px-4 text-center font-medium text-slate-600">
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-xs">{item.qty}</span>
                  </td>
                  <td className="py-5 px-4 text-right font-medium text-slate-600">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                  </td>
                  <td className="py-5 px-6 text-right font-black text-slate-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes Section */}
        <div className="flex gap-6 items-end">
          <div className="flex-1 space-y-6">
            {data.paymentInstructions && (
              <div className="bg-white shadow-sm border border-slate-100 p-6 rounded-3xl">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Payment Details</h3>
                <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">{data.paymentInstructions}</p>
              </div>
            )}
            
            {data.notes && (
              <div className="px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Additional Notes</h3>
                <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">{data.notes}</p>
              </div>
            )}
          </div>

          <div className="w-[300px]">
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: primaryColor }}></div>
              
              <div className="relative z-10 space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs font-medium text-slate-300">
                  <span>Subtotal</span>
                  <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}</span>
                </div>
                {data.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-xs font-medium text-red-400">
                    <span>Discount</span>
                    <span>-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}</span>
                  </div>
                )}
                {data.taxAmount > 0 && (
                  <div className="flex justify-between items-center text-xs font-medium text-slate-300">
                    <span>Tax</span>
                    <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}</span>
                  </div>
                )}
              </div>

              <div className="relative z-10 border-t border-white/20 pt-4 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Total Due</span>
                <span className="text-2xl font-black" style={{ color: primaryColor }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
                </span>
              </div>
            </div>

            {/* Signature Area */}
            <div className="mt-8 text-center px-4">
              <div className="border-b-2 border-slate-200 pb-2 mb-2">
                <span className="font-['Brush_Script_MT',cursive] text-2xl text-slate-700 opacity-80 block h-8"></span>
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Authorized Signature</h4>
            </div>
          </div>
        </div>

      </div>
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
  name: 'Creative Marketing',
  description: 'Vibrant, bold layout with modern rounded containers and dynamic accents.',
  component: MarketingInvoiceErrorBoundary,
  primaryColor: '#ec4899',
  secondaryColor: '#fdf2f8',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
