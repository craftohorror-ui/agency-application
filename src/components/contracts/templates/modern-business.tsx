import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import { contractDesignTokens } from '@/lib/contractDesignTokens'
import remarkGfm from 'remark-gfm'


export const modernBusinessContractConfig: ContractTemplateConfig = {
  id: 'modern-business',
  name: 'Modern Business',
  description: 'A clean, professional contract with a modern layout and clear typography.',
  primaryColor: '#2563EB',
  secondaryColor: '#1E293B',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0',
  component: ModernBusinessContract
}

export function ModernBusinessContract({ data }: { data: ContractTemplateData }) {
  return (
    <div className="w-[800px] mx-auto bg-white min-h-[1056px] text-slate-800 font-sans shadow-sm print:shadow-none print:w-full print:max-w-none">
      {/* Cover Page */}
      <div className="h-[1056px] flex flex-col justify-between p-16 border-b-8 border-blue-600 print:break-after-page">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">{data.agencyName}</h2>
            {data.agencyLogo && <img src={data.agencyLogo} alt="Logo" className="h-14 mt-6" />}
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-3 px-5 py-2.5 ${contractDesignTokens.colors.modernBusiness.bg} rounded-full`}>
              <span className={`w-2 h-2 rounded-full ${contractDesignTokens.colors.modernBusiness.accent.split(' ')[0]}`}></span>
              <span className={`text-xs font-bold tracking-widest uppercase ${contractDesignTokens.colors.modernBusiness.text}`}>
                Contract Agreement
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8 max-w-3xl mt-20">
          <h1 className={contractDesignTokens.typography.coverTitle}>
            {data.title}
          </h1>
          <div className={`w-32 h-2 ${contractDesignTokens.colors.modernBusiness.accent.split(' ')[0]} rounded-full`}></div>
        </div>

        <div className="grid grid-cols-2 gap-16 pt-16 mt-auto border-t border-slate-200">
          <div>
            <h3 className={contractDesignTokens.typography.metadata}>Prepared For</h3>
            <p className="text-2xl font-bold text-slate-900 mt-3">{data.clientName}</p>
            {data.clientCompany && <p className="text-lg text-slate-500 mt-1">{data.clientCompany}</p>}
          </div>
          <div>
            <h3 className={contractDesignTokens.typography.metadata}>Effective Date</h3>
            <p className="text-2xl font-bold text-slate-900 mt-3">{data.date}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-16 space-y-8">
        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-blue-600">
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
      <div className="p-16 pt-12 mt-24 border-t-2 border-slate-100 print:break-inside-avoid">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Acceptance & Signatures</h3>
        <p className="text-lg text-slate-500 mb-16 max-w-2xl leading-relaxed">By signing below, the parties agree to the terms and conditions outlined in this contract, acknowledging full understanding and mutual consent.</p>
        
        <div className="grid grid-cols-2 gap-20">
          <div className="space-y-6">
            <div className="h-24 border-b-2 border-slate-300 flex items-end pb-3">
              {data.signedByName ? (
                <span className="font-serif italic text-4xl text-slate-800">{data.signedByName}</span>
              ) : null}
            </div>
            <div>
              <p className={contractDesignTokens.typography.signatureTitle}>Client Signature</p>
              <p className={contractDesignTokens.typography.signatureValue}>{data.clientName}</p>
              {data.clientCompany && <p className="text-slate-500">{data.clientCompany}</p>}
              <p className="text-sm text-slate-400 mt-4 font-mono bg-slate-50 inline-block px-3 py-1 rounded">Date: {data.signedAt || 'PENDING'}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="h-24 border-b-2 border-slate-300 flex items-end pb-3">
            </div>
            <div>
              <p className={contractDesignTokens.typography.signatureTitle}>Agency Signature</p>
              <p className={contractDesignTokens.typography.signatureValue}>{data.agencyName}</p>
              <p className="text-sm text-slate-400 mt-4 font-mono bg-slate-50 inline-block px-3 py-1 rounded">Date: PENDING</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
