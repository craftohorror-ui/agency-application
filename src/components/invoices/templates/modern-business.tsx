import React from 'react'
import type { InvoiceTemplateData, InvoiceTemplateConfig } from '@/lib/invoice-template-registry'
import { contractDesignTokens } from '@/lib/contractDesignTokens'

function StatusBadge({ status }: { status: string }) {
  let color = 'bg-slate-100 text-slate-800'
  let label = 'Draft'
  
  switch(status) {
    case 'paid':
      color = 'bg-emerald-100 text-emerald-800'
      label = 'Paid'
      break
    case 'partially_paid':
      color = 'bg-blue-100 text-blue-800'
      label = 'Partially Paid'
      break
    case 'overdue':
      color = 'bg-red-100 text-red-800'
      label = 'Overdue'
      break
    case 'sent':
      color = 'bg-amber-100 text-amber-800'
      label = 'Due'
      break
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${color}`}>
      {label}
    </span>
  )
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export const ModernBusinessInvoice = ({ data }: { data: InvoiceTemplateData }) => {
  return (
    <div className={`max-w-4xl mx-auto bg-white min-h-[1056px] ${contractDesignTokens.typography.body} text-slate-800 p-12 shadow-sm`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
          {data.agencyLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto mb-6 object-contain" />
          )}
          <h1 className={`${contractDesignTokens.typography.documentTitle} mb-2 text-slate-900`}>INVOICE</h1>
          <div className="flex items-center gap-3">
            <span className={`${contractDesignTokens.typography.numeric} text-slate-500 font-medium`}>#{data.number}</span>
            <StatusBadge status={data.status} />
          </div>
        </div>
        
        <div className="text-right">
          <h2 className={`${contractDesignTokens.typography.sectionTitle} mb-1 border-b-0 mt-0`} style={{ color: data.brandColor || '#334155' }}>
            {data.agencyName}
          </h2>
          <div className="text-sm text-slate-500 space-y-1 mt-3">
            {data.agencyPhone && <p>{data.agencyPhone}</p>}
            {data.agencyEmail && <p>{data.agencyEmail}</p>}
            {data.agencyWebsite && <p>{data.agencyWebsite}</p>}
          </div>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-12 mb-12 py-8 border-y border-slate-100">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Billed To</p>
          <p className={`${contractDesignTokens.typography.subsectionTitle} mt-0 mb-1`}>{data.clientName}</p>
          {data.clientCompany && <p className="text-slate-600">{data.clientCompany}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Issue Date</p>
            <p className={contractDesignTokens.typography.numeric}>{data.issueDate}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Due Date</p>
            <p className={contractDesignTokens.typography.numeric}>{data.dueDate}</p>
          </div>
          {data.contractReference && (
            <div className="col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Reference</p>
              <p className="font-mono text-sm">{data.contractReference}</p>
            </div>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-4 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-[50%]">Description</th>
              <th className="py-4 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Qty</th>
              <th className="py-4 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Price</th>
              <th className="py-4 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-5 px-2">
                  <p className="font-medium text-slate-900">{item.description}</p>
                </td>
                <td className={`py-5 px-2 text-right ${contractDesignTokens.typography.numeric}`}>{item.qty}</td>
                <td className={`py-5 px-2 text-right ${contractDesignTokens.typography.numeric}`}>{formatCurrency(item.unit_price, data.currency)}</td>
                <td className={`py-5 px-2 text-right font-medium text-slate-900 ${contractDesignTokens.typography.numeric}`}>
                  {formatCurrency(item.qty * item.unit_price, data.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-80">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className={contractDesignTokens.typography.numeric}>{formatCurrency(data.subtotal, data.currency)}</span>
            </div>
            
            {data.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({data.discountType === 'percentage' ? `${data.discountValue}%` : 'Fixed'})</span>
                <span className={contractDesignTokens.typography.numeric}>-{formatCurrency(data.discountAmount, data.currency)}</span>
              </div>
            )}
            
            {data.taxAmount > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Tax ({data.taxType.toUpperCase()}{data.taxRate ? ` ${data.taxRate}%` : ''})</span>
                <span className={contractDesignTokens.typography.numeric}>{formatCurrency(data.taxAmount, data.currency)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-4 border-t-2 border-slate-900">
              <span className="font-bold text-slate-900">Total</span>
              <span className={`text-xl font-bold text-slate-900 ${contractDesignTokens.typography.numeric}`}>
                {formatCurrency(data.total, data.currency)}
              </span>
            </div>
            
            {data.amountPaid > 0 && (
              <div className="flex justify-between text-slate-500 pt-2">
                <span>Amount Paid</span>
                <span className={contractDesignTokens.typography.numeric}>-{formatCurrency(data.amountPaid, data.currency)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3 bg-slate-50 px-4 rounded-md">
              <span className="font-bold text-slate-900">Balance Due</span>
              <span className={`text-lg font-bold ${data.balanceDue > 0 ? 'text-red-600' : 'text-emerald-600'} ${contractDesignTokens.typography.numeric}`}>
                {formatCurrency(data.balanceDue, data.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-2 gap-12 text-sm text-slate-600">
        {data.notes && (
          <div>
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">Notes</h4>
            <div className="whitespace-pre-wrap">{data.notes}</div>
          </div>
        )}
        
        {data.paymentInstructions && (
          <div>
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">Payment Instructions</h4>
            <div className="whitespace-pre-wrap">{data.paymentInstructions}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export const modernBusinessInvoiceConfig: InvoiceTemplateConfig = {
  id: 'modern-business',
  name: 'Modern Business',
  description: 'Clean, professional design suitable for any industry.',
  component: ModernBusinessInvoice,
  primaryColor: '#0F172A',
  secondaryColor: '#334155',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0'
}
