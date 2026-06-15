import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const onePageConfig: TemplateConfig = {
  id: 'one-page',
  name: 'One Page Summary',
  description: 'Ultra-dense, multi-column layout designed to fit as much on a single page as possible.',
  component: OnePageTemplate,
  primaryColor: '#6366f1', // Indigo-500
  secondaryColor: '#312e81', // Indigo-900
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0'
}

export function OnePageTemplate({ data }: { data: TemplateData }) {
  const indigo = '#6366f1'
  const darkIndigo = '#312e81'
  const textDark = '#1e293b'
  const textLight = '#475569'
  
  return (
    <div className="bg-white min-h-[1056px] w-[816px] mx-auto shadow-sm" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      
      {/* Dense Header */}
      <div className="p-8 text-white flex justify-between items-center" style={{ backgroundColor: darkIndigo }}>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest">{data.title}</h1>
          <p className="text-xs font-medium mt-1 opacity-80">Prepared for: {data.clientName} {data.clientCompany ? `(${data.clientCompany})` : ''}</p>
        </div>
        <div className="text-right">
          {data.agencyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.agencyLogo} alt={data.agencyName} className="h-8 w-auto mb-1 ml-auto" />
          ) : (
            <h2 className="text-lg font-bold">{data.agencyName}</h2>
          )}
          <p className="text-xs opacity-80">{data.date}</p>
        </div>
      </div>

      <div className="p-8">
        
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column (Content) */}
          <div className="col-span-7">
            
            {/* Scope */}
            {data.scope && (
              <section className="mb-6 break-inside-avoid">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b-2 pb-1" style={{ color: indigo, borderColor: indigo }}>Project Scope</h3>
                <div className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: textDark }}>
                  {data.scope}
                </div>
              </section>
            )}

            {/* Deliverables */}
            {data.deliverables && (
              <section className="mb-6 break-inside-avoid">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b-2 pb-1" style={{ color: indigo, borderColor: indigo }}>Deliverables</h3>
                <div className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: textDark }}>
                  {data.deliverables}
                </div>
              </section>
            )}

            {/* Timeline */}
            {data.timeline && (
              <section className="mb-6 break-inside-avoid">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b-2 pb-1" style={{ color: indigo, borderColor: indigo }}>Timeline</h3>
                <div className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: textDark }}>
                  {data.timeline}
                </div>
              </section>
            )}
            
            {/* Terms */}
            {data.terms && (
              <section className="mb-6 break-inside-avoid">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b-2 pb-1" style={{ color: indigo, borderColor: indigo }}>Terms</h3>
                <div className="text-[10px] leading-relaxed whitespace-pre-wrap" style={{ color: textLight }}>
                  {data.terms}
                </div>
              </section>
            )}

          </div>

          {/* Right Column (Financials & Signatures) */}
          <div className="col-span-5 flex flex-col">
            
            {/* Pricing Section */}
            <section className="mb-8 break-inside-avoid bg-slate-50 p-4 rounded-md border border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: darkIndigo }}>Financial Summary</h3>
              
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="py-2 text-left font-semibold" style={{ color: textDark }}>Item</th>
                    <th className="py-2 text-right font-semibold" style={{ color: textDark }}>Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.items.length > 0 ? (
                    data.items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="py-2" style={{ color: textDark }}>
                          <span className="block font-medium">{item.description}</span>
                          {item.qty > 1 && <span className="text-[10px]" style={{ color: textLight }}>{item.qty} x ${item.unitPrice.toFixed(2)}</span>}
                        </td>
                        <td className="py-2 text-right font-semibold" style={{ color: textDark }}>${item.total.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-4 text-center italic" style={{ color: textLight }}>No items specified.</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t-2 border-slate-800">
                  <tr>
                    <td className="py-3 font-bold uppercase" style={{ color: darkIndigo }}>Total</td>
                    <td className="py-3 text-right font-bold text-sm" style={{ color: indigo }}>${data.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </section>

            {/* Signatures */}
            <section className="mt-auto break-inside-avoid">
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: darkIndigo }}>Authorization</h3>
                
                <div className="mb-6">
                  <div className="border-b border-slate-400 h-8 mb-2"></div>
                  <p className="font-bold text-xs" style={{ color: textDark }}>{data.clientName}</p>
                  <p className="text-[10px]" style={{ color: textLight }}>Client Signature</p>
                </div>

                <div>
                  <div className="border-b border-slate-400 h-8 mb-2"></div>
                  <p className="font-bold text-xs" style={{ color: textDark }}>{data.agencyName}</p>
                  <p className="text-[10px]" style={{ color: textLight }}>Agency Signature</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
