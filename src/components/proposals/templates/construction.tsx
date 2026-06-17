import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const constructionConfig: TemplateConfig = {
  id: 'construction',
  name: 'Construction & Build',
  description: 'Industrial aesthetic with heavy typography, hazard stripes, and high contrast blocks.',
  component: ConstructionTemplate,
  primaryColor: '#f97316',
  secondaryColor: '#1c1917',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

interface ConstructionTemplateProps {
  data: TemplateData
}

export function ConstructionTemplate({ data }: ConstructionTemplateProps) {
  // Orange warning/construction color
  const brandColor = data.brandColor || '#f97316'
  const darkSlate = '#1c1917'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-stone-50 font-sans text-stone-900 border-x border-stone-200" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-between p-16 print-avoid-break bg-stone-100 overflow-hidden border-b-8" style={{ pageBreakAfter: 'always', borderColor: brandColor }}>
        
        {/* Construction Stripe Background */}
        <div className="absolute top-0 right-0 w-1/2 h-[300px] opacity-[0.03]" 
             style={{ backgroundImage: `repeating-linear-gradient(45deg, ${darkSlate} 0, ${darkSlate} 10px, transparent 10px, transparent 20px)` }} />
             
        {/* Massive Watermark */}
        <div className="absolute -bottom-20 -right-20 text-[200px] font-black opacity-5 tracking-tighter" style={{ color: brandColor, writingMode: 'vertical-rl' }}>
          BUILD
        </div>

        <div className="relative z-10 flex items-center justify-between border-b-4 pb-6" style={{ borderColor: darkSlate }}>
          <div>
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-16 object-contain" />
            ) : (
              <div className="text-4xl font-black uppercase tracking-widest" style={{ color: darkSlate }}>
                {data.agencyName}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="bg-stone-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
              Project Proposal
            </span>
          </div>
        </div>

        <div className="relative z-10 mt-32 mb-auto">
          <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: brandColor }}>Project Identity</p>
          <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.9] text-stone-900 mb-8 break-words">
            {data.title}
          </h1>
          <div className="bg-white p-6 border-l-8 shadow-sm max-w-xl" style={{ borderColor: brandColor }}>
            <p className="text-sm font-bold uppercase text-stone-500 mb-1">Prepared For</p>
            <p className="text-2xl font-bold text-stone-900">{data.clientCompany || data.clientName}</p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-8 bg-white p-8 shadow-sm border border-stone-200">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Contractor</p>
            <p className="font-bold text-stone-900 text-lg uppercase">{data.agencyName}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Client Rep</p>
            <p className="font-bold text-stone-900 text-lg uppercase">{data.clientName}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Issue Date</p>
            <p className="font-bold text-stone-900 text-lg uppercase">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-16 space-y-20">

        {/* Scope of Work */}
        {(data.scope || data.deliverables) && (
          <div className="space-y-16">
            {data.scope && (
              <section className="print-avoid-break">
                <div className="flex items-center gap-6 mb-8 border-b-4 pb-4" style={{ borderColor: darkSlate }}>
                  <div className="text-5xl font-black opacity-20" style={{ color: darkSlate }}>01</div>
                  <h2 className="text-4xl font-black uppercase tracking-tight text-stone-900">Scope of Work</h2>
                </div>
                <div className="bg-white p-10 border-2 shadow-sm" style={{ borderColor: darkSlate }}>
                  <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap font-medium">
                    {data.scope}
                  </div>
                </div>
              </section>
            )}

            {data.deliverables && (
              <section className="print-avoid-break">
                <div className="flex items-center gap-6 mb-8 border-b-4 pb-4" style={{ borderColor: darkSlate }}>
                  <div className="text-5xl font-black opacity-20" style={{ color: darkSlate }}>02</div>
                  <h2 className="text-4xl font-black uppercase tracking-tight text-stone-900">Deliverables</h2>
                </div>
                <div className="bg-white p-10 border-2 shadow-sm relative" style={{ borderColor: darkSlate }}>
                  <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${brandColor} 0, ${brandColor} 10px, ${darkSlate} 10px, ${darkSlate} 20px)` }} />
                  <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap font-medium mt-4">
                    {data.deliverables}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Timeline Visualization */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-6 mb-8 border-b-4 pb-4" style={{ borderColor: darkSlate }}>
              <div className="text-5xl font-black opacity-20" style={{ color: darkSlate }}>03</div>
              <h2 className="text-4xl font-black uppercase tracking-tight text-stone-900">Project Schedule</h2>
            </div>
            <div className="bg-stone-900 text-stone-100 p-10 border-l-8 shadow-md" style={{ borderColor: brandColor }}>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap font-medium leading-relaxed">
                {data.timeline}
              </div>
            </div>
          </section>
        )}

        {/* Investment Summary */}
        <section className="print-avoid-break">
          <div className="flex items-center gap-6 mb-8 border-b-4 pb-4" style={{ borderColor: darkSlate }}>
            <div className="text-5xl font-black opacity-20" style={{ color: darkSlate }}>04</div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-stone-900">Cost Estimate</h2>
          </div>
          
          <div className="border-4 shadow-sm bg-white" style={{ borderColor: darkSlate }}>
            <table className="w-full text-left text-sm font-medium">
              <thead className="bg-stone-200 border-b-4" style={{ borderColor: darkSlate }}>
                <tr>
                  <th className="px-6 py-5 font-black uppercase tracking-widest text-stone-900">Item Description</th>
                  <th className="px-6 py-5 font-black uppercase tracking-widest text-stone-900 text-center">Qty</th>
                  <th className="px-6 py-5 font-black uppercase tracking-widest text-stone-900 text-right">Rate</th>
                  <th className="px-6 py-5 font-black uppercase tracking-widest text-stone-900 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-stone-100">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-stone-50">
                      <td className="px-6 py-5 text-stone-900">{item.description}</td>
                      <td className="px-6 py-5 text-center text-stone-600">{item.qty}</td>
                      <td className="px-6 py-5 text-right text-stone-600">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-5 text-right font-black text-stone-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-stone-500 italic bg-white">No items specified.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Bold Total Block */}
            <div className="border-t-4 p-8 flex justify-between items-center" style={{ borderColor: darkSlate, backgroundColor: darkSlate }}>
              <div>
                <p className="font-bold text-sm uppercase tracking-widest text-stone-400">Total Estimate</p>
                <p className="text-xs text-stone-500 mt-1 font-medium">Valid for 30 days</p>
              </div>
              <div className="font-black text-5xl" style={{ color: brandColor }}>
                ${data.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* Terms & Conditions */}
        {data.terms && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-6 mb-8 border-b-4 pb-4" style={{ borderColor: darkSlate }}>
              <div className="text-5xl font-black opacity-20" style={{ color: darkSlate }}>05</div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-stone-900">Terms & Conditions</h2>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed whitespace-pre-wrap font-medium p-8 border-2 border-dashed border-stone-300 bg-white">
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

        {/* Signatures */}
        <section className="mt-20 pt-16 border-t-8 print-avoid-break" style={{ borderColor: darkSlate }}>
          <h3 className="text-3xl font-black uppercase tracking-tight mb-12 text-stone-900 text-center">Authorization to Proceed</h3>
          <div className="grid grid-cols-2 gap-12">
            <div className="p-8 border-2 bg-white" style={{ borderColor: darkSlate }}>
              <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-12">Client Approval</p>
              <div className="border-b-4 h-4 mb-4" style={{ borderColor: darkSlate }} />
              <p className="font-black text-stone-900 uppercase text-lg">{data.clientName}</p>
              <p className="text-sm font-bold text-stone-500 uppercase">{data.clientCompany || 'Client'}</p>
              <p className="text-xs text-stone-400 mt-6 font-bold uppercase tracking-widest">Date: __ / __ / ____</p>
            </div>
            <div className="p-8 border-2 bg-white relative overflow-hidden" style={{ borderColor: darkSlate }}>
              <div className="absolute top-0 right-0 w-8 h-8" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${brandColor} 0, ${brandColor} 5px, transparent 5px, transparent 10px)` }} />
              <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-12">Contractor Approval</p>
              <div className="border-b-4 h-4 mb-4" style={{ borderColor: darkSlate }} />
              <p className="font-black text-stone-900 uppercase text-lg">{data.agencyName}</p>
              <p className="text-sm font-bold text-stone-500 uppercase">Authorized Representative</p>
              <p className="text-xs text-stone-400 mt-6 font-bold uppercase tracking-widest">Date: __ / __ / ____</p>
            </div>
          </div>
        </section>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
