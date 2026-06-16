import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const legalServicesConfig: TemplateConfig = {
  id: 'legal-services',
  name: 'Legal & Compliance',
  description: 'Traditional, authoritative layout with formal typography, justified text, and classic dividers.',
  component: LegalServicesTemplate,
  primaryColor: '#1e3a8a', // Deep Blue
  secondaryColor: '#ffffff',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function LegalServicesTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#1e3a8a'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-serif text-slate-900 border border-slate-300 shadow-xl print:shadow-none print:border-none" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col items-center justify-center p-24 print-avoid-break text-center border-[12px] border-double m-8" style={{ pageBreakAfter: 'always', borderColor: `${brandColor}20` }}>
        
        <div className="absolute top-16 left-0 w-full flex justify-center">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-24 object-contain" />
          ) : (
            <div className="text-3xl uppercase tracking-widest font-bold" style={{ color: brandColor }}>
              {data.agencyName}
            </div>
          )}
        </div>

        <div className="w-full max-w-lg mt-32">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-8 border-b-2 pb-4" style={{ borderColor: brandColor }}>
            Proposal for Legal & Compliance Services
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-12 leading-snug">
            {data.title}
          </h1>
          <div className="flex justify-center mb-12">
            <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7l-10 5 10 5 10-5-10-5zm0 7l-10 5 10 5 10-5-10-5z"/></svg>
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-4">Prepared For</p>
          <p className="text-2xl font-bold text-slate-900">{data.clientCompany || data.clientName}</p>
        </div>

        <div className="absolute bottom-16 left-0 w-full flex flex-col items-center text-sm uppercase tracking-widest text-slate-500">
          <p className="mb-2 border-b border-slate-300 pb-1 w-48">Date of Issue</p>
          <p className="font-bold text-slate-900">{data.date}</p>
          <p className="mt-8 text-[10px] tracking-[0.3em]">Privileged & Confidential</p>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-24 space-y-20 bg-white leading-loose text-justify">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-slate-900 mb-6 border-b-4 pb-2" style={{ borderColor: brandColor }}>I. Overview of Matter</h2>
            <div className="prose prose-slate max-w-none text-slate-800">
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-slate-900 mb-6 border-b-4 pb-2" style={{ borderColor: brandColor }}>II. Scope of Representation</h2>
            <div className="prose prose-slate max-w-none text-slate-800">
              {data.deliverables}
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-slate-900 mb-6 border-b-4 pb-2" style={{ borderColor: brandColor }}>III. Estimated Timeline</h2>
            <div className="prose prose-slate max-w-none text-slate-800 pl-8 border-l-2 border-slate-300 italic">
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-slate-900 mb-6 border-b-4 pb-2" style={{ borderColor: brandColor }}>IV. Fee Structure</h2>
          
          <table className="w-full text-left text-base mt-8">
            <thead className="border-b-2 border-slate-900">
              <tr>
                <th className="py-4 font-bold uppercase tracking-widest text-slate-900 text-sm">Description of Services</th>
                <th className="py-4 font-bold uppercase tracking-widest text-slate-900 text-sm text-center">Hours/Qty</th>
                <th className="py-4 font-bold uppercase tracking-widest text-slate-900 text-sm text-right">Rate</th>
                <th className="py-4 font-bold uppercase tracking-widest text-slate-900 text-sm text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.items.length > 0 ? (
                data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-6 text-slate-800 pr-4">{item.description}</td>
                    <td className="py-6 text-center text-slate-600 px-4">{item.qty}</td>
                    <td className="py-6 text-right text-slate-600 px-4">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-6 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 italic">No fee items specified.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="flex justify-end pt-6 border-t-4 border-slate-900 mt-2 print-avoid-break">
            <div className="w-1/2 flex justify-between items-center py-4 bg-slate-50 px-6 border border-slate-200">
              <span className="font-bold text-sm uppercase tracking-widest text-slate-900">Total Estimated Fees</span>
              <span className="font-bold text-2xl text-slate-900">${data.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break mt-16">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-slate-900 mb-6 border-b-4 pb-2" style={{ borderColor: brandColor }}>V. Terms of Engagement</h2>
          <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap text-justify bg-slate-50 p-8 border border-slate-200">
            {data.terms || "Standard terms of legal representation apply. Execution of this document constitutes a binding agreement for services rendered."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-20 pt-16 border-t-2 border-slate-900 print-avoid-break">
          <p className="mb-12 font-bold uppercase text-center tracking-widest text-slate-900">Signatures & Authorization</p>
          <div className="grid grid-cols-2 gap-24">
            <div>
              <div className="border-b border-slate-400 h-16 mb-2" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-900 uppercase tracking-wider">{data.clientName}</p>
                  <p className="text-xs text-slate-500 mt-1">{data.clientCompany || 'Client'}</p>
                </div>
                <p className="text-xs text-slate-500 uppercase">Date</p>
              </div>
            </div>
            <div>
              <div className="border-b border-slate-400 h-16 mb-2" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-900 uppercase tracking-wider">{data.agencyName}</p>
                  <p className="text-xs text-slate-500 mt-1">Authorized Representative</p>
                </div>
                <p className="text-xs text-slate-500 uppercase">Date</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
