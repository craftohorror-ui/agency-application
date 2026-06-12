import 'server-only'

import {
  LEAD_STAGES,
  getLead,
  listLeadOwners,
  listLeads,
  type LeadListFilters,
} from '@/lib/leads'

export async function getLeadsQuery(filters: LeadListFilters = {}) {
  return listLeads(filters)
}

export async function getLeadQuery(id: string) {
  return getLead(id)
}

export async function getLeadOwnersQuery() {
  return listLeadOwners()
}

export function getLeadStageOptions() {
  return LEAD_STAGES
}
