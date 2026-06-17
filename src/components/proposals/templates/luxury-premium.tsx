import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const luxuryPremiumConfig: TemplateConfig = {
  id: 'luxury-premium',
  name: 'Luxury Premium',
  description: 'High-end elegant design with serif typography, gold accents, and expansive whitespace.',
  component: LuxuryPremiumTemplate,
  primaryColor: '#d4af37', // Gold
  secondaryColor: '#111827',
  supportsPdf: true,
  supportsDocx: false, // Too complex for standard docx generator
  version: '2.0'
}

export function LuxuryPremiumTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#d4af37'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-[#faf9f6] font-serif text-slate-900 shadow-xl overflow-hidden print:shadow-none" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-between p-24 print-avoid-break text-center overflow-hidden" style={{ pageBreakAfter: 'always' }}>
        
        {/* Luxury Border Frame */}
        <div className="absolute inset-8 border border-slate-200 pointer-events-none" />
        <div className="absolute inset-10 border border-slate-200 pointer-events-none" />

        <div className="relative z-10 w-full mb-auto mt-12">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-20 object-contain mx-auto" />
          ) : (
            <div className="text-3xl tracking-[0.3em] uppercase font-light text-slate-800">
              {data.agencyName}
            </div>
          )}
        </div>

        <div className="relative z-10 w-full my-auto px-12">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-12" style={{ color: brandColor }}>
            Exclusive Proposal
          </p>
          <h1 className="text-6xl font-light tracking-tight leading-snug mb-16 text-slate-900 italic">
            {data.title}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="h-px w-16 bg-slate-300" />
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: brandColor }} />
            <div className="h-px w-16 bg-slate-300" />
          </div>
          <p className="text-sm font-sans uppercase tracking-[0.2em] text-slate-500 mb-4">Prepared For</p>
          <p className="text-2xl font-light text-slate-800">{data.clientCompany || data.clientName}</p>
        </div>

        <div className="relative z-10 w-full mt-auto text-xs font-sans uppercase tracking-[0.2em] text-slate-400">
          <p className="mb-2">Confidential & Proprietary</p>
          <p>{data.date}</p>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-24 space-y-24 bg-[#faf9f6]">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break text-center">
            <h2 className="text-sm font-sans uppercase tracking-[0.3em] mb-8" style={{ color: brandColor }}>The Vision</h2>
            <div className="prose prose-lg prose-slate max-w-2xl mx-auto text-slate-600 leading-loose whitespace-pre-wrap font-serif italic text-xl">
              &quot;{data.scope}&quot;
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-24 bg-slate-300" />
              <h2 className="text-sm font-sans uppercase tracking-[0.3em]" style={{ color: brandColor }}>Key Deliverables</h2>
              <div className="h-px w-24 bg-slate-300" />
            </div>
            <div className="bg-white p-12 border border-slate-200 shadow-sm">
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose whitespace-pre-wrap font-serif">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-24 bg-slate-300" />
              <h2 className="text-sm font-sans uppercase tracking-[0.3em]" style={{ color: brandColor }}>Project Timeline</h2>
              <div className="h-px w-24 bg-slate-300" />
            </div>
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose whitespace-pre-wrap font-serif pl-8 border-l border-slate-300">
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-24 bg-slate-300" />
            <h2 className="text-sm font-sans uppercase tracking-[0.3em]" style={{ color: brandColor }}>Financial Overview</h2>
            <div className="h-px w-24 bg-slate-300" />
          </div>
          
          <table className="w-full text-left text-sm font-sans mb-12">
            <thead className="border-b border-slate-300">
              <tr>
                <th className="px-4 py-4 font-normal uppercase tracking-widest text-slate-500">Service Description</th>
                <th className="px-4 py-4 font-normal uppercase tracking-widest text-slate-500 text-center">Qty</th>
                <th className="px-4 py-4 font-normal uppercase tracking-widest text-slate-500 text-right">Fee</th>
                <th className="px-4 py-4 font-normal uppercase tracking-widest text-slate-500 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.length > 0 ? (
                data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="px-4 py-6 text-slate-800 font-serif text-base">{item.description}</td>
                    <td className="px-4 py-6 text-center text-slate-500">{item.qty}</td>
                    <td className="px-4 py-6 text-right text-slate-500 font-serif">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-6 text-right text-slate-900 font-serif text-base">${item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">No line items.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="flex justify-end pt-8 border-t border-slate-300 print-avoid-break">
            <div className="w-2/3 flex justify-between items-center py-6 px-8 bg-white border border-slate-200 shadow-sm">
              <span className="font-sans text-xs uppercase tracking-widest text-slate-500">Total Investment</span>
              <span className="font-serif text-3xl text-slate-900">${data.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break text-center mt-24">
          <h2 className="text-xs font-sans uppercase tracking-[0.3em] mb-8 text-slate-400">Terms & Conditions</h2>
          <div className="text-xs text-slate-500 leading-loose whitespace-pre-wrap font-sans max-w-2xl mx-auto">
            {data.terms || "Standard premium terms apply."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-24 pt-16 border-t border-slate-200 print-avoid-break">
          <div className="grid grid-cols-2 gap-24 text-center">
            <div>
              <div className="border-b border-slate-300 h-16 mb-6" />
              <p className="font-serif text-slate-900 text-lg">{data.clientName}</p>
              <p className="text-[10px] font-sans text-slate-400 mt-2 uppercase tracking-widest">Client Authorization</p>
            </div>
            <div>
              <div className="border-b border-slate-300 h-16 mb-6" />
              <p className="font-serif text-slate-900 text-lg">{data.agencyName}</p>
              <p className="text-[10px] font-sans text-slate-400 mt-2 uppercase tracking-widest">Agency Authorization</p>
            </div>
          </div>
        </section>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
