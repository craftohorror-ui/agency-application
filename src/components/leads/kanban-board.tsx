'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  PointerSensor, 
  useSensor, 
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/badge'
import { updateLeadStageAction } from '@/app/dashboard/leads/actions'
import type { LeadStage } from '@/lib/types'

export interface KanbanLeadOwner {
  id: string
  full_name: string
  email: string
  role: string
  avatar_url: string | null
}

export interface KanbanLead {
  id: string
  name: string
  company: string | null
  email: string | null
  owner: KanbanLeadOwner | null
  score: number
  stage: LeadStage
  [key: string]: unknown
}

const LEAD_STAGES: LeadStage[] = [
  'new_lead',
  'contacted',
  'discovery_scheduled',
  'discovery_completed',
  'proposal_sent',
  'negotiation',
  'won',
  'lost',
]

function formatStage(stage: string) {
  return stage.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function getStageVariant(stage: string): 'default' | 'outline' | 'muted' {
  if (stage === 'won') return 'default'
  if (stage === 'lost') return 'muted'
  return 'outline'
}

interface SortableLeadCardProps {
  lead: KanbanLead
  onClick: (id: string) => void
}

function SortableLeadCard({ lead, onClick }: SortableLeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
    data: { type: 'Lead', lead }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card text-card-foreground border rounded-lg shadow-sm p-4 mb-3 cursor-grab active:cursor-grabbing touch-none select-none hover:border-primary/50 transition-colors"
      onClick={() => {
        if (!isDragging) {
          onClick(lead.id)
        }
      }}
    >
      <div className="font-medium truncate mb-1">{lead.name}</div>
      <div className="text-sm text-muted-foreground truncate mb-3">{lead.company || 'No company'}</div>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span className="truncate mr-2">{lead.owner?.full_name || 'Unassigned'}</span>
        <span className="shrink-0 font-medium">Score: {lead.score}</span>
      </div>
    </div>
  )
}

function Column({ stage, leads, onClick }: { stage: LeadStage, leads: KanbanLead[], onClick: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { type: 'Column', stage }
  })

  return (
    <div className={`flex flex-col bg-muted/30 rounded-xl w-[320px] flex-shrink-0 border transition-colors ${isOver ? 'bg-muted/60 border-primary/50' : 'border-transparent'}`}>
      <div className="p-4 font-semibold text-sm flex justify-between items-center border-b border-border/50">
        <span className="tracking-tight">{formatStage(stage)}</span>
        <Badge variant={getStageVariant(stage)} className="px-2 py-0.5">{leads.length}</Badge>
      </div>
      <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto min-h-[200px]">
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map(lead => (
            <SortableLeadCard key={lead.id} lead={lead} onClick={onClick} />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed border-border/50 rounded-lg">
            Drop leads here
          </div>
        )}
      </div>
    </div>
  )
}

export function KanbanBoard({ initialLeads }: { initialLeads: KanbanLead[] }) {
  const [leads, setLeads] = useState<KanbanLead[]>(initialLeads)
  const [activeLead, setActiveLead] = useState<KanbanLead | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLeads(initialLeads)
  }, [initialLeads])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const columns = useMemo(() => {
    const cols = new Map<LeadStage, KanbanLead[]>()
    LEAD_STAGES.forEach(s => cols.set(s, []))
    leads.forEach(l => {
      if (cols.has(l.stage)) cols.get(l.stage)!.push(l)
    })
    return Array.from(cols.entries())
  }, [leads])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'Lead') {
      setActiveLead(active.data.current.lead)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string

    if (activeId === over.id) return

    const activeLeadItem = leads.find(l => l.id === activeId)
    if (!activeLeadItem) return

    let targetStage: LeadStage | null = null
    const overData = over.data.current

    if (overData?.type === 'Column') {
      targetStage = overData.stage
    } else if (overData?.type === 'Lead') {
      targetStage = overData.lead.stage
    }

    if (!targetStage || activeLeadItem.stage === targetStage) return

    setLeads(leads.map(l => l.id === activeId ? { ...l, stage: targetStage! } : l))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveLead(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string

    const activeLeadItem = initialLeads.find(l => l.id === activeId)
    if (!activeLeadItem) return

    let targetStage: LeadStage | null = null
    const overData = over.data.current

    if (overData?.type === 'Column') {
      targetStage = overData.stage
    } else if (overData?.type === 'Lead') {
      targetStage = overData.lead.stage
    }

    if (!targetStage || activeLeadItem.stage === targetStage) return

    setIsUpdating(true)
    try {
      await updateLeadStageAction(activeId, targetStage)
    } catch (err) {
      console.error('Failed to update lead stage', err)
      setLeads(initialLeads) 
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDragCancel = () => {
    setActiveLead(null)
    setLeads(initialLeads)
  }

  const handleLeadClick = (id: string) => {
    router.push(`/dashboard/leads/${id}`)
  }

  return (
    <div className="relative flex flex-col h-full">
      {isUpdating && (
        <div className="absolute top-0 right-0 z-50 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium animate-pulse shadow-sm">
          Saving...
        </div>
      )}
      <div className="flex flex-1 overflow-x-auto space-x-6 pb-4 pt-2 px-1">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners} 
          onDragStart={handleDragStart} 
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {columns.map(([stage, stageLeads]) => (
            <Column key={stage} stage={stage} leads={stageLeads} onClick={handleLeadClick} />
          ))}
          <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
            {activeLead ? (
              <div className="bg-card text-card-foreground border-2 border-primary rounded-lg shadow-xl p-4 opacity-90 rotate-3 w-[290px] cursor-grabbing">
                <div className="font-medium truncate mb-1">{activeLead.name}</div>
                <div className="text-sm text-muted-foreground truncate mb-3">{activeLead.company || 'No company'}</div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="truncate mr-2">{activeLead.owner?.full_name || 'Unassigned'}</span>
                  <span className="shrink-0 font-medium">Score: {activeLead.score}</span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
