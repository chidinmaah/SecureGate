"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone, Globe, Trash2, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

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

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
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

export default function SessionsPage() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function loadSessions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
        setCurrentId(data.currentSessionId);
      } else {
        setError("Failed to load sessions");
      }
    } catch {
      setError("Network error");
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
    } catch {
      alert("Network error");
    } finally {
      setRevoking(null);
    }
  }

  const activeCount = sessions.filter((s) => !s.isRevoked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Sessions</h1>
          <p className="text-sm text-muted mt-1">
            {activeCount} active session{activeCount !== 1 ? "s" : ""} — manage the devices signed into your account.
          </p>
        </div>
        <button
          onClick={loadSessions}
          className="p-2 text-muted hover:text-text transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-error bg-error-bg border border-error/20 rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center text-sm text-muted">
          Loading sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center text-sm text-muted">
          No sessions found.
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl divide-y divide-border">
          {sessions.map((s) => {
            const info = parseDeviceInfo(s.userAgent);
            const isCurrent = s.id === currentId;
            return (
              <div key={s.id} className="p-4 md:p-6 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      s.isRevoked ? "bg-error-bg" : isCurrent ? "bg-success-bg" : "bg-bg"
                    }`}
                  >
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
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {s.ipAddress}
                      </span>
                      <span>Active {formatTimeAgo(s.lastActiveAt)}</span>
                      <span className="hidden sm:inline">Created {formatDate(s.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {!s.isRevoked && !isCurrent && (
                    <button
                      onClick={() => revokeSession(s.id)}
                      disabled={revoking === s.id}
                      className="p-2 text-muted hover:text-error transition-colors disabled:opacity-50"
                      title="Revoke session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {s.isRevoked && <XCircle className="w-5 h-5 text-error" />}
                  {isCurrent && !s.isRevoked && <CheckCircle2 className="w-5 h-5 text-success" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
