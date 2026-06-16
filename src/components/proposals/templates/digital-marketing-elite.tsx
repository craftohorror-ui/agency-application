import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function DigitalMarketingElite({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen font-sans text-slate-800 shadow-2xl print:shadow-none print:max-w-none">
      
      {/* Sidebar Layout */}
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* Left Column (Brand) */}
        <div className="md:w-1/3 p-10 flex flex-col justify-between print:color-adjust-exact print:break-inside-avoid" style={{ backgroundColor: data.brandColor || '#ec4899', color: '#fff', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div>
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-12 w-auto object-contain mb-8 filter brightness-0 invert" />
            ) : (
              <h2 className="text-2xl font-black mb-8 tracking-tight">{data.agencyName}</h2>
            )}
            
            <div className="space-y-6">
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Proposal For</p>
                <p className="text-xl font-bold">{data.clientName}</p>
                <p className="text-white/80">{data.clientCompany}</p>
              </div>
              
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Date</p>
                <p className="text-white/80">{data.date}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-sm text-white/70 space-y-2">
            <p className="font-bold text-white">{data.agencyName}</p>
            <p>{data.agencyEmail}</p>
            <p>{data.agencyPhone}</p>
          </div>
        </div>

        {/* Right Column (Content) */}
        <div className="md:w-2/3 p-12 lg:p-16 flex flex-col gap-12 bg-white">
          
          <div className="print:break-inside-avoid">
            <h1 className="text-4xl font-black text-slate-900 leading-none mb-4">{data.title}</h1>
            <div className="w-16 h-2 mb-8" style={{ backgroundColor: data.brandColor || '#ec4899' }}></div>
          </div>

          <div className="print:break-inside-avoid">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">Strategy & Scope</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.scope || 'Digital marketing strategy outline.'}</p>
          </div>

          <div className="print:break-inside-avoid">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">Campaign Deliverables</h3>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.deliverables || 'Specific marketing deliverables.'}</p>
            </div>
          </div>

          <div className="print:break-inside-avoid">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-6">Investment</h3>
            <table className="w-full text-left text-sm mb-6">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-3 font-bold text-slate-900">Item</th>
                  <th className="py-3 font-bold text-slate-900 text-center">Qty</th>
                  <th className="py-3 font-bold text-slate-900 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-4 text-slate-700">{item.description}</td>
                    <td className="py-4 text-center text-slate-500">{item.qty}</td>
                    <td className="py-4 text-right font-medium text-slate-900">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-xl print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <span className="font-bold uppercase tracking-widest text-sm">Total Campaign Budget</span>
              <span className="text-2xl font-black">${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="print:break-inside-avoid border-t border-slate-200 pt-8">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">Timeline & Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div>
                <strong className="block text-slate-900 mb-2">Timeline</strong>
                <p className="text-slate-600 whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
              </div>
              <div>
                <strong className="block text-slate-900 mb-2">Terms</strong>
                <p className="text-slate-600 whitespace-pre-wrap">{data.terms || 'TBD'}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export const digitalMarketingEliteConfig: TemplateConfig = {
  id: 'digital-marketing-elite',
  name: 'Digital Marketing Elite',
  description: 'Vibrant sidebar layout perfect for digital agencies and ad campaigns.',
  component: DigitalMarketingElite,
  primaryColor: '#ec4899',
  secondaryColor: '#ffffff',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
