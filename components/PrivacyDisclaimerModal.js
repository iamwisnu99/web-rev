"use client";

import { useState, useEffect } from "react";

/**
 * PrivacyDisclaimerModal
 * 
 * Premium modal shown once per session after the host enters the dashboard.
 * Communicates that WebRev respects the privacy & security policies of
 * reviewed websites, and some interactive features may be limited.
 */
export default function PrivacyDisclaimerModal({ isOpen, onClose, lang = "id" }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const content = {
    id: {
      badge: "Pemberitahuan Penting",
      title: "Kami Menghormati Privasi & Keamanan",
      titleAccent: "Situs yang Anda Review",
      description:
        "WebRev dirancang untuk membantu Anda melakukan review website secara profesional. Namun, setiap website memiliki kebijakan keamanan dan privasi tersendiri yang kami hormati sepenuhnya.",
      points: [
        {
          icon: "shield",
          title: "Kebijakan Keamanan Dihormati",
          desc: "Beberapa website menerapkan proteksi khusus yang membatasi akses dari lingkungan eksternal. Fitur-fitur tertentu pada website yang direview mungkin tidak dapat diakses sepenuhnya.",
        },
        {
          icon: "lock",
          title: "Autentikasi & Data Dilindungi",
          desc: "Fitur yang memerlukan login, pemrosesan data sensitif, atau interaksi backend kemungkinan akan dibatasi demi menjaga integritas keamanan website asli.",
        },
        {
          icon: "eye",
          title: "Mode Pratinjau Visual",
          desc: "Review mode kami dioptimalkan untuk evaluasi visual, tata letak, responsivitas, dan pengalaman pengguna - bukan untuk mengakses fitur operasional website.",
        },
      ],
      footerNote:
        "Untuk pengalaman lengkap, gunakan fitur \"Buka di Tab Baru\" atau \"Pop-up Studio\" yang tersedia di panel review.",
      buttonText: "Saya Mengerti",
    },
    en: {
      badge: "Important Notice",
      title: "We Respect the Privacy & Security",
      titleAccent: "of Reviewed Websites",
      description:
        "WebRev is designed to help you conduct website reviews professionally. However, each website has its own security and privacy policies that we fully respect.",
      points: [
        {
          icon: "shield",
          title: "Security Policies Honored",
          desc: "Some websites implement specific protections that restrict access from external environments. Certain features on the reviewed website may not be fully accessible.",
        },
        {
          icon: "lock",
          title: "Authentication & Data Protected",
          desc: "Features requiring login, sensitive data processing, or backend interaction may be limited to maintain the integrity of the original website's security.",
        },
        {
          icon: "eye",
          title: "Visual Preview Mode",
          desc: "Our review mode is optimized for visual evaluation, layout, responsiveness, and user experience - not for accessing operational website features.",
        },
      ],
      footerNote:
        'For a complete experience, use the "Open in New Tab" or "Pop-up Studio" features available in the review panel.',
      buttonText: "I Understand",
    },
  };

  const t = content[lang] || content.id;

  const icons = {
    shield: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    lock: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
        <circle cx="12" cy="16" r="1" />
      </svg>
    ),
    eye: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        opacity: isAnimating ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "540px",
          background: "var(--bg-primary)",
          borderRadius: "20px",
          border: "1px solid var(--border-color)",
          boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          transform: isAnimating ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Gradient Header Accent */}
        <div
          style={{
            height: "4px",
            background: "linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa, #2563eb)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        />

        <div style={{ padding: "32px 28px 28px" }}>
          {/* Badge */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 14px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(59, 130, 246, 0.12))",
                color: "#3b82f6",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                border: "1px solid rgba(59, 130, 246, 0.25)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {t.badge}
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              textAlign: "center",
              fontSize: "1.35rem",
              fontWeight: 800,
              lineHeight: 1.3,
              color: "var(--text-primary)",
              margin: "0 0 8px 0",
            }}
          >
            {t.title}
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.titleAccent}
            </span>
          </h2>

          {/* Description */}
          <p
            style={{
              textAlign: "center",
              fontSize: "0.85rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.6,
              margin: "0 0 24px 0",
              maxWidth: "440px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {t.description}
          </p>

          {/* Points */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
            {t.points.map((point, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  transition: "border-color 0.2s ease",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      idx === 0
                        ? "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(37, 99, 235, 0.05))"
                        : idx === 1
                          ? "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))"
                          : "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))",
                    color:
                      idx === 0 ? "#3b82f6" : idx === 1 ? "#f59e0b" : "#10b981",
                  }}
                >
                  {icons[point.icon]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: "0 0 3px 0",
                    }}
                  >
                    {point.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--text-tertiary)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, rgba(37, 99, 235, 0.06), rgba(59, 130, 246, 0.06))",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                fontSize: "0.74rem",
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                margin: 0,
                textAlign: "center",
              }}
            >
              💡 {t.footerNote}
            </p>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              padding: "13px 24px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              letterSpacing: "0.01em",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 99, 235, 0.45)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(37, 99, 235, 0.35)";
            }}
          >
            {t.buttonText}
          </button>
        </div>
      </div>

      {/* Shimmer animation for the gradient bar */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
