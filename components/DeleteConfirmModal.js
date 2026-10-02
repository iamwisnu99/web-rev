"use client";

import { useEffect } from "react";
import { translations } from "@/lib/i18n";

export default function DeleteConfirmModal({
  item,
  onConfirm,
  onClose,
  lang = "id",
}) {
  const t = translations[lang] || translations.id;
  const deleteText = t.deleteModal || {
    title: lang === "en" ? "Delete Website from Queue?" : "Hapus Website dari Antrean?",
    desc:
      lang === "en"
        ? "Are you sure you want to remove this website from the review queue? This action cannot be undone."
        : "Apakah Anda yakin ingin menghapus website ini dari daftar review? Tindakan ini tidak dapat dibatalkan.",
    btnCancel: lang === "en" ? "Cancel" : "Batal",
    btnConfirm: lang === "en" ? "Yes, Delete Website" : "Ya, Hapus Website",
  };

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

  if (!item) return null;

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 1200 }}
    >
      <div
        className="modal"
        style={{
          maxWidth: "480px",
          width: "92vw",
          padding: "26px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          {/* Warning Icon with Red Accent */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.12)",
              color: "var(--color-danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 6px 0",
              }}
            >
              {deleteText.title}
            </h3>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
                margin: "0 0 14px 0",
                lineHeight: "1.45",
              }}
            >
              {deleteText.desc}
            </p>

            {/* Target URL highlight card */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "10px 12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  wordBreak: "break-all",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="3" y="6" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                <span>{item.url}</span>
              </div>
              {item.note && (
                <div
                  style={{
                    fontSize: "0.76rem",
                    color: "var(--text-tertiary)",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>Catatan:</span>
                  <span>{item.note}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onClose}
                style={{ minWidth: "85px" }}
              >
                {deleteText.btnCancel}
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => onConfirm(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  minWidth: "120px",
                  justifyContent: "center",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4M12.67 4v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {deleteText.btnConfirm}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
