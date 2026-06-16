import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const creativeAgencyConfig: TemplateConfig = {
  id: 'creative-agency',
  name: 'Creative Agency',
  description: 'Bold typography, vibrant overlapping shapes, and dynamic layouts for creative studios.',
  component: CreativeAgencyTemplate,
  primaryColor: '#ec4899', // Pink
  secondaryColor: '#fdf2f8',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function CreativeAgencyTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#ec4899'
  
  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-center p-20 print-avoid-break bg-slate-900 text-white overflow-hidden" style={{ pageBreakAfter: 'always' }}>
        
        {/* Creative overlapping circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full mix-blend-multiply opacity-80 blur-3xl translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: brandColor }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full mix-blend-multiply opacity-60 blur-3xl -translate-x-1/4 translate-y-1/4" style={{ backgroundColor: '#3b82f6' }} />

        <div className="relative z-10 w-full mb-auto flex justify-between items-start">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-16 object-contain" />
          ) : (
            <div className="text-3xl font-black tracking-tighter">
              {data.agencyName}
            </div>
          )}
          <div className="text-right">
            <span className="inline-block border px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border-white/20">Proposal</span>
          </div>
        </div>

        <div className="relative z-10 w-full my-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-6 flex items-center gap-4">
            <span className="w-12 h-0.5" style={{ backgroundColor: brandColor }} />
            Prepared For {data.clientCompany || data.clientName}
          </p>
          <h1 className="text-7xl font-black tracking-tighter leading-[1.05] mb-8">
            {data.title}
          </h1>
          <p className="text-xl text-white/70 max-w-lg font-light leading-relaxed">
            A creative strategy designed to elevate your brand and capture your audience.
          </p>
        </div>

        <div className="relative z-10 w-full mt-auto flex justify-between items-end border-t border-white/10 pt-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Prepared By</p>
            <p className="font-bold text-lg">{data.agencyName}</p>
            {data.agencyEmail && <p className="text-sm text-white/60">{data.agencyEmail}</p>}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Date</p>
            <p className="font-bold text-lg">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-24 bg-[#fcfcfc]">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break relative">
            <div className="absolute -left-10 top-0 text-[120px] font-black opacity-[0.03] leading-none" style={{ color: brandColor }}>01</div>
            <div className="relative z-10 ml-8">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-8">The Vision</h2>
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {data.scope}
              </div>
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break relative">
            <div className="absolute -left-10 top-0 text-[120px] font-black opacity-[0.03] leading-none" style={{ color: brandColor }}>02</div>
            <div className="relative z-10 ml-8">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-8">Deliverables</h2>
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {data.deliverables}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break relative">
            <div className="absolute -left-10 top-0 text-[120px] font-black opacity-[0.03] leading-none" style={{ color: brandColor }}>03</div>
            <div className="relative z-10 ml-8">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-8">Timeline</h2>
              <div className="pl-6 border-l-4" style={{ borderColor: brandColor }}>
                <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {data.timeline}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Investment */}
        <section className="print-avoid-break relative">
          <div className="absolute -left-10 top-0 text-[120px] font-black opacity-[0.03] leading-none" style={{ color: brandColor }}>04</div>
          <div className="relative z-10 ml-8">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-8">Investment</h2>
            
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 font-bold uppercase tracking-widest text-slate-500 text-xs">Item</th>
                    <th className="px-8 py-6 font-bold uppercase tracking-widest text-slate-500 text-xs text-center">Qty</th>
                    <th className="px-8 py-6 font-bold uppercase tracking-widest text-slate-500 text-xs text-right">Rate</th>
                    <th className="px-8 py-6 font-bold uppercase tracking-widest text-slate-500 text-xs text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.items.length > 0 ? (
                    data.items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="px-8 py-6 text-slate-900 font-bold text-base">{item.description}</td>
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
              
              <div className="p-8 flex justify-between items-center text-white relative overflow-hidden" style={{ backgroundColor: brandColor }}>
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]" />
                <div className="relative z-10">
                  <span className="font-bold text-sm uppercase tracking-widest text-white/80">Project Total</span>
                </div>
                <div className="relative z-10 font-black text-5xl">
                  ${data.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Terms & Signatures */}
        <div className="grid grid-cols-2 gap-16 print-avoid-break mt-24 pt-16 border-t border-slate-200">
          <div>
            <h3 className="text-xl font-black tracking-tight mb-6 text-slate-900">Terms</h3>
            <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">
              {data.terms || "Standard agency terms apply."}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight mb-8 text-slate-900">Sign-off</h3>
            <div className="space-y-8">
              <div>
                <div className="border-b-2 border-slate-200 h-10 mb-2" />
                <p className="font-bold text-slate-900 text-sm">{data.clientName}</p>
                <p className="text-xs text-slate-500">Client</p>
              </div>
              <div>
                <div className="border-b-2 border-slate-200 h-10 mb-2" />
                <p className="font-bold text-slate-900 text-sm">{data.agencyName}</p>
                <p className="text-xs text-slate-500">Agency</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
