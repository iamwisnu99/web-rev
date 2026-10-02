"use client";

import { useState, useRef, useEffect } from "react";
import { FlagID, FlagUS } from "./FlagIcons";

export default function LanguageSwitcher({ lang, onSelectLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (newLang) => {
    onSelectLang(newLang);
    setIsOpen(false);
  };

  return (
    <div className="lang-switcher" ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        className="lang-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Pilih Bahasa / Choose Language"
        aria-expanded={isOpen}
      >
        <span className="lang-flag-current">
          {lang === "id" ? <FlagID width={20} height={14} /> : <FlagUS width={20} height={14} />}
        </span>
        <span className="lang-text-label">{lang === "en" ? "EN" : "ID"}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s ease",
            color: "var(--text-tertiary)",
          }}
        >
          <path
            d="M2.5 4.5L6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="lang-dropdown">
          <button
            type="button"
            className={`lang-option ${lang === "id" ? "active" : ""}`}
            onClick={() => handleSelect("id")}
          >
            <div className="lang-option-left">
              <FlagID width={22} height={15} />
              <span className="lang-option-text">INDONESIA</span>
            </div>
            {lang === "id" && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="lang-check">
                <path
                  d="M13.33 4L6 11.33 2.67 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button
            type="button"
            className={`lang-option ${lang === "en" ? "active" : ""}`}
            onClick={() => handleSelect("en")}
          >
            <div className="lang-option-left">
              <FlagUS width={22} height={15} />
              <span className="lang-option-text">ENGLISH</span>
            </div>
            {lang === "en" && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="lang-check">
                <path
                  d="M13.33 4L6 11.33 2.67 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
