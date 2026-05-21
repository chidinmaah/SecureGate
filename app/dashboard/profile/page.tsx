"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Input, Button, Alert } from "@/components/ui";
import { User, Lock } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [name, setName] = useState(session?.user?.name ?? "");
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    if (!name.trim()) {
      setProfileMsg({ type: "error", text: "Name is required" });
      return;
    }
    setProfileLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg({ type: "success", text: "Profile updated successfully" });
        await update();
      } else {
        setProfileMsg({ type: "error", text: data.error ?? "Failed to update profile" });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: "success", text: "Password changed successfully" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: data.error ?? "Failed to change password" });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-text">Profile</h1>
        <p className="text-sm text-muted mt-1">Manage your account details and password.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-text">Personal Information</h2>
            <p className="text-sm text-muted">Update your display name.</p>
          </div>
        </div>

        {profileMsg && <Alert type={profileMsg.type}>{profileMsg.text}</Alert>}

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text">Email</label>
            <input
              className="input-field bg-bg text-muted cursor-not-allowed"
              value={session?.user?.email ?? ""}
              disabled
            />
            <p className="text-xs text-muted">Email cannot be changed.</p>
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={profileLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-warning-bg rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h2 className="font-semibold text-text">Change Password</h2>
            <p className="text-sm text-muted">Update your account password.</p>
          </div>
        </div>

        {passwordMsg && <Alert type={passwordMsg.type}>{passwordMsg.text}</Alert>}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
          <div className="flex justify-end">
            <Button type="submit" isLoading={passwordLoading}>
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
