import { Resend } from 'resend'
import { Package, sessionsRemaining, daysUntilExpiry } from './supabase'

// ─── Lazy Resend instance — safe to import at build time ─────────────────────

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? '')
  }
  return _resend
}

interface ReminderEmailOptions {
  pkg: Package
  reminderDays: 30 | 14 | 7
}

export async function sendReminderEmail({ pkg, reminderDays }: ReminderEmailOptions) {
  const resend = getResend()
  const sessions = sessionsRemaining(pkg)
  const days = daysUntilExpiry(pkg.expiry_date)
  const bookingLink = pkg.booking_link || 'https://your-booking-link.com'

  const urgencyColor =
    reminderDays === 7 ? '#dc2626' :
    reminderDays === 14 ? '#d97706' :
    '#1a7a4a'

  const urgencyLabel =
    reminderDays === 7 ? 'Final Reminder — Package Expiring Soon' :
    reminderDays === 14 ? 'Heads Up — Your Package Expires in 2 Weeks' :
    'Friendly Reminder — Package Expiry in 30 Days'

  const expiryDisplay = new Date(pkg.expiry_date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #faf7f4; color: #1a1320; }
    .wrapper { max-width: 560px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1320 0%, #2d2438 100%); padding: 32px 40px; }
    .logo { font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; }
    .logo span { color: #c9a0a8; }
    .urgency-bar { background: ${urgencyColor}15; border-left: 4px solid ${urgencyColor}; padding: 12px 40px; font-size: 13px; font-weight: 600; color: ${urgencyColor}; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 18px; font-weight: 600; color: #1a1320; margin-bottom: 16px; }
    .message { font-size: 15px; line-height: 1.7; color: #4a3f4a; margin-bottom: 28px; }
    .package-card { background: #faf7f4; border: 1px solid #e4d8dc; border-radius: 12px; padding: 24px; margin-bottom: 28px; }
    .package-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #a07880; margin-bottom: 12px; }
    .package-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e4d8dc; }
    .package-row:last-child { border-bottom: none; }
    .package-label { font-size: 14px; color: #7a6a72; }
    .package-value { font-size: 14px; font-weight: 600; color: #1a1320; }
    .days-badge { display: inline-block; background: ${urgencyColor}15; color: ${urgencyColor}; padding: 2px 10px; border-radius: 99px; font-size: 13px; font-weight: 700; }
    .cta-btn { display: block; text-align: center; background: linear-gradient(135deg, #1a1320 0%, #2d2438 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 15px; font-weight: 600; letter-spacing: 0.01em; margin-bottom: 28px; }
    .footer { padding: 24px 40px; background: #f5f0f3; border-top: 1px solid #e4d8dc; text-align: center; font-size: 12px; color: #a09098; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Skin<span>tally</span></div>
    </div>
    <div class="urgency-bar">${urgencyLabel}</div>
    <div class="body">
      <p class="greeting">Hi ${pkg.client_name},</p>
      <p class="message">
        Your <strong>${pkg.package_type}</strong> package has
        <strong>${sessions} session${sessions !== 1 ? 's' : ''} remaining</strong>
        and expires in <span class="days-badge">${days} days</span>.
        We&apos;d love to help you use every session you&apos;ve invested in.
      </p>
      <div class="package-card">
        <div class="package-title">Your Package Details</div>
        <div class="package-row">
          <span class="package-label">Package</span>
          <span class="package-value">${pkg.package_type}</span>
        </div>
        <div class="package-row">
          <span class="package-label">Sessions remaining</span>
          <span class="package-value">${sessions} of ${pkg.sessions_purchased}</span>
        </div>
        <div class="package-row">
          <span class="package-label">Expires</span>
          <span class="package-value">${expiryDisplay}</span>
        </div>
        <div class="package-row">
          <span class="package-label">Days remaining</span>
          <span class="package-value days-badge">${days}</span>
        </div>
      </div>
      <a href="${bookingLink}" class="cta-btn">Book My Next Session &rarr;</a>
      <p style="font-size:13px;color:#7a6a72;line-height:1.6;">
        Questions? Reply to this email or call us directly.
        We look forward to seeing you soon.
      </p>
    </div>
    <div class="footer">
      This is an automated reminder from your aesthetics practice.<br/>
      Powered by <strong>Skintally</strong> &middot; automationbyJT
    </div>
  </div>
</body>
</html>
`

  const subjectLine =
    reminderDays === 7 ? `Your ${pkg.package_type} package — ${days} days left (${sessions} session${sessions !== 1 ? 's' : ''} remaining)` :
    reminderDays === 14 ? `Your ${pkg.package_type} package expires in 2 weeks` :
    `Reminder: ${sessions} session${sessions !== 1 ? 's' : ''} remaining — ${pkg.package_type}`

  const result = await resend.emails.send({
    from: 'Skintally <reminders@automationbyjt.com>',
    to: pkg.client_email,
    subject: subjectLine,
    html,
  })

  return result
}
