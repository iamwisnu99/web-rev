"use client";

import { useState, useEffect, useRef } from "react";
import { translations } from "@/lib/i18n";

export default function NameModal({ onSubmit, onClose, lang = "id" }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  const t = translations[lang] || translations.id;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 100);
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
    if (name.trim()) onSubmit(name);
  };

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {t.modal.nameTitle} <span className="gradient-text">WebRev</span>
          </h2>
          <p className="modal-subtitle">{t.modal.nameSubtitle}</p>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-group large">
            <svg
              className="input-icon"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M11 11a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM3 20a8 8 0 0116 0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="input"
              placeholder={t.modal.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-full">
            {t.modal.nameSubmit}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9h12M11 5l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
