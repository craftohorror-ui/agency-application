import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function MarketingGrowth({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none print:max-w-none border-t-8" style={{ borderTopColor: data.brandColor || '#F97316' }}>
      {/* Header */}
      <div className="px-12 pt-16 pb-8 print:break-inside-avoid">
        <div className="flex justify-between items-center mb-12">
          <div>
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto object-contain" />
            ) : (
              <h2 className="text-2xl font-black tracking-tight uppercase" style={{ color: data.brandColor || '#F97316' }}>{data.agencyName}</h2>
            )}
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-slate-900 uppercase tracking-wider text-xs">Growth Proposal</p>
            <p className="text-slate-500">{data.date}</p>
          </div>
        </div>
        
        <h1 className="text-5xl font-black tracking-tighter leading-tight mb-4 text-slate-900">{data.title}</h1>
        <p className="text-xl text-slate-600 font-medium">Prepared for <span style={{ color: data.brandColor || '#F97316' }}>{data.clientName}</span></p>
      </div>

      <div className="px-12 pb-16 space-y-12">
        {/* Objectives */}
        <div className="bg-slate-50 p-8 rounded-tr-3xl rounded-bl-3xl print:break-inside-avoid print:color-adjust-exact">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: data.brandColor || '#F97316', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>1</span>
            Campaign Objectives
          </h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.scope || 'Define marketing objectives here.'}</p>
        </div>

        {/* Deliverables */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: data.brandColor || '#F97316', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>2</span>
            Strategy & Deliverables
          </h3>
          <div className="pl-10 border-l-2 border-slate-100">
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.deliverables || 'Outline deliverables here.'}</p>
          </div>
        </div>

        {/* Budget & Items */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: data.brandColor || '#F97316', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>3</span>
            Campaign Investment
          </h3>
          <div className="pl-10">
            <div className="overflow-hidden ring-1 ring-slate-200 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Activity</th>
                    <th className="px-4 py-3 font-semibold text-center">Volume</th>
                    <th className="px-4 py-3 font-semibold text-right">Rate</th>
                    <th className="px-4 py-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.description}</td>
                      <td className="px-4 py-3 text-center text-slate-500">{item.qty}</td>
                      <td className="px-4 py-3 text-right text-slate-500">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-slate-900 p-4 flex justify-between items-center text-white print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                <span className="font-semibold uppercase tracking-wider text-xs">Total Budget</span>
                <span className="text-xl font-bold text-white">${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline & Terms */}
        <div className="grid grid-cols-2 gap-8 print:break-inside-avoid">
          <div className="pl-10 border-l-2 border-slate-100">
            <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">Timeline</h4>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
          </div>
          <div className="pl-10 border-l-2 border-slate-100">
            <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">Terms</h4>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">{data.terms || 'Standard terms.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const marketingGrowthConfig: TemplateConfig = {
  id: 'marketing-growth',
  name: 'Marketing Growth',
  description: 'Dynamic, numbered sections designed for marketing strategy proposals.',
  component: MarketingGrowth,
  primaryColor: '#F97316',
  secondaryColor: '#FFF7ED',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
