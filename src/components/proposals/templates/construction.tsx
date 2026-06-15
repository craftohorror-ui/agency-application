import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const constructionConfig: TemplateConfig = {
  id: 'construction',
  name: 'Construction & Build',
  description: 'High-contrast, robust layout focused on project milestones and clear budget breakdowns.',
  component: ConstructionTemplate,
  primaryColor: '#f97316', // Orange-500
  secondaryColor: '#1c1917', // Stone-900
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0'
}

export function ConstructionTemplate({ data }: { data: TemplateData }) {
  const brandOrange = '#f97316' // For accents
  const heavyDark = '#1c1917' // Stone-900 for high contrast headers
  const mutedDark = '#44403c' // Stone-700 for text
  
  return (
    <div className="bg-white min-h-[1056px] w-[816px] mx-auto shadow-sm border-t-[16px]" style={{ borderColor: heavyDark, fontFamily: 'Arial, sans-serif' }}>
      <div className="p-12">
        
        {/* Header Block */}
        <div className="bg-stone-100 p-8 mb-12 border-l-8" style={{ borderColor: brandOrange }}>
          <div className="flex justify-between items-start">
            <div className="max-w-[60%]">
              <h1 className="text-4xl font-black uppercase tracking-tight mb-4" style={{ color: heavyDark }}>
                Project Proposal
              </h1>
              <h2 className="text-2xl font-bold leading-snug" style={{ color: heavyDark }}>{data.title}</h2>
              <p className="text-sm font-bold uppercase tracking-widest mt-4" style={{ color: brandOrange }}>
                Submitted on: {data.date}
              </p>
            </div>
            <div className="text-right">
              {data.agencyLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.agencyLogo} alt={data.agencyName} className="h-14 w-auto mb-4 ml-auto" />
              ) : (
                <h3 className="text-2xl font-black mb-2" style={{ color: heavyDark }}>{data.agencyName}</h3>
              )}
              {data.agencyEmail && <p className="text-sm font-medium" style={{ color: mutedDark }}>{data.agencyEmail}</p>}
              {data.agencyPhone && <p className="text-sm font-medium" style={{ color: mutedDark }}>{data.agencyPhone}</p>}
            </div>
          </div>
        </div>

        {/* Client Block */}
        <section className="mb-12 border-b-4 pb-8 break-inside-avoid" style={{ borderColor: heavyDark }}>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: brandOrange }}>Client Details</p>
          <h3 className="text-3xl font-black uppercase" style={{ color: heavyDark }}>{data.clientName}</h3>
          {data.clientCompany && <p className="text-xl font-bold mt-1" style={{ color: mutedDark }}>{data.clientCompany}</p>}
        </section>

        {/* Scope */}
        {data.scope && (
          <section className="mb-12 break-inside-avoid">
            <h4 className="text-xl font-black uppercase tracking-wider bg-stone-900 text-white px-4 py-2 mb-6 inline-block">
              1. Project Scope
            </h4>
            <div className="text-base font-medium leading-relaxed whitespace-pre-wrap pl-4 border-l-4" style={{ color: mutedDark, borderColor: '#d6d3d1' }}>
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables / Milestones */}
        {data.deliverables && (
          <section className="mb-12 break-inside-avoid">
            <h4 className="text-xl font-black uppercase tracking-wider bg-stone-900 text-white px-4 py-2 mb-6 inline-block">
              2. Key Milestones & Deliverables
            </h4>
            <div className="text-base font-medium leading-relaxed whitespace-pre-wrap pl-4 border-l-4" style={{ color: mutedDark, borderColor: '#d6d3d1' }}>
              {data.deliverables}
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="mb-12 break-inside-avoid">
            <h4 className="text-xl font-black uppercase tracking-wider bg-stone-900 text-white px-4 py-2 mb-6 inline-block">
              3. Execution Timeline
            </h4>
            <div className="text-base font-medium leading-relaxed whitespace-pre-wrap pl-4 border-l-4" style={{ color: mutedDark, borderColor: '#d6d3d1' }}>
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing / Budget */}
        <section className="mb-12 break-inside-avoid">
          <h4 className="text-xl font-black uppercase tracking-wider bg-stone-900 text-white px-4 py-2 mb-6 inline-block">
            4. Estimated Budget
          </h4>
          
          <table className="w-full text-base">
            <thead className="border-b-4 border-stone-900">
              <tr>
                <th className="px-2 py-3 text-left font-black uppercase" style={{ color: heavyDark }}>Line Item</th>
                <th className="px-2 py-3 text-center font-black uppercase" style={{ color: heavyDark }}>Qty</th>
                <th className="px-2 py-3 text-right font-black uppercase" style={{ color: heavyDark }}>Unit Rate</th>
                <th className="px-2 py-3 text-right font-black uppercase" style={{ color: heavyDark }}>Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-stone-200">
              {data.items.length > 0 ? (
                data.items.map((item, idx) => (
                  <tr key={item.id || idx} className="break-inside-avoid">
                    <td className="px-2 py-4 font-bold" style={{ color: heavyDark }}>{item.description}</td>
                    <td className="px-2 py-4 text-center font-medium" style={{ color: mutedDark }}>{item.qty}</td>
                    <td className="px-2 py-4 text-right font-medium" style={{ color: mutedDark }}>${item.unitPrice.toFixed(2)}</td>
                    <td className="px-2 py-4 text-right font-black" style={{ color: heavyDark }}>${item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr className="break-inside-avoid">
                  <td colSpan={4} className="px-2 py-8 text-center font-bold italic" style={{ color: mutedDark }}>No budget items specified.</td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-4 border-stone-900 bg-stone-100">
              <tr className="break-inside-avoid">
                <td colSpan={3} className="px-4 py-6 text-right font-black uppercase tracking-wider text-xl" style={{ color: heavyDark }}>Total Project Budget</td>
                <td className="px-4 py-6 text-right font-black text-2xl" style={{ color: brandOrange }}>${data.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Terms */}
        {data.terms && (
          <section className="mb-16 break-inside-avoid">
            <h4 className="text-xl font-black uppercase tracking-wider bg-stone-900 text-white px-4 py-2 mb-6 inline-block">
              5. Terms & Conditions
            </h4>
            <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap pl-4 border-l-4" style={{ color: mutedDark, borderColor: '#d6d3d1' }}>
              {data.terms}
            </div>
          </section>
        )}

        {/* Signatures */}
        <section className="break-inside-avoid border-t-8 pt-12" style={{ borderColor: heavyDark }}>
          <h4 className="text-xl font-black uppercase tracking-wider mb-8" style={{ color: heavyDark }}>
            Approval & Sign-off
          </h4>
          <div className="grid grid-cols-2 gap-12">
            <div className="bg-stone-50 p-6 border-2 border-stone-200">
              <div className="border-b-2 border-stone-400 h-16 mb-4"></div>
              <p className="font-black text-lg uppercase" style={{ color: heavyDark }}>{data.clientName}</p>
              <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: brandOrange }}>Client Authorization</p>
            </div>
            <div className="bg-stone-50 p-6 border-2 border-stone-200">
              <div className="border-b-2 border-stone-400 h-16 mb-4"></div>
              <p className="font-black text-lg uppercase" style={{ color: heavyDark }}>{data.agencyName}</p>
              <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: brandOrange }}>Contractor Authorization</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
