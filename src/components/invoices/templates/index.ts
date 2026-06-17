import { modernBusinessInvoiceConfig as modernBusinessV2Config } from './modern-business-v2'
import { executiveInvoiceConfig } from './executive-invoice'
import { creativeStudioInvoiceConfig } from './creative-studio-invoice'
import { marketingInvoiceConfig } from './marketing-invoice'
import { saasInvoiceConfig } from './saas-invoice'
import { enterpriseInvoiceConfig } from './enterprise-invoice'

// We map modernBusinessInvoiceConfig back to modern-business-v2 for seamless integration
export const modernBusinessInvoiceConfig = {
  ...modernBusinessV2Config,
  id: 'modern-business' // Ensure ID is exact for backwards compatibility
}

export {
  executiveInvoiceConfig,
  creativeStudioInvoiceConfig as consultingInvoiceConfig, // Map ID for backwards compatibility
  marketingInvoiceConfig,
  saasInvoiceConfig,
  enterpriseInvoiceConfig
}
