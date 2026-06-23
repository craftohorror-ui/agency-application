import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'

function EnterpriseInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#0284c7'

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-white text-slate-800 max-w-[850px] mx-auto font-sans shadow-sm min-h-[1100px] flex flex-col border border-slate-300 print:shadow-none print:border-none">
      
      {/* Enterprise Header Block */}
      <div className="bg-[#f8fafc] border-b-[16px] p-12 flex justify-between items-start" style={{ borderBottomColor: primaryColor }}>
        
        <div>
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-14 w-auto object-contain mb-8" />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">
              {data.agencyName}
            </h1>
          )}
          
          <div className="text-sm text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">{data.agencyName}</p>
            {data.agencyEmail && <p>{data.agencyEmail}</p>}
            {data.agencyWebsite && <p>{data.agencyWebsite}</p>}
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-4">Commercial Invoice</span>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-8" style={{ color: primaryColor }}>INVOICE</h2>
          
          <div className="bg-white border border-slate-200 shadow-sm p-4 text-left grid grid-cols-2 gap-x-8 gap-y-3 w-72">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Invoice Ref</p>
              <p className="font-bold text-slate-900 text-sm">{data.number}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Date</p>
              <p className="font-bold text-slate-900 text-sm">{formatDate(data.issueDate)}</p>
            </div>
            {data.dueDate && (
              <div className="col-span-2 border-t border-slate-100 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Payment Due</p>
                <p className="font-bold text-slate-900 text-sm">{formatDate(data.dueDate)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-12 flex-1 flex flex-col bg-white">
        
        {/* Bill To & Status */}
        <div className="grid grid-cols-2 gap-12 mb-12 border-b-2 border-slate-200 pb-12">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-3 h-3" style={{ backgroundColor: primaryColor }} />
              Billed To
            </h3>
            <p className="text-lg font-bold text-slate-900 mb-1">{data.clientName}</p>
            {data.clientCompany && <p className="text-slate-600 font-medium">{data.clientCompany}</p>}
          </div>

          <div className="flex flex-col justify-end items-end">
            <div className="bg-slate-50 border border-slate-200 p-4 w-64 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Account Status</p>
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{data.status || 'DRAFT'}</p>
            </div>
          </div>
        </div>

        {/* Financial Schedule */}
        <div className="mb-12 flex-1 border-l-4" style={{ borderColor: primaryColor }}>
          <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide mb-6 pl-4 border-b border-slate-200 pb-4">Financial Schedule</h3>
          
          <div className="pl-4">
            <table className="w-full text-left text-sm border border-slate-300">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-b border-r border-slate-300">Description of Service/Product</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-center border-b border-r border-slate-300">Qty</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right border-b border-r border-slate-300">Unit Price</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right border-b border-slate-300">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 bg-white">
                {data.items.length > 0 ? (
                  data.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-5 text-slate-900 font-medium border-r border-slate-300">{item.description}</td>
                      <td className="px-6 py-5 text-center text-slate-600 border-r border-slate-300">{item.qty}</td>
                      <td className="px-6 py-5 text-right text-slate-600 border-r border-slate-300">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-slate-900">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">No line items specified.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Totals Section */}
            <div className="flex justify-end bg-slate-50 border-x border-b border-slate-300 p-6">
              <div className="w-80 space-y-4">
                <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                  <span>Subtotal Amount</span>
                  <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}</span>
                </div>
                {data.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-red-600">
                    <span>Discount Applied</span>
                    <span>-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}</span>
                  </div>
                )}
                {data.taxAmount > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-slate-600 pb-4 border-b border-slate-300">
                    <span>Tax Assessment</span>
                    <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-sm uppercase tracking-widest text-slate-700">Invoice Total</span>
                  <span className="font-bold text-xl text-slate-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-sm uppercase tracking-widest text-green-600">Amount Paid</span>
                  <span className="font-bold text-sm text-green-600">
                    -{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-300 mt-2">
                  <span className="font-bold text-sm uppercase tracking-widest text-slate-700">Balance Due</span>
                  <span className="font-bold text-3xl" style={{ color: primaryColor }}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.balanceDue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
{/* Footer info */}
        <div className="grid grid-cols-2 gap-12 mt-auto pt-8 border-t-2 border-slate-900">
          <div>
            {data.paymentInstructions && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900">Remittance Details</h4>
                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 border border-slate-200">
                  {data.paymentInstructions}
                </div>
              </div>
            )}
          </div>
          <div>
            {data.notes && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-900">Standard Terms</h4>
                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap p-6 border border-slate-200">
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

export function EnterpriseInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<div className="p-8 text-center text-red-500">Failed to render Enterprise template.</div>}>
      <EnterpriseInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const enterpriseInvoiceConfig: InvoiceTemplateConfig = {
  id: 'enterprise-invoice',
  name: 'Enterprise Corporate',
  description: 'Formal, structured layout with thick borders and clear hierarchical information presentation.',
  component: EnterpriseInvoiceErrorBoundary,
  primaryColor: '#0284c7',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '3.0.0'
}
