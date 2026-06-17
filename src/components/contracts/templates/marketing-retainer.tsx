import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const marketingRetainerConfig: ContractTemplateConfig = {
  id: 'marketing-retainer',
  name: 'Marketing Retainer',
  description: 'A vibrant, creative contract template ideal for marketing and design agencies.',
  primaryColor: '#F43F5E', // Rose 500
  secondaryColor: '#881337', // Rose 900
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0',
  component: MarketingRetainer
}

export function MarketingRetainer({ data }: { data: ContractTemplateData }) {
  return (
    <div className="w-[800px] mx-auto bg-[#FFF5F6] min-h-[1056px] text-slate-800 font-sans shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-[#FFF5F6]">
      {/* Dynamic Header */}
      <div className="p-16 pb-12 relative overflow-hidden print:break-after-page">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-bl-[100%] opacity-10"></div>
        <div className="absolute -top-12 left-12 w-32 h-32 bg-rose-300 rounded-full opacity-20"></div>

        <div className="relative z-10 flex justify-between items-center mb-16">
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt="Logo" className="h-12" />
          ) : (
            <h2 className="text-2xl font-black tracking-tighter text-rose-600">{data.agencyName}</h2>
          )}
          <span className="font-bold text-rose-900 tracking-wider text-sm uppercase">Retainer Agreement</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-2xl mt-12 mb-16">
          <h1 className="text-6xl font-black text-rose-950 tracking-tight leading-[1.1]">
            {data.title}
          </h1>
          <div className="w-20 h-3 bg-rose-500"></div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 bg-white p-8 shadow-sm border border-rose-100 rounded-2xl">
          <div>
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Prepared For</h3>
            <p className="text-xl font-bold text-rose-950">{data.clientName}</p>
            {data.clientCompany && <p className="text-rose-700">{data.clientCompany}</p>}
          </div>
          <div>
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Effective Date</h3>
            <p className="text-xl font-bold text-rose-950">{data.date}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-16 py-8 space-y-8 bg-white mx-8 rounded-3xl shadow-sm border border-rose-50 mb-16">
        <div className="prose prose-rose max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-rose-950 prose-p:text-slate-600 prose-p:leading-loose whitespace-pre-wrap">
          {data.body}
              {data.termsConditions && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Agency Terms & Conditions</h4>
                  <div className="whitespace-pre-wrap">{data.termsConditions}</div>
                </div>
              )}
              {data.privacyPolicy && (
                <div className="mt-8">
                  <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Privacy Policy</h4>
                  <div className="whitespace-pre-wrap">{data.privacyPolicy}</div>
                </div>
              )}
        </div>
      </div>

      {/* Signatures */}
      <div className="p-16 bg-rose-950 text-rose-50 print:break-inside-avoid">
        <h3 className="text-3xl font-black mb-8 text-white">Let&apos;s Get Started</h3>
        <p className="text-rose-200 mb-12 max-w-md">Please sign below to authorize the commencement of our partnership.</p>
        
        <div className="grid grid-cols-2 gap-16 font-sans">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider">Client Approval</h4>
            <div className="h-16 border-b-2 border-rose-800 flex items-end pb-2">
              {data.signedByName ? (
                <span className="font-serif italic text-3xl text-white">{data.signedByName}</span>
              ) : null}
            </div>
            <div>
              <p className="font-bold text-white">{data.clientName}</p>
              <p className="text-sm text-rose-300 mt-2">Date: {data.signedAt || '_________________'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider">Agency Approval</h4>
            <div className="h-16 border-b-2 border-rose-800 flex items-end pb-2">
            </div>
            <div>
              <p className="font-bold text-white">{data.agencyName}</p>
              <p className="text-sm text-rose-300 mt-2">Date: _________________</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
