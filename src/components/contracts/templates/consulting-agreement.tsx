import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import { contractDesignTokens } from '@/lib/contractDesignTokens'
import remarkGfm from 'remark-gfm'




export const consultingAgreementConfig: ContractTemplateConfig = {
  id: 'consulting-agreement',
  name: 'Consulting Agreement',
  description: 'A sophisticated, minimalist contract for independent consultants and advisors.',
  primaryColor: '#4F46E5', // Indigo 600
  secondaryColor: '#312E81', // Indigo 900
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0',
  component: ConsultingAgreement
}

export function ConsultingAgreement({ data }: { data: ContractTemplateData }) {
  return (
    <div className="w-[800px] mx-auto bg-white min-h-[1000px] print:min-h-0 text-slate-800 font-serif shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white relative">
      {/* Decorative Sidebar */}
      <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 print:hidden"></div>

      {/* Header */}
      <div className="pt-24 px-20 pb-16">
        <div className="flex justify-between items-start pb-8 mb-16">
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-indigo-600 mb-6 bg-indigo-50 inline-block px-4 py-2 rounded-full border border-indigo-100">Consulting Agreement</h2>
          </div>
          <div className="text-right">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt="Logo" className="h-12 mb-2" />
            ) : (
              <h2 className="text-xl font-bold text-slate-900">{data.agencyName}</h2>
            )}
            <p className="text-sm text-slate-400 font-mono tracking-widest mt-4 uppercase">{data.date}</p>
          </div>
        </div>

        <div className="mb-24">
          <h1 className={`${contractDesignTokens.typography.coverTitle} font-serif`}>
            {data.title}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-16 font-sans bg-indigo-50/50 p-12 rounded-tr-[3rem] rounded-bl-[3rem] border border-indigo-100/50">
          <div>
            <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-[0.2em] mb-4">Consultant</h3>
            <p className="text-2xl font-black text-slate-900">{data.agencyName}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-[0.2em] mb-4">Client</h3>
            <p className="text-2xl font-black text-slate-900">{data.clientName}</p>
            {data.clientCompany && <p className="text-lg text-slate-600 mt-2">{data.clientCompany}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-20 pb-16 space-y-8">
        <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-indigo-900 prose-h2:border-b prose-h2:border-indigo-100 prose-h2:pb-2 prose-p:font-sans prose-p:text-slate-600 prose-p:leading-relaxed">
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
      <div className="px-20 py-20 mt-16 bg-slate-50 print:break-inside-avoid border-t border-slate-200">
        <h3 className="text-3xl font-black text-indigo-900 mb-12 tracking-tight">Signatures</h3>
        
        <div className="grid grid-cols-2 gap-20 font-sans">
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 border border-indigo-100 inline-block px-3 py-1 rounded">Client</h4>
            <div className="h-24 border-b-2 border-slate-300 flex items-end pb-3">
              {data.signedByName ? (
                <span className="font-serif italic text-4xl text-indigo-900">{data.signedByName}</span>
              ) : null}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">{data.clientName}</p>
              <p className="text-xs text-slate-400 mt-4 font-mono tracking-widest uppercase">Date: {data.signedAt || 'PENDING'}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 border border-indigo-100 inline-block px-3 py-1 rounded">Consultant</h4>
            <div className="h-24 border-b-2 border-slate-300 flex items-end pb-3">
            </div>
            <div>
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
