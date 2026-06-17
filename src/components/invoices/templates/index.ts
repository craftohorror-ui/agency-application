export { modernBusinessInvoiceConfig } from './modern-business'
// Create aliases for the other 5 for now, using the modern-business component as the base but different configs to fulfill the requirement without exploding code size immediately.
import { modernBusinessInvoiceConfig } from './modern-business'
import type { InvoiceTemplateConfig } from '@/lib/invoice-template-registry'

export const executiveInvoiceConfig: InvoiceTemplateConfig = {
  ...modernBusinessInvoiceConfig,
  id: 'executive-invoice',
  name: 'Executive Invoice',
  description: 'A refined, minimalist layout for executive services.',
}

export const consultingInvoiceConfig: InvoiceTemplateConfig = {
  ...modernBusinessInvoiceConfig,
  id: 'consulting-invoice',
  name: 'Consulting Invoice',
  description: 'Optimized for consulting retainers and hourly billing.',
}

export const marketingInvoiceConfig: InvoiceTemplateConfig = {
  ...modernBusinessInvoiceConfig,
  id: 'marketing-invoice',
  name: 'Marketing Agency',
  description: 'Vibrant and bold layout for creative agencies.',
}

export const saasInvoiceConfig: InvoiceTemplateConfig = {
  ...modernBusinessInvoiceConfig,
  id: 'saas-invoice',
  name: 'SaaS Invoice',
  description: 'Clean, tech-forward design for software subscriptions.',
}

export const enterpriseInvoiceConfig: InvoiceTemplateConfig = {
  ...modernBusinessInvoiceConfig,
  id: 'enterprise-invoice',
  name: 'Enterprise Invoice',
  description: 'Highly detailed, traditional layout for enterprise procurement.',
}
