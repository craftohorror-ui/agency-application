import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function MinimalProfessional({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen font-sans text-slate-900 border border-slate-100 shadow-sm print:border-none print:shadow-none print:max-w-none">
      {/* Header */}
      <div className="px-12 py-16 border-b-2 border-slate-900 print:break-inside-avoid">
        <div className="flex justify-between items-end mb-8">
          <div>
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-10 w-auto object-contain grayscale" />
            ) : (
              <h2 className="text-2xl font-bold tracking-tight">{data.agencyName}</h2>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">Date: {data.date}</p>
          </div>
        </div>

        <h1 className="text-4xl font-semibold mb-4">{data.title}</h1>
        <p className="text-xl text-slate-600">Prepared for: {data.clientName} {data.clientCompany && `(${data.clientCompany})`}</p>
      </div>

      <div className="px-12 py-12 space-y-12">
        {/* Scope */}
        <div className="print:break-inside-avoid">
          <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4">1. Scope of Work</h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.scope || 'Scope of work details.'}</p>
        </div>

        {/* Deliverables */}
        <div className="print:break-inside-avoid">
          <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4">2. Deliverables</h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.deliverables || 'Deliverables list.'}</p>
        </div>

        {/* Financials */}
        <div className="print:break-inside-avoid">
          <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4">3. Investment Breakdown</h3>
          <table className="w-full text-left border-collapse mt-4">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="py-2 font-semibold">Description</th>
                <th className="py-2 font-semibold text-center">Qty</th>
                <th className="py-2 font-semibold text-right">Price</th>
                <th className="py-2 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-3 text-slate-800">{item.description}</td>
                  <td className="py-3 text-center text-slate-600">{item.qty}</td>
                  <td className="py-3 text-right text-slate-600">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 text-right text-slate-800">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <td colSpan={3} className="py-4 text-right font-bold">Total Investment:</td>
                <td className="py-4 text-right font-bold">${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-12 print:break-inside-avoid">
          <div>
            <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4">4. Timeline</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4">5. Terms</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{data.terms || 'Standard terms apply.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const minimalProfessionalConfig: TemplateConfig = {
  id: 'minimal-professional',
  name: 'Minimal Professional',
  description: 'Ultra-clean layout emphasizing strong typography and clear hierarchy.',
  component: MinimalProfessional,
  primaryColor: '#0f172a',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
