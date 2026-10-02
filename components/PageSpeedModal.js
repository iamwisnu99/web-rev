"use client";

import { useEffect } from "react";
import PageSpeedPanel from "./PageSpeedPanel";
import { translations } from "@/lib/i18n";

export default function PageSpeedModal({ url, onClose, lang = "id" }) {
  const t = translations[lang] || translations.id;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!url) return null;

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 1100 }}
    >
      <div
        className="modal"
        style={{
          maxWidth: "760px",
          width: "92vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-color)",
            marginBottom: 0,
            background: "var(--bg-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--accent-subtle)",
                color: "var(--accent-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2
                className="modal-title"
                style={{
                  fontSize: "1.1rem",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {t.pagespeed?.title || "PageSpeed & Lighthouse Audit"}
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "var(--color-success)",
                  }}
                >
                  Live Engine
                </span>
              </h2>
              <p
                style={{
                  fontSize: "0.76rem",
                  color: "var(--text-tertiary)",
                  margin: "2px 0 0 0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "500px",
                }}
              >
                {url}
              </p>
            </div>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Tutup / Close"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-tertiary)",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            background: "var(--bg-card)",
          }}
        >
          <PageSpeedPanel url={url} lang={lang} />
        </div>
      </div>
    </div>
  );
}
