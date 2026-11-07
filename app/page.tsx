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
  Fingerprint,
  ArrowRight,
  Smartphone,
  QrCode,
  Bell,
  BadgeCheck,
  ScanFace,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from "@/components/Header";

const trustStats = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "15+", label: "Security checks" },
  { value: "10k+", label: "Developers" },
  { value: "4.9/5", label: "G2 rating" },
];

const compliance = [
  { label: "OWASP", detail: "Top 10 compliant" },
  { label: "GDPR", detail: "Data protection" },
  { label: "SOC 2", detail: "Type II audited" },
  { label: "WCAG 2.2", detail: "Accessible by default" },
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
    icon: Fingerprint,
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

  return (
    <div className="min-h-screen bg-brand-ink text-white antialiased overflow-x-hidden scroll-smooth">
      {/* ── Header ── */}
      <Header session={!!session} />

      {/* ── Hero ── */}
      <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-32 w-[24rem] h-[24rem] md:w-[42rem] md:h-[42rem] rounded-full bg-[#01A79E]/20 blur-[120px]" />
          <div className="absolute top-10 right-0 w-[20rem] h-[20rem] md:w-[34rem] md:h-[34rem] rounded-full bg-[#1279A6]/20 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[16rem] h-[16rem] md:w-[28rem] md:h-[28rem] rounded-full bg-[#26C165]/10 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-sm font-medium text-brand-mint">
              <BadgeCheck className="w-4 h-4 text-brand" />
              Production-ready authentication
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              <span className="text-gradient">Secure access</span> for the
              modern product
            </h1>

            <p className="text-lg text-white/60 max-w-xl leading-relaxed">
              A production-ready, standalone authentication foundation with
              verification, session management, and hardened security — so you
              can ship with confidence in minutes, not weeks.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white font-semibold px-7 py-3.5 rounded-full transition-all shadow-lg shadow-brand/30"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white font-semibold px-7 py-3.5 rounded-full transition-all shadow-lg shadow-brand/30"
                  >
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white font-medium px-6 py-3.5 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/10">
              {trustStats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute -inset-8 bg-gradient-to-tr from-brand/20 to-[#1279A6]/20 blur-3xl rounded-full" />
            <div className="relative w-[260px] sm:w-[300px] rounded-[3rem] border border-white/15 bg-white/[0.05] backdrop-blur-2xl p-3 shadow-2xl">
              <div className="rounded-[2.4rem] bg-brand-darker border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-xs font-semibold text-white">
                      SecureGate
                    </span>
                  </div>
                  <Bell className="w-4 h-4 text-white/50" />
                </div>

                <div className="px-5 py-6 space-y-4">
                  <div>
                    <p className="text-xs text-white/60">Welcome back</p>
                    <p className="text-sm font-semibold text-white">
                      Good morning, Ada
                    </p>
                  </div>

                  <div className="glass-dark rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center">
                        <Fingerprint className="w-5 h-5 text-brand" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-white">
                          Biometric verified
                        </p>
                        <p className="text-[11px] text-white/60">
                          Face ID · Just now
                        </p>
                      </div>
                      <BadgeCheck className="w-4 h-4 text-brand-green" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">Active sessions</span>
                      <span className="text-brand-mint font-medium">3 devices</span>
                    </div>
                    {[
                      { icon: Smartphone, label: "iPhone 15 Pro", place: "Lagos, NG" },
                      { icon: Monitor, label: "MacBook Pro", place: "Remote" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center gap-3 glass-dark rounded-xl px-3 py-2.5"
                      >
                        <s.icon className="w-4 h-4 text-white/50" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-white">
                            {s.label}
                          </p>
                          <p className="text-[11px] text-white/60">{s.place}</p>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-brand p-3.5">
                    <ScanFace className="w-5 h-5 text-white" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">
                        Identity verified
                      </p>
                      <p className="text-[11px] text-white/80">
                        KYC &amp; email confirmed
                      </p>
                    </div>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compliance strip ── */}
      <section className="px-6 py-10 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-6">
          {compliance.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand" />
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-white/60">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-20 md:py-28 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-brand mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Everything you need to ship auth
            </h2>
            <p className="text-white/60 mt-3">
              Complete authentication features designed to be secure, fast, and
              easy to extend.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group glass-dark rounded-3xl p-7 space-y-5 transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-[#0fb5ad] flex items-center justify-center shadow-lg shadow-brand/25">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section
        id="benefits"
        className="relative px-6 py-20 md:py-28 border-y border-white/10 bg-white/[0.02] scroll-mt-20"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 right-0 w-[30rem] h-[30rem] rounded-full bg-brand/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="space-y-7">
            <p className="text-sm font-semibold text-brand mb-3">Why SecureGate</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Why teams choose SecureGate
            </h2>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-brand" />
                  </span>
                  <span className="text-white/70">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-dark rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-brand/15">
                <ShieldCheck className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Zero-config security</h3>
                <p className="text-sm text-white/60">Hardened by default</p>
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
                  className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                >
                  <span className="text-sm text-white/60">{item}</span>
                  <Check className="w-4 h-4 text-brand-green" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="px-6 py-20 md:py-28 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-brand mb-3">Customers</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Loved by developers
            </h2>
            <p className="text-white/60 mt-3">
              See what teams building on SecureGate have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="glass-dark rounded-3xl p-7 space-y-5"
              >
                <div className="flex gap-1 text-[#F5C518]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-white/60 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-[#1279A6] flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/60">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-brand-deep via-brand-darker to-brand-ink border border-white/10 px-8 py-16 md:px-16 md:py-20 text-center">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] rounded-full bg-brand/20 blur-[100px]" />
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 mx-auto px-4 py-1.5 rounded-full glass-dark text-sm font-medium text-brand-mint">
              <QrCode className="w-4 h-4 text-brand" />
              Start your security journey today
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Start building with
              <br className="hidden md:block" /> confidence
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Get secure, production-ready authentication up and running in
              minutes — not weeks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-white text-brand-deep font-semibold px-7 py-3.5 rounded-full hover:bg-brand-mint transition-colors"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 bg-white text-brand-deep font-semibold px-7 py-3.5 rounded-full hover:bg-brand-mint transition-colors"
                  >
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="text-white font-medium hover:text-brand-mint px-6 py-3.5 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-[#0fb5ad] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </span>
            <span className="font-bold text-white">SecureGate</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/60">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="hover:text-white transition-colors">
              Why SecureGate
            </Link>
            <Link href="#testimonials" className="hover:text-white transition-colors">
              Customers
            </Link>
          </div>

          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} SecureGate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
