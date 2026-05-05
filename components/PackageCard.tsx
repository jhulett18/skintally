'use client'

import type { Package } from '@/lib/supabase'
import { sessionsRemaining, daysUntilExpiry, packageStatus } from '@/lib/supabase'
import { useState } from 'react'

interface PackageCardProps {
  pkg: Package
  onUseSession: (id: string) => void
  onDelete: (id: string) => void
}

const STATUS_CONFIG = {
  expired: { bg: '#fef2f4', border: '#fca5b0', badge: '#be123c', badgeBg: '#fee2e6', label: 'Expired' },
  critical: { bg: '#fffbeb', border: '#fcd34d', badge: '#92400e', badgeBg: '#fef3c7', label: 'Expiring Soon' },
  warning: { bg: '#fff7ed', border: '#fdba74', badge: '#c2410c', badgeBg: '#ffedd5', label: 'Expires in 2 wks' },
  active: { bg: '#f0fdf4', border: '#86efac', badge: '#166534', badgeBg: '#dcfce7', label: 'Active' },
}

export default function PackageCard({ pkg, onUseSession, onDelete }: PackageCardProps) {
  const remaining = sessionsRemaining(pkg)
  const days = daysUntilExpiry(pkg.expiry_date)
  const status = packageStatus(pkg)
  const cfg = STATUS_CONFIG[status]
  const [deleting, setDeleting] = useState(false)
  const [using, setUsing] = useState(false)

  const expiryDisplay = new Date(pkg.expiry_date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  async function handleUseSession() {
    setUsing(true)
    try {
      const res = await fetch(`/api/packages/${pkg.id}/use`, { method: 'POST' })
      if (res.ok) onUseSession(pkg.id)
    } finally {
      setUsing(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Remove ${pkg.client_name}'s ${pkg.package_type} package?`)) return
    setDeleting(true)
    try {
      await fetch(`/api/packages/${pkg.id}`, { method: 'DELETE' })
      onDelete(pkg.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      className="rounded-2xl p-5 transition-all animate-fade-in"
      style={{
        background: status === 'active' ? '#fff' : cfg.bg,
        border: `1px solid ${status === 'active' ? '#e4d8dc' : cfg.border}`,
        boxShadow: '0 2px 12px rgba(26,19,32,0.05)',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <h3
            className="font-bold text-base truncate"
            style={{ color: '#1a1320' }}
          >
            {pkg.client_name}
          </h3>
          <p className="text-xs truncate mt-0.5" style={{ color: '#7a6a72' }}>
            {pkg.client_email}
          </p>
        </div>
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0"
          style={{ background: cfg.badgeBg, color: cfg.badge }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Package type */}
      <div
        className="inline-block px-3 py-1 rounded-lg text-xs font-semibold mb-4"
        style={{ background: 'var(--rose-gold-light)', color: 'var(--rose-gold-dark)' }}
      >
        {pkg.package_type}
      </div>

      {/* Stats grid */}
      <div
        className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl"
        style={{ background: 'rgba(26,19,32,0.03)' }}
      >
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: remaining === 0 ? cfg.badge : '#1a1320' }}
          >
            {remaining}
          </div>
          <div className="text-xs" style={{ color: '#7a6a72' }}>remaining</div>
        </div>
        <div className="text-center border-x" style={{ borderColor: 'rgba(26,19,32,0.08)' }}>
          <div className="text-2xl font-bold" style={{ color: '#1a1320' }}>
            {pkg.sessions_purchased}
          </div>
          <div className="text-xs" style={{ color: '#7a6a72' }}>total</div>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: days < 0 ? cfg.badge : days <= 7 ? '#dc2626' : days <= 14 ? '#d97706' : '#1a1320' }}
          >
            {days < 0 ? '–' : days}
          </div>
          <div className="text-xs" style={{ color: '#7a6a72' }}>
            {days < 0 ? 'expired' : 'days left'}
          </div>
        </div>
      </div>

      {/* Expiry date */}
      <div className="flex items-center gap-1.5 mb-4" style={{ color: '#7a6a72' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M1 6h12M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span className="text-xs">Expires {expiryDisplay}</span>
      </div>

      {/* Session progress bar */}
      <div className="mb-4">
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(26,19,32,0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(pkg.sessions_used / pkg.sessions_purchased) * 100}%`,
              background: remaining === 0 ? cfg.badge : 'var(--rose-gold)',
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: '#a09098' }}>
            {pkg.sessions_used} used
          </span>
          <span className="text-xs" style={{ color: '#a09098' }}>
            {pkg.sessions_purchased} total
          </span>
        </div>
      </div>

      {/* Actions */}
      {status !== 'expired' && (
        <div className="flex gap-2">
          <button
            onClick={handleUseSession}
            disabled={using || remaining === 0}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-40"
            style={{
              background: 'var(--navy)',
              color: '#fff',
            }}
          >
            {using ? '…' : '+ Use Session'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-2 rounded-lg text-xs transition-all hover:opacity-70"
            style={{
              border: '1px solid #e4d8dc',
              color: '#7a6a72',
              background: '#fff',
            }}
            title="Remove package"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M6 7v4M8 7v4M3 4l1 8h6l1-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
