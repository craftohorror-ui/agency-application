import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function SaaSStartup({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none print:max-w-none">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-12 py-8 flex justify-between items-center print:break-inside-avoid">
        <div>
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt={data.agencyName} className="h-8 w-auto object-contain" />
          ) : (
            <h2 className="text-xl font-bold tracking-tight text-slate-900">{data.agencyName}</h2>
          )}
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>{data.date}</p>
        </div>
      </div>

      {/* Hero */}
      <div className="px-12 py-16 text-center print:break-inside-avoid">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-6" style={{ backgroundColor: `${data.brandColor}15`, color: data.brandColor }}>
          Proposal for {data.clientCompany || data.clientName}
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">{data.title}</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">A tailored product solution and implementation plan for <span className="font-semibold text-slate-900">{data.clientName}</span>.</p>
      </div>

      <div className="px-12 pb-16 space-y-12">
        {/* Core Solution */}
        <div className="print:break-inside-avoid">
          <div className="border-l-4 pl-6 py-2 mb-6" style={{ borderColor: data.brandColor || '#3B82F6' }}>
            <h3 className="text-2xl font-bold text-slate-900">Core Solution</h3>
          </div>
          <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {data.scope || 'Software solution overview goes here.'}
          </div>
        </div>

        {/* Deliverables Grid */}
        <div className="print:break-inside-avoid">
          <div className="border-l-4 pl-6 py-2 mb-6" style={{ borderColor: data.brandColor || '#3B82F6' }}>
            <h3 className="text-2xl font-bold text-slate-900">Platform Deliverables</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4" style={{ backgroundColor: `${data.brandColor}15` }}>
                <svg className="h-6 w-6" style={{ color: data.brandColor || '#3B82F6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.deliverables || 'Features and deliverables outline.'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4" style={{ backgroundColor: `${data.brandColor}15` }}>
                <svg className="h-6 w-6" style={{ color: data.brandColor || '#3B82F6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Timeline & Rollout</h4>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.timeline || 'Estimated timeline.'}</p>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="print:break-inside-avoid">
          <div className="border-l-4 pl-6 py-2 mb-6" style={{ borderColor: data.brandColor || '#3B82F6' }}>
            <h3 className="text-2xl font-bold text-slate-900">Pricing Summary</h3>
          </div>
          
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-medium">Item / License</th>
                  <th className="px-6 py-4 font-medium text-center">Seats / Qty</th>
                  <th className="px-6 py-4 font-medium text-right">Unit Rate</th>
                  <th className="px-6 py-4 font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="px-6 py-4 text-slate-900 font-medium">{item.description}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{item.qty}</td>
                    <td className="px-6 py-4 text-right text-slate-500">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right font-bold text-slate-900 uppercase tracking-wider text-xs">Total Annual Commitment</td>
                  <td className="px-6 py-4 text-right font-bold text-lg" style={{ color: data.brandColor || '#3B82F6' }}>${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Terms */}
        <div className="print:break-inside-avoid bg-slate-50 rounded-xl p-6 text-sm text-slate-500 border border-slate-200">
          <strong className="text-slate-700 block mb-2">Terms & Conditions:</strong>
          <p className="whitespace-pre-wrap">{data.terms || 'Standard SaaS licensing terms apply.'}</p>
        </div>

      </div>
    </div>
  )
}

export const saasStartupConfig: TemplateConfig = {
  id: 'saas-startup',
  name: 'SaaS Startup',
  description: 'Clean, modern card-based layout perfect for software tools.',
  component: SaaSStartup,
  primaryColor: '#3B82F6',
  secondaryColor: '#EFF6FF',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
