# Skintally

**Prepaid treatment package tracker for med spas.**

Tracks every prepaid package at your aesthetics practice and auto-sends expiry reminder emails to clients at 30, 14, and 7 days before their sessions lapse.

Built with Next.js + Supabase + Resend by [automationbyJT](https://automationbyJT.com).

---

## Setup

### 1. Supabase

1. Create a new [Supabase](https://supabase.com) project
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. Copy your **Project URL** and **Service Role Key** from Settings → API

### 2. Resend

1. Create a [Resend](https://resend.com) account
2. Add and verify your sending domain
3. Generate an API key
4. Update the `from` address in `lib/resend.ts` to match your domain

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_YOUR_API_KEY
NEXT_PUBLIC_PASSPHRASE=your-practice-passphrase
CRON_SECRET=your-random-cron-secret
```

### 4. Deploy to Vercel

```bash
vercel --prod
```

Add all environment variables in Vercel Dashboard → Settings → Environment Variables.

The cron job is configured in `vercel.json` and runs daily at 9am UTC.

---

## Architecture

- **Frontend**: Next.js App Router + Tailwind CSS
- **Database**: Supabase (packages + send_log tables)
- **Email**: Resend (transactional, HTML templates)
- **Cron**: Vercel cron job (`/api/cron/send-reminders`) runs daily
- **Auth**: Single shared passphrase per practice (no accounts)

## Reminder schedule

- **T-30**: 30 days before expiry — friendly heads-up
- **T-14**: 14 days before expiry — moderate urgency
- **T-7**: 7 days before expiry — final warning

Each reminder is sent once (logged in `send_log` to prevent duplicates).
