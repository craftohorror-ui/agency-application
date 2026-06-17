import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const digitalMarketingEliteConfig: TemplateConfig = {
  id: 'digital-marketing-elite',
  name: 'Digital Marketing Elite',
  description: 'Vibrant, high-contrast digital marketing proposal with dynamic mesh gradients and data-driven layouts.',
  component: DigitalMarketingEliteTemplate,
  primaryColor: '#8b5cf6', // Violet
  secondaryColor: '#ffffff',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function DigitalMarketingEliteTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#8b5cf6'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-center p-20 print-avoid-break bg-slate-900 text-white overflow-hidden" style={{ pageBreakAfter: 'always' }}>
        
        {/* Dynamic mesh gradient background */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ background: `radial-gradient(circle at 0% 0%, ${brandColor} 0%, transparent 50%), radial-gradient(circle at 100% 100%, #3b82f6 0%, transparent 50%)` }} />

        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full border border-white/20" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full border border-white/10" />

        <div className="relative z-10 w-full mb-auto flex justify-between items-start">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-12 object-contain" />
          ) : (
            <div className="text-2xl font-black tracking-tight">
              {data.agencyName}
            </div>
          )}
          <div className="text-right">
            <span className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Digital Strategy</span>
          </div>
        </div>

        <div className="relative z-10 w-full my-auto text-center">
          <div className="inline-flex items-center gap-2 mb-8 bg-black/30 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: brandColor }} />
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">Prepared for {data.clientCompany || data.clientName}</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            {data.title}
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Data-driven growth architecture and multi-channel campaign execution.
          </p>
        </div>

        <div className="relative z-10 w-full mt-auto flex justify-between items-end border-t border-white/20 pt-8">
          <div className="flex gap-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Lead Strategist</p>
              <p className="font-bold text-lg">{data.agencyName}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Issue Date</p>
              <p className="font-bold text-lg">{data.date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-24 bg-white">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transform -rotate-6" style={{ backgroundColor: brandColor }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900">Campaign Blueprint</h2>
            </div>
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap ml-16">
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transform rotate-6" style={{ backgroundColor: brandColor }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900">Execution Outputs</h2>
            </div>
            <div className="bg-slate-50 p-10 rounded-3xl ml-16 shadow-inner border border-slate-100">
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transform -rotate-3" style={{ backgroundColor: brandColor }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900">Deployment Timeline</h2>
            </div>
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap ml-16 pl-6 border-l-4" style={{ borderColor: brandColor }}>
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transform rotate-3" style={{ backgroundColor: brandColor }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">Investment Structure</h2>
          </div>
          
          <div className="ml-16 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px]">Service Parameter</th>
                  <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px] text-center">Volume</th>
                  <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px] text-right">Unit Rate</th>
                  <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px] text-right">Ext. Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-8 py-6 text-slate-800 font-bold text-base">{item.description}</td>
                      <td className="px-8 py-6 text-center text-slate-500 font-medium">{item.qty}</td>
                      <td className="px-8 py-6 text-right text-slate-500 font-medium">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-8 py-6 text-right font-black text-slate-900 text-base">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-8 text-center text-slate-400 italic">No line items.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="p-8 flex justify-between items-center bg-slate-900 text-white">
              <div className="font-black text-xs uppercase tracking-widest text-slate-400">Total Campaign Investment</div>
              <div className="font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                ${data.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break mt-16 pt-16 border-t-2 border-slate-100 ml-16">
          <h2 className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-400">Terms of Service</h2>
          <div className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap columns-2 gap-8">
            {data.terms || "Standard digital marketing service terms apply."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-16 pt-16 border-t-2 border-slate-100 print-avoid-break ml-16">
          <div className="grid grid-cols-2 gap-16">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="border-b-2 border-slate-200 h-10 mb-4" />
              <p className="font-bold text-slate-900">{data.clientName}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Client Authorization</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="border-b-2 border-slate-200 h-10 mb-4" />
              <p className="font-bold text-slate-900">{data.agencyName}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Agency Authorization</p>
            </div>
          </div>
        </section>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
