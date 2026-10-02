"use client";

export default function PageSpeedGauge({ score, title, size = 80 }) {
  const radius = 32;
  const strokeWidth = 5.5;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, score ?? 0));
  const offset = circumference - (safeScore / 100) * circumference;

  let color = "#ef4444"; // red
  let bgTint = "rgba(239, 68, 68, 0.1)";
  if (safeScore >= 90) {
    color = "#10b981"; // green
    bgTint = "rgba(16, 185, 129, 0.1)";
  } else if (safeScore >= 50) {
    color = "#f59e0b"; // orange/amber
    bgTint = "rgba(245, 158, 11, 0.1)";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 80 80"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background circle track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Filled progress circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>

        {/* Center score */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size > 80 ? "1.4rem" : "1.15rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          {safeScore}
        </div>
      </div>

      {title && (
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            textAlign: "center",
          }}
        >
          {title}
        </span>
      )}
    </div>
  );
}
