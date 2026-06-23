import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const financialAdvisoryConfig: TemplateConfig = {
  id: 'financial-advisory',
  name: 'Financial Advisory',
  description: 'Trustworthy layout with forest greens, precise grid structures, and professional serif/sans-serif pairing.',
  component: FinancialAdvisoryTemplate,
  primaryColor: '#065f46', // Emerald
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function FinancialAdvisoryTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#065f46'
  const accentColor = '#d1fae5' // Light emerald

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans text-slate-800 shadow-xl print:shadow-none" style={{ minHeight: '1000px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1000px] flex flex-col p-20 print-avoid-break bg-[#f8fafc] border-l-[16px]" style={{ pageBreakAfter: 'always', borderColor: brandColor }}>
        
        {/* Subtle Financial Background */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 26%, transparent 27%, transparent 74%, rgba(0,0,0,1) 75%, rgba(0,0,0,1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 26%, transparent 27%, transparent 74%, rgba(0,0,0,1) 75%, rgba(0,0,0,1) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }} />

        <div className="relative z-10 flex justify-between items-start mb-auto">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-16 object-contain" />
          ) : (
            <div className="text-2xl font-serif text-slate-900 tracking-tight">
              {data.agencyName}
            </div>
          )}
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 border border-slate-300 px-3 py-1 bg-white">Strategic Proposal</span>
        </div>

        <div className="relative z-10 my-auto bg-white p-12 border border-slate-200 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: brandColor }}>
            Financial Advisory Services
          </p>
          <h1 className="text-5xl font-serif text-slate-900 leading-tight mb-8">
            {data.title}
          </h1>
          <div className="w-16 h-1 mb-8" style={{ backgroundColor: brandColor }} />
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Prepared For</p>
          <p className="text-2xl text-slate-800 font-medium">{data.clientCompany || data.clientName}</p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-slate-300 pt-8 mt-auto text-sm">
          <div>
            <p className="font-bold text-slate-900">{data.agencyName}</p>
            {data.agencyEmail && <p className="text-slate-500">{data.agencyEmail}</p>}
          </div>
          <div className="text-right">
            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold mb-1">Issue Date</p>
            <p className="font-bold text-slate-900">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-20 bg-white">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-4">
              <span className="w-6 h-6 rounded-sm flex-shrink-0" style={{ backgroundColor: brandColor }} />
              Strategic Overview
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap ml-10">
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-4">
              <span className="w-6 h-6 rounded-sm flex-shrink-0" style={{ backgroundColor: brandColor }} />
              Key Services & Deliverables
            </h2>
            <div className="bg-slate-50 p-8 border border-slate-200 ml-10">
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-4">
              <span className="w-6 h-6 rounded-sm flex-shrink-0" style={{ backgroundColor: brandColor }} />
              Execution Roadmap
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap ml-10 pl-6 border-l-2" style={{ borderColor: accentColor }}>
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-4">
            <span className="w-6 h-6 rounded-sm flex-shrink-0" style={{ backgroundColor: brandColor }} />
            Fee Schedule
          </h2>
          
          <div className="ml-10">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-100 text-slate-600 border-y-2 border-slate-300">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Service Element</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-center">Volume</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Rate</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 border-b-2 border-slate-300">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50">
                      <td className="px-6 py-5 text-slate-900 font-medium">{item.description}</td>
                      <td className="px-6 py-5 text-center text-slate-600">{item.qty}</td>
                      <td className="px-6 py-5 text-right text-slate-600">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-5 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">No fee items specified.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="flex justify-end mt-4">
              <div className="w-1/2 p-6 flex justify-between items-center bg-slate-50 border border-slate-200">
                <span className="font-bold text-sm uppercase tracking-widest text-slate-600">Total Capital Outlay</span>
                <span className="font-serif text-3xl text-slate-900" style={{ color: brandColor }}>${data.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-6 text-slate-500">Terms of Engagement</h2>
          <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap columns-2 gap-8">
            {data.terms || "Standard advisory terms and confidentiality agreements apply."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-16 pt-16 border-t border-slate-200 print-avoid-break">
          <div className="grid grid-cols-2 gap-16">
            <div className="p-8 border border-slate-200 bg-slate-50">
              <p className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-12">Client Acceptance</p>
              <div className="border-b border-slate-400 h-4 mb-4" />
              <p className="font-bold text-slate-900 text-sm">{data.clientName}</p>
              <p className="text-xs text-slate-500 mt-1">{data.clientCompany || 'Client'}</p>
            </div>
            <div className="p-8 border border-slate-200 bg-slate-50">
              <p className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-12">Advisor Signature</p>
              <div className="border-b border-slate-400 h-4 mb-4" />
              <p className="font-bold text-slate-900 text-sm">{data.agencyName}</p>
              <p className="text-xs text-slate-500 mt-1">Authorized Representative</p>
            </div>
          </div>
        </section>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
