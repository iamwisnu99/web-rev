"use client";

import { useState } from "react";
import { translations } from "@/lib/i18n";

export default function AddUrlForm({ onAdd, lang = "id" }) {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  const t = translations[lang] || translations.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAdd(url.trim(), note.trim());
    setUrl("");
    setNote("");
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {t.dashboard.addTitle}
        </h2>
      </div>
      <form className="add-url-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="input-group flex-grow">
            <svg className="input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7.5 10.5a3.75 3.75 0 005.303 0l2.25-2.25a3.75 3.75 0 00-5.303-5.303l-1.286 1.276" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10.5 7.5a3.75 3.75 0 00-5.303 0l-2.25 2.25a3.75 3.75 0 005.303 5.303l1.276-1.276" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className="input"
              placeholder={t.dashboard.urlPlaceholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group flex-grow">
            <svg className="input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 4.5h12M3 9h8M3 13.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className="input"
              placeholder={t.dashboard.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {t.dashboard.addBtn}
          </button>
        </div>
      </form>
    </div>
  );
}
