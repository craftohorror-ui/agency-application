import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import remarkGfm from 'remark-gfm'


export const freelancerContractConfig: ContractTemplateConfig = {
  id: 'freelancer-contract',
  name: 'Freelancer Contract',
  description: 'A clean, friendly agreement tailored for independent creatives and freelancers.',
  primaryColor: '#F59E0B', // Amber 500
  secondaryColor: '#B45309', // Amber 700
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0',
  component: FreelancerContract
}

export function FreelancerContract({ data }: { data: ContractTemplateData }) {
  return (
    <div className="w-[800px] mx-auto bg-[#FFFAF0] min-h-[1056px] text-slate-800 font-sans shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-[#FFFAF0]">
      {/* Playful Header */}
      <div className="p-16 border-t-[12px] border-amber-500 bg-white shadow-sm print:break-after-page rounded-b-[40px] mb-8 mx-4 mt-0 border-x border-b border-amber-100">
        <div className="flex justify-between items-center mb-12">
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt="Logo" className="h-14" />
          ) : (
            <h2 className="text-3xl font-black tracking-tighter text-amber-600">{data.agencyName}</h2>
          )}
          <div className="text-amber-700 font-bold tracking-widest text-xs uppercase bg-amber-100 px-4 py-2 rounded-full">
            Freelance Agreement
          </div>
        </div>

        <div className="space-y-4 mb-16 text-center">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-lg font-medium text-amber-600 uppercase tracking-widest">Let&apos;s Create Something Great</p>
        </div>

        <div className="flex justify-around items-center pt-8 border-t border-amber-100 border-dashed">
          <div className="text-center">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Freelancer</h3>
            <p className="text-lg font-bold text-slate-900">{data.agencyName}</p>
          </div>
          <div className="h-12 w-px bg-amber-200"></div>
          <div className="text-center">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Client</h3>
            <p className="text-lg font-bold text-slate-900">{data.clientName}</p>
            {data.clientCompany && <p className="text-sm text-slate-500">{data.clientCompany}</p>}
          </div>
          <div className="h-12 w-px bg-amber-200"></div>
          <div className="text-center">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Date</h3>
            <p className="text-lg font-bold text-slate-900">{data.date}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-16 py-8 space-y-8 bg-transparent">
        <div className="prose prose-amber max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-lg">
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
      <div className="p-16 mt-8 border-t-2 border-dashed border-amber-200 print:break-inside-avoid">
        <h3 className="text-3xl font-black text-slate-900 mb-2">The Handshake</h3>
        <p className="text-slate-500 mb-10 text-lg">By signing below, we agree to the terms outlined above and are ready to start working together.</p>
        
        <div className="grid grid-cols-2 gap-12 font-sans">
          <div className="bg-white p-8 rounded-2xl border-2 border-amber-100 shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-100 rounded-full"></div>
            <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-6 relative z-10">Client</h4>
            <div className="h-16 border-b-2 border-amber-200 flex items-end pb-2 relative z-10">
              {data.signedByName ? (
                <span className="font-serif italic text-3xl text-slate-800">{data.signedByName}</span>
              ) : null}
            </div>
            <div className="mt-4 relative z-10">
              <p className="font-bold text-slate-900 text-lg">{data.clientName}</p>
              <p className="text-sm text-slate-500 mt-1">Date: {data.signedAt || '_________________'}</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border-2 border-amber-100 shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-100 rounded-full"></div>
            <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-6 relative z-10">Freelancer</h4>
            <div className="h-16 border-b-2 border-amber-200 flex items-end pb-2 relative z-10">
            </div>
            <div className="mt-4 relative z-10">
              <p className="font-bold text-slate-900 text-lg">{data.agencyName}</p>
              <p className="text-sm text-slate-500 mt-1">Date: _________________</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
