import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/packages — list all packages ordered by expiry
export async function GET() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('expiry_date', { ascending: true })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ packages: data })
}

// POST /api/packages — add a new package
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { client_name, client_email, package_type, sessions_purchased, sessions_used, expiry_date, booking_link } = body

    if (!client_name || !client_email || !package_type || !sessions_purchased || !expiry_date) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('packages')
      .insert({
        client_name: client_name.trim(),
        client_email: client_email.trim().toLowerCase(),
        package_type: package_type.trim(),
        sessions_purchased: Number(sessions_purchased),
        sessions_used: Number(sessions_used ?? 0),
        expiry_date,
        booking_link: booking_link?.trim() || null,
      })
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ package: data }, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
