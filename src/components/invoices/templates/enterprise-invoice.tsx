import React from 'react'
import { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { InvoiceErrorBoundary } from './components/InvoiceErrorBoundary'
import { modernBusinessInvoiceConfig as fallbackConfig } from './modern-business'

function EnterpriseInvoiceTemplate({ data }: { data: InvoiceTemplateData }) {
  const primaryColor = data.brandColor || '#1e3a8a' // Dark blue default

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch { return dateString }
  }

  return (
    <div className="bg-white text-slate-900 max-w-[800px] mx-auto text-[12px] font-sans relative shadow-sm min-h-[1056px] flex flex-col p-12 overflow-hidden">
      
      {/* Striped Background Pattern for Header/Footer areas */}
      <div className="absolute top-0 left-0 w-full h-40 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
      <div className="absolute bottom-0 left-0 w-full h-40 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>

      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: primaryColor }}></div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10 pb-8 border-b-2" style={{ borderColor: primaryColor }}>
          <div className="w-1/2">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto object-contain object-left mb-4" />
            ) : (
              <h2 className="text-3xl font-black tracking-tight mb-2" style={{ color: primaryColor }}>{data.agencyName}</h2>
            )}
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">{data.agencyWebsite || 'Premium Agency Services'}</p>
          </div>
          
          <div className="w-1/2 text-right">
            <h1 className="text-4xl font-black tracking-tighter text-slate-800 mb-2">.Invoice</h1>
            <h2 className="text-xl font-bold tracking-tight text-slate-600">Template</h2>
          </div>
        </div>

        {/* Info Grid */}
        <div className="flex justify-between items-start mb-8 gap-8">
          <div className="w-1/2 pr-8 border-r border-slate-200 border-dashed">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Invoice To:</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: primaryColor }}>👤</div>
              <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide">{data.clientName}</h4>
            </div>
            <p className="text-slate-600 font-medium mb-1 pl-8">{data.clientCompany}</p>
          </div>

          <div className="w-1/2 pl-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Invoice Details:</h3>
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="py-1 text-slate-500 font-medium w-1/2">INVOICE N°</td>
                  <td className="py-1 text-slate-400 text-center">:</td>
                  <td className="py-1 font-bold text-slate-900 text-right">{data.number}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500 font-medium">INVOICE DATE</td>
                  <td className="py-1 text-slate-400 text-center">:</td>
                  <td className="py-1 font-bold text-slate-900 text-right">{formatDate(data.issueDate)}</td>
                </tr>
                {data.dueDate && (
                  <tr>
                    <td className="py-1 text-slate-500 font-medium">DUE DATE</td>
                    <td className="py-1 text-slate-400 text-center">:</td>
                    <td className="py-1 font-bold text-slate-900 text-right">{formatDate(data.dueDate)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Solid Total Block at the top right (like Reference 4) */}
            <div className="mt-4 flex justify-between items-center text-white px-4 py-3" style={{ backgroundColor: primaryColor }}>
              <span className="text-[10px] uppercase tracking-widest font-bold">Total Due :</span>
              <span className="text-base font-black">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Table Headers */}
        <div className="flex border-t border-b border-slate-300 py-2 mt-4 mb-2 opacity-[0.8]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f1f5f9 0, #f1f5f9 1px, transparent 0, transparent 10px)' }}>
          <div className="w-1/2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Item Description</div>
          <div className="w-[15%] px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 text-center">Quantity</div>
          <div className="w-[15%] px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 text-right">Unit Price</div>
          <div className="w-[20%] px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 text-right">Total</div>
        </div>

        {/* Table Rows */}
        <div className="flex-1">
          {data.items.map((item, index) => (
            <div key={index} className="flex border-b border-slate-100 border-dashed py-4 items-center">
              <div className="w-1/2 px-2 flex gap-3 items-start">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white mt-0.5 shrink-0" style={{ backgroundColor: primaryColor }}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">{item.description}</h4>
                  <p className="text-[10px] text-slate-500">Premium service rendered.</p>
                </div>
              </div>
              <div className="w-[15%] px-2 text-center text-slate-600 font-medium">{item.qty}</div>
              <div className="w-[15%] px-2 text-right text-slate-600 font-medium">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price)}
              </div>
              <div className="w-[20%] px-2 text-right font-bold text-slate-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(item.unit_price * item.qty)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals Section */}
        <div className="flex justify-between items-end mt-8 border-t border-slate-300 pt-8 pb-8">
          <div className="w-1/2 pr-8">
            <div className="text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest inline-block mb-4" style={{ backgroundColor: primaryColor }}>
              Payment Method & Terms
            </div>
            {data.paymentInstructions && (
              <p className="text-slate-600 text-xs mb-4 whitespace-pre-wrap">{data.paymentInstructions}</p>
            )}
            {data.notes && (
              <p className="text-slate-500 text-[10px] leading-relaxed whitespace-pre-wrap border-t border-slate-200 border-dashed pt-4">
                {data.notes}
              </p>
            )}
            <p className="text-slate-900 font-bold mt-4 text-xs">Thank you for your business!</p>
          </div>

          <div className="w-1/2 pl-12 border-l border-slate-200 border-dashed">
            <table className="w-full text-xs mb-6">
              <tbody>
                <tr>
                  <td className="py-2 text-slate-600 font-bold uppercase tracking-wider text-[10px]">Sub Total</td>
                  <td className="py-2 text-slate-400 text-center">:</td>
                  <td className="py-2 font-bold text-right text-slate-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.subtotal)}</td>
                </tr>
                {data.taxAmount > 0 && (
                  <tr>
                    <td className="py-2 text-slate-600 font-bold uppercase tracking-wider text-[10px]">Tax</td>
                    <td className="py-2 text-slate-400 text-center">:</td>
                    <td className="py-2 font-bold text-right text-slate-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.taxAmount)}</td>
                  </tr>
                )}
                {data.discountAmount > 0 && (
                  <tr>
                    <td className="py-2 text-red-500 font-bold uppercase tracking-wider text-[10px]">Discount</td>
                    <td className="py-2 text-slate-400 text-center">:</td>
                    <td className="py-2 font-bold text-right text-red-500">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.discountAmount)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="border-t border-b border-slate-300 py-3 flex justify-between items-center mb-8 opacity-[0.8]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f1f5f9 0, #f1f5f9 1px, transparent 0, transparent 10px)' }}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Total Due :</span>
              <span className="text-lg font-black" style={{ color: primaryColor }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.total)}
              </span>
            </div>

            {/* Signature Area */}
            <div className="text-right">
              <div className="inline-block text-center border-t border-slate-900 pt-2 min-w-[150px]">
                <h4 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'cursive' }}>Authorized Sign</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Accounts Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info line */}
        <div className="border-t-2 pt-4 flex justify-between items-center text-[10px] text-slate-500 relative z-10" style={{ borderColor: primaryColor }}>
          {data.agencyEmail && <div>{data.agencyEmail}</div>}
          {data.agencyWebsite && <div>{data.agencyWebsite}</div>}
          {data.agencyPhone && <div>{data.agencyPhone}</div>}
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-2" style={{ backgroundColor: primaryColor }}></div>
    </div>
  )
}

export function EnterpriseInvoiceErrorBoundary(props: { data: InvoiceTemplateData }) {
  return (
    <InvoiceErrorBoundary fallbackTemplate={<fallbackConfig.component data={props.data} />}>
      <EnterpriseInvoiceTemplate data={props.data} />
    </InvoiceErrorBoundary>
  )
}

export const enterpriseInvoiceConfig: InvoiceTemplateConfig = {
  id: 'enterprise-invoice',
  name: 'Enterprise Corporate',
  description: 'Detailed grid structure with striped accents, optimized for heavy item lists.',
  component: EnterpriseInvoiceErrorBoundary,
  primaryColor: '#1e3a8a',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0.0'
}
