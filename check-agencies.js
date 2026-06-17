const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing env variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data: agencies, error: err1 } = await supabase.from('agencies').select('*')
  console.log('Agencies:', agencies)
  console.log('Error:', err1)

  const { data: profiles, error: err2 } = await supabase.from('profiles').select('id, email, agency_id')
  console.log('Profiles:', profiles)
}

check()
