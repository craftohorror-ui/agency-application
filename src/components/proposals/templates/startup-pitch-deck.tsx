import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function StartupPitchDeck({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-[#1e1e2f] min-h-screen font-sans text-white shadow-2xl print:shadow-none print:max-w-none print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      {/* Slide 1: Title */}
      <div className="h-[800px] flex flex-col justify-center items-center text-center px-16 relative overflow-hidden print:break-after-page">
        <div className="absolute top-12 left-12">
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt={data.agencyName} className="h-8 w-auto object-contain opacity-80" />
          ) : (
            <h2 className="text-xl font-bold tracking-widest text-slate-300 uppercase">{data.agencyName}</h2>
          )}
        </div>
        
        <div className="w-full max-w-3xl z-10">
          <h1 className="text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600" style={{ backgroundImage: `linear-gradient(to right, ${data.brandColor || '#c084fc'}, #ec4899)` }}>{data.title}</h1>
          <p className="text-2xl text-slate-300 font-light mb-12">Presented to {data.clientName}</p>
          <div className="h-1 w-24 mx-auto rounded-full" style={{ backgroundColor: data.brandColor || '#c084fc' }}></div>
        </div>

        <div className="absolute bottom-12 right-12 text-sm text-slate-500 font-medium">{data.date}</div>
      </div>

      {/* Slide 2: Problem & Solution (Scope & Deliverables) */}
      <div className="h-[800px] flex flex-col px-16 py-24 relative print:break-after-page">
        <h2 className="text-4xl font-bold mb-12 text-slate-100">The Strategy</h2>
        
        <div className="grid grid-cols-2 gap-16 flex-1">
          <div className="bg-[#2a2a3c] p-8 rounded-2xl border border-[#3f3f5a]">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3" style={{ color: data.brandColor || '#c084fc' }}>
              <span className="p-2 rounded-lg bg-black/20">01</span> The Vision
            </h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{data.scope || 'Executive summary and vision.'}</p>
          </div>
          
          <div className="bg-[#2a2a3c] p-8 rounded-2xl border border-[#3f3f5a]">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3" style={{ color: data.brandColor || '#c084fc' }}>
              <span className="p-2 rounded-lg bg-black/20">02</span> The Execution
            </h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{data.deliverables || 'How we will execute.'}</p>
          </div>
        </div>
      </div>

      {/* Slide 3: Financials */}
      <div className="h-[800px] flex flex-col px-16 py-24 relative print:break-after-page">
        <h2 className="text-4xl font-bold mb-12 text-slate-100">Financial Model</h2>
        
        <div className="bg-[#2a2a3c] rounded-2xl border border-[#3f3f5a] overflow-hidden flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-black/20 text-slate-400">
                <tr>
                  <th className="p-6 font-medium">Investment Category</th>
                  <th className="p-6 font-medium text-center">Volume</th>
                  <th className="p-6 font-medium text-right">Unit Price</th>
                  <th className="p-6 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3f3f5a]">
                {data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="p-6 text-slate-200">{item.description}</td>
                    <td className="p-6 text-center text-slate-400">{item.qty}</td>
                    <td className="p-6 text-right text-slate-400">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-6 text-right font-medium text-slate-100">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-black/40 p-8 flex justify-between items-center border-t border-[#3f3f5a]">
            <span className="text-xl text-slate-400 font-medium uppercase tracking-widest">Ask</span>
            <span className="text-4xl font-bold" style={{ color: data.brandColor || '#c084fc' }}>${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Slide 4: Timeline & Closing */}
      <div className="h-[800px] flex flex-col px-16 py-24 relative">
        <h2 className="text-4xl font-bold mb-12 text-slate-100">Roadmap & Terms</h2>
        
        <div className="grid grid-cols-2 gap-16 flex-1">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-slate-400">Timeline</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-slate-400">Key Terms</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{data.terms || 'TBD'}</p>
          </div>
        </div>

        <div className="mt-auto text-center border-t border-[#3f3f5a] pt-8">
          <p className="text-xl font-bold text-white mb-2">{data.agencyName}</p>
          <div className="text-slate-400 flex justify-center gap-6">
            <span>{data.agencyEmail}</span>
            <span>{data.agencyPhone}</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export const startupPitchDeckConfig: TemplateConfig = {
  id: 'startup-pitch-deck',
  name: 'Startup Pitch Deck',
  description: 'Slide-based dark mode layout suitable for pitch presentations.',
  component: StartupPitchDeck,
  primaryColor: '#c084fc',
  secondaryColor: '#1e1e2f',
  supportsPdf: true,
  supportsDocx: false, // Page heights and dark backgrounds do not map well to DOCX
  version: '1.0.0'
}
