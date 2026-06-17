'use client'

import React, { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, Download, Loader2 } from 'lucide-react'
import { invoiceTemplates, InvoiceTemplateData } from '@/lib/invoice-template-registry'
import { toast } from 'sonner'
import { updateInvoiceTemplateAction } from '@/app/dashboard/invoices/actions'

interface InvoiceExportModalProps {
  invoiceId: string
  initialTemplateId: string
  templateData: InvoiceTemplateData
}

export function InvoiceExportModal({ invoiceId, initialTemplateId, templateData }: InvoiceExportModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId || invoiceTemplates[0]?.id || 'modern-business')
  const [isPending, startTransition] = useTransition()
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [isExportingDocx, setIsExportingDocx] = useState(false)

  const selectedTemplate = invoiceTemplates.find(t => t.id === selectedTemplateId) || invoiceTemplates[0]

  async function handleExportPdf() {
    setIsExportingPdf(true)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/export?template=${selectedTemplateId}`)
      if (!res.ok) throw new Error('Failed to generate PDF')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice_${invoiceId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('PDF downloaded successfully')
    } catch (err) {
      console.error(err)
      toast.error('Failed to download PDF')
    } finally {
      setIsExportingPdf(false)
    }
  }

  async function handleExportDocx() {
    setIsExportingDocx(true)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/export-docx?template=${selectedTemplateId}`)
      if (!res.ok) throw new Error('Failed to generate DOCX')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice_${invoiceId}.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('DOCX downloaded successfully')
    } catch (err) {
      console.error(err)
      toast.error('Failed to download DOCX')
    } finally {
      setIsExportingDocx(false)
    }
  }

  function handleTemplateSelect(tId: string) {
    setSelectedTemplateId(tId)
    startTransition(async () => {
      try {
        await updateInvoiceTemplateAction(invoiceId, tId)
        toast.success('Default template updated')
      } catch (err) {
        toast.error('Failed to save template selection')
      }
    })
  }

  if (!selectedTemplate) return null

  const TemplateComponent = selectedTemplate.component

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export / Preview
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-[1200px] w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b shrink-0 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">Invoice Export</DialogTitle>
            <p className="text-sm text-muted-foreground">Preview and export your invoice.</p>
          </div>
          <div className="flex items-center gap-2 pr-8">
            <Button variant="outline" onClick={handleExportDocx} disabled={isExportingDocx || !selectedTemplate.supportsDocx} className="gap-2">
              {isExportingDocx ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Export DOCX
            </Button>
            <Button onClick={handleExportPdf} disabled={isExportingPdf || !selectedTemplate.supportsPdf} className="gap-2">
              {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden bg-slate-50">
          {/* Left Sidebar - Templates */}
          <div className="w-80 shrink-0 border-r bg-white overflow-y-auto p-4 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Templates</h3>
            {invoiceTemplates.map(t => (
              <div 
                key={t.id}
                onClick={() => handleTemplateSelect(t.id)}
                className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                  selectedTemplateId === t.id 
                    ? 'border-blue-600 bg-blue-50/30 shadow-md ring-1 ring-blue-600/20' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                }`}
              >
                {/* CSS Thumbnail Mockup */}
                <div className="h-24 mb-4 rounded border bg-white flex shadow-sm overflow-hidden select-none opacity-80 group-hover:opacity-100 transition-opacity">
                  {t.id === 'consulting-invoice' /* Creative Studio */ && (
                    <div className="w-2 h-full" style={{ backgroundColor: t.primaryColor }} />
                  )}
                  <div className="flex-1 p-2 flex flex-col gap-1.5">
                    {/* Header Mock */}
                    {t.id === 'executive-invoice' ? (
                      <div className="flex flex-col items-center gap-1 border-b pb-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primaryColor }} />
                        <div className="w-12 h-1.5 rounded" style={{ backgroundColor: t.primaryColor }} />
                      </div>
                    ) : (
                      <div className="flex justify-between items-center pb-1">
                        <div className="w-10 h-2 rounded" style={{ backgroundColor: t.primaryColor }} />
                        <div className="w-8 h-1.5 bg-slate-200 rounded" />
                      </div>
                    )}
                    
                    {/* Body Mock */}
                    <div className={`flex ${t.id === 'saas-invoice' ? 'flex-col gap-1' : 'justify-between gap-2'} mt-1`}>
                      <div className={`w-8 h-6 rounded ${t.id === 'saas-invoice' ? 'w-full border' : 'bg-slate-100'}`} />
                      <div className={`w-12 h-6 rounded ${t.id === 'saas-invoice' ? 'w-full border' : 'bg-slate-100'}`} />
                    </div>
                    
                    {/* Table Mock */}
                    <div className="mt-auto space-y-0.5">
                      <div className="w-full h-1 bg-slate-200" />
                      <div className="w-full h-1 bg-slate-100" />
                      <div className="w-full h-1 bg-slate-100" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1.5 relative z-10">
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  {isPending && selectedTemplateId === t.id && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed relative z-10">{t.description}</p>
                
                {selectedTemplateId === t.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                )}
              </div>
            ))}
          </div>

          {/* Main Area - Preview */}
          <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100/50">
            <div className="origin-top" style={{ transform: 'scale(0.85)' }}>
              <div className="shadow-2xl overflow-hidden ring-1 ring-black/5 bg-white">
                <TemplateComponent data={templateData} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
