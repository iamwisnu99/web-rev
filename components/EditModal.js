"use client";

import { useState, useEffect } from "react";
import { translations } from "@/lib/i18n";

export default function EditModal({ item, onSave, onDelete, onClose, lang = "id" }) {
  const [url, setUrl] = useState(item?.url || "");
  const [status, setStatus] = useState(item?.status || "pending");
  const [note, setNote] = useState(item?.note || "");

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

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSave(item.id, { url: url.trim(), status, note: note.trim() });
  };

  const handleDelete = () => {
    onDelete(item.id);
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
          <h2 className="modal-title">{t.modal.editTitle}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Tutup / Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-group large">
            <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M8.33 11.67a4.17 4.17 0 005.893 0l2.5-2.5a4.17 4.17 0 00-5.893-5.893l-1.429 1.418"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11.67 8.33a4.17 4.17 0 00-5.893 0l-2.5 2.5a4.17 4.17 0 005.893 5.893l1.418-1.418"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              className="input"
              placeholder="https://contoh-website.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <select
              className="input select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">{t.modal.statusPending}</option>
              <option value="in-progress">{t.modal.statusProgress}</option>
              <option value="reviewed">{t.modal.statusReviewed}</option>
            </select>
          </div>

          <div className="input-group large">
            <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 5h14M3 10h9M3 15h11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              className="input"
              placeholder={t.dashboard.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="form-row">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4M12.67 4v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t.modal.btnDelete}
            </button>
            <button type="submit" className="btn btn-primary flex-grow">
              {t.modal.btnSave}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
