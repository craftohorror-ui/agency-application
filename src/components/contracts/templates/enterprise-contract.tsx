import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import { contractDesignTokens } from '@/lib/contractDesignTokens'
import remarkGfm from 'remark-gfm'


export const enterpriseContractConfig: ContractTemplateConfig = {
  id: 'enterprise-contract',
  name: 'Enterprise Contract',
  description: 'A comprehensive, multi-page layout designed for large-scale enterprise agreements.',
  primaryColor: '#0369A1', // Sky 700
  secondaryColor: '#082F49', // Sky 900
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0',
  component: EnterpriseContract
}

export function EnterpriseContract({ data }: { data: ContractTemplateData }) {
  return (
    <div className="w-[800px] mx-auto bg-white min-h-[1000px] print:min-h-0 text-slate-800 font-serif shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white border-l-2 border-slate-200">
      {/* Formal Header */}
      <div className="p-16 print:p-8 border-b-2 border-sky-900 print:break-after-page">
        <div className="flex justify-between items-center mb-16 print:mb-8 mt-6">
          <div>
            <h2 className="text-2xl font-bold tracking-[0.2em] text-sky-900 uppercase">Enterprise Agreement</h2>
            <p className="text-sm text-slate-500 font-sans tracking-widest mt-2 uppercase bg-slate-50 inline-block px-3 py-1 mt-4 border border-slate-200">Ref: ENT-{data.id?.substring(0, 8) || '00000000'}</p>
          </div>
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt="Logo" className="h-12" />
          ) : (
            <h2 className="text-xl font-black text-slate-900">{data.agencyName}</h2>
          )}
        </div>

        <div className="space-y-8 print:space-y-4 max-w-4xl mt-32 mb-32">
          <h1 className={`${contractDesignTokens.typography.coverTitle} font-serif`}>
            {data.title}
          </h1>
          <p className="text-xl text-slate-400 font-sans uppercase tracking-[0.3em] font-bold mt-8 border-l-4 border-sky-700 pl-4">Strictly Confidential</p>
        </div>

        <div className="grid grid-cols-2 gap-16 print:gap-8 font-sans border-t border-slate-200 pt-16 print:pt-8">
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-sky-700 uppercase tracking-[0.2em] mb-4">Party A (Provider)</h3>
            <p className="text-2xl font-black text-slate-900">{data.agencyName}</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-sky-700 uppercase tracking-[0.2em] mb-4">Party B (Client)</h3>
            <p className="text-2xl font-black text-slate-900">{data.clientName}</p>
            {data.clientCompany && <p className="text-lg text-slate-600 mt-2">{data.clientCompany}</p>}
          </div>
        </div>
        <div className="mt-8 font-sans bg-slate-50 p-8 rounded-xl border border-slate-200 inline-block w-full">
            <h3 className="text-xs font-bold text-sky-700 uppercase tracking-[0.2em] mb-4">Effective Date</h3>
            <p className={`text-xl font-bold text-slate-900 ${contractDesignTokens.typography.numeric}`}>{data.date}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-16 print:p-8 space-y-8 print:space-y-4 bg-white text-justify">
        <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-sky-900 prose-headings:font-normal prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-p:font-serif prose-p:text-slate-800 prose-p:leading-loose">
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
      <div className="p-16 print:p-8 pt-16 print:pt-8 mt-16 print:mt-8 border-t-2 border-slate-200 bg-slate-50 print:break-inside-avoid">
        <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-widest font-sans">Signatures</h3>
        
        <div className="grid grid-cols-2 gap-20 print:gap-10 font-sans">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8 bg-white p-2 border border-slate-200 inline-block rounded">For and on behalf of Party B</h4>
            <div className="h-24 border-b-2 border-slate-400 flex items-end pb-3">
              {data.signedByName ? (
                <span className="font-serif italic text-4xl text-slate-900">{data.signedByName}</span>
              ) : null}
            </div>
            <div className="pt-4">
              <p className="font-bold text-slate-900 text-lg">{data.clientName}</p>
              {data.clientCompany && <p className="text-sm text-slate-500 mt-1">{data.clientCompany}</p>}
              <p className="text-xs text-slate-400 mt-4 font-mono tracking-widest uppercase">Date: {data.signedAt || 'PENDING'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8 bg-white p-2 border border-slate-200 inline-block rounded">For and on behalf of Party A</h4>
            <div className="h-24 border-b-2 border-slate-400 flex items-end pb-3">
            </div>
            <div className="pt-4">
              <p className="font-bold text-slate-900 text-lg">{data.agencyName}</p>
              <p className="text-xs text-slate-400 mt-4 font-mono tracking-widest uppercase">Date: PENDING</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
