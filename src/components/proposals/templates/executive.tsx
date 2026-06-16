import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const executiveConfig: TemplateConfig = {
  id: 'executive',
  name: 'Executive Boardroom',
  description: 'Sophisticated dark cover layout with a refined minimalist interior.',
  component: ExecutiveTemplate,
  primaryColor: '#111827',
  secondaryColor: '#ffffff',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

interface ExecutiveTemplateProps {
  data: TemplateData
}

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const brandColor = data.brandColor || '#111827'
  
  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-serif text-slate-900 border-x border-slate-200" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-between p-20 print-avoid-break overflow-hidden text-white" style={{ backgroundColor: brandColor, pageBreakAfter: 'always' }}>
        
        {/* Subtle Luxury Gradient Overlay */}
        <div className="absolute inset-0 opacity-50" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.5) 100%)' }} />
        
        {/* Fine border frame inside */}
        <div className="absolute inset-8 border border-white/10 pointer-events-none" />

        <div className="relative z-10 text-center mt-12">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-16 object-contain mx-auto" />
          ) : (
            <div className="text-2xl tracking-[0.3em] uppercase font-light text-white/90">
              {data.agencyName}
            </div>
          )}
        </div>

        <div className="relative z-10 text-center mt-32 mb-auto px-12">
          <p className="text-xs tracking-[0.4em] uppercase text-white/50 mb-8">Executive Proposal</p>
          <h1 className="text-5xl font-light tracking-tight leading-snug mb-12">
            {data.title}
          </h1>
          <div className="w-12 h-px bg-white/30 mx-auto mb-12" />
          <p className="text-sm tracking-[0.2em] uppercase text-white/70">Prepared Exclusively For</p>
          <p className="text-2xl font-medium mt-4">{data.clientCompany || data.clientName}</p>
        </div>

        <div className="relative z-10 flex justify-between text-xs tracking-[0.2em] uppercase text-white/50 px-8">
          <div>
            <p>Date: {data.date}</p>
          </div>
          <div className="text-right">
            <p>Confidential</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-24 space-y-24 bg-white">

        {/* Scope / Summary */}
        {(data.scope || data.deliverables) && (
          <div className="space-y-16">
            {data.scope && (
              <section className="print-avoid-break">
                <h2 className="text-2xl font-light tracking-wide uppercase mb-8 border-b pb-4 border-slate-200">Executive Summary</h2>
                <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-loose whitespace-pre-wrap font-serif">
                  {data.scope}
                </div>
              </section>
            )}

            {data.deliverables && (
              <section className="print-avoid-break">
                <h2 className="text-2xl font-light tracking-wide uppercase mb-8 border-b pb-4 border-slate-200">Key Deliverables</h2>
                <div className="pl-8 border-l border-slate-300">
                  <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-loose whitespace-pre-wrap font-serif">
                    {data.deliverables}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <h2 className="text-2xl font-light tracking-wide uppercase mb-8 border-b pb-4 border-slate-200">Timeline & Phasing</h2>
            <div className="bg-slate-50 p-12 border border-slate-100">
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-loose whitespace-pre-wrap font-serif">
                {data.timeline}
              </div>
            </div>
          </section>
        )}

        {/* Financials */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-light tracking-wide uppercase mb-8 border-b pb-4 border-slate-200">Financial Overview</h2>
          
          <table className="w-full text-left text-sm font-sans mb-8">
            <thead className="border-b-2 border-slate-900">
              <tr>
                <th className="py-4 font-semibold uppercase tracking-wider text-slate-500">Service Area</th>
                <th className="py-4 font-semibold uppercase tracking-wider text-slate-500 text-center">Qty</th>
                <th className="py-4 font-semibold uppercase tracking-wider text-slate-500 text-right">Rate</th>
                <th className="py-4 font-semibold uppercase tracking-wider text-slate-500 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.length > 0 ? (
                data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-5 pr-4 text-slate-800">{item.description}</td>
                    <td className="py-5 px-4 text-center text-slate-500">{item.qty}</td>
                    <td className="py-5 px-4 text-right text-slate-500">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-5 text-right font-medium text-slate-900">${item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 italic">No line items specified.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="flex justify-end pt-8 border-t-2 border-slate-900 print-avoid-break">
            <div className="w-1/2">
              <div className="flex justify-between items-center py-4 text-lg">
                <span className="font-sans font-semibold tracking-wider uppercase text-slate-500">Total Investment</span>
                <span className="font-sans font-bold text-2xl text-slate-900">${data.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Terms */}
        {data.terms && (
          <section className="print-avoid-break mt-16 pt-16 border-t border-slate-200">
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-6 text-slate-400 font-sans">Terms & Conditions</h2>
            <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap font-sans">
              {data.terms}
            </div>
          </section>
        )}

        {/* Signatures */}
        <section className="mt-24 pt-16 border-t border-slate-200 print-avoid-break">
          <div className="grid grid-cols-2 gap-20">
            <div>
              <div className="border-b border-slate-300 h-16 mb-4" />
              <p className="font-semibold text-slate-900 font-sans text-sm uppercase tracking-wider">{data.clientName}</p>
              <p className="text-xs text-slate-500 font-sans mt-1 uppercase tracking-widest">Client Signature</p>
            </div>
            <div>
              <div className="border-b border-slate-300 h-16 mb-4" />
              <p className="font-semibold text-slate-900 font-sans text-sm uppercase tracking-wider">{data.agencyName}</p>
              <p className="text-xs text-slate-500 font-sans mt-1 uppercase tracking-widest">Agency Signature</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
