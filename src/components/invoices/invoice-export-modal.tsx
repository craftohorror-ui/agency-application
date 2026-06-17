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
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedTemplateId === t.id 
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{t.name}</h4>
                  {isPending && selectedTemplateId === t.id && (
                    <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                <div className="flex gap-2 mt-3">
                  <span className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: t.primaryColor }} />
                  <span className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: t.secondaryColor }} />
                </div>
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
