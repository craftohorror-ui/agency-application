import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function ConstructionPremium({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen font-sans text-slate-800 border-t-[16px] shadow-lg print:shadow-none print:max-w-none print:border-t-[16px]" style={{ borderTopColor: data.brandColor || '#eab308' }}>
      
      {/* Header */}
      <div className="px-12 py-12 flex justify-between items-center border-b border-slate-200 print:break-inside-avoid">
        <div>
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto object-contain" />
          ) : (
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{data.agencyName}</h2>
          )}
        </div>
        <div className="text-right border-l-4 pl-4" style={{ borderLeftColor: data.brandColor || '#eab308' }}>
          <p className="font-bold text-slate-900 uppercase tracking-widest text-sm">Project Bid</p>
          <p className="text-slate-500 font-medium">{data.date}</p>
        </div>
      </div>

      <div className="px-12 py-16 space-y-12">
        {/* Project Info */}
        <div className="print:break-inside-avoid">
          <h1 className="text-5xl font-black uppercase tracking-tight text-slate-900 leading-none mb-6">{data.title}</h1>
          <div className="bg-slate-100 p-6 font-medium text-slate-700 flex flex-col sm:flex-row gap-6 uppercase tracking-wider text-sm">
            <div>
              <span className="text-slate-500 block text-xs">Client</span>
              {data.clientName}
            </div>
            {data.clientCompany && (
              <div>
                <span className="text-slate-500 block text-xs">Company</span>
                {data.clientCompany}
              </div>
            )}
            <div>
              <span className="text-slate-500 block text-xs">Prepared By</span>
              {data.agencyEmail || data.agencyPhone || data.agencyName}
            </div>
          </div>
        </div>

        {/* Scope */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-4 h-4 bg-yellow-500 block print:color-adjust-exact" style={{ backgroundColor: data.brandColor || '#eab308', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></span>
            Project Scope
          </h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.scope || 'Construction scope of work.'}</p>
        </div>

        {/* Deliverables */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-4 h-4 bg-yellow-500 block print:color-adjust-exact" style={{ backgroundColor: data.brandColor || '#eab308', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></span>
            Materials & Labor Deliverables
          </h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.deliverables || 'Materials, labor, and phases.'}</p>
        </div>

        {/* Pricing */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-4 h-4 bg-yellow-500 block print:color-adjust-exact" style={{ backgroundColor: data.brandColor || '#eab308', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></span>
            Cost Breakdown
          </h3>
          
          <table className="w-full text-left text-sm border-2 border-slate-900">
            <thead className="bg-slate-900 text-white print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider">Item Description</th>
                <th className="p-4 font-bold uppercase tracking-wider text-center">Qty</th>
                <th className="p-4 font-bold uppercase tracking-wider text-right">Unit Cost</th>
                <th className="p-4 font-bold uppercase tracking-wider text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="p-4 font-medium text-slate-900">{item.description}</td>
                  <td className="p-4 text-center text-slate-600">{item.qty}</td>
                  <td className="p-4 text-right text-slate-600">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-right font-bold text-slate-900">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-4 border-slate-900 bg-slate-100 print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <tr>
                <td colSpan={3} className="p-4 text-right font-black uppercase tracking-widest text-slate-900">Total Project Estimate</td>
                <td className="p-4 text-right font-black text-xl text-slate-900">${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Schedule & Terms */}
        <div className="grid grid-cols-2 gap-8 print:break-inside-avoid">
          <div className="border border-slate-200 p-6">
            <h4 className="font-black text-slate-900 uppercase tracking-widest mb-3 text-sm">Schedule</h4>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
          </div>
          <div className="border border-slate-200 p-6">
            <h4 className="font-black text-slate-900 uppercase tracking-widest mb-3 text-sm">Payment Terms</h4>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">{data.terms || 'Draw schedule applies.'}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export const constructionPremiumConfig: TemplateConfig = {
  id: 'construction-premium',
  name: 'Construction Premium',
  description: 'Heavy, blocky design perfect for contractors, builders, and trades.',
  component: ConstructionPremium,
  primaryColor: '#eab308',
  secondaryColor: '#0f172a',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
