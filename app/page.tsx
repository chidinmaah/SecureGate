import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  Monitor,
  KeyRound,
  Zap,
  Users,
  Check,
  Star,
  Menu,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const navLinks = [
  { href: "#trust", label: "Trust" },
  { href: "#features", label: "Features" },
  { href: "#benefits", label: "Benefits" },
  { href: "#testimonials", label: "Testimonials" },
];

const trustStats = [
  { value: "99.9%", label: "Uptime" },
  { value: "15+", label: "Security checks" },
  { value: "10k+", label: "Developers" },
  { value: "4.9/5", label: "Rating" },
];

const features = [
  {
    icon: KeyRound,
    title: "Secure authentication",
    description:
      "Bcrypt-hashed passwords and JWT-based sessions keep credentials safe from the start.",
  },
  {
    icon: Mail,
    title: "Email verification",
    description:
      "Time-limited verification links ensure only real, verified users gain access.",
  },
  {
    icon: Monitor,
    title: "Session management",
    description:
      "View, track, and revoke active sessions across every device from one dashboard.",
  },
  {
    icon: Lock,
    title: "Password reset flow",
    description:
      "Token-based reset links with automatic expiry for a safe recovery experience.",
  },
  {
    icon: Zap,
    title: "Rate limiting",
    description:
      "Built-in sliding-window rate limiting protects auth endpoints from abuse.",
  },
  {
    icon: ShieldCheck,
    title: "Security headers",
    description:
      "CSP, HSTS, and hardened headers configured out of the box for production.",
  },
];

const benefits = [
  "Production-ready from day one — no boilerplate to wire together",
  "Full ownership of your user data with a standalone auth system",
  "Fully typed validation with Zod and React Hook Form",
  "Accessible, responsive UI following WCAG best practices",
  "Email templates included for every authentication event",
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Senior Engineer, Fintech",
    quote:
      "SecureGate saved us weeks of work. The auth flows are rock solid and the code is clean enough to extend.",
  },
  {
    name: "David Chen",
    role: "Founder, SaaS Startup",
    quote:
      "Session management and rate limiting out of the box. We shipped our MVP in days, not months.",
  },
  {
    name: "Amara Okafor",
    role: "Lead Product Designer",
    quote:
      "The attention to accessibility and responsive detail is genuinely impressive. It just feels right.",
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  const primaryCta = session ? (
    <Link href="/dashboard" className="btn-primary text-center">
      Go to Dashboard
    </Link>
  ) : (
    <Link href="/signup" className="btn-primary text-center">
      Get Started
    </Link>
  );

  const secondaryCta = session ? null : (
    <Link
      href="/login"
      className="text-accent font-medium hover:underline px-6 py-3 text-center"
    >
      Sign In
    </Link>
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-primary">SecureGate</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-text transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted hover:text-text px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-text" aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* ── Trust signals ── */}
      <section id="trust" className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 text-primary text-sm font-medium rounded-full">
            <ShieldCheck className="w-4 h-4" />
            Built for security and trust
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
            Authentication, solved for modern developers
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            A production-ready, standalone authentication foundation with
            verification, session management, and hardened security out of the box.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {primaryCta}
            {secondaryCta}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-14 border-t border-border">
            {trustStats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-20 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-text">Everything you need to ship auth</h2>
            <p className="text-muted mt-2">
              Complete authentication features designed to be secure, fast, and easy to extend.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-bg border border-border rounded-xl p-6 space-y-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text">{feature.title}</h3>
                  <p className="text-sm text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section id="benefits" className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-text">
              Why teams choose SecureGate
            </h2>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-success-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-success" />
                  </span>
                  <span className="text-muted">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/5 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-text">Zero-config security</h3>
                <p className="text-sm text-muted">Hardened by default</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "Hashed passwords with bcrypt",
                "JWT sessions with automatic expiry",
                "Rate-limited auth endpoints",
                "Email verification & recovery",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted">{item}</span>
                  <Check className="w-4 h-4 text-success" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="px-6 py-20 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-text">Loved by developers</h2>
            <p className="text-muted mt-2">
              See what teams building on SecureGate have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="bg-bg border border-border rounded-xl p-6 space-y-4"
              >
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-muted">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-2">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto bg-primary rounded-2xl px-8 py-14 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Start building with confidence
          </h2>
          <p className="text-white/80 max-w-xl mx-auto">
            Get secure, production-ready authentication up and running in minutes —
            not weeks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {session ? (
              <Link
                href="/dashboard"
                className="bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-bg transition-colors text-center"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-bg transition-colors text-center"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="text-white font-medium hover:underline px-6 py-3 text-center"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">SecureGate</span>
          </Link>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} SecureGate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
