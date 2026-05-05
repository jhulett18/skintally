import { NextRequest } from 'next/server'
import { supabase, daysUntilExpiry, sessionsRemaining, type Package } from '@/lib/supabase'
import { sendReminderEmail } from '@/lib/resend'

const REMINDER_WINDOWS = [30, 14, 7] as const
type ReminderDay = 30 | 14 | 7

// Vercel cron: runs daily at 9am UTC (configured in vercel.json)
export async function GET(req: NextRequest) {
  // Protect with cron secret
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]

  // Fetch all non-expired packages
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .gte('expiry_date', today)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const results: Array<{ packageId: string; clientEmail: string; reminderDays: number; status: string }> = []

  for (const pkg of (packages as Package[])) {
    const days = daysUntilExpiry(pkg.expiry_date)
    const remaining = sessionsRemaining(pkg)

    // Skip packages with no sessions left
    if (remaining === 0) continue

    for (const window of REMINDER_WINDOWS) {
      // Fire if days remaining is within this window (e.g. 29-30 for T-30)
      if (days > window || days < window - 1) continue

      // Check if we already sent this reminder
      const { data: existing } = await supabase
        .from('send_log')
        .select('id')
        .eq('package_id', pkg.id)
        .eq('reminder_days', window)
        .maybeSingle()

      if (existing) {
        results.push({
          packageId: pkg.id,
          clientEmail: pkg.client_email,
          reminderDays: window,
          status: 'already_sent',
        })
        continue
      }

      try {
        await sendReminderEmail({ pkg, reminderDays: window as ReminderDay })

        await supabase.from('send_log').insert({
          package_id: pkg.id,
          reminder_days: window,
        })

        results.push({
          packageId: pkg.id,
          clientEmail: pkg.client_email,
          reminderDays: window,
          status: 'sent',
        })
      } catch (err) {
        results.push({
          packageId: pkg.id,
          clientEmail: pkg.client_email,
          reminderDays: window,
          status: `error: ${err instanceof Error ? err.message : 'unknown'}`,
        })
      }
    }
  }

  return Response.json({
    ok: true,
    processedAt: new Date().toISOString(),
    packagesChecked: packages.length,
    results,
  })
}
