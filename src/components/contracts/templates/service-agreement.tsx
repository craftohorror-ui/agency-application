import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
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
      <div className="p-16 border-t-8 border-emerald-600 bg-emerald-50/50 print:break-after-page">
        <div className="flex justify-between items-center mb-16">
          {data.agencyLogo ? (
            <img src={data.agencyLogo} alt="Logo" className="h-14" />
          ) : (
            <h2 className="text-2xl font-bold tracking-tight text-emerald-900">{data.agencyName}</h2>
          )}
          <div className="text-emerald-800 font-semibold uppercase tracking-wider text-sm border border-emerald-200 bg-emerald-100 px-4 py-1.5 rounded-md">
            Master Services Agreement
          </div>
        </div>

        <div className="space-y-4 mb-16">
          <h1 className="text-5xl font-extrabold text-emerald-900 tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-xl text-emerald-700">Contract Reference: MSA-{new Date(data.date).getFullYear()}-{data.version}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-sm border border-emerald-100">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Service Provider</h3>
              <p className="text-lg font-bold text-slate-900">{data.agencyName}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Effective Date</h3>
              <p className="font-medium text-slate-700">{data.date}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Client</h3>
              <p className="text-lg font-bold text-slate-900">{data.clientName}</p>
              {data.clientCompany && <p className="text-slate-600">{data.clientCompany}</p>}
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Status</h3>
              <p className="font-medium text-slate-700 capitalize">{data.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-16 space-y-8 bg-white">
        <div className="prose prose-slate max-w-none prose-headings:text-emerald-900 prose-p:text-slate-700 prose-p:leading-relaxed">
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
      <div className="p-16 pt-8 mt-8 border-t bg-emerald-50/30 print:break-inside-avoid">
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">Authorization</h3>
        <p className="text-slate-500 mb-10">This agreement is executed by the authorized representatives of both parties.</p>
        
        <div className="grid grid-cols-2 gap-12">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Client</h4>
            <div className="h-16 border-b border-dashed border-slate-300 flex items-end pb-2">
              {data.signedByName ? (
                <span className="font-serif italic text-2xl text-slate-800">{data.signedByName}</span>
              ) : null}
            </div>
            <div>
              <p className="font-bold text-slate-900">{data.clientName}</p>
              {data.clientCompany && <p className="text-sm text-slate-500">{data.clientCompany}</p>}
              <p className="text-xs text-slate-400 mt-2">Date: {data.signedAt || 'Pending'}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Service Provider</h4>
            <div className="h-16 border-b border-dashed border-slate-300 flex items-end pb-2">
            </div>
            <div>
              <p className="font-bold text-slate-900">{data.agencyName}</p>
              <p className="text-xs text-slate-400 mt-6">Date: Pending</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
