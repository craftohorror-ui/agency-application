import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import { contractDesignTokens } from '@/lib/contractDesignTokens'
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
    <div className="w-[800px] mx-auto bg-white min-h-[1000px] print:min-h-0 text-slate-900 font-sans shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white border-x-[16px] border-orange-500">
      {/* Structural Header */}
      <div className="p-16 print:p-8 border-b-4 border-orange-950 bg-stone-50 print:break-after-page">
        <div className="flex justify-between items-start mb-16 print:mb-8">
          <div className="space-y-4">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt="Logo" className="h-16 mt-4" />
            ) : (
              <h2 className="text-4xl font-black tracking-tighter text-orange-950 uppercase mt-4">{data.agencyName}</h2>
            )}
            <p className="text-orange-700 font-black tracking-[0.2em] text-sm uppercase bg-orange-100/50 print:bg-orange-50 inline-block px-3 py-1">General Contracting Agreement</p>
          </div>
          <div className="text-right">
            <div className="bg-orange-500 text-white font-black tracking-widest text-xs uppercase px-5 py-3 border-2 border-orange-950 shadow-[4px_4px_0_0_#431407]">
              Contract No. {data.id?.split('-')[0] || '1001'}
            </div>
          </div>
        </div>

        <div className="space-y-8 print:space-y-4 max-w-4xl mt-24 print:mt-12 mb-24 print:mb-12">
          <h1 className={`${contractDesignTokens.typography.coverTitle} uppercase`}>
            {data.title}
          </h1>
          <div className="w-full h-2 bg-orange-500"></div>
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
      <div className="p-16 print:p-8 space-y-8 print:space-y-4 bg-white">
        <div className="prose prose-stone max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-orange-950 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:font-medium">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={PremiumMarkdownComponents}>
            {data.body}
          </ReactMarkdown>
              {data.termsConditions && (
                <div className="mt-12 print:mt-6 pt-8 border-t border-slate-200">
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
      <div className="p-16 print:p-8 bg-stone-100 border-t-8 border-orange-950 print:break-inside-avoid">
        <h3 className="text-4xl font-black text-orange-950 mb-4 uppercase tracking-tight">Execution of Contract</h3>
        <p className="text-slate-600 mb-16 print:mb-8 font-medium text-xl max-w-2xl">By signing below, the parties agree to be bound by the terms and conditions herein.</p>
        
        <div className="grid grid-cols-2 gap-16 print:gap-8 font-sans">
          <div className="bg-white p-10 border-4 border-slate-300 shadow-[8px_8px_0_0_#cbd5e1] relative">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 bg-slate-100 inline-block px-3 py-1 border border-slate-300">Client / Owner</h4>
            <div className="h-24 border-b-4 border-slate-800 flex items-end pb-3">
              {data.signedByName ? (
                <span className="font-serif italic text-4xl text-slate-900">{data.signedByName}</span>
              ) : null}
            </div>
            <div className="mt-6">
              <p className="font-black text-slate-900 text-xl uppercase">{data.clientName}</p>
              <p className="text-xs text-slate-500 mt-4 font-black tracking-widest uppercase">Date: {data.signedAt || 'PENDING'}</p>
            </div>
          </div>
          
          <div className="bg-white p-10 border-4 border-slate-300 shadow-[8px_8px_0_0_#cbd5e1] relative">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 bg-slate-100 inline-block px-3 py-1 border border-slate-300">Contractor</h4>
            <div className="h-24 border-b-4 border-slate-800 flex items-end pb-3">
            </div>
            <div className="mt-6">
              <p className="font-black text-slate-900 text-xl uppercase">{data.agencyName}</p>
              <p className="text-xs text-slate-500 mt-4 font-black tracking-widest uppercase">Date: PENDING</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
