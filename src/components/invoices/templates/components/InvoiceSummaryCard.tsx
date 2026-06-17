import React from 'react'
import { InvoiceTemplateData } from '@/lib/invoice-template-registry'

interface InvoiceSummaryCardProps {
  data: InvoiceTemplateData
  primaryColor?: string
  style?: 'classic' | 'modern' | 'minimal' | 'cards'
}

export function InvoiceSummaryCard({ data, primaryColor = '#1e40af', style = 'classic' }: InvoiceSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency || 'USD' }).format(amount)
  }

  const hasDiscount = data.discountAmount > 0
  const hasTax = data.taxAmount > 0
  const hasPaid = data.amountPaid > 0

  if (style === 'minimal') {
    return (
      <div className="flex justify-end mb-8 page-break-inside-avoid">
        <div className="w-full max-w-[300px] text-right space-y-3">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal:</span>
            <span>{formatCurrency(data.subtotal)}</span>
          </div>
          {hasDiscount && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Discount ({data.discountType === 'percentage' ? `${data.discountValue}%` : 'Fixed'}):</span>
              <span>-{formatCurrency(data.discountAmount)}</span>
            </div>
          )}
          {hasTax && (
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tax ({data.taxRate}%):</span>
              <span>{formatCurrency(data.taxAmount)}</span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-bold text-slate-900">
            <span>Total:</span>
            <span>{formatCurrency(data.total)}</span>
          </div>
          {hasPaid && (
            <div className="flex justify-between text-sm text-green-600 pt-2 border-t border-slate-100">
              <span>Amount Paid:</span>
              <span>-{formatCurrency(data.amountPaid)}</span>
            </div>
          )}
          {hasPaid && (
            <div className="flex justify-between text-base font-bold text-slate-900 mt-1">
              <span>Balance Due:</span>
              <span>{formatCurrency(data.balanceDue)}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (style === 'modern') {
    return (
      <div className="flex justify-end mb-8 page-break-inside-avoid">
        <div className="w-full max-w-[350px] bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-3">
          <div className="flex justify-between text-sm font-medium text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrency(data.subtotal)}</span>
          </div>
          {hasDiscount && (
            <div className="flex justify-between text-sm font-medium text-red-500">
              <span>Discount</span>
              <span>-{formatCurrency(data.discountAmount)}</span>
            </div>
          )}
          {hasTax && (
            <div className="flex justify-between text-sm font-medium text-slate-600">
              <span>Tax ({data.taxRate}%)</span>
              <span>{formatCurrency(data.taxAmount)}</span>
            </div>
          )}
          <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-center mt-2">
            <span className="text-sm uppercase tracking-wider font-bold text-slate-500">Total</span>
            <span className="text-xl font-bold" style={{ color: primaryColor }}>{formatCurrency(data.total)}</span>
          </div>
          {hasPaid && (
            <div className="flex justify-between text-sm font-medium text-emerald-600 pt-3 mt-1 border-t border-slate-100">
              <span>Amount Paid</span>
              <span>-{formatCurrency(data.amountPaid)}</span>
            </div>
          )}
          {hasPaid && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm uppercase tracking-wider font-bold text-slate-500">Balance Due</span>
              <span className="text-lg font-bold text-slate-900">{formatCurrency(data.balanceDue)}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Classic Style (default)
  return (
    <div className="flex justify-end mb-8 page-break-inside-avoid">
      <div className="w-full max-w-[300px]">
        <table className="w-full text-right text-sm">
          <tbody>
            <tr>
              <td className="py-2 text-slate-600 pr-4">Subtotal</td>
              <td className="py-2 font-medium text-slate-900">{formatCurrency(data.subtotal)}</td>
            </tr>
            {hasDiscount && (
              <tr>
                <td className="py-2 text-red-600 pr-4">Discount</td>
                <td className="py-2 font-medium text-red-600">-{formatCurrency(data.discountAmount)}</td>
              </tr>
            )}
            {hasTax && (
              <tr>
                <td className="py-2 text-slate-600 pr-4">Tax ({data.taxRate}%)</td>
                <td className="py-2 font-medium text-slate-900">{formatCurrency(data.taxAmount)}</td>
              </tr>
            )}
            <tr className="border-t-2 border-slate-800">
              <td className="py-4 font-bold text-slate-900 pr-4 text-base">Total</td>
              <td className="py-4 font-bold text-slate-900 text-lg">{formatCurrency(data.total)}</td>
            </tr>
            {hasPaid && (
              <tr className="border-t border-slate-200">
                <td className="py-2 text-slate-600 pr-4">Amount Paid</td>
                <td className="py-2 font-medium text-slate-900">-{formatCurrency(data.amountPaid)}</td>
              </tr>
            )}
            {hasPaid && (
              <tr>
                <td className="py-2 font-bold text-slate-900 pr-4">Balance Due</td>
                <td className="py-2 font-bold text-slate-900">{formatCurrency(data.balanceDue)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
