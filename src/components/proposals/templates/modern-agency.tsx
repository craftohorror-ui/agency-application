import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const modernAgencyConfig: TemplateConfig = {
  id: 'modern-agency',
  name: 'Modern Agency',
  description: 'Vibrant, creative, bold headers with a dark slate cover and geometric accents.',
  component: ModernAgencyTemplate,
  primaryColor: '#eab308',
  secondaryColor: '#0f172a',
  supportsPdf: true,
  supportsDocx: true,
  version: '2.0' // Premium Upgrade
}

interface ModernAgencyTemplateProps {
  data: TemplateData
}

export function ModernAgencyTemplate({ data }: ModernAgencyTemplateProps) {
  // Vibrant yellow/gold accent color for Modern Agency
  const accentColor = data.brandColor || '#eab308' 
  const slateDark = '#0f172a'

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white overflow-hidden font-sans text-slate-800" style={{ minHeight: '1100px' }}>
      
      {/* --- COVER PAGE --- */}
      <div className="relative flex flex-col justify-between p-16 print-avoid-break" style={{ backgroundColor: slateDark, color: 'white', minHeight: '1100px', pageBreakAfter: 'always' }}>
        {/* Background diagonal styling (Modern aesthetic) */}
        <div 
          className="absolute top-0 right-0 w-3/4 h-full opacity-20 print:opacity-10" 
          style={{ 
            background: `linear-gradient(135deg, ${accentColor}00 40%, ${accentColor} 100%)`,
            clipPath: 'polygon(100% 0, 100% 100%, 15% 100%, 35% 0)'
          }} 
        />
        <div 
          className="absolute bottom-0 left-0 w-1/2 h-1/3 opacity-10"
          style={{
            background: `radial-gradient(circle at bottom left, ${accentColor}, transparent 70%)`
          }}
        />
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="text-4xl font-extrabold tracking-tighter">
            {data.agencyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.agencyLogo} alt={data.agencyName} className="h-16 object-contain" />
            ) : (
              <span style={{ color: accentColor }}>{data.agencyName}</span>
            )}
          </div>
          <div className="text-right">
            <span className="inline-block border px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full" style={{ borderColor: `${accentColor}50`, color: accentColor }}>
              Proposal
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-8 mt-40 mb-auto">
          <div className="w-24 h-3" style={{ backgroundColor: accentColor }} />
          <h1 className="text-7xl font-black tracking-tighter leading-[1.1] drop-shadow-lg">
            {data.title}
          </h1>
          <p className="text-2xl text-slate-300 font-light max-w-2xl leading-relaxed">
            A strategic proposal prepared exclusively for <strong className="text-white font-semibold">{data.clientCompany || data.clientName}</strong>
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 border-t pt-10" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: accentColor }}>Prepared By</p>
            <p className="font-bold text-lg">{data.agencyName}</p>
            {data.agencyEmail && <p className="text-sm text-slate-400">{data.agencyEmail}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: accentColor }}>Date</p>
            <p className="font-bold text-lg">{data.date}</p>
            <p className="text-sm text-slate-400">Valid for 30 days</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT PAGES --- */}
      <div className="p-16 space-y-24 bg-slate-50/50">

        {/* Executive Summary / Scope */}
        {(data.scope || data.deliverables) && (
          <div className="space-y-16">
            {data.scope && (
              <section className="print-avoid-break">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: accentColor, transform: 'rotate(-5deg)' }}>1</div>
                  <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: slateDark }}>Executive Scope</h2>
                </div>
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: accentColor }} />
                  <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap relative z-10">
                    {data.scope}
                  </div>
                </div>
              </section>
            )}

            {data.deliverables && (
              <section className="print-avoid-break">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: slateDark, transform: 'rotate(5deg)' }}>2</div>
                  <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: slateDark }}>Key Deliverables</h2>
                </div>
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
                  <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {data.deliverables}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: accentColor, transform: 'rotate(-5deg)' }}>3</div>
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: slateDark }}>Project Roadmap</h2>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 relative">
              {/* Decorative Timeline Background Line */}
              <div className="absolute left-10 top-20 bottom-10 w-1 rounded-full opacity-20" style={{ backgroundColor: slateDark }} />
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 whitespace-pre-wrap pl-8 relative z-10">
                {data.timeline}
              </div>
            </div>
          </section>
        )}

        {/* Section Divider */}
        <div className="h-px w-full my-8 relative print-avoid-break">
          <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
        </div>

        {/* Pricing / Investment */}
        <section className="print-avoid-break">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: slateDark, transform: 'rotate(5deg)' }}>4</div>
            <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: slateDark }}>Investment Summary</h2>
          </div>
          
          <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-base">
              <thead style={{ backgroundColor: slateDark, color: 'white' }}>
                <tr>
                  <th className="px-8 py-6 font-bold uppercase tracking-wider text-sm">Description</th>
                  <th className="px-8 py-6 font-bold uppercase tracking-wider text-sm text-right">Qty</th>
                  <th className="px-8 py-6 font-bold uppercase tracking-wider text-sm text-right">Unit Price</th>
                  <th className="px-8 py-6 font-bold uppercase tracking-wider text-sm text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'} hover:bg-slate-100 transition-colors`}>
                      <td className="px-8 py-6 font-semibold text-slate-800">{item.description}</td>
                      <td className="px-8 py-6 text-right text-slate-600 font-medium">{item.qty}</td>
                      <td className="px-8 py-6 text-right text-slate-600 font-medium">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-8 py-6 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-8 text-center text-slate-500 italic">No line items specified.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Elevated Total Block */}
            <div className="p-8 flex justify-between items-center text-white" style={{ backgroundColor: accentColor }}>
              <div className="font-bold text-lg uppercase tracking-widest drop-shadow-sm text-white">Total Investment</div>
              <div className="font-black text-5xl text-white drop-shadow-sm">${data.totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </section>

        {/* Terms & Conditions */}
        {data.terms && (
          <section className="print-avoid-break">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: accentColor, transform: 'rotate(-5deg)' }}>5</div>
              <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: slateDark }}>Terms & Conditions</h2>
            </div>
            <div className="bg-slate-100 p-8 rounded-2xl text-sm text-slate-600 leading-relaxed whitespace-pre-wrap border border-slate-200 shadow-inner">
              {data.terms}
            </div>
          </section>
        )}

        {/* Signature Block */}
        <section className="mt-16 pt-16 border-t-2 border-slate-200 print-avoid-break">
          <h3 className="text-3xl font-extrabold tracking-tight mb-12 text-center" style={{ color: slateDark }}>Sign-off & Acceptance</h3>
          <div className="grid grid-cols-2 gap-16 px-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="border-b-2 border-slate-200 mb-4 h-16 flex items-end pb-2">
                <span className="text-slate-300 italic text-sm">Client Signature</span>
              </div>
              <p className="text-lg font-bold text-slate-800">{data.clientName}</p>
              <p className="text-sm font-medium text-slate-500">{data.clientCompany || 'Client'}</p>
              <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest font-semibold">Date: _________________</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 opacity-10" style={{ backgroundColor: accentColor, clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
              <div className="border-b-2 border-slate-200 mb-4 h-16 flex items-end pb-2">
                <span className="text-slate-300 italic text-sm">Agency Signature</span>
              </div>
              <p className="text-lg font-bold text-slate-800">{data.agencyName}</p>
              <p className="text-sm font-medium text-slate-500">Authorized Representative</p>
              <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest font-semibold">Date: _________________</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
