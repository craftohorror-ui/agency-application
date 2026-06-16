import React from 'react'
import { TemplateData } from '@/lib/templates'
import { TemplateConfig } from '@/lib/template-registry'

function CreativePortfolio({ data }: { data: TemplateData }) {
  return (
    <div className="max-w-4xl mx-auto bg-[#faf9f6] min-h-screen font-serif text-[#2d2d2d] shadow-2xl print:shadow-none print:max-w-none">
      {/* Hero */}
      <div className="relative pt-32 pb-24 px-16 text-center print:break-inside-avoid overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: data.brandColor || '#e86a58' }}></div>
        <h2 className="text-sm font-sans tracking-[0.3em] uppercase text-[#888] mb-8">{data.agencyName}</h2>
        <h1 className="text-6xl font-normal leading-tight mb-8 relative z-10">{data.title}</h1>
        <div className="h-0.5 w-16 mx-auto mb-8 relative z-10" style={{ backgroundColor: data.brandColor || '#e86a58' }}></div>
        <p className="text-xl font-sans text-[#555] relative z-10">Prepared for <strong>{data.clientName}</strong> &mdash; {data.date}</p>
      </div>

      <div className="px-16 py-16 space-y-20">
        {/* Concept */}
        <div className="print:break-inside-avoid flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3">
            <h3 className="text-3xl font-normal mb-2">The Concept</h3>
            <p className="text-sm font-sans text-[#888] uppercase tracking-widest">Scope of Work</p>
          </div>
          <div className="md:w-2/3 prose prose-stone font-sans text-[#444] prose-p:leading-loose">
            <p className="whitespace-pre-wrap">{data.scope || 'Describe the creative concept and scope here.'}</p>
          </div>
        </div>

        <div className="h-px w-full bg-[#eee]"></div>

        {/* Deliverables */}
        <div className="print:break-inside-avoid flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3">
            <h3 className="text-3xl font-normal mb-2">The Output</h3>
            <p className="text-sm font-sans text-[#888] uppercase tracking-widest">Deliverables</p>
          </div>
          <div className="md:w-2/3 font-sans text-[#444] text-lg leading-relaxed border-l-4 pl-8" style={{ borderColor: data.brandColor || '#e86a58' }}>
            <p className="whitespace-pre-wrap">{data.deliverables || 'List the creative deliverables.'}</p>
          </div>
        </div>

        <div className="h-px w-full bg-[#eee]"></div>

        {/* Investment */}
        <div className="print:break-inside-avoid">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-normal mb-2">The Investment</h3>
            <p className="text-sm font-sans text-[#888] uppercase tracking-widest">Cost Breakdown</p>
          </div>
          
          <div className="font-sans border border-[#eee] bg-white">
            {data.items.map((item, idx) => (
              <div key={item.id || idx} className="flex justify-between items-center p-6 border-b border-[#eee] last:border-0">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.description}</h4>
                  <p className="text-sm text-[#888]">Qty: {item.qty} &times; ${item.unitPrice.toLocaleString()}</p>
                </div>
                <div className="text-xl font-normal">
                  ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
            <div className="p-8 text-center" style={{ backgroundColor: `${data.brandColor}10` || '#e86a5810' }}>
              <p className="text-sm uppercase tracking-widest text-[#666] mb-2">Total Project Fee</p>
              <p className="text-4xl font-semibold" style={{ color: data.brandColor || '#e86a58' }}>${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        {/* Logistics */}
        <div className="grid md:grid-cols-2 gap-16 print:break-inside-avoid">
          <div className="bg-white p-8 border border-[#eee]">
            <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-[#888] mb-4">Timeline & Schedule</h4>
            <p className="font-sans text-[#444] whitespace-pre-wrap">{data.timeline || 'TBD'}</p>
          </div>
          <div className="bg-white p-8 border border-[#eee]">
            <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-[#888] mb-4">Engagement Terms</h4>
            <p className="font-sans text-[#444] whitespace-pre-wrap">{data.terms || 'TBD'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const creativePortfolioConfig: TemplateConfig = {
  id: 'creative-portfolio',
  name: 'Creative Portfolio',
  description: 'Editorial, magazine-style layout for design agencies and freelancers.',
  component: CreativePortfolio,
  primaryColor: '#e86a58',
  secondaryColor: '#faf9f6',
  supportsPdf: true,
  supportsDocx: true,
  version: '1.0.0'
}
