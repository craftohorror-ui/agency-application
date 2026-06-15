import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

export const corporateConfig: TemplateConfig = {
  id: 'corporate',
  name: 'Corporate Executive',
  description: 'Enterprise-grade layout with a clean, trustworthy blue aesthetic.',
  component: CorporateTemplate,
  primaryColor: '#2563eb', // Blue-600
  secondaryColor: '#1e293b', // Slate-800
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0'
}

export function CorporateTemplate({ data }: { data: TemplateData }) {
  const primaryBlue = '#2563eb'
  const textDark = '#1e293b'
  const textLight = '#64748b'

  return (
    <div className="bg-white min-h-[1056px] w-[816px] mx-auto shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="p-16 text-slate-800">
        
        {/* Header Section */}
        <header className="border-b-4 pb-8 mb-12 flex justify-between items-start" style={{ borderColor: primaryBlue }}>
          <div>
            <h1 className="text-4xl font-extrabold uppercase tracking-widest mb-2" style={{ color: textDark }}>
              Proposal
            </h1>
            <p className="text-sm font-medium" style={{ color: textLight }}>
              Date: {data.date}
            </p>
          </div>
          <div className="text-right">
            {data.agencyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto mb-2" />
            ) : (
              <h2 className="text-2xl font-bold" style={{ color: primaryBlue }}>{data.agencyName}</h2>
            )}
            {data.agencyEmail && <p className="text-sm" style={{ color: textLight }}>{data.agencyEmail}</p>}
            {data.agencyPhone && <p className="text-sm" style={{ color: textLight }}>{data.agencyPhone}</p>}
          </div>
        </header>

        {/* Title & Client Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: primaryBlue }}>Prepared For</p>
              <h3 className="text-xl font-bold" style={{ color: textDark }}>{data.clientName}</h3>
              {data.clientCompany && <p className="text-lg" style={{ color: textLight }}>{data.clientCompany}</p>}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: primaryBlue }}>Project Title</p>
              <h3 className="text-2xl font-bold leading-tight" style={{ color: textDark }}>{data.title}</h3>
            </div>
          </div>
        </section>

        {/* Executive Summary & Scope */}
        {data.scope && (
          <section className="mb-12 break-inside-avoid">
            <h4 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider" style={{ color: textDark, borderColor: '#e2e8f0' }}>
              1. Executive Summary & Scope
            </h4>
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: textLight }}>
              {data.scope}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {data.deliverables && (
          <section className="mb-12 break-inside-avoid">
            <h4 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider" style={{ color: textDark, borderColor: '#e2e8f0' }}>
              2. Deliverables
            </h4>
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: textLight }}>
              {data.deliverables}
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline && (
          <section className="mb-12 break-inside-avoid">
            <h4 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider" style={{ color: textDark, borderColor: '#e2e8f0' }}>
              3. Proposed Timeline
            </h4>
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: textLight }}>
              {data.timeline}
            </div>
          </section>
        )}

        {/* Pricing / Investment */}
        <section className="mb-12 break-inside-avoid">
          <h4 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider" style={{ color: textDark, borderColor: '#e2e8f0' }}>
            4. Investment Profile
          </h4>
          
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold" style={{ color: textDark }}>Description</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: textDark }}>Qty</th>
                <th className="px-4 py-3 text-right font-bold" style={{ color: textDark }}>Unit Price</th>
                <th className="px-4 py-3 text-right font-bold" style={{ color: textDark }}>Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.length > 0 ? (
                data.items.map((item, idx) => (
                  <tr key={item.id || idx} className="break-inside-avoid">
                    <td className="px-4 py-3" style={{ color: textDark }}>{item.description}</td>
                    <td className="px-4 py-3 text-center" style={{ color: textLight }}>{item.qty}</td>
                    <td className="px-4 py-3 text-right" style={{ color: textLight }}>${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: textDark }}>${item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr className="break-inside-avoid">
                  <td colSpan={4} className="px-4 py-6 text-center italic" style={{ color: textLight }}>No investment items specified.</td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-2 border-slate-200">
              <tr className="break-inside-avoid">
                <td colSpan={3} className="px-4 py-4 text-right font-bold uppercase tracking-wider" style={{ color: textDark }}>Total Amount</td>
                <td className="px-4 py-4 text-right font-bold text-lg" style={{ color: primaryBlue }}>${data.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Terms */}
        {data.terms && (
          <section className="mb-16 break-inside-avoid">
            <h4 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider" style={{ color: textDark, borderColor: '#e2e8f0' }}>
              5. Terms & Conditions
            </h4>
            <div className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: textLight }}>
              {data.terms}
            </div>
          </section>
        )}

        {/* Signatures */}
        <section className="break-inside-avoid">
          <div className="grid grid-cols-2 gap-16 mt-8">
            <div>
              <div className="border-b-2 border-slate-300 h-12 mb-2"></div>
              <p className="font-bold text-sm" style={{ color: textDark }}>{data.clientName}</p>
              <p className="text-xs" style={{ color: textLight }}>Client Signature</p>
            </div>
            <div>
              <div className="border-b-2 border-slate-300 h-12 mb-2"></div>
              <p className="font-bold text-sm" style={{ color: textDark }}>{data.agencyName}</p>
              <p className="text-xs" style={{ color: textLight }}>Agency Signature</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
