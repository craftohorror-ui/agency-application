import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const executiveConfig: TemplateConfig = {
  id: 'executive',
  name: 'Executive Boardroom',
  description: 'Minimalist, premium black-and-white design tailored for C-suite presentations.',
  component: ExecutiveTemplate,
  primaryColor: '#000000', // Pure Black
  secondaryColor: '#52525b', // Zinc-600
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0'
}

export function ExecutiveTemplate({ data }: { data: TemplateData }) {
  const black = '#000000'
  const gray = '#52525b'
  const lightGray = '#f4f4f5'
  
  return (
    <div className="bg-white min-h-[1056px] w-[816px] mx-auto shadow-sm" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="p-16">
        
        {/* Header Block */}
        <div className="flex justify-between items-end border-b pb-8 mb-16" style={{ borderColor: black }}>
          <div>
            {data.agencyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.agencyLogo} alt={data.agencyName} className="h-10 w-auto mb-4" />
            ) : (
              <h2 className="text-xl font-bold tracking-widest uppercase mb-4" style={{ color: black }}>{data.agencyName}</h2>
            )}
            <p className="text-xs tracking-widest uppercase" style={{ color: gray }}>Executive Brief</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-light tracking-wide" style={{ color: black }}>
              {data.title}
            </h1>
            <p className="text-sm italic mt-2" style={{ color: gray }}>
              Prepared for {data.clientName} &bull; {data.date}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        {data.scope && (
          <section className="mb-16 break-inside-avoid">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: black }}>I. Executive Summary</h3>
            <div className="text-base leading-loose whitespace-pre-wrap pl-6 border-l" style={{ color: black, borderColor: black }}>
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="mb-16 break-inside-avoid">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: black }}>II. Strategic Deliverables</h3>
            <div className="text-base leading-loose whitespace-pre-wrap text-justify" style={{ color: gray }}>
              {data.deliverables}
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="mb-16 break-inside-avoid">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: black }}>III. Proposed Timeline</h3>
            <div className="text-base leading-loose whitespace-pre-wrap" style={{ color: gray }}>
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="mb-16 break-inside-avoid">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: black }}>IV. Financial Overview</h3>
          
          <table className="w-full text-base">
            <thead className="border-b-2" style={{ borderColor: black }}>
              <tr>
                <th className="px-2 py-4 text-left font-normal uppercase tracking-wider text-xs" style={{ color: gray }}>Investment</th>
                <th className="px-2 py-4 text-center font-normal uppercase tracking-wider text-xs" style={{ color: gray }}>Qty</th>
                <th className="px-2 py-4 text-right font-normal uppercase tracking-wider text-xs" style={{ color: gray }}>Rate</th>
                <th className="px-2 py-4 text-right font-normal uppercase tracking-wider text-xs" style={{ color: gray }}>Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: lightGray }}>
              {data.items.length > 0 ? (
                data.items.map((item, idx) => (
                  <tr key={item.id || idx} className="break-inside-avoid">
                    <td className="px-2 py-5" style={{ color: black }}>{item.description}</td>
                    <td className="px-2 py-5 text-center italic" style={{ color: gray }}>{item.qty}</td>
                    <td className="px-2 py-5 text-right italic" style={{ color: gray }}>${item.unitPrice.toFixed(2)}</td>
                    <td className="px-2 py-5 text-right font-bold" style={{ color: black }}>${item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr className="break-inside-avoid">
                  <td colSpan={4} className="px-2 py-8 text-center italic" style={{ color: gray }}>No investment items detailed.</td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-2" style={{ borderColor: black }}>
              <tr className="break-inside-avoid">
                <td colSpan={3} className="px-2 py-6 text-right text-sm uppercase tracking-widest" style={{ color: black }}>Total Investment Required</td>
                <td className="px-2 py-6 text-right font-bold text-xl" style={{ color: black }}>${data.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Terms */}
        {data.terms && (
          <section className="mb-20 break-inside-avoid">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: black }}>V. Terms & Conditions</h3>
            <div className="text-sm leading-loose whitespace-pre-wrap text-justify" style={{ color: gray }}>
              {data.terms}
            </div>
          </section>
        )}

        {/* Signatures */}
        <section className="break-inside-avoid">
          <div className="grid grid-cols-2 gap-24 mt-12">
            <div>
              <div className="border-b border-black h-12 mb-3"></div>
              <p className="font-bold text-sm tracking-wide" style={{ color: black }}>{data.clientName}</p>
              {data.clientCompany && <p className="text-xs italic" style={{ color: gray }}>{data.clientCompany}</p>}
            </div>
            <div>
              <div className="border-b border-black h-12 mb-3"></div>
              <p className="font-bold text-sm tracking-wide" style={{ color: black }}>{data.agencyName}</p>
              <p className="text-xs italic" style={{ color: gray }}>Authorized Representative</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
