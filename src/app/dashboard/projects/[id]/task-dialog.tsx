'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createProjectTaskAction, updateProjectTaskAction, deleteProjectTaskAction } from '../tasks-actions'
import type { TaskWithAssignee } from '@/lib/tasks'
import type { TaskStatus, TaskPriority, Profile } from '@/lib/types'

const TASK_STATUSES = ['todo', 'in_progress', 'review', 'done'] as const
const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const

export function TaskDialog({
  projectId,
  task,
  teamMembers,
  open,
  onOpenChange
}: {
  projectId: string
  task: TaskWithAssignee | null
  teamMembers: Profile[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const input = {
      project_id: projectId,
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      status: formData.get('status') as TaskStatus,
      priority: formData.get('priority') as TaskPriority,
      assignee_id: formData.get('assignee_id') as string || null,
      due_date: formData.get('due_date') as string || null,
      comments: formData.get('comments') as string || null,
    }
    
    if (input.assignee_id === 'unassigned') input.assignee_id = null

    if (task) {
      await updateProjectTaskAction(task.id, projectId, input)
    } else {
      await createProjectTaskAction(input)
    }
    
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const handleDelete = async () => {
    if (!task) return
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true)
      await deleteProjectTaskAction(task.id, projectId)
      setIsDeleting(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" defaultValue={task?.title} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select name="status" defaultValue={task?.status || 'todo'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map(s => (
                      <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select name="priority" defaultValue={task?.priority || 'medium'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map(p => (
                      <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select name="assignee_id" defaultValue={task?.assignee_id || 'unassigned'}>
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {teamMembers.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" name="due_date" defaultValue={task?.due_date || ''} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" defaultValue={task?.description || ''} rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Comments / Notes</Label>
              <Textarea name="comments" defaultValue={task?.comments || ''} rows={2} />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between items-center w-full mt-4">
            {task ? (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isSubmitting}>
                Delete
              </Button>
            ) : <div />}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Task'}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
