'use client'

import { useState, useEffect, useRef } from 'react'

const SESSION_KEY = 'skintally_auth'

interface PassphraseGateProps {
  children: React.ReactNode
}

export default function PassphraseGate({ children }: PassphraseGateProps) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [value, setValue] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY)
    setAuthed(stored === 'true')
  }, [])

  useEffect(() => {
    if (authed === false) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [authed])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const expected = process.env.NEXT_PUBLIC_PASSPHRASE ?? 'skintally2024'
    if (value === expected) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
      setShaking(true)
      setValue('')
      setTimeout(() => setShaking(false), 500)
    }
  }

  if (authed === null) return null
  if (authed) return <>{children}</>

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, #f5eef1 0%, #faf7f4 60%, #ede4e8 100%)' }}
    >
      {/* Radial accent */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,160,168,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm animate-fade-up">
        {/* Brand */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #1a1320, #2d2438)' }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M9 14 C9 10.5 11.5 8 14 8 C16.5 8 19 10.5 19 14 C19 17.5 16.5 21 14 21"
                stroke="#c9a0a8" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="14" cy="14" r="2" fill="#c9a0a8"/>
              <path d="M14 11 v-3" stroke="#c9a0a8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ color: '#1a1320', letterSpacing: '-0.02em' }}
          >
            Skintally
          </h1>
          <p className="text-sm" style={{ color: '#7a6a72' }}>
            Enter your practice passphrase to continue
          </p>
        </div>

        <div
          className="rounded-3xl p-8 shadow-xl"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(228,216,220,0.6)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="passphrase"
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: '#7a6a72' }}
              >
                Passphrase
              </label>
              <div className={['relative transition-all', shaking ? 'animate-shake' : ''].join(' ')}>
                {/* Lock icon */}
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#c9a0a8' }}
                >
                  <rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <input
                  ref={inputRef}
                  id="passphrase"
                  type={showPass ? 'text' : 'password'}
                  value={value}
                  onChange={(e) => { setValue(e.target.value); setError(false) }}
                  placeholder="Enter passphrase"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm transition-all outline-none border"
                  style={{
                    background: error ? '#fef2f4' : '#fff',
                    borderColor: error ? '#f87171' : shaking ? '#f87171' : '#e4d8dc',
                    color: '#1a1320',
                    boxShadow: error ? '0 0 0 3px rgba(248,113,113,0.15)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                  aria-label={showPass ? 'Hide passphrase' : 'Show passphrase'}
                  style={{ color: '#7a6a72' }}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M3 3l10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-xs text-red-600 animate-fade-in">
                  Incorrect passphrase. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #1a1320, #2d2438)',
                boxShadow: '0 4px 16px rgba(26,19,32,0.3)',
              }}
            >
              Enter Practice Portal
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#a09098' }}>
          Contact your practice manager for access credentials.
        </p>
      </div>
    </div>
  )
}
