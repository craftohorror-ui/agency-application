import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import remarkGfm from 'remark-gfm'


export const constructionAgreementConfig: ContractTemplateConfig = {
  id: 'construction-agreement',
  name: 'Construction Agreement',
  description: 'A robust, highly structured template tailored for contractors, builders, and trades.',
  primaryColor: '#F97316', // Orange 500
  secondaryColor: '#431407', // Orange 950
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0',
  component: ConstructionAgreement
}

export function ConstructionAgreement({ data }: { data: ContractTemplateData }) {
  return (
    <div className="w-[800px] mx-auto bg-white min-h-[1056px] text-slate-900 font-sans shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white border-x-[16px] border-orange-500">
      {/* Structural Header */}
      <div className="p-16 border-b-4 border-orange-950 bg-stone-50 print:break-after-page">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt="Logo" className="h-16" />
            ) : (
              <h2 className="text-4xl font-black tracking-tighter text-orange-950 uppercase">{data.agencyName}</h2>
            )}
            <p className="text-orange-700 font-bold tracking-widest text-sm uppercase">General Contracting Agreement</p>
          </div>
          <div className="text-right">
            <div className="bg-orange-500 text-white font-bold tracking-widest text-xs uppercase px-4 py-2 border-2 border-orange-950">
              Contract No. {data.id?.split('-')[0] || '1001'}
            </div>
          </div>
        </div>

        <div className="space-y-6 max-w-2xl mt-12 mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            {data.title}
          </h1>
          <div className="w-full h-1 bg-orange-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-0 border-2 border-orange-950 bg-white">
          <div className="p-6 border-r-2 border-orange-950">
            <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Contractor</h3>
            <p className="text-xl font-bold text-slate-900 uppercase">{data.agencyName}</p>
          </div>
          <div className="p-6">
            <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Client / Owner</h3>
            <p className="text-xl font-bold text-slate-900 uppercase">{data.clientName}</p>
            {data.clientCompany && <p className="text-slate-600 font-medium uppercase">{data.clientCompany}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-16 space-y-8 bg-white">
        <div className="prose prose-stone max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-orange-950 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:font-medium">
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
      <div className="p-16 bg-stone-100 border-t-4 border-orange-950 print:break-inside-avoid">
        <h3 className="text-3xl font-black text-orange-950 mb-2 uppercase">Execution of Contract</h3>
        <p className="text-slate-600 mb-10 font-medium">By signing below, the parties agree to be bound by the terms and conditions herein.</p>
        
        <div className="grid grid-cols-2 gap-12 font-sans">
          <div className="bg-white p-6 border-2 border-slate-300 shadow-sm relative">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Client / Owner</h4>
            <div className="h-16 border-b-2 border-slate-800 flex items-end pb-2">
              {data.signedByName ? (
                <span className="font-serif italic text-3xl text-slate-900">{data.signedByName}</span>
              ) : null}
            </div>
            <div className="mt-4">
              <p className="font-bold text-slate-900 uppercase">{data.clientName}</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">Date: {data.signedAt || '_________________'}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 border-2 border-slate-300 shadow-sm relative">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Contractor</h4>
            <div className="h-16 border-b-2 border-slate-800 flex items-end pb-2">
            </div>
            <div className="mt-4">
              <p className="font-bold text-slate-900 uppercase">{data.agencyName}</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">Date: _________________</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
