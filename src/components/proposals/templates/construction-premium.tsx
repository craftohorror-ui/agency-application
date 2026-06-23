import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const constructionPremiumConfig: TemplateConfig = {
  id: 'construction-premium',
  name: 'Construction Premium',
  description: 'A sophisticated architectural layout featuring blueprint aesthetics, geometric precision, and heavy structural typography.',
  component: ConstructionPremiumTemplate,
  primaryColor: '#b45309', // Amber/Bronze
  secondaryColor: '#1e293b', // Slate 800
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function ConstructionPremiumTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#b45309'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-[#f8fafc] font-sans text-slate-900 border border-slate-300 shadow-xl overflow-hidden print:shadow-none print:border-none" style={{ minHeight: '1000px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1000px] flex flex-col p-20 print-avoid-break bg-[#0f172a] text-white" style={{ pageBreakAfter: 'always' }}>
        
        {/* Blueprint Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '125px 125px' }} />

        <div className="relative z-10 flex justify-between items-center mb-auto border-b border-white/20 pb-8">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-14 object-contain brightness-0 invert" />
          ) : (
            <div className="text-3xl font-black tracking-tighter uppercase">
              {data.agencyName}
            </div>
          )}
          <div className="text-right">
            <span className="font-mono text-xs text-white/50 border border-white/20 px-3 py-1 bg-white/5">PROJ.DOC.01</span>
          </div>
        </div>

        <div className="relative z-10 my-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-2" style={{ backgroundColor: brandColor }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
              Project Proposal & Specification
            </p>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-[1.05] text-white mb-10">
            {data.title}
          </h1>
          <div className="grid grid-cols-2 gap-12 bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Prepared For</p>
              <p className="text-lg font-medium text-white">{data.clientCompany || data.clientName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Project Date</p>
              <p className="text-lg font-medium text-white">{data.date}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto border-t border-white/20 pt-8 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">General Contractor</p>
            <p className="font-bold text-sm text-white uppercase tracking-wider">{data.agencyName}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Confidential</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-20 bg-white">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-6 mb-8 border-b-2 border-slate-900 pb-4">
              <span className="text-3xl font-black text-slate-300">01</span>
              <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900">Project Scope</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium whitespace-pre-wrap pl-14">
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-6 mb-8 border-b-2 border-slate-900 pb-4">
              <span className="text-3xl font-black text-slate-300">02</span>
              <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900">Specifications</h2>
            </div>
            <div className="bg-[#f8fafc] p-10 border border-slate-200 ml-14">
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-6 mb-8 border-b-2 border-slate-900 pb-4">
              <span className="text-3xl font-black text-slate-300">03</span>
              <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900">Project Schedule</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium whitespace-pre-wrap ml-14 pl-6 border-l-4" style={{ borderColor: brandColor }}>
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <div className="flex items-center gap-6 mb-8 border-b-2 border-slate-900 pb-4">
            <span className="text-3xl font-black text-slate-300">04</span>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900">Estimate & Costing</h2>
          </div>
          
          <div className="ml-14 border-2 border-slate-900 overflow-hidden">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-r border-slate-700">Material/Labor</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-center border-r border-slate-700">Qty</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right border-r border-slate-700">Unit Cost</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-6 py-5 text-slate-900 font-bold border-r border-slate-200">{item.description}</td>
                      <td className="px-6 py-5 text-center text-slate-600 border-r border-slate-200">{item.qty}</td>
                      <td className="px-6 py-5 text-right text-slate-600 border-r border-slate-200">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-5 text-right font-black text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">No line items.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="bg-[#f8fafc] border-t-2 border-slate-900 p-8 flex justify-between items-center">
              <div className="font-bold text-sm uppercase tracking-widest text-slate-500">Total Project Estimate</div>
              <div className="font-black text-4xl" style={{ color: brandColor }}>
                ${data.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break mt-16 pt-16 border-t-2 border-slate-200 ml-14">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-slate-500">Terms & Conditions</h2>
          <div className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap bg-[#f8fafc] p-6 border border-slate-200">
            {data.terms || "Standard construction and contracting terms apply."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-16 pt-8 print-avoid-break ml-14">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <div className="border-b-4 border-slate-900 h-12 mb-3" />
              <p className="font-bold text-slate-900 text-sm uppercase tracking-wide">{data.clientName}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Client Authorization</p>
            </div>
            <div>
              <div className="border-b-4 border-slate-900 h-12 mb-3" />
              <p className="font-bold text-slate-900 text-sm uppercase tracking-wide">{data.agencyName}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Contractor Authorization</p>
            </div>
          </div>
        </section>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
