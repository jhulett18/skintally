import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(250,247,244,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--navy)", letterSpacing: "-0.02em" }}
          >
            Skintally
          </span>
        </div>
        <Link
          href="/app"
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{
            background: "var(--navy)",
            color: "#fff",
          }}
        >
          Practice Portal →
        </Link>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 text-center animate-fade-up">
        <div className="max-w-3xl mx-auto">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{
              background: "var(--rose-gold-light)",
              color: "var(--rose-gold-dark)",
            }}
          >
            For South Florida Med Spas
          </span>

          <h1
            className="text-5xl font-bold leading-tight mb-6"
            style={{ color: "var(--navy)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            Never let a prepaid
            <br />
            <span style={{ color: "var(--rose-gold-dark)" }}>treatment package lapse</span>
          </h1>

          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            Skintally gives your front desk one place to log every package —
            and automatically emails clients at <strong style={{ color: "var(--navy)" }}>30, 14, and 7 days</strong> before
            their sessions expire. Stop managing packages on whiteboards and spreadsheets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-soft) 100%)",
                color: "#fff",
                boxShadow: "0 4px 24px rgba(26,19,32,0.25)",
              }}
            >
              Access Your Practice Portal
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div
        className="py-5 px-6 border-y text-center text-sm"
        style={{ background: "var(--rose-gold-light)", borderColor: "var(--rose-gold)", color: "var(--rose-gold-dark)" }}
      >
        <span className="font-semibold">One prevented refund dispute pays for 12 months.</span>
        &nbsp;Average prepaid package value: $2,400.
      </div>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--navy)", letterSpacing: "-0.02em" }}
            >
              How Skintally works
            </h2>
            <p style={{ color: "var(--muted)" }}>
              Log a package in 60 seconds. Reminders go out automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Log each package",
                desc: "Enter client email, package type, sessions purchased, sessions used, and expiry date. Takes under a minute.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 12h8M8 8h5M8 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Skintally monitors expiry",
                desc: "Your dashboard shows every active package with sessions remaining and days until expiry — at a glance.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Clients get reminder emails",
                desc: "Automatic branded emails go out at 30, 14, and 7 days before expiry — with a direct link to book their next session.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-8 rounded-2xl"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 2px 16px rgba(26,19,32,0.06)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "var(--rose-gold-light)", color: "var(--rose-gold-dark)" }}
                >
                  {item.icon}
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "var(--rose-gold-dark)" }}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--navy)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain point section */}
      <section
        className="py-20 px-6"
        style={{ background: "var(--navy)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ color: "#fff", letterSpacing: "-0.02em" }}
          >
            The problem every front desk knows
          </h2>
          <p
            className="text-lg mb-12 max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}
          >
            A client booked a 6-session laser package in January. It&apos;s now September.
            Three sessions left, package expires in 11 days. Nobody told her.
            She calls demanding a refund. Your front desk spends two hours on hold.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { stat: "82%", label: "of med spas have no marketing automation" },
              { stat: "$2,400", label: "average prepaid package value at risk" },
              { stat: "T‑30/14/7", label: "automated reminder schedule, no manual work" },
            ].map((s) => (
              <div
                key={s.stat}
                className="p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: "var(--rose-gold)" }}
                >
                  {s.stat}
                </div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--navy)", letterSpacing: "-0.02em" }}
            >
              Everything you need. Nothing you don&apos;t.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Package entry in under 60 seconds",
              "Live dashboard — sessions remaining, days to expiry",
              "Automatic T-30, T-14, T-7 reminder emails",
              "Branded emails with your booking link",
              "Passphrase-protected — no accounts to manage",
              "No EMR integration or IT setup required",
              "Works on any device — tablet, phone, desktop",
              "Instant send log — see every email that went out",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="9" cy="9" r="9" fill="var(--rose-gold-light)"/>
                  <path d="M5 9l3 3 5-5" stroke="var(--rose-gold-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm font-medium" style={{ color: "var(--navy)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 px-6 text-center"
        style={{
          background: "linear-gradient(135deg, var(--rose-gold-light) 0%, var(--cream) 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--navy)", letterSpacing: "-0.02em" }}
          >
            Start protecting your packages today
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--muted)" }}>
            Enter your practice passphrase and log your first package in under two minutes.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-soft) 100%)",
              color: "#fff",
              boxShadow: "0 4px 24px rgba(26,19,32,0.25)",
            }}
          >
            Open Practice Portal
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center text-sm"
        style={{ borderTop: "1px solid var(--border)", color: "var(--muted)" }}
      >
        <p>
          © 2026 Skintally by{" "}
          <a
            href="https://automationbyJT.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
            style={{ color: "var(--navy)" }}
          >
            automationbyJT
          </a>
          . Built for South Florida aesthetics practices.
        </p>
      </footer>
    </div>
  )
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="#1a1320"/>
      <path d="M9 14 C9 10.5 11.5 8 14 8 C16.5 8 19 10.5 19 14 C19 17.5 16.5 21 14 21"
        stroke="#c9a0a8" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="14" cy="14" r="2" fill="#c9a0a8"/>
      <path d="M14 11 v-3" stroke="#c9a0a8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
