import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function RealEstateDevelopment({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-stone-50 min-h-screen font-serif text-stone-800 shadow-xl print:shadow-none print:max-w-none">
      
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-16 text-center print:color-adjust-exact print:break-inside-avoid" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        <h3 className="uppercase tracking-[0.3em] text-xs font-sans text-stone-400 mb-8">{data.agencyName}</h3>
        <h1 className="text-5xl font-light mb-6 font-serif">{data.title}</h1>
        <div className="w-16 h-px bg-stone-500 mx-auto mb-6"></div>
        <p className="font-sans font-light uppercase tracking-widest text-sm text-stone-300">Investment Proposal for {data.clientName}</p>
      </div>

      <div className="px-16 py-16 space-y-16">
        
        {/* Project Summary */}
        <div className="print:break-inside-avoid text-center">
          <h3 className="font-sans uppercase tracking-widest text-sm font-semibold text-stone-900 mb-6">Project Summary</h3>
          <p className="text-stone-600 leading-loose text-lg whitespace-pre-wrap max-w-2xl mx-auto">{data.scope || 'Real estate development overview.'}</p>
        </div>

        <div className="w-full h-px bg-stone-200 my-8"></div>

        {/* Milestones / Deliverables */}
        <div className="print:break-inside-avoid">
          <h3 className="font-sans uppercase tracking-widest text-sm font-semibold text-stone-900 mb-6 text-center">Development Milestones</h3>
          <p className="text-stone-600 leading-loose whitespace-pre-wrap text-center max-w-2xl mx-auto">{data.deliverables || 'Phases and milestones.'}</p>
        </div>

        <div className="w-full h-px bg-stone-200 my-8"></div>

        {/* Financials */}
        <div className="print:break-inside-avoid">
          <h3 className="font-sans uppercase tracking-widest text-sm font-semibold text-stone-900 mb-8 text-center">Capital Investment</h3>
          
          <div className="border border-stone-200 bg-white p-8">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-widest text-xs">
                  <th className="pb-4 font-medium">Phase / Asset</th>
                  <th className="pb-4 font-medium text-center">Units</th>
                  <th className="pb-4 font-medium text-right">Cost</th>
                  <th className="pb-4 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-4 text-stone-900 font-medium">{item.description}</td>
                    <td className="py-4 text-center text-stone-500">{item.qty}</td>
                    <td className="py-4 text-right text-stone-500">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 text-right text-stone-900 font-medium">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-stone-900">
                  <td colSpan={3} className="pt-6 pb-2 text-right uppercase tracking-widest text-xs font-semibold">Total Estimated Capital</td>
                  <td className="pt-6 pb-2 text-right text-xl font-bold text-stone-900">${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Timeline & Terms */}
        <div className="grid grid-cols-2 gap-12 print:break-inside-avoid font-sans text-sm">
          <div>
            <h4 className="uppercase tracking-widest font-semibold text-stone-900 mb-4">Projected Timeline</h4>
            <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">{data.timeline || 'TBD'}</p>
          </div>
          <div>
            <h4 className="uppercase tracking-widest font-semibold text-stone-900 mb-4">Investment Terms</h4>
            <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">{data.terms || 'TBD'}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export const realEstateDevelopmentConfig: TemplateConfig = {
  id: 'real-estate-development',
  name: 'Real Estate Development',
  description: 'Sophisticated, stone-toned serif layout for property and development proposals.',
  component: RealEstateDevelopment,
  primaryColor: '#1c1917',
  secondaryColor: '#fafaf9',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
