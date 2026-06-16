import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const modernAgencyConfig: TemplateConfig = {
  id: 'modern-agency',
  name: 'Modern Agency',
  description: 'Vibrant, creative, bold headers with a dark slate cover.',
  component: ModernAgencyTemplate,
  primaryColor: '#eab308',
  secondaryColor: '#0f172a',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0'
}

interface ModernAgencyTemplateProps {
  data: TemplateData
}

export function ModernAgencyTemplate({ data }: ModernAgencyTemplateProps) {
  // Vibrant yellow/gold accent color for Modern Agency
  const accentColor = data.brandColor || '#eab308' 
  const slateDark = '#0f172a'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white shadow-lg overflow-hidden font-sans text-slate-800" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative min-h-[1100px] flex flex-col justify-between p-16" style={{ backgroundColor: slateDark, color: 'white' }}>
        {/* Background diagonal styling (Modern aesthetic) */}
        <div 
          className="absolute top-0 right-0 w-2/3 h-full opacity-10" 
          style={{ 
            background: `linear-gradient(135deg, transparent 50%, ${accentColor} 50%)`,
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
          }} 
        />
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="text-3xl font-bold tracking-tighter">
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 object-contain" />
            ) : (
              <span style={{ color: accentColor }}>{data.agencyName}</span>
            )}
          </div>
          <div className="text-right text-slate-400 text-sm font-medium uppercase tracking-widest">
            Proposal Document
          </div>
        </div>

        <div className="relative z-10 space-y-6 mt-32 mb-auto">
          <div className="w-20 h-2" style={{ backgroundColor: accentColor }} />
          <h1 className="text-6xl font-black tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-xl text-slate-300 font-light max-w-lg">
            Prepared exclusively for <strong className="text-white font-semibold">{data.clientCompany || data.clientName}</strong>
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-end border-t border-slate-800 pt-8 mt-16">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Prepared By</p>
            <p className="font-medium">{data.agencyName}</p>
            {data.agencyEmail && <p className="text-sm text-slate-300">{data.agencyEmail}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Date</p>
            <p className="font-medium">{data.date}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-16 space-y-16">

        {/* Scope & Deliverables */}
        {(data.scope || data.deliverables) && (
          <div className="space-y-12">
            {data.scope && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: accentColor }}>1</div>
                  <h2 className="text-2xl font-bold" style={{ color: slateDark }}>Scope of Work</h2>
                </div>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {data.scope}
                </div>
              </section>
            )}

            {data.deliverables && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: accentColor }}>2</div>
                  <h2 className="text-2xl font-bold" style={{ color: slateDark }}>Deliverables</h2>
                </div>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap border-l-4 pl-6" style={{ borderColor: accentColor }}>
                  {data.deliverables}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="break-inside-avoid print-avoid-break">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: accentColor }}>3</div>
              <h2 className="text-2xl font-bold" style={{ color: slateDark }}>Timeline & Process</h2>
            </div>
            <div className="bg-slate-50 p-8 rounded-lg border border-slate-100 prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing / Investment */}
        <section className="break-inside-avoid print-avoid-break">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: accentColor }}>4</div>
            <h2 className="text-2xl font-bold" style={{ color: slateDark }}>Investment Summary</h2>
          </div>
          
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead style={{ backgroundColor: slateDark, color: 'white' }}>
                <tr>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold text-right">Qty</th>
                  <th className="px-6 py-4 font-semibold text-right">Unit Price</th>
                  <th className="px-6 py-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50 break-inside-avoid print-avoid-break">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.description}</td>
                      <td className="px-6 py-4 text-right text-slate-600">{item.qty}</td>
                      <td className="px-6 py-4 text-right text-slate-600">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="break-inside-avoid print-avoid-break">
                    <td colSpan={4} className="px-6 py-4 text-center text-slate-500 italic">No line items specified.</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                <tr className="break-inside-avoid print-avoid-break">
                  <td colSpan={3} className="px-6 py-5 text-right font-bold text-slate-700">Total Investment:</td>
                  <td className="px-6 py-5 text-right font-bold text-xl" style={{ color: accentColor }}>${data.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Terms & Conditions */}
        {data.terms && (
          <section className="pt-8 mt-8 border-t border-slate-200 break-inside-avoid print-avoid-break">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: accentColor }}>5</div>
              <h2 className="text-2xl font-bold" style={{ color: slateDark }}>Terms & Conditions</h2>
            </div>
            <div className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">
              {data.terms}
            </div>
          </section>
        )}

        {/* Signature Block */}
        <section className="pt-16 mt-16 border-t border-slate-200 pb-16 break-inside-avoid print-avoid-break">
          <h3 className="text-xl font-bold mb-12" style={{ color: slateDark }}>Acceptance of Proposal</h3>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <div className="border-b border-slate-300 mb-2 h-12" />
              <p className="text-sm font-semibold text-slate-800">{data.clientName}</p>
              <p className="text-xs text-slate-500">{data.clientCompany || 'Client'}</p>
              <p className="text-xs text-slate-400 mt-2">Date: _________________</p>
            </div>
            <div>
              <div className="border-b border-slate-300 mb-2 h-12 flex items-end">
                {/* Visual signature placeholder */}
              </div>
              <p className="text-sm font-semibold text-slate-800">{data.agencyName}</p>
              <p className="text-xs text-slate-500">Agency Representative</p>
              <p className="text-xs text-slate-400 mt-2">Date: _________________</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
