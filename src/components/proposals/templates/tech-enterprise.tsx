import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const techEnterpriseConfig: TemplateConfig = {
  id: 'tech-enterprise',
  name: 'Tech Enterprise',
  description: 'Cyber-inspired layout with monospace accents, deep dark sections, and neon cyan highlights.',
  component: TechEnterpriseTemplate,
  primaryColor: '#06b6d4', // Cyan
  secondaryColor: '#0f172a',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function TechEnterpriseTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#06b6d4'
  const darkBg = '#020617' // Very dark slate

  return (
    <div className="w-full max-w-[850px] mx-auto bg-slate-50 font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-between p-20 print-avoid-break text-white overflow-hidden" style={{ backgroundColor: darkBg, pageBreakAfter: 'always' }}>
        
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${brandColor} 1px, transparent 1px), linear-gradient(90deg, ${brandColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        
        {/* Neon Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-10" style={{ backgroundColor: brandColor }} />

        <div className="relative z-10 flex justify-between items-start">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-12 object-contain" />
          ) : (
            <div className="text-2xl font-bold tracking-tight">
              {data.agencyName}
            </div>
          )}
          <div className="text-right">
            <span className="font-mono text-xs border px-3 py-1 bg-black/50" style={{ color: brandColor, borderColor: `${brandColor}40` }}>SYS.DOC.PROP</span>
          </div>
        </div>

        <div className="relative z-10 w-full my-auto">
          <div className="font-mono text-[10px] mb-4 flex items-center gap-2 uppercase tracking-widest text-slate-400">
            <span className="w-2 h-2" style={{ backgroundColor: brandColor }} />
            INITIALIZING PROPOSAL SEQUENCE
          </div>
          <h1 className="text-6xl font-black tracking-tighter leading-[1.1] mb-8">
            {data.title}
          </h1>
          <p className="text-lg text-slate-400 max-w-xl font-light">
            Enterprise architecture, deployment strategy, and technical investment parameters for <strong className="text-white">{data.clientCompany || data.clientName}</strong>.
          </p>
        </div>

        <div className="relative z-10 border-t border-slate-800 pt-8 mt-auto grid grid-cols-2 gap-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1">Authored By</p>
            <p className="font-bold text-lg">{data.agencyName}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1">Timestamp</p>
            <p className="font-bold text-lg">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-20 bg-white">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-3">
              <span className="font-mono text-sm px-2 py-1 bg-slate-100 text-slate-500">01</span>
              Technical Scope
            </h2>
            <div className="bg-slate-50 p-8 border-l-4" style={{ borderColor: brandColor }}>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {data.scope}
              </div>
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-3">
              <span className="font-mono text-sm px-2 py-1 bg-slate-100 text-slate-500">02</span>
              Deliverables
            </h2>
            <div className="bg-slate-50 p-8 border border-slate-200">
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-3">
              <span className="font-mono text-sm px-2 py-1 bg-slate-100 text-slate-500">03</span>
              Deployment Timeline
            </h2>
            <div className="bg-slate-900 p-8 text-slate-300">
              <div className="prose prose-invert max-w-none leading-relaxed whitespace-pre-wrap">
                {data.timeline}
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-3">
            <span className="font-mono text-sm px-2 py-1 bg-slate-100 text-slate-500">04</span>
            Investment
          </h2>
          
          <div className="border-2 border-slate-900">
            <table className="w-full text-left text-sm font-mono">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 uppercase font-normal">Component</th>
                  <th className="px-6 py-4 uppercase font-normal text-center">Qty</th>
                  <th className="px-6 py-4 uppercase font-normal text-right">Rate</th>
                  <th className="px-6 py-4 uppercase font-normal text-right">Sum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-6 py-4 font-sans font-medium">{item.description}</td>
                      <td className="px-6 py-4 text-center">{item.qty}</td>
                      <td className="px-6 py-4 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-bold">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-slate-400 italic font-sans">No components.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="bg-slate-100 p-6 flex justify-between items-center border-t-2 border-slate-900">
              <div className="font-mono text-xs uppercase text-slate-500">Total System Investment</div>
              <div className="font-black text-3xl font-sans" style={{ color: brandColor }}>${data.totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break border-t border-slate-200 pt-16">
          <h2 className="font-mono text-xs uppercase text-slate-400 mb-4">05_Terms.md</h2>
          <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6">
            {data.terms || "Standard SLA and deployment terms apply."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-16 pt-16 border-t border-slate-200 print-avoid-break">
          <div className="grid grid-cols-2 gap-12">
            <div className="border border-slate-200 p-6">
              <p className="font-mono text-[10px] uppercase text-slate-400 mb-8">Client Auth</p>
              <div className="border-b border-slate-300 h-8 mb-2" />
              <p className="font-bold text-slate-900 text-sm">{data.clientName}</p>
            </div>
            <div className="border border-slate-200 p-6 bg-slate-50">
              <p className="font-mono text-[10px] uppercase text-slate-400 mb-8">Vendor Auth</p>
              <div className="border-b border-slate-300 h-8 mb-2" />
              <p className="font-bold text-slate-900 text-sm">{data.agencyName}</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
