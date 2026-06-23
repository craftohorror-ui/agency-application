import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const creativePortfolioConfig: TemplateConfig = {
  id: 'creative-portfolio',
  name: 'Creative Portfolio',
  description: 'Artistic and bold design with masonry-like text layouts and large graphic typestyle.',
  component: CreativePortfolioTemplate,
  primaryColor: '#8b5cf6', // Purple
  secondaryColor: '#fdf4ff',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function CreativePortfolioTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#8b5cf6'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-[#fafafa] font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none" style={{ minHeight: '1000px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1000px] flex flex-col p-20 print-avoid-break bg-[#f3f4f6]" style={{ pageBreakAfter: 'always' }}>
        
        {/* Abstract typography background */}
        <div className="absolute top-10 -left-20 text-[200px] font-black opacity-[0.03] text-slate-900 leading-none break-all w-[120%] overflow-hidden pointer-events-none">
          PORTFOLIOPORTFOLIO
        </div>

        <div className="relative z-10 flex justify-between items-start mb-32">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-14 object-contain" />
          ) : (
            <div className="text-3xl font-black tracking-tighter" style={{ color: brandColor }}>
              {data.agencyName}
            </div>
          )}
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">Proposal</span>
        </div>

        <div className="relative z-10 w-full flex-grow flex flex-col justify-center">
          <div className="w-24 h-2 mb-12" style={{ backgroundColor: brandColor }} />
          <h1 className="text-7xl font-black tracking-tighter leading-[0.95] text-slate-900 mb-8 max-w-2xl">
            {data.title}
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
            A bespoke creative strategy crafted for <strong className="text-slate-900">{data.clientCompany || data.clientName}</strong>.
          </p>
        </div>

        <div className="relative z-10 w-full mt-12 grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-200">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Agency</p>
            <p className="font-bold text-lg text-slate-900">{data.agencyName}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Date</p>
            <p className="font-bold text-lg text-slate-900">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-24 bg-white">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-8 border-l-8 pl-6" style={{ borderColor: brandColor }}>The Vision</h2>
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap ml-14">
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-8 border-l-8 pl-6" style={{ borderColor: brandColor }}>Deliverables</h2>
            <div className="bg-slate-50 p-10 ml-14 shadow-sm border border-slate-100">
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                {data.deliverables}
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-8 border-l-8 pl-6" style={{ borderColor: brandColor }}>Timeline</h2>
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap ml-14">
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-8 border-l-8 pl-6" style={{ borderColor: brandColor }}>Investment</h2>
          
          <div className="ml-14 border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Item</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-center">Qty</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Price</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-6 py-4 text-slate-900 font-bold text-base">{item.description}</td>
                      <td className="px-6 py-4 text-center text-slate-500 font-medium">{item.qty}</td>
                      <td className="px-6 py-4 text-right text-slate-500 font-medium">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-black text-slate-900 text-base">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-slate-400 italic">No line items.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
              <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Total Investment</div>
              <div className="font-black text-4xl" style={{ color: brandColor }}>${data.totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="print-avoid-break border-t-4 border-slate-100 pt-16">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-6 text-slate-400 ml-14">Terms</h2>
          <div className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap ml-14 bg-slate-50 p-6">
            {data.terms || "Standard agency terms apply."}
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-16 pt-16 border-t border-slate-100 print-avoid-break ml-14">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <div className="border-b-4 border-slate-200 h-12 mb-4" />
              <p className="font-bold text-slate-900 text-sm">{data.clientName}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Client Approval</p>
            </div>
            <div>
              <div className="border-b-4 border-slate-200 h-12 mb-4" />
              <p className="font-bold text-slate-900 text-sm">{data.agencyName}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Agency Approval</p>
            </div>
          </div>
        </section>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
