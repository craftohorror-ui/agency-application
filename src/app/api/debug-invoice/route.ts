import { NextResponse } from 'next/server'
import { getInvoice } from '@/lib/invoices'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase.from('invoices').select('id').limit(1).single()
    
    if (error) {
      return NextResponse.json({ success: false, error: 'Database fetch error', details: error })
    }
    
    if (!data) return NextResponse.json({ message: 'No invoice found' })
    
    // Test getInvoice
    const invoice = await getInvoice(data.id)
    return NextResponse.json({ success: true, invoice })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack })
  }
}
