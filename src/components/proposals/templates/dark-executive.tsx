import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function DarkExecutive({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-[#121212] min-h-screen font-sans text-slate-300 shadow-2xl print:shadow-none print:max-w-none print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      {/* Sidebar/Header hybrid */}
      <div className="flex border-b border-slate-800 print:break-inside-avoid">
        <div className="w-1/3 bg-[#0a0a0a] p-12 flex flex-col justify-between print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div>
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt={data.agencyName} className="h-10 w-auto object-contain mb-12" style={{ filter: 'brightness(0) invert(1)' }} />
            ) : (
              <h2 className="text-xl font-bold text-white mb-12 tracking-wide">{data.agencyName}</h2>
            )}
            
            <div className="space-y-6 text-sm">
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] mb-1">Prepared For</p>
                <p className="text-white font-medium">{data.clientName}</p>
                <p>{data.clientCompany}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] mb-1">Date</p>
                <p className="text-white">{data.date}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-2/3 p-12 flex items-center bg-[#1a1a1a] print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-xs mb-4" style={{ color: data.brandColor || '#38bdf8' }}>Executive Proposal</p>
            <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">{data.title}</h1>
          </div>
        </div>
      </div>

      <div className="p-12 space-y-16">
        
        {/* Scope */}
        <div className="print:break-inside-avoid">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-slate-700"></div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Project Scope</h3>
          </div>
          <div className="pl-12">
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{data.scope || 'Scope of work details.'}</p>
          </div>
        </div>

        {/* Deliverables */}
        <div className="print:break-inside-avoid">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-slate-700"></div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Deliverables</h3>
          </div>
          <div className="pl-12">
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{data.deliverables || 'Deliverables list.'}</p>
          </div>
        </div>

        {/* Investment */}
        <div className="print:break-inside-avoid">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-slate-700"></div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Financial Overview</h3>
          </div>
          <div className="pl-12">
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#0a0a0a]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1a1a1a] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Description</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-center">Qty</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">Price</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-6 py-4 text-white">{item.description}</td>
                      <td className="px-6 py-4 text-center text-slate-400">{item.qty}</td>
                      <td className="px-6 py-4 text-right text-slate-400">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-right text-white font-medium">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-slate-700 bg-[#1a1a1a]">
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-right font-bold text-slate-400 uppercase tracking-widest text-xs">Total Amount</td>
                    <td className="px-6 py-6 text-right font-bold text-xl" style={{ color: data.brandColor || '#38bdf8' }}>${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Timeline & Terms */}
        <div className="grid grid-cols-2 gap-12 print:break-inside-avoid pl-12">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-slate-800">
            <h4 className="text-white font-bold mb-2 tracking-wide">Timeline</h4>
            <p className="text-slate-500 text-sm whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-slate-800">
            <h4 className="text-white font-bold mb-2 tracking-wide">Terms</h4>
            <p className="text-slate-500 text-sm whitespace-pre-wrap">{data.terms || 'Standard terms.'}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export const darkExecutiveConfig: TemplateConfig = {
  id: 'dark-executive',
  name: 'Dark Executive',
  description: 'Premium dark mode aesthetic for modern executive presentations.',
  component: DarkExecutive,
  primaryColor: '#38bdf8',
  secondaryColor: '#121212',
  supportsPdf: true,
  supportsDocx: false, // Dark background templates do not translate well to DOCX
  version: '1.0.0'
}
