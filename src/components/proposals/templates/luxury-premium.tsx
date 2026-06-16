import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function LuxuryPremium({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-[#0a0a0a] min-h-screen font-serif text-slate-300 shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      {/* Hero */}
      <div className="px-16 pt-24 pb-16 text-center border-b border-[#2a2a2a] print:break-inside-avoid">
        <div className="mb-12">
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt={data.agencyName} className="h-16 w-auto object-contain mx-auto" style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(10deg)' }} />
          ) : (
            <h2 className="text-2xl tracking-[0.3em] uppercase text-[#d4af37]">{data.agencyName}</h2>
          )}
        </div>
        
        <p className="text-[#a0a0a0] uppercase tracking-[0.2em] text-xs mb-6 font-sans">Exclusive Proposal</p>
        <h1 className="text-5xl font-light tracking-wide text-white leading-tight mb-8 font-serif">{data.title}</h1>
        <div className="h-px w-24 bg-[#d4af37] mx-auto mb-8"></div>
        <p className="text-lg text-[#a0a0a0] font-sans font-light">Presented to <span className="text-white font-normal">{data.clientName}</span></p>
        <p className="text-sm text-[#808080] font-sans mt-2">{data.date}</p>
      </div>

      <div className="px-16 py-16 space-y-20 font-sans font-light">
        
        {/* Scope */}
        <div className="print:break-inside-avoid text-center">
          <h3 className="text-sm uppercase tracking-[0.2em] text-[#d4af37] mb-6">The Vision</h3>
          <p className="text-[#c0c0c0] leading-loose whitespace-pre-wrap max-w-2xl mx-auto text-lg font-serif italic">&quot;{data.scope || 'Executive summary of the engagement.'}&quot;</p>
        </div>

        {/* Deliverables */}
        <div className="print:break-inside-avoid">
          <h3 className="text-sm uppercase tracking-[0.2em] text-[#d4af37] mb-8 text-center">Scope of Engagement</h3>
          <div className="border border-[#2a2a2a] p-10 bg-[#111]">
            <p className="text-[#a0a0a0] leading-relaxed whitespace-pre-wrap">{data.deliverables || 'Specific premium deliverables.'}</p>
          </div>
        </div>

        {/* Investment */}
        <div className="print:break-inside-avoid">
          <h3 className="text-sm uppercase tracking-[0.2em] text-[#d4af37] mb-8 text-center">Professional Fees</h3>
          
          <div className="border border-[#2a2a2a] bg-[#111]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-[#808080] text-xs uppercase tracking-[0.1em]">
                  <th className="p-6 font-normal">Service</th>
                  <th className="p-6 font-normal text-center">Qty</th>
                  <th className="p-6 font-normal text-right">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="p-6 text-[#d0d0d0]">{item.description}</td>
                    <td className="p-6 text-center text-[#808080]">{item.qty}</td>
                    <td className="p-6 text-right text-[#d0d0d0]">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#d4af37]">
                  <td colSpan={2} className="p-6 text-right uppercase tracking-[0.1em] text-xs text-[#d4af37]">Total Retainer</td>
                  <td className="p-6 text-right text-xl text-white tracking-wider">${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Timeline & Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 print:break-inside-avoid text-sm">
          <div>
            <h4 className="uppercase tracking-[0.2em] text-[#d4af37] mb-4">Timeline</h4>
            <p className="text-[#a0a0a0] whitespace-pre-wrap leading-relaxed">{data.timeline || 'TBD'}</p>
          </div>
          <div>
            <h4 className="uppercase tracking-[0.2em] text-[#d4af37] mb-4">Terms</h4>
            <p className="text-[#a0a0a0] whitespace-pre-wrap leading-relaxed">{data.terms || 'Standard terms.'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-16 border-t border-[#2a2a2a] text-center print:break-inside-avoid">
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt={data.agencyName} className="h-8 w-auto object-contain mx-auto mb-4 opacity-50" style={{ filter: 'brightness(0) invert(1)' }} />
          ) : (
            <p className="text-[#808080] uppercase tracking-[0.2em] text-xs mb-4">{data.agencyName}</p>
          )}
          <div className="text-[#606060] text-xs space-y-1">
            {data.agencyEmail && <p>{data.agencyEmail}</p>}
            {data.agencyPhone && <p>{data.agencyPhone}</p>}
          </div>
        </div>

      </div>
    </div>
  )
}

export const luxuryPremiumConfig: TemplateConfig = {
  id: 'luxury-premium',
  name: 'Luxury Premium',
  description: 'Elegant black and gold aesthetic for high-end engagements.',
  component: LuxuryPremium,
  primaryColor: '#d4af37',
  secondaryColor: '#0a0a0a',
  supportsPdf: true,
  supportsDocx: false, // Dark themes are hard to translate to DOCX perfectly
  version: '1.0.0'
}
