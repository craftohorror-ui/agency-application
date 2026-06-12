import 'server-only'

import {
  getClient,
  listClients,
  type ClientListFilters,
} from '@/lib/clients'

export async function getClientsQuery(filters: ClientListFilters = {}) {
  return listClients(filters)
}

export async function getClientQuery(id: string) {
  return getClient(id)
}
