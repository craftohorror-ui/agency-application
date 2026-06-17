import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const saasStartupConfig: TemplateConfig = {
  id: 'saas-startup',
  name: 'SaaS & Startup',
  description: 'Clean, modern tech-focused layout with rounded elements and soft gradients.',
  component: SaaSStartupTemplate,
  primaryColor: '#3b82f6', // Blue
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function SaaSStartupTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#3b82f6'
  const lightBg = '#f8fafc'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-between p-20 print-avoid-break bg-slate-50 border-t-8" style={{ pageBreakAfter: 'always', borderColor: brandColor }}>
        
        {/* Soft SaaS Gradients */}
        <div className="absolute top-0 right-0 w-full h-[500px] opacity-20" style={{ background: `linear-gradient(to bottom right, ${brandColor}40, transparent)` }} />
        <div className="absolute top-40 right-20 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ backgroundColor: brandColor }} />

        <div className="relative z-10 w-full mb-auto flex justify-between items-center">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-10 object-contain" />
          ) : (
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {data.agencyName}
            </div>
          )}
          <div className="text-right">
            <span className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">Proposal</span>
          </div>
        </div>

        <div className="relative z-10 w-full my-auto">
          <span className="inline-flex items-center rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest mb-6 border shadow-sm" style={{ backgroundColor: `${brandColor}10`, color: brandColor, borderColor: `${brandColor}30` }}>
            For {data.clientCompany || data.clientName}
          </span>
          <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            {data.title}
          </h1>
          <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
            A comprehensive solution architecture and deployment roadmap.
          </p>
        </div>

        <div className="relative z-10 w-full mt-auto grid grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Account Exec</p>
            <p className="font-bold text-slate-900 text-lg">{data.agencyName}</p>
            {data.agencyEmail && <p className="text-sm text-slate-500">{data.agencyEmail}</p>}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Generated On</p>
            <p className="font-bold text-slate-900 text-lg">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-24 bg-white">

        {/* Scope / Solution */}
        {data.scope && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: brandColor }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Proposed Solution</h2>
            </div>
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {data.scope}
              </div>
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: brandColor }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Key Features & Deliverables</h2>
            </div>
            <div className="pl-6 border-l-2" style={{ borderColor: brandColor }}>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: brandColor }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Deployment Roadmap</h2>
            </div>
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {data.timeline}
              </div>
            </div>
          </section>
        )}

        {/* Pricing SaaS Style */}
        <section className="print-avoid-break">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: brandColor }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">SaaS Plan & Implementation</h2>
          </div>
          
          <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Module / Service</th>
                  <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">Qty</th>
                  <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Price</th>
                  <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-8 py-5 text-slate-900 font-medium">{item.description}</td>
                      <td className="px-8 py-5 text-center text-slate-500">{item.qty}</td>
                      <td className="px-8 py-5 text-right text-slate-500">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-8 py-5 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-8 text-center text-slate-400 italic">No line items.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* SaaS Total Block */}
            <div className="bg-slate-50 border-t border-slate-200 p-8 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm uppercase tracking-widest text-slate-500">Total Implementation Cost</p>
              </div>
              <div className="font-black text-4xl" style={{ color: brandColor }}>
                ${data.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* Terms & Signatures */}
        <div className="grid grid-cols-2 gap-12 print-avoid-break mt-16 pt-16 border-t border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Terms of Service</h3>
            <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {data.terms || "Standard SaaS implementation terms apply."}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Authorization</h3>
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-900 text-sm mb-1">{data.clientName}</p>
                <p className="text-xs text-slate-500 mb-4">{data.clientCompany || 'Client'}</p>
                <div className="border-t border-slate-200 pt-4 mt-2">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">Signature / Date</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
