import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const corporateConfig: TemplateConfig = {
  id: 'corporate',
  name: 'Corporate Executive',
  description: 'Deep navy premium feel with structured grid layouts and robust data cards.',
  component: CorporateTemplate,
  primaryColor: '#1e3a8a',
  secondaryColor: '#f1f5f9',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0' // Premium Upgrade
}

interface CorporateTemplateProps {
  data: TemplateData
}

export function CorporateTemplate({ data }: CorporateTemplateProps) {
  // Deep navy blue for corporate identity
  const brandColor = data.brandColor || '#1e3a8a'
  const lightBg = '#f8fafc'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans text-slate-800 border-x border-slate-200 shadow-xl print:shadow-none print:border-none" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-between p-20 print-avoid-break bg-slate-50 overflow-hidden" style={{ pageBreakAfter: 'always' }}>
        
        {/* Corporate Geometric Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-bl-full opacity-10" style={{ backgroundColor: brandColor }} />
        <div className="absolute bottom-0 left-0 w-full h-[300px] opacity-5" style={{ background: `linear-gradient(to top, ${brandColor}, transparent)` }} />

        {/* Header Ribbon */}
        <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: brandColor }} />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-14 object-contain" />
            ) : (
              <div className="text-3xl font-black tracking-tight" style={{ color: brandColor }}>
                {data.agencyName}
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.2em]">Official Proposal</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">{data.date}</p>
          </div>
        </div>

        <div className="relative z-10 mt-32 mb-auto">
          <div className="inline-block px-4 py-1.5 mb-8 text-xs font-bold uppercase tracking-widest text-white rounded-sm shadow-sm" style={{ backgroundColor: brandColor }}>
            Prepared For: {data.clientCompany || data.clientName}
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-8">
            {data.title}
          </h1>
          <div className="w-32 h-1 mb-8" style={{ backgroundColor: brandColor }} />
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed font-light">
            Confidential business proposal outlining our strategic approach, technical deliverables, and investment parameters.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-12 pt-12 border-t border-slate-300">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Submitted By</p>
            <p className="font-bold text-slate-900 text-lg">{data.agencyName}</p>
            {data.agencyEmail && <p className="text-sm font-medium text-slate-500">{data.agencyEmail}</p>}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Prepared For</p>
            <p className="font-bold text-slate-900 text-lg">{data.clientName}</p>
            {data.clientCompany && <p className="text-sm font-medium text-slate-500">{data.clientCompany}</p>}
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-24">

        {/* Corporate Scope Section */}
        {(data.scope || data.deliverables) && (
          <div className="space-y-16">
            {data.scope && (
              <section className="print-avoid-break">
                <div className="flex items-end gap-6 mb-8 border-b-2 pb-4" style={{ borderColor: brandColor }}>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Project Scope</h2>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Section 01</span>
                </div>
                <div className="bg-slate-50 p-10 rounded-xl border border-slate-200 shadow-sm relative">
                  <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl" style={{ backgroundColor: brandColor }} />
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {data.scope}
                  </div>
                </div>
              </section>
            )}

            {data.deliverables && (
              <section className="print-avoid-break">
                <div className="flex items-end gap-6 mb-8 border-b-2 pb-4 border-slate-200">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Deliverables</h2>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Section 02</span>
                </div>
                <div className="pl-6 border-l-4" style={{ borderColor: brandColor }}>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {data.deliverables}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Timeline Visualization */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-end gap-6 mb-8 border-b-2 pb-4" style={{ borderColor: brandColor }}>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Execution Timeline</h2>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Section 03</span>
            </div>
            <div className="bg-white border border-slate-200 p-10 shadow-sm rounded-xl relative">
              <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                {data.timeline}
              </div>
            </div>
          </section>
        )}

        {/* Corporate Investment Table */}
        <section className="print-avoid-break">
          <div className="flex items-end gap-6 mb-8 border-b-2 pb-4" style={{ borderColor: brandColor }}>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Investment Summary</h2>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Section 04</span>
          </div>
          
          <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-slate-700">Description</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-slate-700 text-center">Qty</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-slate-700 text-right">Unit Price</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-slate-700 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 font-semibold text-slate-900">{item.description}</td>
                      <td className="px-6 py-5 text-center text-slate-600 font-medium">{item.qty}</td>
                      <td className="px-6 py-5 text-right text-slate-600 font-medium">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-5 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic bg-white">No line items specified.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Structured Total Block */}
            <div className="bg-slate-50 border-t border-slate-200 p-8 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm uppercase tracking-widest text-slate-500">Total Investment</p>
                <p className="text-xs text-slate-400 mt-1">Excludes applicable taxes</p>
              </div>
              <div className="font-black text-4xl" style={{ color: brandColor }}>
                ${data.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* Terms & Conditions */}
        {data.terms && (
          <section className="print-avoid-break">
            <div className="flex items-end gap-6 mb-8 border-b-2 pb-4 border-slate-200">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Terms & Conditions</h2>
            </div>
            <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded border border-slate-200">
              {data.terms}
            </div>
          </section>
        )}

        {/* Formal Signature Block */}
        <section className="mt-16 pt-16 border-t-2 border-slate-200 print-avoid-break">
          <h3 className="text-2xl font-bold tracking-tight mb-8 text-slate-900">Authorization</h3>
          <p className="text-sm text-slate-500 mb-12 max-w-2xl">
            By signing below, both parties agree to the terms, scope, and investment parameters outlined in this document.
          </p>
          <div className="grid grid-cols-2 gap-12">
            <div className="p-8 border border-slate-200 rounded-lg bg-white shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Client Authorization</p>
              <div className="border-b border-slate-300 h-10 mb-4" />
              <p className="font-bold text-slate-900">{data.clientName}</p>
              <p className="text-sm font-medium text-slate-500">{data.clientCompany || 'Client'}</p>
              <p className="text-xs text-slate-400 mt-4">Date: _________________</p>
            </div>
            <div className="p-8 border border-slate-200 rounded-lg bg-slate-50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full" style={{ backgroundColor: brandColor }} />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Agency Authorization</p>
              <div className="border-b border-slate-300 h-10 mb-4" />
              <p className="font-bold text-slate-900">{data.agencyName}</p>
              <p className="text-sm font-medium text-slate-500">Authorized Representative</p>
              <p className="text-xs text-slate-400 mt-4">Date: _________________</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
