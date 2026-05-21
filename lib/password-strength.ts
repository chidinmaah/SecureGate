export type Strength = "weak" | "fair" | "strong";

export function getPasswordStrength(password: string): Strength {
  if (password.length < 8) return "weak";

  let types = 0;
  if (/[a-z]/.test(password)) types++;
  if (/[A-Z]/.test(password)) types++;
  if (/[0-9]/.test(password)) types++;
  if (/[^a-zA-Z0-9]/.test(password)) types++;

  if (types < 2) return "weak";
  if (types < 3) return "fair";
  return "strong";
}
