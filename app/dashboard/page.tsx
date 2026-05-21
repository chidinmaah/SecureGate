"use client";

import { useSession } from "next-auth/react";
import { ShieldCheck, User, Monitor, Calendar, Activity } from "lucide-react";
import { useEffect, useState } from "react";

type UserSession = {
  id: string;
  userAgent: string;
  ipAddress: string;
  isRevoked: boolean;
  lastActiveAt: string;
  createdAt: string;
};

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/sessions")
      .then((res) => res.ok ? res.json() : { sessions: [] })
      .then((data) => setSessions(data.sessions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeSessions = sessions.filter((s) => !s.isRevoked);
  const memberSince = session?.user?.id
    ? new Date(parseInt(session.user.id.substring(0, 8), 16) * 1000)
    : null;

  const stats = [
    {
      label: "Active Sessions",
      value: loading ? "..." : activeSessions.length,
      icon: Monitor,
      color: "text-accent bg-accent/10",
    },
    {
      label: "Account Status",
      value: "Verified",
      icon: ShieldCheck,
      color: "text-success bg-success-bg",
    },
    {
      label: "Member Since",
      value: memberSince
        ? memberSince.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "-",
      icon: Calendar,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Last Activity",
      value: activeSessions[0]
        ? new Date(activeSessions[0].lastActiveAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      icon: Activity,
      color: "text-warning bg-warning-bg",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Overview</h1>
        <p className="text-sm text-muted mt-1">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-surface border border-border rounded-xl p-5 space-y-3"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="font-semibold text-text mb-4">Account Details</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted">Name</span>
            <span className="text-sm font-medium text-text">{session?.user?.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted">Email</span>
            <span className="text-sm font-medium text-text">{session?.user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted">Email Verified</span>
            <span className="text-sm font-medium text-success">Yes</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted">User ID</span>
            <span className="text-sm font-mono text-xs text-text">{session?.user?.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
