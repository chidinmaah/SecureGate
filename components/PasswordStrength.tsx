import { getPasswordStrength, type Strength } from "@/lib/password-strength";

const colors: Record<Strength, { bar: string; text: string; label: string }> = {
  weak: { bar: "bg-error", text: "text-error", label: "Weak" },
  fair: { bar: "bg-warning", text: "text-warning", label: "Fair" },
  strong: { bar: "bg-success", text: "text-success", label: "Strong" },
};

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  const { bar, text, label } = colors[strength];

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {["weak", "fair", "strong"].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full ${
              ["weak", "fair", "strong"].indexOf(level) <=
              ["weak", "fair", "strong"].indexOf(strength)
                ? bar
                : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${text}`}>{label}</p>
    </div>
  );
}
