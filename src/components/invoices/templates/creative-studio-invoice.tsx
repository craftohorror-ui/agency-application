import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'

function CreativeStudioInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#8b5cf6'

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-white text-slate-800 max-w-[850px] mx-auto font-sans shadow-xl print:shadow-none min-h-[1100px] flex flex-col border border-slate-100 relative overflow-hidden">
      
      {/* --- HEADER PAGE-LIKE STRUCTURE --- */}
      <div className="bg-[#f3f4f6] px-16 py-20 flex justify-between items-start border-b border-slate-200 relative overflow-hidden">
        
        {/* Subtle decorative typography */}
        <div className="absolute top-4 -right-10 text-[120px] font-black opacity-[0.03] text-slate-900 leading-none pointer-events-none select-none">
          INVOICE
        </div>

        <div className="w-1/2 relative z-10">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-16 w-auto object-contain mb-12" />
          ) : (
            <div className="text-4xl font-black tracking-tighter mb-12" style={{ color: primaryColor }}>
              {data.agencyName}
            </div>
          )}
          
          <div className="space-y-1 text-sm font-medium text-slate-500">
            <p className="text-slate-800 font-bold">{data.agencyName}</p>
            {data.agencyEmail && <p>{data.agencyEmail}</p>}
            {data.agencyWebsite && <p>{data.agencyWebsite}</p>}
          </div>
        </div>

        <div className="w-1/2 relative z-10 text-right flex flex-col items-end">
          <div className="w-16 h-2 mb-6" style={{ backgroundColor: primaryColor }} />
          <h1 className="text-5xl font-black tracking-tighter leading-none text-slate-900 mb-8">
            INVOICE
          </h1>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left bg-white p-6 shadow-sm border border-slate-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Invoice No.</p>
              <p className="font-black text-slate-900 text-sm">{data.number}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Issue Date</p>
              <p className="font-bold text-slate-900 text-sm">{formatDate(data.issueDate)}</p>
            </div>
            {data.dueDate && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Due Date</p>
                <p className="font-bold text-slate-900 text-sm">{formatDate(data.dueDate)}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</p>
              <p className="font-black text-sm uppercase tracking-wider" style={{ color: primaryColor }}>{data.status || 'DRAFT'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-16 flex-1 flex flex-col bg-white">
        
        {/* Bill To */}
        <div className="mb-16">
          <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 border-l-8 pl-4" style={{ borderColor: primaryColor }}>Billed To</h2>
          <div className="ml-6">
            <p className="text-xl font-bold text-slate-900 mb-1">{data.clientName}</p>
            {data.clientCompany && <p className="text-slate-500 font-medium">{data.clientCompany}</p>}
          </div>
        </div>

        {/* Investment Details */}
        <div className="mb-16 flex-1">
          <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-8 border-l-8 pl-4" style={{ borderColor: primaryColor }}>Investment Details</h2>
          
          <div className="ml-6 border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Description</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-center">Qty</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Price</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.length > 0 ? (
                  data.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-5 text-slate-900 font-bold text-base">{item.description}</td>
                      <td className="px-6 py-5 text-center text-slate-500 font-medium">{item.qty}</td>
                      <td className="px-6 py-5 text-right text-slate-500 font-medium text-sm">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                      </td>
                      <td className="px-6 py-5 text-right font-black text-slate-900 text-base">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">No line items.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Totals Box */}
            <div className="bg-slate-900 p-8 flex flex-col justify-between text-white">
              <div className="flex justify-end w-full mb-6 pb-6 border-b border-white/10">
                <div className="w-64 space-y-3 text-sm">
                  <div className="flex justify-between items-center text-slate-400 font-medium">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}</span>
                  </div>
                  {data.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-red-400 font-medium">
                      <span>Discount</span>
                      <span>-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}</span>
                    </div>
                  )}
                  {data.taxAmount > 0 && (
                    <div className="flex justify-between items-center text-slate-400 font-medium">
                      <span>Tax</span>
                      <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-end mb-4">
                <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Invoice Total</div>
                <div className="font-black text-xl text-white">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <div className="font-bold uppercase tracking-widest text-green-400">Amount Paid</div>
                <div className="font-black text-green-400">
                  -{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.amountPaid)}
                </div>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-white/20">
                <div className="text-sm font-bold uppercase tracking-widest text-slate-300">Balance Due</div>
                <div className="font-black text-3xl text-white">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.balanceDue)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="grid grid-cols-2 gap-12 mt-auto pt-12 border-t-4 border-slate-100 mb-8">
          <div>
            {data.paymentInstructions && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-400">Payment Terms</h4>
                <div className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-wrap bg-slate-50 p-6 border border-slate-100">
                  {data.paymentInstructions}
                </div>
              </div>
            )}
          </div>
          <div>
            {data.notes && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-400">Additional Notes</h4>
                <div className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap p-6">
                  {data.notes}
                </div>
              </div>
            )}
          </div>
        </div>
</div>
    </div>
  )
}

export function CreativeStudioInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<div className="p-8 text-center text-red-500">Failed to render Creative Studio template.</div>}>
      <CreativeStudioInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const creativeStudioInvoiceConfig: InvoiceTemplateConfig = {
  id: 'creative-studio-invoice',
  name: 'Creative Agency',
  description: 'Artistic and bold design with masonry-like layouts and a high-contrast dark totals block.',
  component: CreativeStudioInvoiceErrorBoundary,
  primaryColor: '#8b5cf6',
  secondaryColor: '#fdf4ff',
  supportsPdf: true,
  supportsDocx: true,
  version: '3.0.0'
}
