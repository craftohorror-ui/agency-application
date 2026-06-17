import { ElementType } from 'react'

export interface ContractTemplateData {
  id?: string
  title: string
  body: string
  clientName: string
  clientCompany?: string
  agencyName: string
  agencyLogo?: string
  date: string
  status: string
  version: number
  signedByName?: string
  signedAt?: string
  signerIp?: string
  brandColor?: string
  legalName?: string | null
  registrationNumber?: string | null
  taxId?: string | null
  termsConditions?: string | null
  privacyPolicy?: string | null
  contractFooter?: string | null
}

export interface ContractTemplateConfig {
  id: string
  name: string
  description: string
  component: ElementType<{ data: ContractTemplateData }>
  primaryColor: string
  secondaryColor: string
  supportsPdf: boolean
  supportsDocx: boolean
  version: string
}

import { modernBusinessContractConfig, executiveAgreementConfig, serviceAgreementConfig, consultingAgreementConfig, marketingRetainerConfig, saasAgreementConfig, freelancerContractConfig, constructionAgreementConfig, enterpriseContractConfig, premiumLegalConfig } from '@/components/contracts/templates'

export const contractTemplates: ContractTemplateConfig[] = [
  modernBusinessContractConfig,
  executiveAgreementConfig,
  serviceAgreementConfig,
  consultingAgreementConfig,
  marketingRetainerConfig,
  saasAgreementConfig,
  freelancerContractConfig,
  constructionAgreementConfig,
  enterpriseContractConfig,
  premiumLegalConfig
]

export function getContractTemplate(id: string): ContractTemplateConfig | undefined {
  return contractTemplates.find(t => t.id === id)
}

export function getDefaultContractTemplate(): ContractTemplateConfig {
  return contractTemplates[0]
}

export function mapContractToTemplateData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contract: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  agencyContext: any = {}
): ContractTemplateData {
  const snap = contract.branding_snapshot || {}

  return {
    id: contract.id,
    title: contract.title,
    body: contract.body,
    clientName: contract.client?.name || 'Unknown Client',
    clientCompany: contract.client?.company || undefined,
    agencyName: snap.agency_name || agencyContext.name || 'Our Agency',
    agencyLogo: snap.logo_url || agencyContext.logo_url || agencyContext.logoUrl || undefined,
    date: new Date(contract.created_at).toLocaleDateString(),
    status: contract.status,
    version: contract.version,
    signedByName: contract.signed_by_name || undefined,
    signedAt: contract.signed_at ? new Date(contract.signed_at).toLocaleString() : undefined,
    signerIp: contract.signer_ip || undefined,
    brandColor: snap.primary_color || agencyContext.primary_color || undefined,
    legalName: snap.legal_name || agencyContext.legal_name || undefined,
    registrationNumber: snap.registration_number || agencyContext.registration_number || undefined,
    taxId: snap.tax_id || agencyContext.tax_id || undefined,
    termsConditions: snap.terms_and_conditions || agencyContext.terms_and_conditions || undefined,
    privacyPolicy: snap.privacy_policy || agencyContext.privacy_policy || undefined,
    contractFooter: snap.default_contract_footer || agencyContext.default_contract_footer || undefined,
  }
}

