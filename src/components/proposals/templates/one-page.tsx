import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const onePageConfig: TemplateConfig = {
  id: 'one-page',
  name: 'One Page Summary',
  description: 'Infographic-inspired compact layout, dense but highly readable.',
  component: OnePageTemplate,
  primaryColor: '#8b5cf6',
  secondaryColor: '#ffffff',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0'
}

interface OnePageTemplateProps {
  data: TemplateData
}

export function OnePageTemplate({ data }: OnePageTemplateProps) {
  const brandColor = data.brandColor || '#8b5cf6'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans text-slate-800 border border-slate-200 shadow-xl print:shadow-none print:border-none relative overflow-hidden" style={{ minHeight: '1100px' }}>
      
      {/* Abstract background graphics */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03] -translate-y-1/2 translate-x-1/4" style={{ backgroundColor: brandColor }} />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full opacity-[0.02] translate-y-1/3 -translate-x-1/4" style={{ backgroundColor: brandColor }} />

      <div className="p-12 relative z-10 flex flex-col h-full min-h-[1100px]">
        
        {/* HEADER BLOCK */}
        <div className="flex justify-between items-center mb-12 pb-8 border-b-2" style={{ borderColor: `${brandColor}20` }}>
          <div className="w-1/2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none mb-4">
              {data.title}
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Proposal & Estimate</p>
          </div>
          <div className="w-1/2 text-right">
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-10 object-contain ml-auto mb-2" />
            ) : (
              <div className="text-xl font-bold tracking-tight mb-2" style={{ color: brandColor }}>
                {data.agencyName}
              </div>
            )}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{data.date}</p>
          </div>
        </div>

        {/* TOP METADATA GRID */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: brandColor }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Client</p>
              <p className="font-bold text-slate-900 text-lg">{data.clientCompany || data.clientName}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: brandColor }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Investment</p>
              <p className="font-bold text-slate-900 text-lg">${data.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN CONTENT */}
        <div className="grid grid-cols-12 gap-12 flex-grow">
          
          {/* LEFT COLUMN: Narrative */}
          <div className="col-span-7 flex flex-col gap-8">
            {data.scope && (
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: brandColor }}>
                  <span className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: brandColor }} />
                  Executive Summary
                </h3>
                <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  {data.scope}
                </div>
              </div>
            )}
            
            {(data.deliverables || data.timeline) && (
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: brandColor }}>
                  <span className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: brandColor }} />
                  Deliverables & Timeline
                </h3>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                  {data.deliverables && (
                    <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {data.deliverables}
                    </div>
                  )}
                  {data.timeline && (
                    <div className="border-t border-slate-200 pt-4 mt-4">
                      <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {data.timeline}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Financials & Sign-off */}
          <div className="col-span-5 flex flex-col gap-8">
            <div className="flex-1">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: brandColor }}>
                <span className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: brandColor }} />
                Cost Breakdown
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-0 flex-grow">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold uppercase">Item</th>
                        <th className="px-4 py-3 font-semibold uppercase text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.items.length > 0 ? (
                        data.items.map((item, idx) => (
                          <tr key={item.id || idx}>
                            <td className="px-4 py-3 text-slate-800 font-medium">
                              {item.description}
                              {item.qty > 1 && <span className="block text-slate-400 font-normal text-[10px]">Qty: {item.qty} &times; ${item.unitPrice}</span>}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="px-4 py-4 text-center text-slate-400 italic">No items.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 text-white flex justify-between items-center" style={{ backgroundColor: brandColor }}>
                  <span className="text-xs uppercase tracking-widest font-bold">Total</span>
                  <span className="text-xl font-black">${data.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Compact Terms & Signatures */}
            <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl relative overflow-hidden mt-auto">
              {/* Graphic element */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20 -translate-y-1/2 translate-x-1/4 rounded-full" style={{ backgroundColor: brandColor }} />
              
              <div className="relative z-10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-500">Authorization</h3>
                <div className="space-y-4">
                  <div>
                    <div className="border-b border-slate-700 h-8 mb-1" />
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-white font-medium">{data.clientName}</span>
                      <span className="text-slate-500">Date</span>
                    </div>
                  </div>
                  <div>
                    <div className="border-b border-slate-700 h-8 mb-1" />
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-white font-medium">{data.agencyName}</span>
                      <span className="text-slate-500">Date</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest">
          <span>Confidential</span>
          <span>{data.agencyName} &copy; {new Date().getFullYear()}</span>
        </div>

      </div>
    
        <AgencyTemplateFooter data={data} type="proposal" />
      </div>
  )
}
