import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const marketingGrowthConfig: TemplateConfig = {
  id: 'marketing-growth',
  name: 'Marketing Growth',
  description: 'High-energy vibrant layout designed for marketing campaigns and growth strategies.',
  component: MarketingGrowthTemplate,
  primaryColor: '#f43f5e', // Rose
  secondaryColor: '#fff1f2',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

export function MarketingGrowthTemplate({ data }: { data: TemplateData }) {
  const brandColor = data.brandColor || '#f43f5e'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-between p-20 print-avoid-break overflow-hidden" style={{ backgroundColor: brandColor, pageBreakAfter: 'always' }}>
        
        {/* Dynamic Marketing Graphic */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 mix-blend-overlay" style={{ background: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '100px 100px' }} />
        
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 w-full mb-auto flex justify-between items-center text-white">
          {data.agencyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.agencyLogo} alt={data.agencyName} className="h-12 object-contain" />
          ) : (
            <div className="text-3xl font-black tracking-tighter">
              {data.agencyName}
            </div>
          )}
          <div className="text-right">
            <span className="bg-white/20 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest backdrop-blur-sm">Growth Proposal</span>
          </div>
        </div>

        <div className="relative z-10 w-full my-auto text-white">
          <p className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80 text-white">
            Client: {data.clientCompany || data.clientName}
          </p>
          <h1 className="text-7xl font-black tracking-tighter leading-[0.95] mb-8 drop-shadow-lg">
            {data.title}
          </h1>
          <div className="w-24 h-2 bg-white/30 mb-8" />
          <p className="text-2xl font-medium max-w-lg leading-snug opacity-90 text-white">
            Data-driven strategy and campaign architecture.
          </p>
        </div>

        <div className="relative z-10 w-full mt-auto flex justify-between items-end border-t-2 border-white/20 pt-8 text-white">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Prepared By</p>
            <p className="font-bold text-xl">{data.agencyName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Date</p>
            <p className="font-bold text-xl">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-20 space-y-24 bg-white">

        {/* Scope */}
        {data.scope && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl font-black" style={{ color: brandColor }}>/</div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Campaign Strategy</h2>
            </div>
            <div className="bg-slate-50 p-10 border-l-8" style={{ borderColor: brandColor }}>
              <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                {data.scope}
              </div>
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl font-black" style={{ color: brandColor }}>/</div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Deliverables</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-8 border-2 border-slate-100 shadow-sm rounded-xl">
                <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {data.deliverables}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl font-black" style={{ color: brandColor }}>/</div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Timeline</h2>
            </div>
            <div className="bg-slate-900 text-white p-10 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20" style={{ backgroundColor: brandColor }} />
              <div className="relative z-10 prose prose-invert prose-lg max-w-none whitespace-pre-wrap font-medium">
                {data.timeline}
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="print-avoid-break">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-4xl font-black" style={{ color: brandColor }}>/</div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Investment</h2>
          </div>
          
          <div className="border-4 rounded-2xl overflow-hidden" style={{ borderColor: brandColor }}>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 border-b-4" style={{ borderColor: brandColor }}>
                <tr>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-slate-800 text-xs">Item</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-slate-800 text-xs text-center">Qty</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-slate-800 text-xs text-right">Price</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-slate-800 text-xs text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-8 py-5 text-slate-900 font-bold">{item.description}</td>
                      <td className="px-8 py-5 text-center text-slate-500 font-medium">{item.qty}</td>
                      <td className="px-8 py-5 text-right text-slate-500 font-medium">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-8 py-5 text-right font-black text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-8 text-center text-slate-400 italic">No items.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="p-8 flex justify-between items-center text-white" style={{ backgroundColor: brandColor }}>
              <div className="font-black text-sm uppercase tracking-widest">Total Campaign Investment</div>
              <div className="font-black text-5xl drop-shadow-md">
                ${data.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* Terms & Signoff */}
        <section className="print-avoid-break mt-16 pt-16 border-t-4 border-slate-100">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-6">Terms</h3>
              <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap font-medium">
                {data.terms || "Standard terms apply."}
              </div>
            </div>
            <div className="bg-slate-50 p-8 border-2 border-slate-100 rounded-xl">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-8">Authorization</h3>
              <div className="space-y-6">
                <div>
                  <div className="border-b-2 border-slate-300 h-8 mb-2" />
                  <p className="font-bold text-slate-900 text-sm uppercase tracking-wide">{data.clientName}</p>
                </div>
                <div>
                  <div className="border-b-2 border-slate-300 h-8 mb-2" />
                  <p className="font-bold text-slate-900 text-sm uppercase tracking-wide">{data.agencyName}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
