import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const startupPitchDeckConfig: TemplateConfig = {
  id: 'startup-pitch-deck',
  name: 'Startup Pitch Deck',
  description: 'High-impact slide-style layout with massive typography and vibrant energetic gradients.',
  component: StartupPitchDeckTemplate,
  primaryColor: '#f97316', // Orange
  secondaryColor: '#ffffff',
  supportsPdf: true,
  supportsDocx: false, // Pitch style too complex for docx
  version: '2.0'
}

export function StartupPitchDeckTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#f97316'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-slate-900 font-sans text-white shadow-xl overflow-hidden print:shadow-none" style={{ minHeight: '1000px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1000px] flex flex-col justify-center p-24 print-avoid-break bg-slate-900 overflow-hidden" style={{ pageBreakAfter: 'always' }}>
        
        {/* Massive vibrant gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-40 mix-blend-screen" style={{ backgroundColor: brandColor }} />
        
        {/* Abstract dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 w-full mb-auto flex justify-between items-start">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-16 object-contain" />
          ) : (
            <div className="text-3xl font-black tracking-tighter text-white">
              {data.agencyName}
            </div>
          )}
          <span className="bg-white/10 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/20">Pitch Deck</span>
        </div>

        <div className="relative z-10 w-full my-auto text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] mb-6 text-white/60">
            Investment Proposal for {data.clientCompany || data.clientName}
          </p>
          <h1 className="text-7xl font-black tracking-tighter leading-[0.9] text-white mb-8 drop-shadow-2xl">
            {data.title}
          </h1>
          <div className="w-24 h-2 mx-auto mb-8 rounded-full" style={{ backgroundColor: brandColor }} />
          <p className="text-2xl text-white/80 max-w-xl mx-auto font-medium">
            Building the next generation of scalable growth solutions.
          </p>
        </div>

        <div className="relative z-10 w-full mt-auto flex justify-between items-end border-t border-white/10 pt-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Prepared By</p>
            <p className="font-bold text-lg">{data.agencyName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Date</p>
            <p className="font-bold text-lg">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-24 space-y-32 bg-slate-50 text-slate-900">

        {/* Scope - "The Problem / Solution" */}
        {data.scope && (
          <section className="print-avoid-break">
            <div className="flex flex-col mb-10">
              <span className="text-[100px] font-black leading-none opacity-[0.05] -mb-12 ml-4" style={{ color: brandColor }}>01</span>
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 relative z-10">The Vision</h2>
            </div>
            <div className="bg-white p-12 rounded-[2rem] shadow-lg border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full" style={{ backgroundColor: brandColor }} />
              <div className="prose prose-xl prose-slate max-w-none text-slate-700 leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                {data.scope}
              </div>
            </div>
          </section>
        )}

        {/* Deliverables - "The Product" */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <div className="flex flex-col mb-10">
              <span className="text-[100px] font-black leading-none opacity-[0.05] -mb-12 ml-4" style={{ color: brandColor }}>02</span>
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 relative z-10">The Product</h2>
            </div>
            <div className="bg-white p-12 rounded-[2rem] shadow-lg border border-slate-100 relative overflow-hidden">
              <div className="prose prose-xl prose-slate max-w-none text-slate-700 leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline - "Traction / Roadmap" */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex flex-col mb-10">
              <span className="text-[100px] font-black leading-none opacity-[0.05] -mb-12 ml-4" style={{ color: brandColor }}>03</span>
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 relative z-10">The Roadmap</h2>
            </div>
            <div className="bg-slate-900 text-white p-12 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at top right, ${brandColor}, transparent)` }} />
              <div className="prose prose-xl prose-invert max-w-none leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                {data.timeline}
              </div>
            </div>
          </section>
        )}

        {/* Pricing - "The Ask" */}
        <section className="print-avoid-break">
          <div className="flex flex-col mb-10">
            <span className="text-[100px] font-black leading-none opacity-[0.05] -mb-12 ml-4" style={{ color: brandColor }}>04</span>
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 relative z-10">The Ask</h2>
          </div>
          
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-base">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6 font-bold uppercase tracking-widest text-slate-400 text-xs">Category</th>
                  <th className="px-10 py-6 font-bold uppercase tracking-widest text-slate-400 text-xs text-center">Qty</th>
                  <th className="px-10 py-6 font-bold uppercase tracking-widest text-slate-400 text-xs text-right">Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-10 py-6 text-slate-900 font-bold text-xl">{item.description}</td>
                      <td className="px-10 py-6 text-center text-slate-500 font-medium">{item.qty}</td>
                      <td className="px-10 py-6 text-right font-black text-slate-900 text-xl">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-10 py-10 text-center text-slate-400 italic">No allocation specified.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="p-10 flex justify-between items-center bg-slate-900 text-white">
              <div className="font-bold text-sm uppercase tracking-widest text-white/50">Total Funding Required</div>
              <div className="font-black text-6xl drop-shadow-lg" style={{ color: brandColor }}>
                ${data.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* Terms & Authorization */}
        <div className="grid grid-cols-12 gap-12 print-avoid-break mt-16 border-t-2 border-slate-200 pt-16">
          <div className="col-span-7">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-6">Terms</h3>
            <div className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap bg-slate-100 p-6 rounded-2xl">
              {data.terms || "Standard investment/pitch terms apply. Highly confidential."}
            </div>
          </div>
          <div className="col-span-5 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-6">Signatures</h3>
            <div>
              <div className="border-b-2 border-slate-300 h-10 mb-2" />
              <p className="font-bold text-slate-900 text-sm">{data.clientName}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Investor / Client</p>
            </div>
            <div>
              <div className="border-b-2 border-slate-300 h-10 mb-2" />
              <p className="font-bold text-slate-900 text-sm">{data.agencyName}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Founder / Agency</p>
            </div>
          </div>
        </div>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
