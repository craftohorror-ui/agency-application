import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
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
    <div className="w-[800px] mx-auto bg-slate-50 min-h-[1056px] text-slate-800 font-serif shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white">
      {/* Cover Page */}
      <div className="h-[1056px] flex flex-col justify-between p-16 bg-slate-900 text-slate-100 print:bg-slate-900 print:break-after-page print:color-adjust-exact">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-widest uppercase text-slate-100">{data.agencyName}</h2>
            {data.agencyLogo && <img src={data.agencyLogo} alt="Logo" className="h-12 mt-4 brightness-0 invert" />}
          </div>
        </div>

        <div className="space-y-6 max-w-2xl">
          <div className="w-16 h-1 bg-[#D4AF37] mb-8"></div>
          <h1 className="text-5xl font-normal tracking-wide leading-tight uppercase">
            {data.title}
          </h1>
          <p className="text-xl text-slate-400 font-sans tracking-widest uppercase mt-4">Confidential Agreement</p>
        </div>

        <div className="border-t border-slate-700 pt-12">
          <div className="grid grid-cols-2 gap-12 font-sans">
            <div>
              <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Prepared For</h3>
              <p className="text-lg font-medium text-slate-100">{data.clientName}</p>
              {data.clientCompany && <p className="text-sm text-slate-400">{data.clientCompany}</p>}
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Effective Date</h3>
              <p className="text-lg font-medium text-slate-100">{data.date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-16 space-y-8 bg-white">
        <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-headings:font-normal prose-p:font-sans prose-p:text-slate-600 prose-p:leading-loose">
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
      <div className="p-16 pt-8 mt-8 border-t bg-white print:break-inside-avoid">
        <div className="w-12 h-1 bg-[#D4AF37] mb-8"></div>
        <h3 className="text-3xl font-normal text-slate-900 mb-12">Execution</h3>
        
        <div className="grid grid-cols-2 gap-16 font-sans">
          <div className="space-y-4">
            <div className="h-20 border-b border-slate-300 flex items-end pb-2">
              {data.signedByName ? (
                <span className="font-serif italic text-3xl text-slate-800">{data.signedByName}</span>
              ) : null}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm uppercase tracking-widest">{data.clientName}</p>
              {data.clientCompany && <p className="text-xs text-slate-500 mt-1">{data.clientCompany}</p>}
              <p className="text-xs text-slate-400 mt-4">Date: {data.signedAt || '_________________'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-20 border-b border-slate-300 flex items-end pb-2">
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm uppercase tracking-widest">{data.agencyName}</p>
              <p className="text-xs text-slate-400 mt-4">Date: _________________</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
