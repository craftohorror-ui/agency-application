import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const enterpriseConsultingConfig: TemplateConfig = {
  id: 'enterprise-consulting',
  name: 'Enterprise Consulting',
  description: 'Serious, structured, corporate layout with blue accents and detailed grid lines.',
  component: EnterpriseConsultingTemplate,
  primaryColor: '#0284c7', // Sky Blue
  secondaryColor: '#f1f5f9',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function EnterpriseConsultingTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#0284c7'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans text-slate-800 border border-slate-300 shadow-xl print:shadow-none print:border-none" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col p-20 print-avoid-break bg-[#f8fafc] border-b-[20px]" style={{ pageBreakAfter: 'always', borderColor: brandColor }}>
        
        {/* Architectural Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative z-10 flex justify-between items-end border-b-2 border-slate-300 pb-8 mb-auto">
          <div>
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-14 object-contain" />
            ) : (
              <div className="text-3xl font-bold tracking-tight text-slate-900">
                {data.agencyName}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Enterprise Proposal</span>
          </div>
        </div>

        <div className="relative z-10 my-auto bg-white p-16 shadow-sm border border-slate-200">
          <p className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: brandColor }}>
            <span className="w-4 h-4" style={{ backgroundColor: brandColor }} />
            Executive Summary & Proposal
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-12">
            {data.title}
          </h1>
          <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Prepared For</p>
              <p className="text-lg font-medium text-slate-900">{data.clientCompany || data.clientName}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Date</p>
              <p className="text-lg font-medium text-slate-900">{data.date}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto grid grid-cols-2 gap-8 pt-8 text-sm">
          <div>
            <p className="font-bold text-slate-900">{data.agencyName}</p>
            <p className="text-slate-500">Authorized Consulting Partner</p>
            {data.agencyEmail && <p className="text-slate-500">{data.agencyEmail}</p>}
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-16 bg-white">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">1.0 Scope of Work</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap pl-6">
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">2.0 Key Deliverables</h2>
            </div>
            <div className="bg-slate-50 p-8 border border-slate-200 pl-6">
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">3.0 Project Timeline</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap pl-6">
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">4.0 Financial Schedule</h2>
          </div>
          
          <div className="pl-6 border-l-4" style={{ borderColor: brandColor }}>
            <table className="w-full text-left text-sm border border-slate-200">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-b border-slate-200 border-r border-slate-200">Line Item Description</th>
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
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">No line items.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="flex justify-end bg-slate-50 border-x border-b border-slate-200 p-6">
              <div className="flex items-center gap-8">
                <span className="font-bold text-sm uppercase tracking-widest text-slate-600">Total Project Fee</span>
                <span className="font-bold text-3xl" style={{ color: brandColor }}>${data.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break mt-12">
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">5.0 Terms & Conditions</h2>
          </div>
          <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap pl-6 bg-slate-50 p-6 border border-slate-200">
            {data.terms || "Standard enterprise terms and conditions apply."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-16 pt-8 print-avoid-break">
          <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">6.0 Authorization</h2>
          </div>
          <div className="grid grid-cols-2 gap-16 pl-6">
            <div>
              <div className="border-b border-slate-400 h-12 mb-3" />
              <p className="font-bold text-slate-900">{data.clientName}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Client Signature</p>
            </div>
            <div>
              <div className="border-b border-slate-400 h-12 mb-3" />
              <p className="font-bold text-slate-900">{data.agencyName}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Agency Signature</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
