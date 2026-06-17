import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
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
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{data.agencyName}</h2>
            {data.agencyLogo && <img src={data.agencyLogo} alt="Logo" className="h-12 mt-4" />}
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold tracking-widest uppercase rounded-full">
              Contract Agreement
            </span>
          </div>
        </div>

        <div className="space-y-6 max-w-2xl">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {data.title}
          </h1>
          <div className="w-24 h-2 bg-blue-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 gap-12 pt-12 border-t">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Prepared For</h3>
            <p className="text-xl font-medium text-slate-900">{data.clientName}</p>
            {data.clientCompany && <p className="text-slate-500">{data.clientCompany}</p>}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Date</h3>
            <p className="text-xl font-medium text-slate-900">{data.date}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-16 space-y-8">
        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-blue-600">
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
      <div className="p-16 pt-8 mt-8 border-t print:break-inside-avoid">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Acceptance & Signatures</h3>
        <p className="text-slate-500 mb-12">By signing below, the parties agree to the terms and conditions outlined in this contract.</p>
        
        <div className="grid grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="h-16 border-b-2 border-slate-300 flex items-end pb-2">
              {data.signedByName ? (
                <span className="font-serif italic text-2xl text-slate-800">{data.signedByName}</span>
              ) : null}
            </div>
            <div>
              <p className="font-bold text-slate-900">Client Signature</p>
              <p className="text-slate-500">{data.clientName}</p>
              <p className="text-sm text-slate-400 mt-2">Date: {data.signedAt || '_________________'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-16 border-b-2 border-slate-300 flex items-end pb-2">
            </div>
            <div>
              <p className="font-bold text-slate-900">Agency Signature</p>
              <p className="text-slate-500">{data.agencyName}</p>
              <p className="text-sm text-slate-400 mt-2">Date: _________________</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
