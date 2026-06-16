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
  contract: { id: string; title: string; body: string; client?: { name: string; company?: string | null } | null; created_at: string; status: string; version: number; signed_by_name?: string | null; signed_at?: string | null; signer_ip?: string | null },
  agencyContext: { name: string; logoUrl?: string | null }
): ContractTemplateData {
  return {
    id: contract.id,
    title: contract.title,
    body: contract.body,
    clientName: contract.client?.name || 'Unknown Client',
    clientCompany: contract.client?.company || undefined,
    agencyName: agencyContext.name,
    agencyLogo: agencyContext.logoUrl || undefined,
    date: new Date(contract.created_at).toLocaleDateString(),
    status: contract.status,
    version: contract.version,
    signedByName: contract.signed_by_name || undefined,
    signedAt: contract.signed_at ? new Date(contract.signed_at).toLocaleString() : undefined,
    signerIp: contract.signer_ip || undefined,
  }
}

