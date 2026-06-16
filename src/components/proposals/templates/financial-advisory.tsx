import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function FinancialAdvisory({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none print:max-w-none">
      {/* Header */}
      <div className="bg-slate-900 text-white px-12 py-10 flex justify-between items-center print:break-inside-avoid print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        <div>
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt={data.agencyName} className="h-10 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          ) : (
            <h2 className="text-2xl font-semibold tracking-wider uppercase" style={{ color: data.brandColor || '#10b981' }}>{data.agencyName}</h2>
          )}
        </div>
        <div className="text-right text-sm text-slate-400 uppercase tracking-widest font-semibold">
          <p>Financial Advisory Proposal</p>
          <p>{data.date}</p>
        </div>
      </div>

      <div className="px-12 py-16 space-y-12">
        {/* Title */}
        <div className="border-l-8 pl-6 print:break-inside-avoid" style={{ borderColor: data.brandColor || '#10b981' }}>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-4">{data.title}</h1>
          <p className="text-xl text-slate-600 font-medium">Prepared for <span className="text-slate-900">{data.clientName}</span> {data.clientCompany && `| ${data.clientCompany}`}</p>
        </div>

        {/* Advisory Scope */}
        <div className="print:break-inside-avoid grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 border-t-2 border-slate-200 pt-4">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm mb-2" style={{ color: data.brandColor || '#10b981' }}>Strategic Overview</h3>
          </div>
          <div className="md:col-span-2 border-t-2 border-slate-200 pt-4">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.scope || 'Financial advisory scope details.'}</p>
          </div>
        </div>

        {/* Deliverables */}
        <div className="print:break-inside-avoid grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 border-t-2 border-slate-200 pt-4">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm mb-2" style={{ color: data.brandColor || '#10b981' }}>Core Deliverables</h3>
          </div>
          <div className="md:col-span-2 border-t-2 border-slate-200 pt-4">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.deliverables || 'Specific advisory deliverables.'}</p>
          </div>
        </div>

        {/* Investment Schedule */}
        <div className="print:break-inside-avoid pt-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Fee Schedule & Investment</h3>
          
          <div className="border border-slate-200 rounded-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold">Service Description</th>
                  <th className="p-4 font-semibold text-center">Volume/Hrs</th>
                  <th className="p-4 font-semibold text-right">Rate</th>
                  <th className="p-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="p-4 font-medium text-slate-900">{item.description}</td>
                    <td className="p-4 text-center text-slate-500">{item.qty}</td>
                    <td className="p-4 text-right text-slate-500">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-right font-medium text-slate-900">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                  <td colSpan={3} className="p-4 text-right font-semibold uppercase tracking-widest text-xs">Total Advisory Fee</td>
                  <td className="p-4 text-right font-bold text-lg" style={{ color: data.brandColor || '#10b981' }}>${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Timeline & Terms */}
        <div className="grid grid-cols-2 gap-12 print:break-inside-avoid pt-8 border-t border-slate-200">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm mb-4" style={{ color: data.brandColor || '#10b981' }}>Implementation Timeline</h4>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm mb-4" style={{ color: data.brandColor || '#10b981' }}>Terms & Conditions</h4>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{data.terms || 'Standard financial advisory terms.'}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export const financialAdvisoryConfig: TemplateConfig = {
  id: 'financial-advisory',
  name: 'Financial Advisory',
  description: 'Structured, trustworthy layout using green accents for financial services.',
  component: FinancialAdvisory,
  primaryColor: '#10b981',
  secondaryColor: '#0f172a',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
