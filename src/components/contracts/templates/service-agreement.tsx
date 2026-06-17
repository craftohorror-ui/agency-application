import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import { contractDesignTokens } from '@/lib/contractDesignTokens'
import remarkGfm from 'remark-gfm'


export const serviceAgreementConfig: ContractTemplateConfig = {
  id: 'service-agreement',
  name: 'Service Agreement',
  description: 'A standard service agreement with a structured, professional layout.',
  primaryColor: '#059669', // Emerald 600
  secondaryColor: '#064E3B', // Emerald 900
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0',
  component: ServiceAgreement
}

export function ServiceAgreement({ data }: { data: ContractTemplateData }) {
  return (
    <div className="w-[800px] mx-auto bg-white min-h-[1056px] text-slate-800 font-sans shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white">
      {/* Header Page */}
      <div className="p-16 border-t-[16px] border-emerald-600 bg-emerald-50/30 print:break-after-page">
        <div className="flex justify-between items-start mb-16">
          <div className="mt-4">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt="Logo" className="h-16" />
            ) : (
              <h2 className="text-3xl font-black tracking-tight text-emerald-900 uppercase">{data.agencyName}</h2>
            )}
          </div>
          <div className="text-emerald-800 font-bold uppercase tracking-widest text-xs border-2 border-emerald-200 bg-emerald-100 px-5 py-2.5 rounded mt-4">
            Master Services Agreement
          </div>
        </div>

        <div className="space-y-8 mb-24 mt-24">
          <h1 className={`${contractDesignTokens.typography.coverTitle} text-emerald-950 border-l-8 border-emerald-600 pl-8`}>
            {data.title}
          </h1>
          <p className="text-2xl text-emerald-700 font-bold uppercase tracking-[0.2em] pl-8">Contract Reference: MSA-{new Date(data.date).getFullYear()}-{data.version}</p>
        </div>

        <div className="grid grid-cols-2 gap-12 bg-white p-12 rounded-[2rem] shadow-sm border-[3px] border-emerald-100 mt-20">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-2">Service Provider</h3>
              <p className="text-2xl font-black text-slate-900">{data.agencyName}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-2">Effective Date</h3>
              <p className="text-xl font-bold text-slate-700">{data.date}</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-2">Client</h3>
              <p className="text-2xl font-black text-slate-900">{data.clientName}</p>
              {data.clientCompany && <p className="text-lg text-slate-600 mt-1">{data.clientCompany}</p>}
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-2">Status</h3>
              <p className="text-xl font-bold text-slate-700 capitalize">{data.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-16 space-y-8 bg-white">
        <div className="prose prose-slate max-w-none prose-headings:text-emerald-900 prose-p:text-slate-700 prose-p:leading-relaxed">
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
      <div className="p-16 pt-16 mt-16 border-t-4 border-emerald-100 bg-emerald-50/20 print:break-inside-avoid">
        <h3 className="text-4xl font-black text-emerald-900 mb-4 tracking-tight">Authorization</h3>
        <p className="text-slate-500 mb-16 text-xl max-w-2xl leading-relaxed">This agreement is executed by the authorized representatives of both parties.</p>
        
        <div className="grid grid-cols-2 gap-16">
          <div className="bg-white p-10 rounded-2xl border-2 border-emerald-100 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-[0.2em] bg-emerald-50 inline-block px-3 py-1 rounded">Client</h4>
            <div className="h-24 border-b-2 border-dashed border-emerald-200 flex items-end pb-3">
              {data.signedByName ? (
                <span className="font-serif italic text-4xl text-slate-800">{data.signedByName}</span>
              ) : null}
            </div>
            <div className="pt-2">
              <p className="font-bold text-slate-900 text-xl tracking-tight">{data.clientName}</p>
              {data.clientCompany && <p className="text-sm text-slate-500 mt-1">{data.clientCompany}</p>}
              <p className="text-xs text-slate-400 mt-4 font-mono uppercase tracking-widest">Date: {data.signedAt || 'Pending'}</p>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-2xl border-2 border-emerald-100 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-[0.2em] bg-emerald-50 inline-block px-3 py-1 rounded">Service Provider</h4>
            <div className="h-24 border-b-2 border-dashed border-emerald-200 flex items-end pb-3">
            </div>
            <div className="pt-2">
              <p className="font-bold text-slate-900 text-xl tracking-tight">{data.agencyName}</p>
              <p className="text-xs text-slate-400 mt-8 font-mono uppercase tracking-widest">Date: Pending</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
