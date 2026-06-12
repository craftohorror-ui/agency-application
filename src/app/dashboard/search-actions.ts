'use server'

import { requireStaff } from '@/lib/auth'

export type SearchResultType = 'lead' | 'client' | 'project' | 'task' | 'team' | 'file'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle?: string
  url: string
  score?: number
}

function calculateScore(term: string, fields: (string | null | undefined)[]): number {
  const lowerTerm = term.toLowerCase()
  let bestScore = 0 // 0 = no match, 1 = partial, 2 = prefix, 3 = exact

  for (const field of fields) {
    if (!field) continue
    const lowerField = field.toLowerCase()
    if (lowerField === lowerTerm) {
      return 3
    } else if (lowerField.startsWith(lowerTerm)) {
      bestScore = Math.max(bestScore, 2)
    } else if (lowerField.includes(lowerTerm)) {
      bestScore = Math.max(bestScore, 1)
    }
  }

  return bestScore
}

export async function globalSearchAction(query: string): Promise<SearchResult[]> {
  const term = query.trim()
  if (!term) return []

  const { supabase } = await requireStaff()
  const ilikeTerm = `%${term.replace(/[%_\\]/g, '\\$&')}%`

  const [leadsRes, clientsRes, projectsRes, tasksRes, teamRes, filesRes] = await Promise.all([
    supabase.from('leads').select('id, name, email, company').or(`name.ilike.${ilikeTerm},email.ilike.${ilikeTerm},company.ilike.${ilikeTerm}`).limit(10),
    supabase.from('clients').select('id, name, email, company').or(`name.ilike.${ilikeTerm},email.ilike.${ilikeTerm},company.ilike.${ilikeTerm}`).limit(10),
    supabase.from('projects').select('id, name, description').or(`name.ilike.${ilikeTerm},description.ilike.${ilikeTerm}`).limit(10),
    supabase.from('tasks').select('id, title, description, project_id').or(`title.ilike.${ilikeTerm},description.ilike.${ilikeTerm}`).limit(10),
    supabase.from('profiles').select('id, full_name, email, role').or(`full_name.ilike.${ilikeTerm},email.ilike.${ilikeTerm}`).eq('is_suspended', false).limit(10),
    supabase.from('files').select('id, name, storage_path').or(`name.ilike.${ilikeTerm},storage_path.ilike.${ilikeTerm}`).limit(10)
  ])

  const results: SearchResult[] = []

  if (leadsRes.data) {
    results.push(...leadsRes.data.map(l => ({
      id: l.id,
      type: 'lead' as const,
      title: l.name,
      subtitle: [l.company, l.email].filter(Boolean).join(' - '),
      url: `/dashboard/leads/${l.id}`,
      score: calculateScore(term, [l.name, l.email, l.company])
    })))
  }

  if (clientsRes.data) {
    results.push(...clientsRes.data.map(c => ({
      id: c.id,
      type: 'client' as const,
      title: c.name,
      subtitle: [c.company, c.email].filter(Boolean).join(' - '),
      url: `/dashboard/clients/${c.id}`,
      score: calculateScore(term, [c.name, c.email, c.company])
    })))
  }

  if (projectsRes.data) {
    results.push(...projectsRes.data.map(p => ({
      id: p.id,
      type: 'project' as const,
      title: p.name,
      subtitle: p.description?.substring(0, 50) || 'Project',
      url: `/dashboard/projects/${p.id}`,
      score: calculateScore(term, [p.name, p.description])
    })))
  }

  if (tasksRes.data) {
    results.push(...tasksRes.data.map(t => ({
      id: t.id,
      type: 'task' as const,
      title: t.title,
      subtitle: t.description?.substring(0, 50) || 'Task',
      url: `/dashboard/projects/${t.project_id}`,
      score: calculateScore(term, [t.title, t.description])
    })))
  }

  if (teamRes.data) {
    results.push(...teamRes.data.map(m => ({
      id: m.id,
      type: 'team' as const,
      title: m.full_name || m.email,
      subtitle: m.role,
      url: `/dashboard/team/${m.id}`,
      score: calculateScore(term, [m.full_name, m.email])
    })))
  }

  if (filesRes.data) {
    results.push(...filesRes.data.map(f => ({
      id: f.id,
      type: 'file' as const,
      title: f.name,
      subtitle: 'File Document',
      url: `/dashboard/files`, // Files page doesn't have individual pages currently
      score: calculateScore(term, [f.name, f.storage_path])
    })))
  }

  // Sort by score descending
  results.sort((a, b) => (b.score || 0) - (a.score || 0))

  return results
}
