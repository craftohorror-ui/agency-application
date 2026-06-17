import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'

function ModernBusinessV2Template({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#14b8a6' // Teal default

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-white text-slate-900 max-w-[800px] mx-auto text-[13px] font-sans relative shadow-sm min-h-[1056px] flex flex-col">
      
      {/* Massive Gradient Diagonal Header */}
      <div 
        className="w-full relative overflow-hidden" 
        style={{ 
          height: '320px',
          background: `linear-gradient(135deg, ${primaryColor} 0%, #0f172a 100%)`,
          clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0% 100%)'
        }}
      >
        <div className="p-12 flex justify-between items-start text-white">
          <div className="w-1/2">
            <h1 className="text-5xl font-black tracking-tighter mb-12">INVOICE</h1>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Date</h3>
                <p className="text-sm font-medium">{formatDate(data.issueDate)}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Invoice No</h3>
                <p className="text-sm font-medium">{data.number}</p>
              </div>
            </div>
          </div>

          <div className="w-1/2 flex flex-col items-end text-right">
            {data.agencyLogo ? (
              <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
                <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto object-contain" />
              </div>
            ) : (
              <h2 className="text-2xl font-black tracking-tighter mb-4">{data.agencyName}</h2>
            )}
            
            <div className="text-xs text-white/80 space-y-1 mt-2">
              <p className="font-bold text-white">{data.agencyName}</p>
              {data.agencyEmail && <p>{data.agencyEmail}</p>}
              {data.agencyWebsite && <p>{data.agencyWebsite}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="px-12 flex-1 -mt-16 relative z-10">
        
        {/* Bill To Card */}
        <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-8 mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Invoice To</h2>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{data.clientName}</h3>
              {data.clientCompany && <p className="text-slate-600 font-medium mb-3">{data.clientCompany}</p>}
            </div>
            
            <div className="text-right flex gap-12">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Payment Terms</h3>
                <p className="text-xs font-medium text-slate-900">Due on Receipt</p>
              </div>
              {data.dueDate && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Due Date</h3>
                  <p className="text-xs font-medium text-slate-900">{formatDate(data.dueDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-left mb-12">
          <thead>
            <tr className="border-b-2" style={{ borderColor: primaryColor }}>
              <th className="py-4 px-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: primaryColor }}>Item</th>
              <th className="py-4 px-2 text-[11px] font-bold uppercase tracking-widest text-center" style={{ color: primaryColor }}>Qty</th>
              <th className="py-4 px-2 text-[11px] font-bold uppercase tracking-widest text-right" style={{ color: primaryColor }}>Rate</th>
              <th className="py-4 px-2 text-[11px] font-bold uppercase tracking-widest text-right" style={{ color: primaryColor }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-slate-100">
                <td className="py-5 px-2">
                  <p className="font-bold text-slate-900">{item.description}</p>
                </td>
                <td className="py-5 px-2 text-center text-slate-600 font-medium">{item.qty}</td>
                <td className="py-5 px-2 text-right text-slate-600 font-medium">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                </td>
                <td className="py-5 px-2 text-right font-bold text-slate-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Box */}
        <div className="flex justify-end mb-16">
          <div className="w-80 border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-slate-50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}
                </span>
              </div>
              {data.discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Discount</span>
                  <span className="font-bold text-red-500">
                    -{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}
                  </span>
                </div>
              )}
              {data.taxAmount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Tax</span>
                  <span className="font-bold text-slate-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 flex justify-between items-center text-white" style={{ backgroundColor: primaryColor }}>
              <span className="font-bold uppercase tracking-widest text-[11px]">Total Due</span>
              <span className="text-xl font-black">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-end pb-12">
          <div className="flex-1 pr-12 text-xs">
            {data.notes && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] mb-2" style={{ color: primaryColor }}>Notes</h4>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{data.notes}</p>
              </div>
            )}
            {data.paymentInstructions && (
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] mb-2" style={{ color: primaryColor }}>Payment Details</h4>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{data.paymentInstructions}</p>
              </div>
            )}
          </div>

          <div className="w-48 text-center pt-8 border-t border-slate-300">
            <h4 className="text-xs font-bold text-slate-900 mb-1">Authorized Signature</h4>
            <p className="text-[10px] text-slate-400">For {data.agencyName}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export function ModernBusinessV2ErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={
      <div className="p-12 text-center text-red-500 font-bold border border-red-200 bg-red-50">
        Failed to render invoice template. Please try another template or contact support.
      </div>
    }>
      <ModernBusinessV2Template data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const modernBusinessInvoiceConfig: InvoiceTemplateConfig = {
  id: 'modern-business', // ID is fixed
  name: 'Modern Business',
  description: 'A striking gradient diagonal header creating a memorable first impression.',
  component: ModernBusinessV2ErrorBoundary,
  primaryColor: '#14b8a6',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
