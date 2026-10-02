"use client";

import { useState, useEffect, useRef } from "react";
import { translations } from "@/lib/i18n";

export default function ChangeNameModal({
  currentName,
  onSave,
  onClose,
  lang = "id",
}) {
  const [name, setName] = useState(currentName || "");
  const inputRef = useRef(null);

  const t = translations[lang] || translations.id;
  const modalText = t.changeNameModal || {
    title: lang === "en" ? "Change Host Name" : "Ubah Nama Host",
    subtitle:
      lang === "en"
        ? "This name will be displayed in your dashboard and live review sessions."
        : "Nama ini akan ditampilkan di dashboard dan sesi live review Anda.",
    placeholder: lang === "en" ? "Type your new name..." : "Ketik nama baru Anda...",
    btnCancel: lang === "en" ? "Cancel" : "Batal",
    btnSave: lang === "en" ? "Save Name" : "Simpan Nama",
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

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
          maxWidth: "460px",
          width: "92vw",
          padding: "24px 28px",
        }}
      >
        <div className="modal-header" style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "var(--accent-subtle)",
                color: "var(--accent-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 10a4 4 0 100-8 4 4 0 000 8zM3.5 17.5a6.5 6.5 0 0113 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: "1.15rem", margin: 0 }}>
                {modalText.title}
              </h2>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-tertiary)",
                  margin: "3px 0 0 0",
                  lineHeight: "1.35",
                }}
              >
                {modalText.subtitle}
              </p>
            </div>
          </div>

          <button className="modal-close" onClick={onClose} aria-label="Close">
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

        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
          <div className="input-group large" style={{ marginBottom: "20px" }}>
            <svg
              className="input-icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 10a4 4 0 100-8 4 4 0 000 8zM3.5 17.5a6.5 6.5 0 0113 0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="input"
              placeholder={modalText.placeholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={40}
            />
          </div>

          <div className="form-row" style={{ justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ minWidth: "90px" }}
            >
              {modalText.btnCancel}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!name.trim()}
              style={{ minWidth: "120px" }}
            >
              {modalText.btnSave}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
