import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function MarketingInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#ec4899'

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-white text-slate-900 max-w-[800px] mx-auto text-[13px] font-sans shadow-sm min-h-[1056px] flex flex-col border-x border-slate-100">
      
      {/* Header Block: Deep dark block matching Digital Marketing Elite */}
      <div className="bg-slate-900 text-white px-12 py-16 flex flex-col gap-12 rounded-b-3xl mx-2 mt-2">
        <div className="flex justify-between items-start">
          <div className="w-1/2">
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto object-contain bg-white/5 p-2 rounded-xl border border-white/10" />
            ) : (
              <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                {data.agencyName}
              </h1>
            )}
            <div className="mt-4 text-xs font-medium text-white/60 space-y-1">
              <p>{data.agencyEmail}</p>
              <p>{data.agencyWebsite}</p>
              <p>{data.agencyPhone}</p>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <h2 className="text-4xl font-black tracking-tighter mb-4">INVOICE</h2>
            <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="flex flex-col text-left border-r border-white/20 pr-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-0.5">Invoice No</span>
                <span className="font-bold text-white">{data.number}</span>
              </div>
              <div className="flex flex-col text-left pl-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-0.5">Issue Date</span>
                <span className="font-bold text-white">{formatDate(data.issueDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 flex-1 flex flex-col py-12">
        
        {/* Bill To & Status Section */}
        <div className="flex gap-8 mb-12">
          <div className="flex-1 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Billed To
            </h3>
            <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{data.clientName}</h4>
            {data.clientCompany && <p className="text-sm font-bold text-slate-600">{data.clientCompany}</p>}
          </div>

          <div className="w-[300px] bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                {data.status || 'DRAFT'}
              </span>
            </div>
            {data.dueDate && (
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Due Date</span>
                <span className="font-bold text-slate-900">{formatDate(data.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Items Table */}
        <div className="flex-1 mb-12 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Service Output</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Qty</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Rate</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ext. Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.items.length > 0 ? (
                data.items.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-8">
                      <p className="font-bold text-slate-900 text-sm">{item.description}</p>
                    </td>
                    <td className="py-5 px-6 text-center font-medium text-slate-600">
                      <span className="bg-slate-100 px-3 py-1 rounded-full text-xs">{item.qty}</span>
                    </td>
                    <td className="py-5 px-6 text-right font-medium text-slate-600">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                    </td>
                    <td className="py-5 px-8 text-right font-black text-slate-900 text-sm">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 px-8 text-center text-slate-400 italic font-medium">No items added.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes Section */}
        <div className="flex gap-8 items-end mt-auto pb-12">
          <div className="flex-1 space-y-6">
            {data.paymentInstructions && (
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Payment Details</h3>
                <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">{data.paymentInstructions}</p>
              </div>
            )}
            
            {data.notes && (
              <div className="px-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Additional Notes</h3>
                <p className="text-xs font-medium text-slate-500 whitespace-pre-wrap leading-relaxed">{data.notes}</p>
              </div>
            )}
          </div>

          <div className="w-[320px]">
            {/* Highly visible Total block, ensuring contrast regardless of primaryColor */}
            <div className="bg-slate-900 text-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
              {/* Safe color bar using primary color as a thick border accent */}
              <div className="h-2 w-full" style={{ backgroundColor: primaryColor }}></div>
              
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-white/60">
                  <span>Subtotal</span>
                  <span className="text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}</span>
                </div>
                {data.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold text-red-400">
                    <span>Discount</span>
                    <span>-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}</span>
                  </div>
                )}
                {data.taxAmount > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold text-white/60">
                    <span>Tax</span>
                    <span className="text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}</span>
                  </div>
                )}
                
                <div className="border-t border-white/20 pt-5 mt-5 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Invoice Total</span>
                  <span className="text-xl font-black text-white">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Amount Paid</span>
                  <span className="text-sm font-black text-green-400">
                    -{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.amountPaid)}
                  </span>
                </div>
                <div className="border-t border-white/20 pt-5 mt-2 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Balance Due</span>
                  <span className="text-3xl font-black text-white">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.balanceDue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {data.payments && data.payments.length > 0 && (
          <div className="mb-12 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm mt-8">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Payment History
            </h3>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-6 font-bold uppercase tracking-widest text-slate-400">Date</th>
                    <th className="py-3 px-6 font-bold uppercase tracking-widest text-slate-400">Method</th>
                    <th className="py-3 px-6 font-bold uppercase tracking-widest text-slate-400">Reference</th>
                    <th className="py-3 px-6 font-bold uppercase tracking-widest text-slate-400 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.payments.map((p, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6 text-slate-700 font-bold">{formatDate(p.paid_at)}</td>
                      <td className="py-3 px-6 text-slate-600 capitalize font-medium">{p.method?.replace('_', ' ') || '-'}</td>
                      <td className="py-3 px-6 text-slate-500 font-medium">{p.reference || '-'}</td>
                      <td className="py-3 px-6 text-slate-900 font-black text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
  description: 'Vibrant, bold layout with high-contrast total blocks and modern rounded containers.',
  component: MarketingInvoiceErrorBoundary,
  primaryColor: '#ec4899',
  secondaryColor: '#fdf2f8',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
