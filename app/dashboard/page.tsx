"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui";
import { LogOut, User, ShieldCheck, Smartphone, Globe, Monitor, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type UserSession = {
  id: string;
  userAgent: string;
  ipAddress: string;
  isRevoked: boolean;
  lastActiveAt: string;
  createdAt: string;
};

function parseDeviceInfo(userAgent: string) {
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  const isMac = /macintosh|mac os/i.test(userAgent);
  const isWindows = /windows/i.test(userAgent);
  const isLinux = /linux/i.test(userAgent);
  const browser = userAgent.match(/(chrome|safari|firefox|edge|opera)\/?\s*([\d.]+)/i);
  const os = isMobile ? "Mobile" : isMac ? "macOS" : isWindows ? "Windows" : isLinux ? "Linux" : "Unknown";
  return { os, browser: browser?.[1] ?? "Unknown", isMobile };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function loadSessions() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
        setCurrentId(data.currentSessionId);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function revokeSession(id: string) {
    setRevoking(id);
    try {
      const res = await fetch(`/api/auth/sessions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isRevoked: true } : s))
        );
      } else {
        const data = await res.json();
        alert(data.error ?? "Failed to revoke session");
      }
    } finally {
      setRevoking(null);
    }
  }

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

          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold text-text">Active Sessions</h2>
              <p className="text-sm text-muted mt-1">Manage devices and browsers signed into your account.</p>
            </div>

            {loading ? (
              <div className="p-6 text-center text-sm text-muted">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted">No sessions found.</div>
            ) : (
              <div className="divide-y divide-border">
                {sessions.map((s) => {
                  const info = parseDeviceInfo(s.userAgent);
                  const isCurrent = s.id === currentId;
                  return (
                    <div key={s.id} className="p-6 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          s.isRevoked ? "bg-error-bg" : isCurrent ? "bg-success-bg" : "bg-bg"
                        }`}>
                          {info.isMobile ? (
                            <Smartphone className={`w-5 h-5 ${s.isRevoked ? "text-error" : "text-text"}`} />
                          ) : (
                            <Monitor className={`w-5 h-5 ${s.isRevoked ? "text-error" : "text-text"}`} />
                          )}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm text-text capitalize">{info.os}</span>
                            <span className="text-xs text-muted">-</span>
                            <span className="text-xs text-muted capitalize">{info.browser}</span>
                            {isCurrent && (
                              <span className="text-xs bg-success-bg text-success font-medium px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                            {s.isRevoked && (
                              <span className="text-xs bg-error-bg text-error font-medium px-2 py-0.5 rounded-full">
                                Revoked
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {s.ipAddress}
                            </span>
                            <span>Last active: {formatTimeAgo(s.lastActiveAt)}</span>
                            <span>Created: {formatDate(s.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      {!s.isRevoked && !isCurrent && (
                        <button
                          onClick={() => revokeSession(s.id)}
                          disabled={revoking === s.id}
                          className="p-2 text-muted hover:text-error transition-colors flex-shrink-0 disabled:opacity-50"
                          title="Revoke session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {s.isRevoked && (
                        <XCircle className="w-5 h-5 text-error flex-shrink-0" />
                      )}
                      {isCurrent && !s.isRevoked && (
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function formatTimeAgo(dateStr: string) {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
