import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const darkExecutiveConfig: TemplateConfig = {
  id: 'dark-executive',
  name: 'Dark Executive',
  description: 'A commanding, ultra-premium dark theme with subtle metallic accents and austere typography.',
  component: DarkExecutiveTemplate,
  primaryColor: '#e2e8f0', // Silver/slate text
  secondaryColor: '#000000', // True black
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function DarkExecutiveTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#94a3b8' // Slate metallic
  const bgDark = '#09090b' // Zinc 950

  return (
    <div className="w-full max-w-[850px] mx-auto font-serif text-slate-300 shadow-xl overflow-hidden print:shadow-none" style={{ minHeight: '1100px', backgroundColor: bgDark }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-between p-24 print-avoid-break overflow-hidden" style={{ pageBreakAfter: 'always' }}>
        
        {/* Subtle radial metallic gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)` }} />
        
        {/* Austere border frame */}
        <div className="absolute inset-10 border border-slate-800/50 pointer-events-none" />

        <div className="relative z-10 w-full flex justify-between items-center text-slate-100 mb-auto">
          <div>
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            ) : (
              <div className="text-xl tracking-[0.3em] uppercase text-slate-400">
                {data.agencyName}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-600">Strictly Confidential</span>
          </div>
        </div>

        <div className="relative z-10 w-full my-auto px-8">
          <div className="w-px h-16 bg-slate-800 mb-8" />
          <p className="text-[10px] font-sans uppercase tracking-[0.4em] mb-4" style={{ color: brandColor }}>
            Executive Briefing
          </p>
          <h1 className="text-5xl font-light tracking-wide text-slate-100 mb-12 leading-snug">
            {data.title}
          </h1>
          <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-slate-600 mb-2">Presented To</p>
          <p className="text-xl tracking-wider text-slate-300">{data.clientCompany || data.clientName}</p>
        </div>

        <div className="relative z-10 w-full mt-auto flex justify-between items-end text-[10px] font-sans uppercase tracking-[0.2em] text-slate-600">
          <div>
            <p className="mb-2">Authored By</p>
            <p className="text-slate-400">{data.agencyName}</p>
          </div>
          <div className="text-right">
            <p className="mb-2">Date</p>
            <p className="text-slate-400">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-24 space-y-24 bg-[#09090b]">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-6 mb-12">
              <div className="h-px w-12 bg-slate-800" />
              <h2 className="text-[10px] font-sans uppercase tracking-[0.4em] text-slate-400">Executive Summary</h2>
            </div>
            <div className="prose prose-lg prose-invert max-w-none text-slate-400 leading-relaxed font-light whitespace-pre-wrap pl-18">
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-6 mb-12">
              <div className="h-px w-12 bg-slate-800" />
              <h2 className="text-[10px] font-sans uppercase tracking-[0.4em] text-slate-400">Strategic Deliverables</h2>
            </div>
            <div className="border border-slate-800/50 p-12 bg-black/20">
              <div className="prose prose-lg prose-invert max-w-none text-slate-400 leading-relaxed font-light whitespace-pre-wrap">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-6 mb-12">
              <div className="h-px w-12 bg-slate-800" />
              <h2 className="text-[10px] font-sans uppercase tracking-[0.4em] text-slate-400">Execution Timeline</h2>
            </div>
            <div className="prose prose-lg prose-invert max-w-none text-slate-400 leading-relaxed font-light whitespace-pre-wrap pl-8 border-l border-slate-800/50">
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px w-12 bg-slate-800" />
            <h2 className="text-[10px] font-sans uppercase tracking-[0.4em] text-slate-400">Financial Authorization</h2>
          </div>
          
          <table className="w-full text-left text-sm font-sans tracking-wide">
            <thead className="border-b border-slate-800">
              <tr>
                <th className="px-4 py-6 font-normal uppercase tracking-[0.2em] text-slate-500 text-[10px]">Description</th>
                <th className="px-4 py-6 font-normal uppercase tracking-[0.2em] text-slate-500 text-[10px] text-center">Qty</th>
                <th className="px-4 py-6 font-normal uppercase tracking-[0.2em] text-slate-500 text-[10px] text-right">Fee</th>
                <th className="px-4 py-6 font-normal uppercase tracking-[0.2em] text-slate-500 text-[10px] text-right">Ext</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {data.items.length > 0 ? (
                data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="px-4 py-6 text-slate-300 font-light">{item.description}</td>
                    <td className="px-4 py-6 text-center text-slate-500 font-light">{item.qty}</td>
                    <td className="px-4 py-6 text-right text-slate-500 font-light">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-6 text-right text-slate-200 font-medium">${item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-600 italic">No line items.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="flex justify-end pt-8 border-t border-slate-800 mt-4 print-avoid-break">
            <div className="w-2/3 border border-slate-800/50 p-8 flex justify-between items-center bg-black/20">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-slate-500">Total Capital Required</span>
              <span className="text-3xl font-light text-slate-100 tracking-wide">${data.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break border-t border-slate-800/80 pt-16 mt-24">
          <h2 className="text-[10px] font-sans uppercase tracking-[0.4em] mb-8 text-slate-600 text-center">Legal Terms & Conditions</h2>
          <div className="text-xs text-slate-500 leading-loose whitespace-pre-wrap font-sans max-w-2xl mx-auto">
            {data.terms || "Standard confidentiality and legal terms apply."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-24 pt-16 border-t border-slate-800 print-avoid-break">
          <div className="grid grid-cols-2 gap-24 text-center">
            <div>
              <div className="border-b border-slate-800 h-16 mb-6" />
              <p className="text-slate-300 tracking-wider text-sm">{data.clientName}</p>
              <p className="text-[10px] font-sans text-slate-600 mt-2 uppercase tracking-[0.2em]">Authorized Signatory</p>
            </div>
            <div>
              <div className="border-b border-slate-800 h-16 mb-6" />
              <p className="text-slate-300 tracking-wider text-sm">{data.agencyName}</p>
              <p className="text-[10px] font-sans text-slate-600 mt-2 uppercase tracking-[0.2em]">Authorized Signatory</p>
            </div>
          </div>
        </section>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
