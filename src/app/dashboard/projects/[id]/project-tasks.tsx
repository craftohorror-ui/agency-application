'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PlusCircle, Calendar, CheckCircle2, Circle, MessageSquare } from 'lucide-react'
import type { TaskWithAssignee } from '@/lib/tasks'
import { TaskDialog } from './task-dialog'
import { updateProjectTaskAction } from '../tasks-actions'
import type { Profile } from '@/lib/types'

export function ProjectTasks({ projectId, tasks, teamMembers }: { projectId: string, tasks: TaskWithAssignee[], teamMembers: Profile[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskWithAssignee | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter(t => t.status === 'done').length
    const completion = total === 0 ? 0 : Math.round((done / total) * 100)
    
    const today = new Date().toISOString().split('T')[0]
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekStr = nextWeek.toISOString().split('T')[0]

    const overdue = tasks.filter(t => t.status !== 'done' && t.due_date && t.due_date < today).length
    const dueSoon = tasks.filter(t => t.status !== 'done' && t.due_date && t.due_date >= today && t.due_date <= nextWeekStr).length

    return { total, done, completion, overdue, dueSoon }
  }, [tasks])

  const handleEdit = (task: TaskWithAssignee) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingTask(null)
    setIsDialogOpen(true)
  }

  const handleToggleComplete = async (task: TaskWithAssignee) => {
    setIsUpdating(true)
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    await updateProjectTaskAction(task.id, projectId, { status: newStatus })
    setIsUpdating(false)
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tasks</CardTitle>
          <div className="text-sm text-muted-foreground mt-1 flex gap-4">
            <span>{stats.done} / {stats.total} Completed</span>
            {stats.overdue > 0 && <span className="text-destructive font-medium">{stats.overdue} Overdue</span>}
            {stats.dueSoon > 0 && <span className="text-amber-600 font-medium">{stats.dueSoon} Due Soon</span>}
          </div>
        </div>
        <Button size="sm" onClick={handleCreate}><PlusCircle className="mr-2 h-4 w-4"/> Add Task</Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center gap-4">
          <Progress value={stats.completion} className="flex-1" />
          <span className="text-sm font-medium">{stats.completion}%</span>
        </div>
        
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border/50 rounded-lg">
              No tasks yet. Create one to get started.
            </div>
          ) : (
            tasks.map(task => {
              const isOverdue = task.status !== 'done' && task.due_date && task.due_date < new Date().toISOString().split('T')[0]
              return (
                <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <button 
                    onClick={() => handleToggleComplete(task)}
                    disabled={isUpdating}
                    className="mt-0.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {task.status === 'done' ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5" />}
                  </button>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleEdit(task)}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className={`font-medium truncate ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {task.priority === 'urgent' && <Badge variant="destructive" className="h-5">Urgent</Badge>}
                        {task.priority === 'high' && <Badge variant="default" className="h-5 bg-orange-600 hover:bg-orange-600/80">High</Badge>}
                        <Badge variant="outline" className="h-5 capitalize">{task.status.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1 mb-2">{task.description}</div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {task.assignee.full_name.charAt(0).toUpperCase()}
                          </div>
                          <span>{task.assignee.full_name}</span>
                        </div>
                      )}
                      {task.due_date && (
                        <div className={`flex items-center gap-1 ${isOverdue ? 'text-destructive font-medium' : ''}`}>
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {task.comments && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          <span>Notes</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>

      {isDialogOpen && (
        <TaskDialog
          projectId={projectId}
          task={editingTask}
          teamMembers={teamMembers}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </Card>
  )
}
