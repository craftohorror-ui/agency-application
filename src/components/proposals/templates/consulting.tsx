import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const consultingConfig: TemplateConfig = {
  id: 'consulting',
  name: 'Strategic Consulting',
  description: 'Methodology-focused layout with emerald accents emphasizing strategy and growth.',
  component: ConsultingTemplate,
  primaryColor: '#059669', // Emerald-600
  secondaryColor: '#0f172a', // Slate-900
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0'
}

export function ConsultingTemplate({ data }: { data: TemplateData }) {
  const emerald = '#059669'
  const darkSlate = '#0f172a'
  const textBody = '#334155'
  
  return (
    <div className="bg-white min-h-[1056px] w-[816px] mx-auto shadow-sm relative" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Decorative Top Bar */}
      <div className="h-4 w-full" style={{ backgroundColor: emerald }}></div>

      <div className="p-14">
        
        {/* Header Block */}
        <div className="flex justify-between items-center pb-12 mb-12 border-b-2 border-slate-100">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase mb-1" style={{ color: emerald }}>Strategic Engagement</p>
            <h1 className="text-3xl font-bold" style={{ color: darkSlate }}>
              {data.title}
            </h1>
          </div>
          <div className="text-right flex flex-col items-end">
            {data.agencyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto mb-2" />
            ) : (
              <h2 className="text-xl font-bold mb-1" style={{ color: darkSlate }}>{data.agencyName}</h2>
            )}
            <p className="text-sm" style={{ color: textBody }}>{data.date}</p>
          </div>
        </div>

        {/* Client Block */}
        <section className="mb-14 break-inside-avoid bg-slate-50 p-6 rounded-lg border border-slate-100">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: emerald }}>Prepared For</p>
              <h3 className="text-xl font-bold" style={{ color: darkSlate }}>{data.clientName}</h3>
              {data.clientCompany && <p className="text-base" style={{ color: textBody }}>{data.clientCompany}</p>}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: emerald }}>Agency Contact</p>
              <h3 className="text-lg font-bold" style={{ color: darkSlate }}>{data.agencyName}</h3>
              {data.agencyEmail && <p className="text-sm" style={{ color: textBody }}>{data.agencyEmail}</p>}
              {data.agencyPhone && <p className="text-sm" style={{ color: textBody }}>{data.agencyPhone}</p>}
            </div>
          </div>
        </section>

        {/* Methodology / Scope */}
        {data.scope && (
          <section className="mb-12 break-inside-avoid">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-1" style={{ backgroundColor: emerald }}></div>
              <h4 className="text-xl font-bold" style={{ color: darkSlate }}>
                Methodology & Scope
              </h4>
            </div>
            <div className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: textBody }}>
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="mb-12 break-inside-avoid">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-1" style={{ backgroundColor: emerald }}></div>
              <h4 className="text-xl font-bold" style={{ color: darkSlate }}>
                Strategic Deliverables
              </h4>
            </div>
            <div className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: textBody }}>
              {data.deliverables}
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="mb-12 break-inside-avoid">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-1" style={{ backgroundColor: emerald }}></div>
              <h4 className="text-xl font-bold" style={{ color: darkSlate }}>
                Engagement Timeline
              </h4>
            </div>
            <div className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: textBody }}>
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="mb-12 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1" style={{ backgroundColor: emerald }}></div>
            <h4 className="text-xl font-bold" style={{ color: darkSlate }}>
              Investment Summary
            </h4>
          </div>
          
          <div className="border rounded-lg overflow-hidden border-slate-200">
            <table className="w-full text-base">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-sm uppercase tracking-wider" style={{ color: darkSlate }}>Phase / Description</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm uppercase tracking-wider" style={{ color: darkSlate }}>Qty</th>
                  <th className="px-4 py-3 text-right font-semibold text-sm uppercase tracking-wider" style={{ color: darkSlate }}>Unit Rate</th>
                  <th className="px-4 py-3 text-right font-semibold text-sm uppercase tracking-wider" style={{ color: darkSlate }}>Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={item.id || idx} className="break-inside-avoid">
                      <td className="px-4 py-4 font-medium" style={{ color: darkSlate }}>{item.description}</td>
                      <td className="px-4 py-4 text-center" style={{ color: textBody }}>{item.qty}</td>
                      <td className="px-4 py-4 text-right" style={{ color: textBody }}>${item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-4 text-right font-semibold" style={{ color: darkSlate }}>${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="break-inside-avoid">
                    <td colSpan={4} className="px-4 py-8 text-center italic" style={{ color: textBody }}>No phases detailed.</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr className="break-inside-avoid">
                  <td colSpan={3} className="px-4 py-5 text-right font-bold uppercase tracking-wider text-sm" style={{ color: darkSlate }}>Total Engagement Value</td>
                  <td className="px-4 py-5 text-right font-bold text-xl" style={{ color: emerald }}>${data.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Terms */}
        {data.terms && (
          <section className="mb-16 break-inside-avoid">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-1" style={{ backgroundColor: emerald }}></div>
              <h4 className="text-xl font-bold" style={{ color: darkSlate }}>
                Terms & Conditions
              </h4>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-lg border border-slate-100" style={{ color: textBody }}>
              {data.terms}
            </div>
          </section>
        )}

        {/* Signatures */}
        <section className="break-inside-avoid">
          <div className="grid grid-cols-2 gap-12 mt-8">
            <div>
              <div className="border-b-2 border-slate-200 h-12 mb-3"></div>
              <p className="font-bold text-base" style={{ color: darkSlate }}>{data.clientName}</p>
              <p className="text-sm" style={{ color: textBody }}>{data.clientCompany || 'Client Signature'}</p>
            </div>
            <div>
              <div className="border-b-2 border-slate-200 h-12 mb-3"></div>
              <p className="font-bold text-base" style={{ color: darkSlate }}>{data.agencyName}</p>
              <p className="text-sm" style={{ color: textBody }}>Agency Signature</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
