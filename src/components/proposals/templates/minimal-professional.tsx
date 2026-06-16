import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const minimalProfessionalConfig: TemplateConfig = {
  id: 'minimal-professional',
  name: 'Minimal Professional',
  description: 'Ultra-clean layout with extensive whitespace, thin borders, and muted typography.',
  component: MinimalProfessionalTemplate,
  primaryColor: '#64748b', // Slate
  secondaryColor: '#ffffff',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function MinimalProfessionalTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#64748b'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans text-slate-800 border border-slate-100 print:border-none" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-between p-24 print-avoid-break bg-white" style={{ pageBreakAfter: 'always' }}>
        
        <div className="flex justify-between items-start">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-10 object-contain" />
          ) : (
            <div className="text-xl font-medium tracking-tight text-slate-900">
              {data.agencyName}
            </div>
          )}
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-slate-400">Proposal</span>
          </div>
        </div>

        <div className="my-auto">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-8" style={{ color: brandColor }}>
            Prepared For {data.clientCompany || data.clientName}
          </p>
          <h1 className="text-5xl font-light tracking-tight text-slate-900 mb-6 leading-tight">
            {data.title}
          </h1>
          <div className="w-12 h-px bg-slate-300 mb-6" />
          <p className="text-lg text-slate-500 font-light max-w-md leading-relaxed">
            A comprehensive overview of our proposed services and strategic implementation.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 border-t border-slate-100 pt-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">From</p>
            <p className="font-medium text-slate-900 text-sm">{data.agencyName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Date</p>
            <p className="font-medium text-slate-900 text-sm">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-24 space-y-20 bg-white">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-6" style={{ color: brandColor }}>01 / Scope</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-light whitespace-pre-wrap">
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-6 border-t border-slate-100 pt-10" style={{ color: brandColor }}>02 / Deliverables</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-light whitespace-pre-wrap">
              {data.deliverables}
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-6 border-t border-slate-100 pt-10" style={{ color: brandColor }}>03 / Timeline</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-light whitespace-pre-wrap pl-6 border-l border-slate-200">
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-6 border-t border-slate-100 pt-10" style={{ color: brandColor }}>04 / Financials</h2>
          
          <div className="border border-slate-200 rounded-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium text-slate-500 text-xs">Description</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-xs text-center">Qty</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-xs text-right">Price</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-xs text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-6 py-4 text-slate-800 font-medium">{item.description}</td>
                      <td className="px-6 py-4 text-center text-slate-500">{item.qty}</td>
                      <td className="px-6 py-4 text-right text-slate-500">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-slate-900 font-medium">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-slate-400 italic">No line items.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-200">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total</div>
              <div className="font-light text-2xl text-slate-900">${data.totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break border-t border-slate-100 pt-10">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-6 text-slate-400">Terms</h2>
          <div className="text-xs text-slate-500 leading-relaxed font-light whitespace-pre-wrap">
            {data.terms || "Standard terms apply."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-16 pt-16 border-t border-slate-100 print-avoid-break">
          <div className="grid grid-cols-2 gap-20">
            <div>
              <div className="border-b border-slate-200 h-10 mb-3" />
              <p className="font-medium text-slate-900 text-sm">{data.clientName}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Client Signature</p>
            </div>
            <div>
              <div className="border-b border-slate-200 h-10 mb-3" />
              <p className="font-medium text-slate-900 text-sm">{data.agencyName}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Agency Signature</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
