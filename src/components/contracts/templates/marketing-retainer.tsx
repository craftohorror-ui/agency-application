import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import { contractDesignTokens } from '@/lib/contractDesignTokens'
import remarkGfm from 'remark-gfm'


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

        <div className="relative z-10 flex justify-between items-start mb-16">
          <div className="mt-8">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt="Logo" className="h-16" />
            ) : (
              <h2 className="text-4xl font-black tracking-tighter text-rose-600">{data.agencyName}</h2>
            )}
          </div>
          <span className="font-bold text-rose-900 tracking-[0.2em] text-sm uppercase bg-rose-100/50 px-4 py-2 rounded-full border border-rose-200/50 mt-8">Retainer Agreement</span>
        </div>

        <div className="relative z-10 space-y-10 max-w-3xl mt-24 mb-24">
          <h1 className={`${contractDesignTokens.typography.coverTitle} text-rose-950`}>
            {data.title}
          </h1>
          <div className="w-24 h-4 bg-rose-500 rounded-full"></div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-16 bg-white p-12 shadow-sm border border-rose-100 rounded-[2.5rem]">
          <div>
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-[0.2em] mb-4">Prepared For</h3>
            <p className="text-2xl font-black text-rose-950">{data.clientName}</p>
            {data.clientCompany && <p className="text-lg text-rose-700 mt-2">{data.clientCompany}</p>}
          </div>
          <div>
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-[0.2em] mb-4">Effective Date</h3>
            <p className="text-2xl font-black text-rose-950">{data.date}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-16 py-8 space-y-8 bg-white mx-8 rounded-3xl shadow-sm border border-rose-50 mb-16">
        <div className="prose prose-rose max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-rose-950 prose-p:text-slate-600 prose-p:leading-loose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={PremiumMarkdownComponents}>
            {data.body}
          </ReactMarkdown>
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
      <div className="p-20 bg-rose-950 text-rose-50 print:break-inside-avoid">
        <h3 className="text-5xl font-black mb-8 text-white tracking-tight">Let&apos;s Get Started</h3>
        <p className="text-rose-200 mb-16 max-w-xl text-lg leading-relaxed">Please sign below to authorize the commencement of our partnership. All digital signatures are legally binding.</p>
        
        <div className="grid grid-cols-2 gap-20 font-sans">
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-[0.2em] bg-rose-900/50 inline-block px-3 py-1 rounded-full border border-rose-800">Client Approval</h4>
            <div className="h-24 border-b-2 border-rose-800 flex items-end pb-3">
              {data.signedByName ? (
                <span className="font-serif italic text-4xl text-white">{data.signedByName}</span>
              ) : null}
            </div>
            <div>
              <p className="font-bold text-white text-xl tracking-tight">{data.clientName}</p>
              <p className="text-xs text-rose-300 mt-4 font-mono tracking-widest uppercase">Date: {data.signedAt || 'PENDING'}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-[0.2em] bg-rose-900/50 inline-block px-3 py-1 rounded-full border border-rose-800">Agency Approval</h4>
            <div className="h-24 border-b-2 border-rose-800 flex items-end pb-3">
            </div>
            <div>
              <p className="font-bold text-white text-xl tracking-tight">{data.agencyName}</p>
              <p className="text-xs text-rose-300 mt-4 font-mono tracking-widest uppercase">Date: PENDING</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
