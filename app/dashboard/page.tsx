"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui";
import { LogOut, User, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-bg">
      <nav className="bg-surface border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-primary">SecureGate</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-bg border border-border rounded-full">
              <User className="w-4 h-4 text-muted" />
              <span className="text-xs font-medium text-text">{session?.user?.email}</span>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 text-muted hover:text-error transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-[32px] font-bold text-text">Welcome back, {session?.user?.name}</h1>
            <p className="text-muted">You are successfully authenticated and verified.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border p-6 rounded-xl space-y-4">
              <div className="w-10 h-10 bg-success-bg rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-text">Security Status</h3>
              <p className="text-sm text-muted">Your account is fully protected with SecureGate identity management.</p>
            </div>
            
            <div className="bg-surface border border-border p-6 rounded-xl space-y-4 md:col-span-2">
              <h3 className="font-semibold text-text">Your Identity</h3>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted">Email</span>
                  <span className="text-sm font-medium text-text">{session?.user?.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted">Account ID</span>
                  <span className="text-sm font-mono text-xs text-text">{session?.user?.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
