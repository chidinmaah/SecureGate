import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg px-6">
      <div className="max-w-xl text-center space-y-8">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/5 rounded-2xl">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-[45px] md:text-[57px] font-bold leading-tight tracking-tight text-primary">
            SecureGate
          </h1>
          <p className="text-lg text-muted max-w-md mx-auto">
            A production-ready, standalone authentication foundation built for security and trust.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/signup" 
            className="btn-primary w-full sm:w-auto text-center"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="text-accent font-medium hover:underline px-6 py-3"
          >
            Sign In
          </Link>
        </div>

        <div className="pt-12 text-xs text-muted/60 uppercase tracking-widest font-semibold">
          Built with Next.js 14 • Prisma • NextAuth • Upstash
        </div>
      </div>
    </main>
  );
}
