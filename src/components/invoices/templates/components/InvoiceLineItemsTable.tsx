import React from 'react'
import { InvoiceTemplateData } from '@/lib/invoice-template-registry'

interface InvoiceLineItemsTableProps {
  data: InvoiceTemplateData
  primaryColor?: string
  accentColor?: string
  style?: 'classic' | 'modern' | 'minimal' | 'bordered'
}

export function InvoiceLineItemsTable({ data, primaryColor = '#1e40af', accentColor = '#0f172a', style = 'classic' }: InvoiceLineItemsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency || 'USD' }).format(amount)
  }

  // Common Table Classes for PDF safety
  const tableClass = "w-full text-left border-collapse"
  const thClass = "py-3 px-4 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
  const tdClass = "py-4 px-4 align-top break-words whitespace-pre-wrap"
  
  if (style === 'modern') {
    return (
      <div className="mb-8">
        <table className={tableClass}>
          <thead>
            <tr className="bg-slate-50 border-b-2" style={{ borderBottomColor: primaryColor }}>
              <th className={`${thClass} text-slate-700 w-[50%]`}>Item Description</th>
              <th className={`${thClass} text-slate-700 w-[15%] text-center`}>Qty</th>
              <th className={`${thClass} text-slate-700 w-[15%] text-right`}>Price</th>
              <th className={`${thClass} text-slate-700 w-[20%] text-right`}>Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50/50 page-break-inside-avoid">
                <td className={`${tdClass} text-slate-900 font-medium`}>{item.description}</td>
                <td className={`${tdClass} text-slate-600 text-center`}>{item.qty}</td>
                <td className={`${tdClass} text-slate-600 text-right`}>{formatCurrency(item.unit_price)}</td>
                <td className={`${tdClass} text-slate-900 font-semibold text-right`}>{formatCurrency(item.qty * item.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (style === 'bordered') {
    return (
      <div className="mb-8">
        <table className={`${tableClass} border border-slate-200`}>
          <thead style={{ backgroundColor: primaryColor, color: '#ffffff' }}>
            <tr>
              <th className={`${thClass} border-r border-white/20 w-[50%]`}>Item Description</th>
              <th className={`${thClass} border-r border-white/20 w-[15%] text-center`}>Qty</th>
              <th className={`${thClass} border-r border-white/20 w-[15%] text-right`}>Price</th>
              <th className={`${thClass} w-[20%] text-right`}>Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.items.map((item, index) => (
              <tr key={index} className={`page-break-inside-avoid ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <td className={`${tdClass} border-r border-slate-200 text-slate-900`}>{item.description}</td>
                <td className={`${tdClass} border-r border-slate-200 text-slate-600 text-center`}>{item.qty}</td>
                <td className={`${tdClass} border-r border-slate-200 text-slate-600 text-right`}>{formatCurrency(item.unit_price)}</td>
                <td className={`${tdClass} text-slate-900 font-semibold text-right`}>{formatCurrency(item.qty * item.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (style === 'minimal') {
    return (
      <div className="mb-8">
        <table className={tableClass}>
          <thead>
            <tr className="border-b border-slate-300">
              <th className={`${thClass} text-slate-500 w-[50%]`}>Item Description</th>
              <th className={`${thClass} text-slate-500 w-[15%] text-center`}>Qty</th>
              <th className={`${thClass} text-slate-500 w-[15%] text-right`}>Price</th>
              <th className={`${thClass} text-slate-500 w-[20%] text-right`}>Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, index) => (
              <tr key={index} className="page-break-inside-avoid">
                <td className={`${tdClass} text-slate-800`}>{item.description}</td>
                <td className={`${tdClass} text-slate-600 text-center`}>{item.qty}</td>
                <td className={`${tdClass} text-slate-600 text-right`}>{formatCurrency(item.unit_price)}</td>
                <td className={`${tdClass} text-slate-800 text-right`}>{formatCurrency(item.qty * item.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Classic Style (default)
  return (
    <div className="mb-8">
      <table className={tableClass}>
        <thead>
          <tr className="border-b-2 border-slate-800">
            <th className={`${thClass} text-slate-800 w-[50%]`}>Item Description</th>
            <th className={`${thClass} text-slate-800 w-[15%] text-center`}>Qty</th>
            <th className={`${thClass} text-slate-800 w-[15%] text-right`}>Price</th>
            <th className={`${thClass} text-slate-800 w-[20%] text-right`}>Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.items.map((item, index) => (
            <tr key={index} className="page-break-inside-avoid">
              <td className={`${tdClass} text-slate-900`}>{item.description}</td>
              <td className={`${tdClass} text-slate-700 text-center`}>{item.qty}</td>
              <td className={`${tdClass} text-slate-700 text-right`}>{formatCurrency(item.unit_price)}</td>
              <td className={`${tdClass} text-slate-900 font-bold text-right`}>{formatCurrency(item.qty * item.unit_price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
