import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import { contractDesignTokens } from '@/lib/contractDesignTokens'
import remarkGfm from 'remark-gfm'


export const executiveAgreementConfig: ContractTemplateConfig = {
  id: 'executive-agreement',
  name: 'Executive Agreement',
  description: 'A formal, dark-themed template designed for high-level executives and premium clients.',
  primaryColor: '#0F172A',
  secondaryColor: '#D4AF37', // Gold accent
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0',
  component: ExecutiveAgreement
}


export function ExecutiveAgreement({ data }: { data: ContractTemplateData }) {
  return (
    <div className="w-[800px] mx-auto bg-slate-50 min-h-[1000px] print:min-h-0 text-slate-800 font-serif shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white">
      {/* Cover Page */}
      <div className="flex flex-col p-16 print:p-8 bg-slate-900 text-slate-100 print:bg-slate-900 print:break-after-page print:color-adjust-exact">
        <div className="flex justify-between items-start mt-4">
          <div>
            <h2 className="text-3xl font-black tracking-[0.3em] uppercase text-slate-100">{data.agencyName}</h2>
            {data.agencyLogo && <img src={data.agencyLogo} alt="Logo" className="h-16 mt-6 brightness-0 invert" />}
          </div>
        </div>

        <div className="space-y-10 max-w-3xl mt-24 print:mt-12 mb-16 print:mb-8">
          <div className="w-24 h-1 bg-[#D4AF37] mb-8"></div>
          <h1 className={`${contractDesignTokens.typography.coverTitle} tracking-wide uppercase break-words`}>
            {data.title}
          </h1>
          <p className="text-2xl text-slate-400 font-sans tracking-[0.4em] uppercase mt-8 border-l-2 border-[#D4AF37] pl-6">Confidential Agreement</p>
        </div>

        <div className="border-t border-slate-700/50 pt-12 mt-12 print:mt-6">
          <div className="flex flex-wrap gap-8 font-sans">
            <div className="bg-slate-800/50 p-10 rounded border border-slate-700/30 flex-1 min-w-[280px]">
              <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-4">Prepared For</h3>
              <p className="text-2xl font-black text-slate-100 break-words">{data.clientName}</p>
              {data.clientCompany && <p className="text-lg text-slate-400 mt-2 break-words">{data.clientCompany}</p>}
            </div>
            <div className="bg-slate-800/50 p-10 rounded border border-slate-700/30 flex-1 min-w-[280px]">
              <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-4">Effective Date</h3>
              <p className={`text-2xl font-black text-slate-100 break-words ${contractDesignTokens.typography.numeric}`}>{data.date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-16 print:p-8 space-y-8 print:space-y-4 bg-white">
        <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-headings:font-normal prose-p:font-sans prose-p:text-slate-600 prose-p:leading-loose">
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
        <div className="w-16 h-1 bg-[#D4AF37] mb-12 print:mb-6"></div>
        <h3 className="text-4xl font-normal text-slate-900 mb-16 print:mb-8 tracking-widest uppercase">Execution</h3>
        
        <div className="grid grid-cols-2 gap-20 print:gap-10 font-sans">
          <div className="space-y-6">
            <div className="h-24 border-b-2 border-slate-300 flex items-end pb-3">
              {data.signedByName ? (
                <span className="font-serif italic text-4xl text-slate-800">{data.signedByName}</span>
              ) : null}
            </div>
            <div className="pt-2">
              <p className="font-bold text-slate-900 text-lg uppercase tracking-[0.2em]">{data.clientName}</p>
              {data.clientCompany && <p className="text-sm text-slate-500 mt-2">{data.clientCompany}</p>}
              <p className="text-xs text-slate-400 mt-6 font-mono tracking-widest">Date: {data.signedAt || 'PENDING'}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="h-24 border-b-2 border-slate-300 flex items-end pb-3">
            </div>
            <div className="pt-2">
              <p className="font-bold text-slate-900 text-lg uppercase tracking-[0.2em]">{data.agencyName}</p>
              <p className="text-xs text-slate-400 mt-6 font-mono tracking-widest">Date: PENDING</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
