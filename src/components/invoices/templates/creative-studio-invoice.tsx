import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function CreativeStudioInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#1e293b' // Dark navy/slate default
  const accentColor = '#3b82f6' // Blue accent matching Reference 1

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-white text-slate-900 max-w-[800px] mx-auto text-[13px] flex min-h-[1056px] shadow-sm relative font-sans">
      
      {/* Left Dark Sidebar */}
      <div className="w-[35%] shrink-0 text-white flex flex-col relative z-10" style={{ backgroundColor: primaryColor }}>
        {/* Top Spacer / Logo Area */}
        <div className="p-8 pt-12 pb-12 flex flex-col gap-2">
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt={data.agencyName} className="h-16 w-auto object-contain object-left mb-2" />
          ) : (
            <h1 className="text-3xl font-bold tracking-tighter">{data.agencyName}</h1>
          )}
          {data.agencyWebsite && <p className="text-white/60 text-xs tracking-widest uppercase">{data.agencyWebsite}</p>}
        </div>

        {/* Invoice To */}
        <div className="px-8 py-10 flex-1">
          <h3 className="text-[10px] tracking-widest font-bold uppercase text-white/50 mb-4">Invoice To,</h3>
          <div className="font-bold text-xl mb-1" style={{ color: accentColor }}>{data.clientName}</div>
          <div className="text-white/80 font-medium mb-6">{data.clientCompany}</div>

          <div className="space-y-3 text-xs">
            {/* Additional info could go here */}
          </div>
        </div>

        {/* Bottom Details (Thank you & Payment) */}
        <div className="px-8 pb-12">
          <h3 className="text-lg font-bold mb-3">Thank you for your business</h3>
          {data.notes && (
            <p className="text-white/60 text-[11px] leading-relaxed mb-6 whitespace-pre-wrap break-words">{data.notes}</p>
          )}

          {data.paymentInstructions && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Payment Info</span>
              <p className="text-white/90 text-xs whitespace-pre-wrap break-words">{data.paymentInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col relative bg-slate-50">
        
        {/* Header Ribbon */}
        <div className="h-24 w-full flex items-center justify-end px-10 relative">
          <div className="absolute top-0 right-0 h-full w-48 opacity-10" style={{ backgroundColor: accentColor }}></div>
          <div className="relative z-10 text-right">
            <h2 className="text-4xl font-black tracking-widest uppercase mb-1" style={{ color: accentColor }}>Invoice</h2>
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest">
              <span className="w-4 h-4 rounded-full flex items-center justify-center bg-white/20">#</span>
              {data.number}
            </div>
          </div>
        </div>

        {/* Agency Info Map Graphic (Abstract) */}
        <div className="px-10 py-8 relative">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-transparent"></div>
          
          <div className="flex justify-end gap-12 relative z-10">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-400">Total Due</div>
              <div className="text-xl font-bold text-slate-900" style={{ color: accentColor }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-400">Invoice Date</div>
              <div className="text-sm font-bold text-slate-900">{formatDate(data.issueDate)}</div>
              {data.dueDate && (
                <>
                  <div className="text-[10px] font-bold uppercase tracking-widest mt-2 mb-1 text-slate-400">Due Date</div>
                  <div className="text-sm font-bold text-slate-900">{formatDate(data.dueDate)}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="flex-1 px-10 py-6 relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-white text-[11px] uppercase tracking-wider" style={{ backgroundColor: accentColor }}>
                <th className="py-3 px-4 font-bold rounded-tl-lg">No.</th>
                <th className="py-3 px-2 font-bold">Description</th>
                <th className="py-3 px-2 font-bold text-right">Price</th>
                <th className="py-3 px-2 font-bold text-right">Qty</th>
                <th className="py-3 px-4 font-bold text-right rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-4 px-4 text-slate-400 font-bold text-xs">{String(index + 1).padStart(2, '0')}.</td>
                  <td className="py-4 px-2">
                    <p className="font-bold text-slate-900">{item.description}</p>
                  </td>
                  <td className="py-4 px-2 text-right text-slate-600">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                  </td>
                  <td className="py-4 px-2 text-right text-slate-600">{item.qty}</td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Subtotal Block */}
          <div className="flex justify-end mt-0">
            <div className="w-64 p-4 rounded-b-lg text-white" style={{ backgroundColor: accentColor }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium opacity-90">Subtotal</span>
                <span className="font-bold text-sm">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}
                </span>
              </div>
              {data.discountAmount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium opacity-90">Discount</span>
                  <span className="font-bold text-sm">
                    -{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}
                  </span>
                </div>
              )}
              {data.taxAmount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium opacity-90">Tax</span>
                  <span className="font-bold text-sm">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="px-10 pb-16 flex justify-end">
          <div className="w-48 text-center pt-8 border-t-2 border-slate-300">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Authorized Signature</h4>
            <p className="text-[10px] text-slate-400">{data.agencyName}</p>
          </div>
        </div>

        {/* Bottom Accent Strip */}
        <div className="h-8 w-full absolute bottom-0 left-0" style={{ backgroundColor: accentColor }}></div>
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
  id: 'consulting-invoice', // Replaces consulting-invoice per user request
  name: 'Creative Studio',
  description: 'Premium dark sidebar design inspired by top-tier creative agencies.',
  component: CreativeStudioInvoiceErrorBoundary,
  primaryColor: '#1e293b',
  secondaryColor: '#3b82f6',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
