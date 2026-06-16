'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveAgencySettings } from '../actions'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Agency } from '@/lib/types'

export function AgencyForm({ agency }: { agency: Agency }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleFileUpload(file: File, prefix: string): Promise<string> {
    const ext = file.name.split('.').pop()
    const fileName = `${prefix}-${Date.now()}.${ext}`
    
    const { data, error } = await supabase.storage
      .from('branding')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (error) throw error

    const { data: publicUrlData } = supabase.storage.from('branding').getPublicUrl(data.path)
    return publicUrlData.publicUrl
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const form = new FormData(e.currentTarget)
      
      const logoFile = form.get('logo_file') as File | null
      const logoDarkFile = form.get('logo_dark_file') as File | null

      if (logoFile && logoFile.size > 0) {
        const url = await handleFileUpload(logoFile, 'logo')
        form.set('logo_url', url)
      } else {
        form.delete('logo_url')
      }

      if (logoDarkFile && logoDarkFile.size > 0) {
        const url = await handleFileUpload(logoDarkFile, 'logo-dark')
        form.set('logo_dark_url', url)
      } else {
        form.delete('logo_dark_url')
      }

      const result = await saveAgencySettings(form)
      if (result.error) throw new Error(result.error)

      toast.success('Agency settings saved successfully')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Branding & Identity</CardTitle>
          <CardDescription>Upload your logos and set your brand colors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agency Name</Label>
              <Input id="name" name="name" defaultValue={agency.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={agency.tagline || ''} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="logo_file">Light Logo (Public URL)</Label>
              {agency.logo_url && (
                <div className="mb-2">
                  <img src={agency.logo_url} alt="Logo" className="h-12 object-contain" />
                </div>
              )}
              <Input id="logo_file" name="logo_file" type="file" accept="image/*" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_dark_file">Dark Logo (Optional)</Label>
              {agency.logo_dark_url && (
                <div className="mb-2 bg-slate-900 p-2 rounded">
                  <img src={agency.logo_dark_url} alt="Dark Logo" className="h-12 object-contain" />
                </div>
              )}
              <Input id="logo_dark_file" name="logo_dark_file" type="file" accept="image/*" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex gap-2">
                <Input type="color" id="primary_color" name="primary_color" defaultValue={agency.primary_color || '#0f172a'} className="w-12 p-1" />
                <Input defaultValue={agency.primary_color || '#0f172a'} readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input type="color" id="secondary_color" name="secondary_color" defaultValue={agency.secondary_color || '#334155'} className="w-12 p-1" />
                <Input defaultValue={agency.secondary_color || '#334155'} readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent_color">Accent Color</Label>
              <div className="flex gap-2">
                <Input type="color" id="accent_color" name="accent_color" defaultValue={agency.accent_color || '#3b82f6'} className="w-12 p-1" />
                <Input defaultValue={agency.accent_color || '#3b82f6'} readOnly />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legal & Compliance</CardTitle>
          <CardDescription>Set your official legal name, tax info, and default disclaimers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legal_name">Legal Entity Name</Label>
              <Input id="legal_name" name="legal_name" defaultValue={agency.legal_name || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration_number">Registration #</Label>
              <Input id="registration_number" name="registration_number" defaultValue={agency.registration_number || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID / VAT</Label>
              <Input id="tax_id" name="tax_id" defaultValue={agency.tax_id || ''} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_legal_disclaimer">Default Legal Disclaimer (Invoices)</Label>
            <Textarea id="default_legal_disclaimer" name="default_legal_disclaimer" defaultValue={agency.default_legal_disclaimer || ''} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="terms_and_conditions">Terms & Conditions (Base)</Label>
              <Textarea id="terms_and_conditions" name="terms_and_conditions" rows={5} defaultValue={agency.terms_and_conditions || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="privacy_policy">Privacy Policy (Base)</Label>
              <Textarea id="privacy_policy" name="privacy_policy" rows={5} defaultValue={agency.privacy_policy || ''} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Defaults & Localization</CardTitle>
          <CardDescription>Configure currency, timezone, and document footers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default_currency">Default Currency</Label>
              <Input id="default_currency" name="default_currency" defaultValue={agency.default_currency || 'USD'} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" name="timezone" defaultValue={agency.timezone || 'UTC'} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default_proposal_footer">Proposal Footer</Label>
              <Input id="default_proposal_footer" name="default_proposal_footer" defaultValue={agency.default_proposal_footer || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_contract_footer">Contract Footer</Label>
              <Input id="default_contract_footer" name="default_contract_footer" defaultValue={agency.default_contract_footer || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_invoice_footer">Invoice Footer</Label>
              <Input id="default_invoice_footer" name="default_invoice_footer" defaultValue={agency.default_invoice_footer || ''} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" defaultValue={agency.website || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" name="linkedin_url" type="url" defaultValue={agency.linkedin_url || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input id="instagram_url" name="instagram_url" type="url" defaultValue={agency.instagram_url || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input id="facebook_url" name="facebook_url" type="url" defaultValue={agency.facebook_url || ''} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'Saving...' : 'Save Agency Settings'}
        </Button>
      </div>
    </form>
  )
}
