import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'


export const saasAgreementConfig: ContractTemplateConfig = {
  id: 'saas-agreement',
  name: 'SaaS Agreement',
  description: 'A tech-forward template designed for software, APIs, and cloud services.',
  primaryColor: '#8B5CF6', // Violet 500
  secondaryColor: '#4C1D95', // Violet 900
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0',
  component: SaasAgreement
}

export function SaasAgreement({ data }: { data: ContractTemplateData }) {
  return (
    <div className="w-[800px] mx-auto bg-slate-900 min-h-[1056px] text-slate-300 font-sans shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-slate-900">
      {/* Cover Page */}
      <div className="h-[1056px] flex flex-col justify-between p-16 border-t-4 border-violet-500 relative overflow-hidden print:break-after-page">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 print:hidden"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-4">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt="Logo" className="h-10 brightness-0 invert" />
            ) : null}
            <h2 className="text-xl font-bold tracking-tight text-white">{data.agencyName}</h2>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-mono tracking-widest uppercase rounded">
              Software as a Service
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="inline-block px-3 py-1 bg-slate-800 text-slate-400 text-sm font-mono mb-4 rounded border border-slate-700">
            Terms of Service / MSA
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-lg text-slate-400 font-mono">v{data.version} — Generated on {data.date}</p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 pt-12 border-t border-slate-800">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2 font-mono">Customer Entity</h3>
            <p className="text-lg font-bold text-white">{data.clientName}</p>
            {data.clientCompany && <p className="text-sm text-slate-400">{data.clientCompany}</p>}
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2 font-mono">Provider Entity</h3>
            <p className="text-lg font-bold text-white">{data.agencyName}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-16 space-y-8 bg-slate-50 text-slate-800">
        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-violet-600 whitespace-pre-wrap">
          {data.body}
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
      <div className="p-16 pt-12 mt-0 bg-slate-100 border-t border-slate-200 print:break-inside-avoid text-slate-900">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Digital Authorization</h3>
        <p className="text-slate-500 mb-10 text-sm">This agreement constitutes a binding legal contract when signed by authorized representatives.</p>
        
        <div className="grid grid-cols-2 gap-12 font-sans">
          <div className="bg-white p-6 border border-slate-200 rounded shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Customer Signature</h4>
            <div className="h-16 border-b-2 border-slate-200 flex items-end pb-2 mb-4">
              {data.signedByName ? (
                <span className="font-serif italic text-2xl text-slate-800">{data.signedByName}</span>
              ) : null}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{data.clientName}</p>
              <p className="text-xs text-slate-500 mt-1">IP: {data.signerIp || 'Pending'}</p>
              <p className="text-xs text-slate-500 mt-1">Timestamp: {data.signedAt || 'Pending'}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 border border-slate-200 rounded shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Provider Signature</h4>
            <div className="h-16 border-b-2 border-slate-200 flex items-end pb-2 mb-4">
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{data.agencyName}</p>
              <p className="text-xs text-slate-500 mt-1">Timestamp: Pending</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
