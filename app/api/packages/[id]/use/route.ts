import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase()
  const { id } = await params

  const { data: pkg, error: fetchError } = await supabase
    .from('packages')
    .select('sessions_used, sessions_purchased')
    .eq('id', id)
    .single()

  if (fetchError || !pkg) {
    return Response.json({ error: 'Package not found' }, { status: 404 })
  }

  if (pkg.sessions_used >= pkg.sessions_purchased) {
    return Response.json({ error: 'All sessions already used' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('packages')
    .update({ sessions_used: pkg.sessions_used + 1 })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ package: data })
}
