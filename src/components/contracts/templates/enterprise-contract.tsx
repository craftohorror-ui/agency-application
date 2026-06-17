import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
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
    <div className="w-[800px] mx-auto bg-white min-h-[1056px] text-slate-800 font-serif shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white border-l-2 border-slate-200">
      {/* Formal Header */}
      <div className="p-16 border-b-2 border-sky-900 print:break-after-page">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-xl font-bold tracking-widest text-sky-900 uppercase">Enterprise Agreement</h2>
            <p className="text-sm text-slate-500 font-sans tracking-widest mt-1">Ref: ENT-{data.id?.substring(0, 8) || '00000000'}</p>
          </div>
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt="Logo" className="h-10" />
          ) : (
            <h2 className="text-xl font-black text-slate-900">{data.agencyName}</h2>
          )}
        </div>

        <div className="space-y-6 max-w-2xl mt-24 mb-24">
          <h1 className="text-4xl font-normal text-slate-900 leading-snug">
            {data.title}
          </h1>
          <p className="text-lg text-slate-500 font-sans">Strictly Confidential</p>
        </div>

        <div className="grid grid-cols-2 gap-12 font-sans border-t border-slate-200 pt-8">
          <div>
            <h3 className="text-xs font-bold text-sky-700 uppercase tracking-widest mb-2">Party A (Provider)</h3>
            <p className="text-base font-bold text-slate-900">{data.agencyName}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-sky-700 uppercase tracking-widest mb-2">Party B (Client)</h3>
            <p className="text-base font-bold text-slate-900">{data.clientName}</p>
            {data.clientCompany && <p className="text-sm text-slate-600">{data.clientCompany}</p>}
          </div>
        </div>
        <div className="mt-8 font-sans">
            <h3 className="text-xs font-bold text-sky-700 uppercase tracking-widest mb-2">Effective Date</h3>
            <p className="text-base font-bold text-slate-900">{data.date}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-16 space-y-8 bg-white text-justify">
        <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-sky-900 prose-headings:font-normal prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-p:font-serif prose-p:text-slate-800 prose-p:leading-loose">
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
      <div className="p-16 pt-12 mt-8 border-t border-slate-300 print:break-inside-avoid">
        <h3 className="text-xl font-normal text-slate-900 mb-8 uppercase tracking-widest">Signatures</h3>
        
        <div className="grid grid-cols-2 gap-16 font-sans">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-8">For and on behalf of Party B</h4>
            <div className="h-16 border-b border-slate-400 flex items-end pb-2">
              {data.signedByName ? (
                <span className="font-serif italic text-2xl text-slate-900">{data.signedByName}</span>
              ) : null}
            </div>
            <div className="pt-2">
              <p className="font-bold text-slate-900">{data.clientName}</p>
              {data.clientCompany && <p className="text-xs text-slate-500">{data.clientCompany}</p>}
              <p className="text-xs text-slate-400 mt-2">Date: {data.signedAt || '_________________'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-8">For and on behalf of Party A</h4>
            <div className="h-16 border-b border-slate-400 flex items-end pb-2">
            </div>
            <div className="pt-2">
              <p className="font-bold text-slate-900">{data.agencyName}</p>
              <p className="text-xs text-slate-400 mt-2">Date: _________________</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
