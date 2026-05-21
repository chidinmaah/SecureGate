import crypto from "crypto";

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function getVerificationExpiry() {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24); // 24 hours
  return expiry;
}

export function getResetPasswordExpiry() {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 1); // 1 hour
  return expiry;
}
