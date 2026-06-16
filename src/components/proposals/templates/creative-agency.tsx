import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function CreativeAgency({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen font-sans text-slate-800 shadow-xl overflow-hidden print:shadow-none print:max-w-none">
      {/* Header / Hero */}
      <div 
        className="px-12 py-20 text-white flex flex-col justify-end print:break-inside-avoid print:color-adjust-exact"
        style={{ 
          background: `linear-gradient(135deg, ${data.brandColor || '#8B5CF6'} 0%, #1E1B4B 100%)`,
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        <div className="flex justify-between items-start mb-16">
          <div>
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-16 w-auto object-contain" />
            ) : (
              <h2 className="text-3xl font-extrabold tracking-tighter">{data.agencyName}</h2>
            )}
          </div>
          <div className="text-right text-white/80 space-y-1">
            <p className="font-medium text-white">{data.date}</p>
            {data.agencyEmail && <p>{data.agencyEmail}</p>}
            {data.agencyPhone && <p>{data.agencyPhone}</p>}
          </div>
        </div>

        <div>
          <p className="text-white/70 font-semibold tracking-widest uppercase mb-4 text-sm">Project Proposal</p>
          <h1 className="text-6xl font-black tracking-tight leading-none mb-6">{data.title}</h1>
          <p className="text-2xl text-white/90 max-w-2xl">Prepared exclusively for <span className="font-bold text-white">{data.clientName}</span> {data.clientCompany && `at ${data.clientCompany}`}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-12 space-y-16">
        
        {/* Scope & Deliverables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 print:break-inside-avoid">
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4" style={{ color: data.brandColor || '#8B5CF6' }}>01. Scope of Work</h3>
            <div className="prose prose-slate prose-p:leading-relaxed">
              <p className="whitespace-pre-wrap">{data.scope || 'Scope of work details will be provided here.'}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4" style={{ color: data.brandColor || '#8B5CF6' }}>02. Deliverables</h3>
            <div className="prose prose-slate prose-p:leading-relaxed">
              <p className="whitespace-pre-wrap">{data.deliverables || 'Specific deliverables will be listed here.'}</p>
            </div>
          </div>
        </div>

        {/* Timeline & Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 print:break-inside-avoid">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4" style={{ color: data.brandColor || '#8B5CF6' }}>03. Project Timeline</h3>
            <p className="text-lg font-medium whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4" style={{ color: data.brandColor || '#8B5CF6' }}>04. Payment Terms</h3>
            <p className="text-lg font-medium whitespace-pre-wrap">{data.terms || 'TBD'}</p>
          </div>
        </div>

        {/* Investment */}
        <div className="print:break-inside-avoid">
          <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-8" style={{ color: data.brandColor || '#8B5CF6' }}>05. Investment</h3>
          
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm tracking-wider uppercase text-slate-500">
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold text-center">Qty</th>
                  <th className="p-4 font-semibold text-right">Price</th>
                  <th className="p-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium">{item.description}</td>
                    <td className="p-4 text-center text-slate-500">{item.qty}</td>
                    <td className="p-4 text-right text-slate-500">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-right font-semibold">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white" style={{ backgroundColor: data.brandColor || '#1E1B4B' }}>
                  <td colSpan={3} className="p-6 text-right text-lg font-medium">Total Investment</td>
                  <td className="p-6 text-right text-2xl font-bold">${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export const creativeAgencyConfig: TemplateConfig = {
  id: 'creative-agency',
  name: 'Creative Agency',
  description: 'Bold gradient header with large typography for creative teams.',
  component: CreativeAgency,
  primaryColor: '#8B5CF6',
  secondaryColor: '#1E1B4B',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
