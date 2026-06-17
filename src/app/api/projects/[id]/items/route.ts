import { requireStaff } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { supabase } = await requireStaff()
    const resolvedParams = await params
    const projectId = resolvedParams.id
    
    // 1. Get project contract and client details
    const { data: project } = await supabase
      .from('projects')
      .select('contract_id, client_id, name')
      .eq('id', projectId)
      .single()
      
    if (!project) return NextResponse.json([])
    
    let proposalId = null
    
    // 2. Try to get proposal from linked contract
    if (project.contract_id) {
      const { data: contract } = await supabase
        .from('contracts')
        .select('proposal_id')
        .eq('id', project.contract_id)
        .single()
        
      if (contract?.proposal_id) proposalId = contract.proposal_id
    }
    
    // 3. Fallback heuristic: Try to find a proposal by name and client ID 
    // for projects created without an intermediate contract
    if (!proposalId && project.client_id) {
      const { data: proposal } = await supabase
        .from('proposals')
        .select('id')
        .eq('title', project.name)
        .eq('client_id', project.client_id)
        .maybeSingle()
        
      if (proposal) proposalId = proposal.id
    }
    
    // 4. If no proposal found, return empty
    if (!proposalId) return NextResponse.json([])
    
    // 5. Fetch proposal items to be used as invoice line items
    const { data: items } = await supabase
      .from('proposal_items')
      .select('*')
      .eq('proposal_id', proposalId)
      
    return NextResponse.json(items || [])
  } catch (error) {
    console.error('Failed to fetch project items:', error)
    // Return empty array on failure instead of a 500, enforcing the failsafe requirement.
    return NextResponse.json([])
  }
}
