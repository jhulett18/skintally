'use client'

import { useState } from 'react'
import type { Package } from '@/lib/supabase'

const PACKAGE_TYPES = [
  'Botox / Dysport',
  'Dermal Filler',
  'Laser Hair Removal',
  'Chemical Peel',
  'Microneedling',
  'IPL Photofacial',
  'HydraFacial',
  'Coolsculpting',
  'RF Microneedling',
  'Body Contouring',
  'Custom / Other',
]

interface PackageFormProps {
  onSuccess: (pkg: Package) => void
  onCancel: () => void
}

export default function PackageForm({ onSuccess, onCancel }: PackageFormProps) {
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    package_type: '',
    custom_type: '',
    sessions_purchased: '',
    sessions_used: '0',
    expiry_date: '',
    booking_link: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const packageType = form.package_type === 'Custom / Other' ? form.custom_type : form.package_type
    if (!packageType) { setError('Please select or enter a package type.'); return }
    if (Number(form.sessions_used) > Number(form.sessions_purchased)) {
      setError('Sessions used cannot exceed sessions purchased.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: form.client_name,
          client_email: form.client_email,
          package_type: packageType,
          sessions_purchased: Number(form.sessions_purchased),
          sessions_used: Number(form.sessions_used),
          expiry_date: form.expiry_date,
          booking_link: form.booking_link || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save package')
      onSuccess(data.package)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    background: '#fff',
    border: '1px solid #e4d8dc',
    color: '#1a1320',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.15s',
  } as const

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    color: '#7a6a72',
    marginBottom: '6px',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Row 1: Client Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Client Name *</label>
          <input
            required
            type="text"
            placeholder="Jane Smith"
            value={form.client_name}
            onChange={(e) => update('client_name', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Client Email *</label>
          <input
            required
            type="email"
            placeholder="jane@email.com"
            value={form.client_email}
            onChange={(e) => update('client_email', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Package Type */}
      <div>
        <label style={labelStyle}>Package Type *</label>
        <select
          required
          value={form.package_type}
          onChange={(e) => update('package_type', e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="">Select treatment type…</option>
          {PACKAGE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {form.package_type === 'Custom / Other' && (
          <input
            required
            type="text"
            placeholder="Enter treatment name"
            value={form.custom_type}
            onChange={(e) => update('custom_type', e.target.value)}
            style={{ ...inputStyle, marginTop: '8px' }}
          />
        )}
      </div>

      {/* Row 2: Sessions Purchased + Used */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Sessions Purchased *</label>
          <input
            required
            type="number"
            min="1"
            max="50"
            placeholder="6"
            value={form.sessions_purchased}
            onChange={(e) => update('sessions_purchased', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Sessions Used</label>
          <input
            required
            type="number"
            min="0"
            max="50"
            placeholder="0"
            value={form.sessions_used}
            onChange={(e) => update('sessions_used', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Expiry Date */}
      <div>
        <label style={labelStyle}>Package Expiry Date *</label>
        <input
          required
          type="date"
          value={form.expiry_date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => update('expiry_date', e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Booking Link */}
      <div>
        <label style={labelStyle}>Booking Link <span style={{ color: '#a09098', fontWeight: 400 }}>(optional)</span></label>
        <input
          type="url"
          placeholder="https://your-booking-page.com"
          value={form.booking_link}
          onChange={(e) => update('booking_link', e.target.value)}
          style={inputStyle}
        />
        <p className="text-xs mt-1.5" style={{ color: '#a09098' }}>
          This link will appear in reminder emails sent to your client.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm animate-fade-in"
          style={{ background: '#fef2f4', border: '1px solid #fca5b0', color: '#be123c' }}
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-70"
          style={{ border: '1px solid #e4d8dc', color: '#7a6a72', background: '#fff' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg, #1a1320, #2d2438)',
          }}
        >
          {submitting ? 'Saving…' : 'Add Package →'}
        </button>
      </div>
    </form>
  )
}
