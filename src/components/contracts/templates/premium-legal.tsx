import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
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
    <div className="w-[800px] mx-auto bg-white min-h-[1056px] text-black font-serif shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white">
      {/* Formal Header */}
      <div className="p-16 border-b-2 border-black print:break-after-page">
        <div className="flex justify-between items-center mb-16">
          <div className="text-sm font-bold uppercase tracking-widest text-gray-500">
            Confidential Legal Document
          </div>
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt="Logo" className="h-12 grayscale" />
          ) : (
            <h2 className="text-xl font-bold uppercase tracking-widest text-black">{data.agencyName}</h2>
          )}
        </div>

        <div className="text-center space-y-6 my-24">
          <h1 className="text-5xl font-bold uppercase tracking-widest text-black border-y-2 border-black py-8 leading-tight">
            {data.title}
          </h1>
        </div>

        <div className="mt-24 space-y-8 text-center text-lg">
          <p className="uppercase tracking-widest text-gray-600 font-bold">This Agreement is made on</p>
          <p className="font-bold text-xl">{data.date}</p>
          <div className="w-12 h-px bg-black mx-auto my-8"></div>
          <p className="uppercase tracking-widest text-gray-600 font-bold">Between</p>
          <p className="font-bold text-xl uppercase">{data.agencyName}</p>
          <p className="uppercase tracking-widest text-gray-600 font-bold text-sm my-4">And</p>
          <p className="font-bold text-xl uppercase">{data.clientName}</p>
          {data.clientCompany && <p className="font-bold text-lg uppercase text-gray-700">{data.clientCompany}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="p-16 space-y-8 bg-white text-justify leading-relaxed">
        <div className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:uppercase prose-headings:text-black prose-p:font-serif prose-p:text-black prose-p:leading-loose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
      <div className="p-16 pt-12 mt-8 print:break-inside-avoid border-t-2 border-black">
        <h3 className="text-xl font-bold uppercase tracking-widest text-black mb-12 text-center">Execution</h3>
        <p className="text-black mb-12 text-center font-serif">IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the date first above written.</p>
        
        <div className="grid grid-cols-2 gap-16 font-serif">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-600 text-center mb-8">Client</h4>
            <div className="h-20 border-b border-black flex items-end justify-center pb-2">
              {data.signedByName ? (
                <span className="italic text-3xl text-black">{data.signedByName}</span>
              ) : null}
            </div>
            <div className="text-center pt-2">
              <p className="font-bold text-black uppercase">{data.clientName}</p>
              {data.clientCompany && <p className="text-sm text-gray-700 uppercase">{data.clientCompany}</p>}
              <p className="text-sm text-gray-500 mt-2">Date: {data.signedAt || '_________________'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-600 text-center mb-8">Agency</h4>
            <div className="h-20 border-b border-black flex items-end justify-center pb-2">
            </div>
            <div className="text-center pt-2">
              <p className="font-bold text-black uppercase">{data.agencyName}</p>
              <p className="text-sm text-gray-500 mt-2">Date: _________________</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
