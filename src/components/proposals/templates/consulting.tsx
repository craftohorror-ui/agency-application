import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const consultingConfig: TemplateConfig = {
  id: 'consulting',
  name: 'Strategic Consulting',
  description: 'Sophisticated teal layouts with roadmap timelines and professional metric cards.',
  component: ConsultingTemplate,
  primaryColor: '#0f766e',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

interface ConsultingTemplateProps {
  data: TemplateData
}

export function ConsultingTemplate({ data }: ConsultingTemplateProps) {
  // Sophisticated Teal
  const brandColor = data.brandColor || '#0f766e'
  const textDark = '#0f172a'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans text-slate-800 shadow-2xl print:shadow-none" style={{ minHeight: '1000px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1000px] flex flex-col justify-between p-20 print-avoid-break bg-slate-50 border-t-8" style={{ pageBreakAfter: 'always', borderColor: brandColor }}>
        
        {/* Subtle dot matrix background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        {/* Abstract shapes */}
        <div className="absolute top-40 right-0 w-64 h-64 rounded-l-full opacity-10" style={{ backgroundColor: brandColor }} />
        <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: brandColor }} />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 object-contain" />
            ) : (
              <div className="text-2xl font-bold tracking-tight" style={{ color: textDark }}>
                {data.agencyName}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Strategic Proposal</span>
          </div>
        </div>

        <div className="relative z-10 mt-40 mb-auto">
          <div className="flex items-center gap-4 mb-6 text-sm font-semibold uppercase tracking-widest" style={{ color: brandColor }}>
            <span className="w-8 h-px" style={{ backgroundColor: brandColor }} />
            Prepared for {data.clientCompany || data.clientName}
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-8">
            {data.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
            A comprehensive strategic roadmap and execution plan designed to drive measurable results.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-12 bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Lead Consultant</p>
            <p className="font-bold text-slate-900 text-lg">{data.agencyName}</p>
            {data.agencyEmail && <p className="text-sm text-slate-500">{data.agencyEmail}</p>}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Date of Issue</p>
            <p className="font-bold text-slate-900 text-lg">{data.date}</p>
            <p className="text-sm text-slate-500">Valid for 30 days</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-24 bg-white">

        {/* Scope & Approach */}
        {(data.scope || data.deliverables) && (
          <div className="space-y-16">
            {data.scope && (
              <section className="print-avoid-break">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }} />
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Strategic Approach</h2>
                </div>
                <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {data.scope}
                </div>
              </section>
            )}

            {data.deliverables && (
              <section className="print-avoid-break">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }} />
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Key Deliverables</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {data.deliverables.split('\n').filter(d => d.trim()).map((deliverable, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-6 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${brandColor}20`, color: brandColor }}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed m-0">{deliverable.replace(/^[-\*]\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Timeline Roadmap */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }} />
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Execution Roadmap</h2>
            </div>
            <div className="relative pl-8 border-l-2 ml-4" style={{ borderColor: `${brandColor}40` }}>
              <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                {/* Visual marker */}
                <div className="absolute top-0 -left-2 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: brandColor }} />
                {data.timeline}
              </div>
            </div>
          </section>
        )}

        {/* Investment Summary */}
        <section className="print-avoid-break">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }} />
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Investment Structure</h2>
          </div>
          
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5 font-bold text-slate-700">Strategic Initiative</th>
                  <th className="px-8 py-5 font-bold text-slate-700 text-center">Qty</th>
                  <th className="px-8 py-5 font-bold text-slate-700 text-right">Unit Price</th>
                  <th className="px-8 py-5 font-bold text-slate-700 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-8 py-5 text-slate-800 font-medium">{item.description}</td>
                      <td className="px-8 py-5 text-center text-slate-500">{item.qty}</td>
                      <td className="px-8 py-5 text-right text-slate-500">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-8 py-5 text-right font-semibold text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-8 text-center text-slate-400 italic">No initiatives specified.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Elevated Total Block */}
            <div className="bg-slate-900 text-white p-8 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: brandColor }} />
              <div className="relative z-10">
                <p className="font-bold text-sm uppercase tracking-widest text-slate-400">Total Strategic Investment</p>
              </div>
              <div className="relative z-10 font-bold text-4xl">
                ${data.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* Terms */}
        {data.terms && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }} />
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Engagement Terms</h2>
            </div>
            <div className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">
              {data.terms}
              {data.termsConditions && (
                <div className="mt-8 pt-6 border-t border-slate-200/60">
                  <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-xs">Agency Terms & Conditions</h4>
                  <div className="whitespace-pre-wrap">{data.termsConditions}</div>
                </div>
              )}
              {data.privacyPolicy && (
                <div className="mt-6">
                  <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-xs">Privacy Policy</h4>
                  <div className="whitespace-pre-wrap">{data.privacyPolicy}</div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Signature */}
        <section className="mt-16 pt-16 border-t border-slate-200 print-avoid-break">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Client Acceptance</p>
              <div className="border-b-2 border-slate-200 h-12 mb-4" />
              <p className="font-bold text-slate-900">{data.clientName}</p>
              <p className="text-sm text-slate-500">{data.clientCompany || 'Client'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Consulting Partner</p>
              <div className="border-b-2 border-slate-200 h-12 mb-4" />
              <p className="font-bold text-slate-900">{data.agencyName}</p>
              <p className="text-sm text-slate-500">Authorized Representative</p>
            </div>
          </div>
        </section>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
