"use client";

import { useState, useEffect, useMemo } from "react";
import LogoIcon from "./LogoIcon";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { legalDocsData } from "@/lib/legalContent";

export default function LegalPage({
  initialDoc = "terms",
  lang = "id",
  onSelectLang,
  theme = "light",
  onToggleTheme,
  onBack,
  backLabel,
}) {
  const [activeDocId, setActiveDocId] = useState(initialDoc);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const localizedData = legalDocsData[lang] || legalDocsData.id;
  const { ui, docs } = localizedData;

  // Active document
  const activeDoc = useMemo(() => {
    return docs.find((d) => d.id === activeDocId) || docs[0];
  }, [docs, activeDocId]);

  // Sync initialDoc when prop changes
  useEffect(() => {
    if (initialDoc) {
      setActiveDocId(initialDoc);
    }
  }, [initialDoc]);

  // Handle section copy link
  const handleCopySection = (sectionId) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(sectionId);
        setTimeout(() => setCopiedId(null), 2000);
      });
    }
  };

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return activeDoc.sections;
    const query = searchQuery.toLowerCase();
    return activeDoc.sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(query) ||
        sec.content.some((c) => c.toLowerCase().includes(query)) ||
        (sec.items && sec.items.some((i) => i.toLowerCase().includes(query))) ||
        (sec.tag && sec.tag.toLowerCase().includes(query))
    );
  }, [activeDoc, searchQuery]);

  // Previous & Next navigation
  const currentIndex = docs.findIndex((d) => d.id === activeDoc.id);
  const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null;
  const nextDoc = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;

  return (
    <div className="legal-portal">
      {/* Top Navbar Styled as Developer Documentation Header */}
      <header className="legal-header">
        <div className="legal-header-inner">
          <div className="legal-header-left">
            <button
              type="button"
              className="legal-back-btn"
              onClick={onBack}
              title={backLabel || ui.backBtn}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{backLabel || ui.backBtn}</span>
            </button>

            <div className="legal-brand" onClick={onBack} style={{ cursor: "pointer" }}>
              <span className="logo-icon">
                <LogoIcon />
              </span>
              <span className="logo-text">
                Web<span className="logo-accent">Rev</span>
              </span>
              <span className="legal-docs-pill">DOCS · LEGAL</span>
            </div>
          </div>

          {/* Search bar inside header */}
          <div className="legal-search-wrapper">
            <svg
              className="legal-search-icon"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9 16A7 7 0 109 2a7 7 0 000 14zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              className="legal-search-input"
              placeholder={ui.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="legal-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className="legal-header-right">
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            <LanguageSwitcher lang={lang} onSelectLang={onSelectLang} />

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="legal-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Document Menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Documentation Layout */}
      <div className="legal-container">
        {/* Left Sidebar (API Docs style menu) */}
        <aside className={`legal-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="legal-sidebar-header">
            <span className="legal-sidebar-title">{ui.sidebarHeader}</span>
            <span className="legal-version-badge">v1.2</span>
          </div>

          <nav className="legal-nav-list">
            {docs.map((doc) => {
              const isActive = doc.id === activeDoc.id;
              return (
                <div key={doc.id} className="legal-nav-group">
                  <button
                    type="button"
                    className={`legal-nav-item ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setActiveDocId(doc.id);
                      setSearchQuery("");
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <span className="legal-nav-method">{doc.method}</span>
                    <div className="legal-nav-text">
                      <span className="legal-nav-name">{doc.navTitle}</span>
                      <span className="legal-nav-sub">{doc.navDesc}</span>
                    </div>
                  </button>

                  {/* Sub-sections anchor links when active */}
                  {isActive && !searchQuery && (
                    <div className="legal-nav-sublinks">
                      {doc.sections.map((sec) => (
                        <a
                          key={sec.id}
                          href={`#${sec.id}`}
                          className="legal-sublink"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="legal-sublink-num">{sec.number}</span>
                          <span className="legal-sublink-title">{sec.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileMenuOpen && (
          <div
            className="legal-sidebar-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="legal-main">
          {/* Document Header (API Spec Style) */}
          <div className="legal-doc-header">
            <div className="legal-breadcrumbs">
              <span>WebRev Docs</span>
              <span className="legal-crumb-sep">/</span>
              <span>Legal</span>
              <span className="legal-crumb-sep">/</span>
              <span className="legal-crumb-active">{activeDoc.navTitle}</span>
            </div>

            <div className="legal-doc-title-row">
              <h1 className="legal-doc-title">{activeDoc.title}</h1>
              <span className="legal-doc-code">{activeDoc.docCode}</span>
            </div>

            {/* API Endpoint-like strip */}
            <div className="legal-endpoint-box">
              <span className="legal-endpoint-method">{activeDoc.method}</span>
              <code className="legal-endpoint-path">{activeDoc.endpoint}</code>
              <span className="legal-endpoint-status">
                <span className="status-dot-pulse" />
                {activeDoc.version}
              </span>
            </div>

            {/* Summary description card */}
            <div className="legal-summary-card">
              <p className="legal-summary-text">{activeDoc.summary}</p>
              <div className="legal-spec-badges">
                {activeDoc.specBadges.map((badge, idx) => (
                  <div key={idx} className="legal-spec-pill">
                    <span className="legal-spec-label">{badge.label}:</span>
                    <span className="legal-spec-val">{badge.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="legal-meta-strip">
              <div className="legal-meta-item">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>
                  {ui.lastUpdated}: <strong>{activeDoc.lastUpdated}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="legal-divider" />

          {/* Search result indicator */}
          {searchQuery && (
            <div className="legal-search-indicator">
              <span>
                Menampilkan hasil untuk: <strong>&quot;{searchQuery}&quot;</strong> (
                {filteredSections.length} pasal ditemukan)
              </span>
              <button
                type="button"
                className="legal-clear-link"
                onClick={() => setSearchQuery("")}
              >
                Reset pencarian
              </button>
            </div>
          )}

          {/* Empty search */}
          {filteredSections.length === 0 && (
            <div className="legal-empty-search">
              <p>{ui.emptySearch}</p>
            </div>
          )}

          {/* Sections List */}
          <div className="legal-sections-list">
            {filteredSections.map((sec) => (
              <section key={sec.id} id={sec.id} className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-title-wrap">
                    <span className="legal-section-num">{sec.number}</span>
                    <h2 className="legal-section-title">{sec.title}</h2>
                  </div>

                  <div className="legal-section-tools">
                    {sec.tag && <span className="legal-tag-pill">{sec.tag}</span>}
                    <button
                      type="button"
                      className="legal-copy-link-btn"
                      onClick={() => handleCopySection(sec.id)}
                      title={ui.copyLink}
                    >
                      {copiedId === sec.id ? (
                        <span className="legal-copied-text">{ui.copied}</span>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M6.67 9.33a2.67 2.67 0 003.77 0l2.67-2.67a2.67 2.67 0 10-3.77-3.77L8 4.22M9.33 6.67a2.67 2.67 0 00-3.77 0L2.89 9.33a2.67 2.67 0 103.77 3.77L8 11.78"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Section Content */}
                <div className="legal-section-body">
                  {sec.content.map((p, pIdx) => (
                    <p key={pIdx} className="legal-paragraph">
                      {p}
                    </p>
                  ))}

                  {/* Bullet items */}
                  {sec.items && sec.items.length > 0 && (
                    <ul className="legal-item-list">
                      {sec.items.map((item, iIdx) => (
                        <li key={iIdx} className="legal-item">
                          <span className="legal-item-bullet" />
                          <span className="legal-item-text">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Code block (API Schema / storage schema) */}
                  {sec.codeBlock && (
                    <div className="legal-codeblock">
                      <div className="legal-codeblock-bar">
                        <span className="legal-codeblock-title">
                          {sec.codeBlock.title}
                        </span>
                        <span className="legal-codeblock-lang">JSON / SPEC</span>
                      </div>
                      <pre className="legal-pre">
                        <code>{sec.codeBlock.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Callout box */}
                  {sec.callout && (
                    <div className={`legal-callout callout-${sec.callout.type}`}>
                      <div className="legal-callout-icon">
                        {sec.callout.type === "warning" ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <div className="legal-callout-content">
                        <span className="legal-callout-title">{sec.callout.title}</span>
                        <p className="legal-callout-text">{sec.callout.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Bottom Previous / Next Navigation */}
          <div className="legal-bottom-nav">
            {prevDoc ? (
              <button
                type="button"
                className="legal-doc-turn-btn prev"
                onClick={() => {
                  setActiveDocId(prevDoc.id);
                  setSearchQuery("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <span className="turn-label">← {ui.prevDoc}</span>
                <span className="turn-title">{prevDoc.navTitle}</span>
              </button>
            ) : (
              <div />
            )}

            {nextDoc ? (
              <button
                type="button"
                className="legal-doc-turn-btn next"
                onClick={() => {
                  setActiveDocId(nextDoc.id);
                  setSearchQuery("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <span className="turn-label">{ui.nextDoc} →</span>
                <span className="turn-title">{nextDoc.navTitle}</span>
              </button>
            ) : (
              <div />
            )}
          </div>
        </main>

        {/* Right Rail: Table of Contents (On this page) for wide screens */}
        <aside className="legal-toc-aside">
          <div className="legal-toc-card">
            <span className="legal-toc-title">{ui.tableOfContents}</span>
            <nav className="legal-toc-nav">
              {activeDoc.sections.map((sec) => (
                <a key={sec.id} href={`#${sec.id}`} className="legal-toc-link">
                  <span className="legal-toc-num">{sec.number}</span>
                  <span className="legal-toc-text">{sec.title}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
