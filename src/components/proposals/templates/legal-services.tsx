import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function LegalServices({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen font-serif text-slate-900 border-x border-slate-200 shadow-md print:shadow-none print:max-w-none print:border-none p-16">
      
      {/* Header */}
      <div className="border-b-4 border-slate-900 pb-8 mb-12 flex justify-between items-start print:break-inside-avoid">
        <div>
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt={data.agencyName} className="h-16 w-auto object-contain" />
          ) : (
            <h2 className="text-3xl font-bold uppercase tracking-widest text-slate-900">{data.agencyName}</h2>
          )}
        </div>
        <div className="text-right text-sm text-slate-600 font-sans space-y-1">
          <p className="font-semibold text-slate-900 uppercase tracking-widest">Confidential</p>
          <p>Date: {data.date}</p>
          {data.agencyEmail && <p>{data.agencyEmail}</p>}
          {data.agencyPhone && <p>{data.agencyPhone}</p>}
        </div>
      </div>

      <div className="space-y-12">
        
        {/* Title */}
        <div className="text-center mb-16 print:break-inside-avoid">
          <h1 className="text-4xl font-bold mb-6 text-slate-900 leading-tight">LEGAL SERVICES PROPOSAL &<br/>ENGAGEMENT LETTER</h1>
          <p className="text-xl text-slate-700">Prepared for <strong className="text-slate-900">{data.clientName}</strong> {data.clientCompany && `of ${data.clientCompany}`}</p>
        </div>

        {/* Scope */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-300 pb-2">I. Scope of Representation</h3>
          <div className="prose prose-slate max-w-none font-serif text-slate-800 leading-relaxed">
            <p className="whitespace-pre-wrap">{data.scope || 'Description of legal matters to be handled.'}</p>
          </div>
        </div>

        {/* Deliverables */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-300 pb-2">II. Services to be Performed</h3>
          <div className="prose prose-slate max-w-none font-serif text-slate-800 leading-relaxed pl-6 border-l-2 border-slate-200">
            <p className="whitespace-pre-wrap">{data.deliverables || 'Specific services and filings.'}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-300 pb-2">III. Anticipated Timeline</h3>
          <div className="prose prose-slate max-w-none font-serif text-slate-800 leading-relaxed">
            <p className="whitespace-pre-wrap">{data.timeline || 'Timeline is subject to court schedules and opposing counsel.'}</p>
          </div>
        </div>

        {/* Financials */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-300 pb-2">IV. Fee Structure & Retainer</h3>
          <p className="mb-6 font-serif text-slate-800">The anticipated fees for the aforementioned services are structured as follows:</p>
          
          <table className="w-full text-left font-sans text-sm border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="border border-slate-300 p-3 font-semibold uppercase tracking-wider text-xs">Description of Services</th>
                <th className="border border-slate-300 p-3 font-semibold uppercase tracking-wider text-xs text-center">Hours/Qty</th>
                <th className="border border-slate-300 p-3 font-semibold uppercase tracking-wider text-xs text-right">Rate/Fee</th>
                <th className="border border-slate-300 p-3 font-semibold uppercase tracking-wider text-xs text-right">Estimated Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="border border-slate-300 p-3 text-slate-900">{item.description}</td>
                  <td className="border border-slate-300 p-3 text-center text-slate-600">{item.qty}</td>
                  <td className="border border-slate-300 p-3 text-right text-slate-600">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border border-slate-300 p-3 text-right text-slate-900">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="border border-slate-300 p-3 text-right font-bold text-slate-900 uppercase tracking-widest">Total Estimated Fees / Initial Retainer</td>
                <td className="border border-slate-300 p-3 text-right font-bold text-lg text-slate-900">${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Terms */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-300 pb-2">V. Terms of Engagement</h3>
          <div className="prose prose-slate max-w-none font-serif text-slate-800 text-sm leading-relaxed">
            <p className="whitespace-pre-wrap">{data.terms || 'Standard legal engagement terms apply.'}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export const legalServicesConfig: TemplateConfig = {
  id: 'legal-services',
  name: 'Legal Services',
  description: 'Formal, serif-based document ideal for law firms and official engagements.',
  component: LegalServices,
  primaryColor: '#0f172a',
  secondaryColor: '#ffffff',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
