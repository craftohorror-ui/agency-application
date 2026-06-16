import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function TechEnterprise({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-[#F8FAFC] min-h-screen font-sans text-slate-800 print:max-w-none print:shadow-none shadow-xl border border-slate-200">
      {/* Header */}
      <div className="bg-white px-12 py-8 border-b-4 print:break-inside-avoid print:color-adjust-exact" style={{ borderBottomColor: data.brandColor || '#2563EB', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-10 w-auto object-contain" />
            ) : (
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{data.agencyName}</h2>
            )}
            <div className="h-8 w-px bg-slate-300"></div>
            <span className="text-slate-500 uppercase tracking-widest text-xs font-semibold">Enterprise Solutions</span>
          </div>
          <div className="text-right text-sm text-slate-500 font-medium">{data.date}</div>
        </div>
      </div>

      <div className="px-12 py-16 space-y-12">
        {/* Title */}
        <div className="print:break-inside-avoid">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{data.title}</h1>
          <p className="text-xl text-slate-500 border-l-4 pl-4" style={{ borderLeftColor: data.brandColor || '#2563EB' }}>
            Solution architecture and implementation proposal for <strong className="text-slate-800">{data.clientCompany || data.clientName}</strong>.
          </p>
        </div>

        {/* Content Blocks */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-12">
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 print:break-inside-avoid">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" style={{ color: data.brandColor || '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Executive Summary & Scope
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.scope || 'Define the scope and enterprise solution here.'}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 print:break-inside-avoid">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" style={{ color: data.brandColor || '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Technical Deliverables
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.deliverables || 'Define technical deliverables and system architecture.'}</p>
            </div>

          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-6 rounded-lg print:color-adjust-exact print:break-inside-avoid" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-xs mb-4">Project Timeline</h3>
              <p className="text-white whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
            </div>
            
            <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 print:break-inside-avoid">
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-xs mb-4">Service Terms</h3>
              <p className="text-slate-700 text-sm whitespace-pre-wrap">{data.terms || 'Standard SLA applies.'}</p>
            </div>
          </div>
        </div>

        {/* Investment */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden print:break-inside-avoid">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">Commercial Proposal</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Service / Component</th>
                <th className="px-6 py-3 font-semibold text-center">Quantity</th>
                <th className="px-6 py-3 font-semibold text-right">Unit Price</th>
                <th className="px-6 py-3 font-semibold text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.description}</td>
                  <td className="px-6 py-4 text-center text-slate-500">{item.qty}</td>
                  <td className="px-6 py-4 text-right text-slate-500">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right font-bold text-slate-600 uppercase tracking-wider text-xs">Total Authorized Investment</td>
                <td className="px-6 py-4 text-right font-bold text-xl" style={{ color: data.brandColor || '#2563EB' }}>${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </div>
  )
}

export const techEnterpriseConfig: TemplateConfig = {
  id: 'tech-enterprise',
  name: 'Tech Enterprise',
  description: 'Structured, corporate blue aesthetic tailored for technology and software firms.',
  component: TechEnterprise,
  primaryColor: '#2563EB',
  secondaryColor: '#F8FAFC',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
