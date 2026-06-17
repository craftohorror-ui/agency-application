import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
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
    <div className="w-[800px] mx-auto bg-white min-h-[1056px] text-slate-800 font-serif shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-white relative">
      {/* Decorative Sidebar */}
      <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 print:hidden"></div>

      {/* Header */}
      <div className="pt-24 px-20 pb-16">
        <div className="flex justify-between items-end border-b-2 border-indigo-100 pb-8 mb-12">
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-indigo-600 mb-2">Consulting Agreement</h2>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              {data.title}
            </h1>
          </div>
          <div className="text-right">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt="Logo" className="h-10 mb-2" />
            ) : (
              <h2 className="text-xl font-bold text-slate-900">{data.agencyName}</h2>
            )}
            <p className="text-sm text-slate-500 font-sans">{data.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 font-sans bg-indigo-50/50 p-8 rounded-tr-3xl rounded-bl-3xl">
          <div>
            <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-2">Consultant</h3>
            <p className="text-base font-bold text-slate-900">{data.agencyName}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-2">Client</h3>
            <p className="text-base font-bold text-slate-900">{data.clientName}</p>
            {data.clientCompany && <p className="text-sm text-slate-600">{data.clientCompany}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-20 pb-16 space-y-8">
        <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-indigo-900 prose-h2:border-b prose-h2:border-indigo-100 prose-h2:pb-2 prose-p:font-sans prose-p:text-slate-600 prose-p:leading-relaxed">
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
      <div className="px-20 py-16 mt-8 bg-slate-50 print:break-inside-avoid">
        <h3 className="text-2xl font-bold text-indigo-900 mb-10">Signatures</h3>
        
        <div className="grid grid-cols-2 gap-16 font-sans">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Client</h4>
            <div className="h-20 border-b border-slate-300 flex items-end pb-2">
              {data.signedByName ? (
                <span className="font-serif italic text-3xl text-indigo-900">{data.signedByName}</span>
              ) : null}
            </div>
            <div>
              <p className="font-bold text-slate-900">{data.clientName}</p>
              <p className="text-sm text-slate-500 mt-2">Date: {data.signedAt || '_________________'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Consultant</h4>
            <div className="h-20 border-b border-slate-300 flex items-end pb-2">
            </div>
            <div>
              <p className="font-bold text-slate-900">{data.agencyName}</p>
              <p className="text-sm text-slate-500 mt-2">Date: _________________</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
