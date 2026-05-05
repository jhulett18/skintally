import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ─── Lazy singleton — safe to import at build time ───────────────────────────

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL ?? ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    // The client is created lazily; runtime errors will surface if env vars are missing
    _client = createClient(url, key, { auth: { persistSession: false } })
  }
  return _client
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Package {
  id: string
  client_name: string
  client_email: string
  package_type: string
  sessions_purchased: number
  sessions_used: number
  expiry_date: string
  booking_link: string | null
  created_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function sessionsRemaining(pkg: Package): number {
  return Math.max(0, pkg.sessions_purchased - pkg.sessions_used)
}

export function daysUntilExpiry(expiryDate: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const exp = new Date(expiryDate)
  exp.setHours(0, 0, 0, 0)
  return Math.round((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function packageStatus(pkg: Package): 'expired' | 'critical' | 'warning' | 'active' {
  const days = daysUntilExpiry(pkg.expiry_date)
  const remaining = sessionsRemaining(pkg)
  if (days < 0 || remaining === 0) return 'expired'
  if (days <= 7) return 'critical'
  if (days <= 14) return 'warning'
  return 'active'
}
