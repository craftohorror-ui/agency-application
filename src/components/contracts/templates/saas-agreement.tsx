import React from 'react'
import { ContractTemplateData, ContractTemplateConfig } from '@/lib/contract-template-registry'
import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'
import ReactMarkdown from 'react-markdown'
import { PremiumMarkdownComponents } from '../premium-markdown'
import { contractDesignTokens } from '@/lib/contractDesignTokens'
import remarkGfm from 'remark-gfm'


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
    <div className="w-[800px] mx-auto bg-slate-900 min-h-[1000px] print:min-h-0 text-slate-300 font-sans shadow-sm print:shadow-none print:w-full print:max-w-none print:bg-slate-900">
      {/* Cover Page */}
      <div className="min-h-[1000px] print:min-h-0 flex flex-col justify-between print:block p-16 print:p-8 border-t-4 border-violet-500 relative overflow-hidden print:break-after-page">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 print:hidden"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-4 mt-6">
            {data.agencyLogo ? (
              <img src={data.agencyLogo} alt="Logo" className="h-14 brightness-0 invert" />
            ) : null}
            <h2 className="text-2xl font-black tracking-widest uppercase text-white">{data.agencyName}</h2>
          </div>
          <div className="text-right">
            <span className="inline-block px-5 py-2.5 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-mono tracking-widest uppercase rounded">
              Software as a Service
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-8 print:space-y-4 max-w-3xl mt-20 print:mt-10">
          <div className="inline-block px-4 py-1.5 bg-slate-800 text-slate-300 text-xs font-mono mb-4 rounded border border-slate-700 tracking-widest uppercase">
            Terms of Service / MSA
          </div>
          <h1 className={`${contractDesignTokens.typography.coverTitle} text-white`}>
            {data.title}
          </h1>
          <p className="text-xl text-slate-400 font-mono tracking-wider mt-4">v{data.version} — <span className="text-violet-400">Generated on {data.date}</span></p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-12 pt-16 print:pt-8 mt-auto print:mt-16 border-t border-slate-800">
          <div className="bg-slate-800/40 p-10 rounded-2xl border border-slate-700/50">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-[0.2em] mb-4 font-mono">Customer Entity</h3>
            <p className="text-3xl font-black text-white tracking-tight">{data.clientName}</p>
            {data.clientCompany && <p className="text-lg text-slate-400 mt-2">{data.clientCompany}</p>}
          </div>
          <div className="bg-slate-800/40 p-10 rounded-2xl border border-slate-700/50">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-[0.2em] mb-4 font-mono">Provider Entity</h3>
            <p className="text-3xl font-black text-white tracking-tight">{data.agencyName}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-16 print:p-8 space-y-8 print:space-y-4 bg-slate-50 text-slate-800">
        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-violet-600">
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
      <div className="p-16 print:p-8 pt-12 mt-0 bg-slate-900 border-t border-slate-800 print:break-inside-avoid text-slate-300">
        <h3 className="text-3xl font-black text-white tracking-tight mb-4">Digital Authorization</h3>
        <p className="text-lg text-slate-500 mb-16 print:mb-8 text-sm max-w-2xl leading-relaxed">This agreement constitutes a binding legal contract when signed by authorized representatives. All digital signatures are recorded securely.</p>
        
        <div className="grid grid-cols-2 gap-16 print:gap-8 font-sans">
          <div className="bg-slate-800/30 p-10 border border-slate-700/50 rounded-2xl shadow-sm">
            <h4 className="text-xs font-bold text-violet-400 uppercase tracking-[0.2em] mb-4 font-mono">Customer Signature</h4>
            <div className="h-24 border-b border-slate-700 flex items-end pb-3 mb-6">
              {data.signedByName ? (
                <span className="font-serif italic text-4xl text-white">{data.signedByName}</span>
              ) : null}
            </div>
            <div>
              <p className="font-bold text-white text-lg tracking-tight">{data.clientName}</p>
              <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-widest">IP: {data.signerIp || 'Pending'}</p>
              <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-widest">Timestamp: {data.signedAt || 'Pending'}</p>
            </div>
          </div>
          
          <div className="bg-slate-800/30 p-10 border border-slate-700/50 rounded-2xl shadow-sm">
            <h4 className="text-xs font-bold text-violet-400 uppercase tracking-[0.2em] mb-4 font-mono">Provider Signature</h4>
            <div className="h-24 border-b border-slate-700 flex items-end pb-3 mb-6">
            </div>
            <div>
              <p className="font-bold text-white text-lg tracking-tight">{data.agencyName}</p>
              <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-widest">Timestamp: Pending</p>
            </div>
          </div>
        </div>
      </div>
    
        <AgencyTemplateFooter data={data} type="contract" />
      </div>
  )
}
