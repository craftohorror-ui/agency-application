'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateProfile } from './actions'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export function ProfileForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const form = new FormData(e.currentTarget)
      
      const fileInput = form.get('avatar_file') as File | null
      if (fileInput && fileInput.size > 0) {
        // Upload Avatar
        const ext = fileInput.name.split('.').pop()
        const fileName = `${profile.id}-${Date.now()}.${ext}`
        
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(fileName, fileInput, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error

        // Actually we save the proxy path so it works in <img> tags
        form.set('avatar_url', `/api/storage/avatars/${data.path}`)
      } else {
        form.delete('avatar_url')
      }

      const result = await updateProfile(form)
      if (result.error) throw new Error(result.error)

      toast.success('Profile updated successfully')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Update your personal information and avatar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="avatar_file">Profile Picture</Label>
            {profile.avatar_url && (
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">Current Avatar Path: {profile.avatar_url}</span>
              </div>
            )}
            <Input id="avatar_file" name="avatar_file" type="file" accept="image/*" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" name="title" defaultValue={profile.title || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={profile.email} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" defaultValue={profile.phone || ''} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" defaultValue={profile.bio || ''} rows={4} />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
