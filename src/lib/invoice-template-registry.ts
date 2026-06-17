import { ElementType } from 'react'

export interface InvoiceTemplateData {
  id?: string
  number: string
  issueDate: string
  dueDate: string
  status: string
  currency: string
  
  // Client Info
  clientName: string
  clientCompany?: string
  
  // Agency Info
  agencyName: string
  agencyLogo?: string
  brandColor?: string
  agencyPhone?: string
  agencyEmail?: string
  agencyWebsite?: string
  
  // Project Info
  projectName?: string
  contractReference?: string
  
  // Line Items & Totals
  items: Array<{ description: string, qty: number, unit_price: number }>
  subtotal: number
  discountType: 'percentage' | 'fixed'
  discountValue: number
  discountAmount: number
  taxType: string
  taxRate: number
  taxAmount: number
  total: number
  amountPaid: number
  balanceDue: number
  
  // Extra Info
  notes?: string | null
  paymentInstructions?: string | null
  
  // Payments
  payments: Array<{ amount: number, paid_at: string, method?: string | null, reference?: string | null }>
}

export interface InvoiceTemplateConfig {
  id: string
  name: string
  description: string
  component: ElementType<{ data: InvoiceTemplateData }>
  primaryColor: string
  secondaryColor: string
  supportsPdf: boolean
  supportsDocx: boolean
  version: string
}

import { modernBusinessInvoiceConfig, executiveInvoiceConfig, consultingInvoiceConfig, marketingInvoiceConfig, saasInvoiceConfig, enterpriseInvoiceConfig } from '@/components/invoices/templates'

export const invoiceTemplates: InvoiceTemplateConfig[] = [
  modernBusinessInvoiceConfig,
  executiveInvoiceConfig,
  consultingInvoiceConfig,
  marketingInvoiceConfig,
  saasInvoiceConfig,
  enterpriseInvoiceConfig
]

export function getInvoiceTemplate(id: string): InvoiceTemplateConfig | undefined {
  return invoiceTemplates.find(t => t.id === id)
}

export function getDefaultInvoiceTemplate(): InvoiceTemplateConfig {
  return invoiceTemplates[0]
}

export function mapInvoiceToTemplateData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoice: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  agencyContext: any = {}
): InvoiceTemplateData {
  // Default parameters don't apply to null, so we must enforce a safe fallback
  const ctx = agencyContext || {}
  const snap = invoice.branding_snapshot || {}
  
  const subtotal = invoice.subtotal || 0
  let discountAmount = 0
  if (invoice.discount_type === 'percentage') {
    discountAmount = subtotal * ((invoice.discount_value || 0) / 100)
  } else {
    discountAmount = invoice.discount_value || 0
  }
  
  return {
    id: invoice.id,
    number: invoice.number,
    issueDate: new Date(invoice.issue_date).toLocaleDateString(),
    dueDate: new Date(invoice.due_date).toLocaleDateString(),
    status: invoice.status,
    currency: invoice.currency || 'USD',
    
    clientName: invoice.client?.name || 'Unknown Client',
    clientCompany: invoice.client?.company || undefined,
    
    agencyName: snap.agency_name || ctx.name || 'Our Agency',
    agencyLogo: snap.logo_url || ctx.logo_url || ctx.logoUrl || undefined,
    brandColor: snap.primary_color || ctx.primary_color || undefined,
    agencyPhone: snap.phone || ctx.phone || undefined,
    agencyEmail: snap.email || ctx.email || undefined,
    agencyWebsite: snap.website || ctx.website || undefined,
    
    projectName: invoice.project?.name || undefined,
    contractReference: invoice.project?.contract_id ? `CTR-${invoice.project.contract_id.substring(0, 8).toUpperCase()}` : undefined,
    
    items: invoice.items || [],
    subtotal: invoice.subtotal,
    discountType: invoice.discount_type || 'fixed',
    discountValue: invoice.discount_value || 0,
    discountAmount: discountAmount,
    taxType: invoice.tax_type || 'none',
    taxRate: invoice.tax_rate || 0,
    taxAmount: invoice.tax_amount || 0,
    total: invoice.total || 0,
    amountPaid: invoice.amount_paid || 0,
    balanceDue: Math.max(0, (invoice.total || 0) - (invoice.amount_paid || 0)),
    
    notes: invoice.notes,
    paymentInstructions: snap.payment_instructions || ctx.payment_instructions || undefined,
    
    payments: invoice.payments || []
  }
}
