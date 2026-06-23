import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const realEstateDevelopmentConfig: TemplateConfig = {
  id: 'real-estate-development',
  name: 'Real Estate Development',
  description: 'Luxurious and structured layout for property and real estate proposals.',
  component: RealEstateDevelopmentTemplate,
  primaryColor: '#0f766e', // Teal
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function RealEstateDevelopmentTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#0f766e'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-[#fdfdfd] font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none print:border-none" style={{ minHeight: '1000px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1000px] flex flex-col p-20 print-avoid-break bg-[#f0f4f8]" style={{ pageBreakAfter: 'always' }}>
        
        {/* Architectural Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${brandColor} 0, ${brandColor} 1px, transparent 1px, transparent 20px)` }} />
        
        {/* Massive Watermark */}
        <div className="absolute bottom-10 -right-10 text-[150px] font-black opacity-5 tracking-tighter text-slate-900 pointer-events-none uppercase">
          ESTATE
        </div>

        <div className="relative z-10 flex justify-between items-start mb-auto">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-14 object-contain" />
          ) : (
            <div className="text-3xl font-serif text-slate-900 tracking-tight">
              {data.agencyName}
            </div>
          )}
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Development Proposal</span>
        </div>

        <div className="relative z-10 my-auto bg-white p-12 shadow-2xl border border-slate-100 transform -translate-x-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-1" style={{ backgroundColor: brandColor }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: brandColor }}>
              Property & Development
            </p>
          </div>
          <h1 className="text-5xl font-serif text-slate-900 leading-tight mb-8">
            {data.title}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Prepared For</p>
          <p className="text-xl text-slate-800 font-sans">{data.clientCompany || data.clientName}</p>
        </div>

        <div className="relative z-10 mt-auto grid grid-cols-2 gap-8 text-sm pt-8 border-t border-slate-200">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Developer</p>
            <p className="font-bold text-slate-900 uppercase tracking-wide">{data.agencyName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Issue Date</p>
            <p className="font-bold text-slate-900 uppercase tracking-wide">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-20 bg-white">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-serif text-slate-400">01.</span>
              <h2 className="text-2xl font-serif text-slate-900 uppercase tracking-wide">Project Overview</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-sans whitespace-pre-wrap ml-12 border-l border-slate-200 pl-6">
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-serif text-slate-400">02.</span>
              <h2 className="text-2xl font-serif text-slate-900 uppercase tracking-wide">Development Specifications</h2>
            </div>
            <div className="bg-[#f0f4f8] p-8 border border-slate-200 ml-12">
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-serif text-slate-400">03.</span>
              <h2 className="text-2xl font-serif text-slate-900 uppercase tracking-wide">Project Phasing</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-sans whitespace-pre-wrap ml-12 pl-6 border-l-4" style={{ borderColor: brandColor }}>
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl font-serif text-slate-400">04.</span>
            <h2 className="text-2xl font-serif text-slate-900 uppercase tracking-wide">Investment Summary</h2>
          </div>
          
          <div className="ml-12">
            <table className="w-full text-left text-sm font-sans border border-slate-200">
              <thead className="bg-[#f0f4f8] text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-b border-slate-200 border-r border-slate-200">Cost Center</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-center border-b border-slate-200 border-r border-slate-200">Qty</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right border-b border-slate-200 border-r border-slate-200">Unit Price</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right border-b border-slate-200">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-6 py-5 text-slate-900 font-medium border-r border-slate-200">{item.description}</td>
                      <td className="px-6 py-5 text-center text-slate-600 border-r border-slate-200">{item.qty}</td>
                      <td className="px-6 py-5 text-right text-slate-600 border-r border-slate-200">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-5 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">No line items.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="flex justify-end">
              <div className="w-1/2 p-6 flex justify-between items-center bg-[#f0f4f8] border-x border-b border-slate-200">
                <span className="font-bold text-sm uppercase tracking-widest text-slate-600">Total Capital</span>
                <span className="font-serif text-3xl font-bold" style={{ color: brandColor }}>${data.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break mt-16 pt-12 border-t border-slate-200 ml-12">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-slate-400">Terms & Conditions</h2>
          <div className="text-xs text-slate-500 leading-relaxed font-sans whitespace-pre-wrap columns-2 gap-8">
            {data.terms || "Standard real estate development terms apply."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-16 pt-8 print-avoid-break ml-12">
          <div className="grid grid-cols-2 gap-16">
            <div className="border border-slate-200 p-8 bg-slate-50">
              <div className="border-b-2 border-slate-300 h-10 mb-4" />
              <p className="font-bold text-slate-900">{data.clientName}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Client Signature</p>
            </div>
            <div className="border border-slate-200 p-8 bg-slate-50">
              <div className="border-b-2 border-slate-300 h-10 mb-4" />
              <p className="font-bold text-slate-900">{data.agencyName}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Agency Signature</p>
            </div>
          </div>
        </section>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
