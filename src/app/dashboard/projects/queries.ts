import 'server-only'

import {
  getProject,
  listProjects,
  type ProjectListFilters,
} from '@/lib/projects'

export async function getProjectsQuery(filters: ProjectListFilters = {}) {
  return listProjects(filters)
}

export async function getProjectQuery(id: string) {
  return getProject(id)
}
