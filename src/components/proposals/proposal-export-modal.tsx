'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileTextIcon, DownloadIcon, Loader2Icon } from 'lucide-react'
import { TemplateData } from '@/lib/templates'
import { TemplateRegistry } from '@/lib/template-registry'
import '@/components/proposals/templates' // Execute registry manifest
import { generateProposalDocx } from '@/lib/docx-generator'
import { saveAs } from 'file-saver'
import { generatePublicLinkAction, updateProposalTemplateAction } from '@/app/dashboard/proposals/actions'
import { useTransition } from 'react'
import { CopyIcon, GlobeIcon, ExternalLinkIcon } from 'lucide-react'

interface ProposalExportModalProps {
  data: TemplateData
  proposalId: string
  initialTemplateId?: string
}

export function ProposalExportModal({ data, proposalId, initialTemplateId }: ProposalExportModalProps) {
  const templates = TemplateRegistry.getAll()
  const [open, setOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId || templates[0]?.id || '')
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingDocx, setIsExportingDocx] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [publicLink, setPublicLink] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const activeTemplateConfig = TemplateRegistry.getById(selectedTemplateId) || templates[0]
  const ActiveComponent = activeTemplateConfig?.component

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id)
    if (id !== initialTemplateId) {
      startTransition(() => {
        updateProposalTemplateAction(proposalId, id).catch(console.error)
      })
    }
  }

  const handleGenerateLink = async () => {
    try {
      setIsGeneratingLink(true)
      const link = await generatePublicLinkAction(proposalId, `Link (${new Date().toLocaleDateString()})`)
      // The absolute URL assumes the app is hosted on window.location.origin
      setPublicLink(`${window.location.origin}/p/${link.token}`)
    } catch (error) {
      console.error('Failed to generate link:', error)
      alert('Failed to generate public link. Please try again.')
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const handleExportDOCX = async () => {
    if (!activeTemplateConfig) return
    try {
      setIsExportingDocx(true)
      const blob = await generateProposalDocx(data, activeTemplateConfig)
      const safeTitle = data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'proposal'
      saveAs(blob, `${safeTitle}_${data.clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`)
    } catch (error) {
      console.error('Failed to export DOCX:', error)
      alert('Failed to export DOCX. Please try again.')
    } finally {
      setIsExportingDocx(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setIsExporting(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (await import('html2pdf.js' as any)).default
      const element = document.getElementById('proposal-export-element')
      
      if (!element) return

      const safeTitle = data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'proposal'
      
      const opt = {
        margin:       0, // CSS handles margins
        filename:     `${safeTitle}_${data.clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('Failed to export PDF:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full sm:w-auto">
          <FileTextIcon className="mr-2 h-4 w-4" />
          Generate Professional Proposal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full flex flex-col p-0 gap-0 overflow-hidden bg-slate-100">
        <DialogHeader className="p-4 border-b bg-white shrink-0 shadow-sm z-10 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">Proposal Export</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Preview and export your proposal.</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button 
              variant="outline" 
              onClick={handleGenerateLink} 
              disabled={isGeneratingLink}
              className="hidden sm:flex"
            >
              {isGeneratingLink ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GlobeIcon className="mr-2 h-4 w-4" />
              )}
              {isGeneratingLink ? 'Generating...' : 'Get Public Link'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportDOCX} 
              disabled={isExportingDocx || !activeTemplateConfig?.supportsDocx}
              title={activeTemplateConfig?.supportsDocx ? 'Export DOCX' : 'DOCX export not supported by this template'}
            >
              {isExportingDocx ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <DownloadIcon className="mr-2 h-4 w-4" />
              )}
              <span className="hidden sm:inline">{isExportingDocx ? 'Generating...' : 'Export DOCX'}</span>
              <span className="sm:hidden">DOCX</span>
            </Button>
            <Button 
              variant="default" 
              onClick={handleExportPDF} 
              disabled={isExporting || !activeTemplateConfig?.supportsPdf}
              title={activeTemplateConfig?.supportsPdf ? 'Export PDF' : 'PDF export not supported by this template'}
            >
              {isExporting ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileTextIcon className="mr-2 h-4 w-4" />
              )}
              <span className="hidden sm:inline">{isExporting ? 'Generating...' : 'Export PDF'}</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </DialogHeader>

        {publicLink && (
          <div className="bg-emerald-50 border-b border-emerald-100 p-3 px-6 flex items-center justify-between text-sm shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-2 text-emerald-800">
              <GlobeIcon className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">Public link ready:</span>
              <a href={publicLink} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-900 flex items-center">
                {publicLink} <ExternalLinkIcon className="ml-1 h-3 w-3" />
              </a>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs bg-white" onClick={() => {
              navigator.clipboard.writeText(publicLink)
              alert('Link copied to clipboard!')
            }}>
              <CopyIcon className="h-3 w-3 mr-2" /> Copy Link
            </Button>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r shrink-0 overflow-y-auto p-4 flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-3">Templates</h3>
              <div className="space-y-2">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`w-full text-left px-3 py-3 rounded-md text-sm transition-all border-2 ${
                      selectedTemplateId === template.id 
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium' 
                        : 'border-transparent hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold">{template.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-y-auto bg-slate-200 p-8 flex justify-center items-start">
            <div className="scale-[0.8] origin-top md:scale-[0.9] lg:scale-100 transition-transform">
               {/* The actual template component */}
               <div id="proposal-export-element" className="print-element">
                  <ActiveComponent data={data} />
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
