'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import PassphraseGate from '@/components/PassphraseGate'
import PackageForm from '@/components/PackageForm'
import PackageCard from '@/components/PackageCard'
import type { Package } from '@/lib/supabase'
import { packageStatus, daysUntilExpiry, sessionsRemaining } from '@/lib/supabase'

type FilterType = 'all' | 'active' | 'warning' | 'critical' | 'expired'

export default function AppPage() {
  return (
    <PassphraseGate>
      <Dashboard />
    </PassphraseGate>
  )
}

function Dashboard() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')

  const fetchPackages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/packages')
      const data = await res.json()
      setPackages(data.packages ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPackages() }, [fetchPackages])

  function handleNewPackage(pkg: Package) {
    setPackages((prev) => {
      const merged = [pkg, ...prev]
      return merged.sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())
    })
    setShowForm(false)
  }

  function handleUseSession(id: string) {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, sessions_used: p.sessions_used + 1 } : p
      )
    )
  }

  function handleDelete(id: string) {
    setPackages((prev) => prev.filter((p) => p.id !== id))
  }

  // Filter + search
  const filtered = packages.filter((p) => {
    const matchesFilter = filter === 'all' || packageStatus(p) === filter
    const q = search.toLowerCase()
    const matchesSearch = !q || 
      p.client_name.toLowerCase().includes(q) ||
      p.client_email.toLowerCase().includes(q) ||
      p.package_type.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  // Summary stats
  const stats = {
    active: packages.filter((p) => packageStatus(p) === 'active').length,
    warning: packages.filter((p) => packageStatus(p) === 'warning').length,
    critical: packages.filter((p) => packageStatus(p) === 'critical').length,
    expired: packages.filter((p) => packageStatus(p) === 'expired').length,
    totalSessions: packages.reduce((acc, p) => acc + sessionsRemaining(p), 0),
  }

  const FILTERS: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: packages.length },
    { key: 'active', label: 'Active', count: stats.active },
    { key: 'warning', label: '14 days', count: stats.warning },
    { key: 'critical', label: '7 days', count: stats.critical },
    { key: 'expired', label: 'Expired', count: stats.expired },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(250,247,244,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#1a1320"/>
              <path d="M9 14 C9 10.5 11.5 8 14 8 C16.5 8 19 10.5 19 14 C19 17.5 16.5 21 14 21"
                stroke="#c9a0a8" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="14" cy="14" r="2" fill="#c9a0a8"/>
              <path d="M14 11 v-3" stroke="#c9a0a8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span
              className="text-xl font-bold"
              style={{ color: '#1a1320', letterSpacing: '-0.02em' }}
            >
              Skintally
            </span>
          </Link>
          <span
            className="hidden sm:inline-block px-2 py-0.5 rounded text-xs font-medium"
            style={{ background: 'var(--rose-gold-light)', color: 'var(--rose-gold-dark)' }}
          >
            Practice Portal
          </span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #1a1320, #2d2438)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Add Package
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Active packages', value: stats.active, color: '#166534', bg: '#dcfce7' },
            { label: 'Expiring in 14 days', value: stats.warning + stats.critical, color: '#92400e', bg: '#fef3c7' },
            { label: 'Sessions remaining', value: stats.totalSessions, color: '#1a1320', bg: 'var(--rose-gold-light)' },
            { label: 'Need attention', value: stats.critical + stats.expired, color: '#be123c', bg: '#fee2e6' },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-2xl"
              style={{ background: '#fff', border: '1px solid var(--border)' }}
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div className="text-xs" style={{ color: '#7a6a72' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add Package form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(26,19,32,0.4)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowForm(false)}
            />
            <div
              className="relative w-full max-w-xl rounded-3xl p-8 shadow-2xl animate-fade-up overflow-y-auto max-h-[90vh]"
              style={{ background: '#fff', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-bold"
                  style={{ color: '#1a1320', letterSpacing: '-0.01em' }}
                >
                  Add Treatment Package
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg hover:opacity-60 transition-opacity"
                  style={{ color: '#7a6a72' }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <PackageForm
                onSuccess={handleNewPackage}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Filter + Search row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
                style={
                  filter === f.key
                    ? { background: '#1a1320', color: '#fff' }
                    : { background: '#fff', color: '#7a6a72', border: '1px solid var(--border)' }
                }
              >
                {f.label}
                {f.count > 0 && (
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full text-xs"
                    style={{
                      background: filter === f.key ? 'rgba(255,255,255,0.2)' : 'var(--rose-gold-light)',
                      color: filter === f.key ? '#fff' : 'var(--rose-gold-dark)',
                      fontSize: '10px',
                      fontWeight: 700,
                    }}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs ml-auto">
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#a09098' }}
            >
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search clients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                color: '#1a1320',
              }}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#c9a0a8', borderTopColor: 'transparent' }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            {packages.length === 0 ? (
              <>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--rose-gold-light)' }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M11 16 C11 12 13.5 9 16 9 C18.5 9 21 12 21 16 C21 20 18.5 24 16 24"
                      stroke="#a07880" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="16" cy="16" r="2.5" fill="#a07880"/>
                    <path d="M16 12 v-4" stroke="#a07880" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1320' }}>
                  No packages yet
                </h3>
                <p className="text-sm mb-6" style={{ color: '#7a6a72' }}>
                  Add your first prepaid treatment package to get started.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #1a1320, #2d2438)' }}
                >
                  Add First Package
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold mb-2" style={{ color: '#1a1320' }}>No matches found</p>
                <p className="text-sm" style={{ color: '#7a6a72' }}>
                  Try adjusting your filter or search term.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onUseSession={handleUseSession}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
