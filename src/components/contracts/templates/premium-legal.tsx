import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import { contractDesignTokens } from '@/lib/contractDesignTokens'
import remarkGfm from 'remark-gfm'


export const premiumLegalConfig: ContractTemplateConfig = {
  id: 'premium-legal',
  name: 'Premium Legal',
  description: 'A highly formal, traditional contract template emphasizing legal rigor and clarity.',
  primaryColor: '#1F2937', // Gray 800
  secondaryColor: '#4B5563', // Gray 600
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0',
  component: PremiumLegal
}

export function PremiumLegal({ data }: { data: ContractTemplateData }) {
  return (
    <div className="w-[800px] mx-auto bg-white min-h-[1000px] print:min-h-0 text-black font-serif shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white">
      {/* Formal Header */}
      <div className="p-16 print:p-8 border-b-2 border-black print:break-after-page">
        <div className="flex justify-between items-center mb-16 print:mb-8">
          <div className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500 border border-gray-200 px-4 py-2">
            Confidential Legal Document
          </div>
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt="Logo" className="h-14 grayscale" />
          ) : (
            <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-black">{data.agencyName}</h2>
          )}
        </div>

        <div className="text-center space-y-8 print:space-y-4 my-32">
          <h1 className={`${contractDesignTokens.typography.coverTitle} uppercase text-black border-y-[3px] border-black py-12 px-8 leading-tight mx-auto max-w-4xl`}>
            {data.title}
          </h1>
        </div>

        <div className="mt-24 print:mt-12 space-y-10 text-center">
          <p className="uppercase tracking-[0.4em] text-gray-500 font-bold text-sm">This Agreement is made on</p>
          <p className={`font-serif italic text-3xl ${contractDesignTokens.typography.numeric}`}>{data.date}</p>
          <div className="w-16 h-px bg-black mx-auto my-12"></div>
          <p className="uppercase tracking-[0.4em] text-gray-500 font-bold text-sm">Between</p>
          <p className="font-bold text-3xl uppercase tracking-widest">{data.agencyName}</p>
          <p className="uppercase tracking-[0.4em] text-gray-500 font-bold text-sm my-6">And</p>
          <p className="font-bold text-3xl uppercase tracking-widest">{data.clientName}</p>
          {data.clientCompany && <p className="font-bold text-xl uppercase tracking-widest text-gray-700">{data.clientCompany}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="p-16 print:p-8 space-y-8 print:space-y-4 bg-white text-justify leading-relaxed">
        <div className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:uppercase prose-headings:text-black prose-p:font-serif prose-p:text-black prose-p:leading-loose">
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
      <div className="p-16 print:p-8 pt-20 print:pt-10 mt-16 print:mt-8 print:break-inside-avoid border-t-[3px] border-black bg-gray-50">
        <h3 className="text-3xl font-black uppercase tracking-[0.3em] text-black mb-12 print:mb-6 text-center">Execution</h3>
        <p className="text-black mb-16 print:mb-8 text-center font-serif text-xl max-w-2xl mx-auto leading-relaxed italic">IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the date first above written.</p>
        
        <div className="grid grid-cols-2 gap-20 print:gap-10 font-serif">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 text-center mb-12 print:mb-6 border border-gray-300 py-2 bg-white">Client</h4>
            <div className="h-24 border-b-2 border-black flex items-end justify-center pb-3">
              {data.signedByName ? (
                <span className="italic text-4xl text-black">{data.signedByName}</span>
              ) : null}
            </div>
            <div className="text-center pt-6">
              <p className="font-bold text-black uppercase tracking-widest text-lg">{data.clientName}</p>
              {data.clientCompany && <p className="text-sm text-gray-700 uppercase tracking-widest mt-2">{data.clientCompany}</p>}
              <p className="text-xs text-gray-500 mt-6 font-sans tracking-widest uppercase">Date: {data.signedAt || 'PENDING'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 text-center mb-12 print:mb-6 border border-gray-300 py-2 bg-white">Agency</h4>
            <div className="h-24 border-b-2 border-black flex items-end justify-center pb-3">
            </div>
            <div className="text-center pt-6">
              <p className="font-bold text-black uppercase tracking-widest text-lg">{data.agencyName}</p>
              <p className="text-xs text-gray-500 mt-6 font-sans tracking-widest uppercase">Date: PENDING</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
