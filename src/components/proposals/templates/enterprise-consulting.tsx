import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function EnterpriseConsulting({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen font-serif text-slate-800 border-[12px] border-slate-100 shadow-xl print:shadow-none print:max-w-none">
      
      {/* Header */}
      <div className="p-12 pb-0 print:break-inside-avoid">
        <div className="flex justify-between items-end border-b-2 border-slate-800 pb-6 mb-12">
          <div>
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto object-contain" />
            ) : (
              <h2 className="text-2xl font-bold tracking-widest uppercase text-slate-900">{data.agencyName}</h2>
            )}
          </div>
          <div className="text-right text-sm font-sans uppercase tracking-widest font-semibold text-slate-500">
            <p>Consulting Engagement</p>
            <p>{data.date}</p>
          </div>
        </div>

        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">{data.title}</h1>
        <p className="text-xl text-slate-600 font-sans border-l-4 pl-4" style={{ borderColor: data.brandColor || '#334155' }}>
          Prepared for <strong className="text-slate-900">{data.clientName}</strong>, {data.clientCompany}
        </p>
      </div>

      <div className="p-12 space-y-12">
        {/* Scope */}
        <div className="print:break-inside-avoid bg-slate-50 p-8">
          <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-4">
            <span className="text-2xl" style={{ color: data.brandColor || '#334155' }}>I.</span>
            Executive Summary & Scope
          </h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.scope || 'Executive summary.'}</p>
        </div>

        {/* Deliverables */}
        <div className="print:break-inside-avoid p-8">
          <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-4">
            <span className="text-2xl" style={{ color: data.brandColor || '#334155' }}>II.</span>
            Key Deliverables
          </h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.deliverables || 'Consulting deliverables.'}</p>
        </div>

        {/* Investment */}
        <div className="print:break-inside-avoid p-8">
          <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-4">
            <span className="text-2xl" style={{ color: data.brandColor || '#334155' }}>III.</span>
            Professional Fees
          </h3>
          
          <table className="w-full text-left font-sans">
            <thead className="bg-slate-800 text-white print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <tr>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Phase / Activity</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs text-center">Hours / Qty</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Rate</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Total Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border border-t-0 border-slate-200">
              {data.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="p-4 text-slate-900 font-medium">{item.description}</td>
                  <td className="p-4 text-center text-slate-500">{item.qty}</td>
                  <td className="p-4 text-right text-slate-500">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-right text-slate-900 font-medium">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="p-6 text-right font-bold uppercase tracking-widest text-slate-900">Total Engagement Fee</td>
                <td className="p-6 text-right font-bold text-xl" style={{ color: data.brandColor || '#334155' }}>${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Logistics */}
        <div className="print:break-inside-avoid bg-slate-50 p-8 grid grid-cols-2 gap-12 font-sans text-sm">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-widest mb-2">Estimated Timeline</h4>
            <p className="text-slate-600 whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-widest mb-2">Terms of Service</h4>
            <p className="text-slate-600 whitespace-pre-wrap">{data.terms || 'Standard consulting terms.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const enterpriseConsultingConfig: TemplateConfig = {
  id: 'enterprise-consulting',
  name: 'Enterprise Consulting',
  description: 'Traditional, highly professional serif layout suitable for management consulting.',
  component: EnterpriseConsulting,
  primaryColor: '#334155',
  secondaryColor: '#f8fafc',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
