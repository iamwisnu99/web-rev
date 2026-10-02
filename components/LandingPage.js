"use client";

import { useState, useEffect } from "react";
import LogoIcon from "./LogoIcon";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { translations } from "@/lib/i18n";

export default function LandingPage({
  onStartClick,
  onEnterDashboard,
  lang = "id",
  onSelectLang,
  theme = "light",
  onToggleTheme,
  onOpenLegal,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [ctaName, setCtaName] = useState("");

  const t = translations[lang] || translations.id;

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document
      .querySelectorAll(".animate-on-scroll")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleCtaSubmit = (e) => {
    e.preventDefault();
    if (ctaName.trim()) onEnterDashboard(ctaName);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div style={{ position: "relative" }}>
      <div className="bg-grid" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      {/* Navbar — Centered Navlinks */}
      <nav className={`navbar ${navScrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* Left: Brand Logo */}
          <div className="nav-logo">
            <span className="logo-icon">
              <LogoIcon />
            </span>
            <span className="logo-text">
              Web<span className="logo-accent">Rev</span>
            </span>
          </div>

          {/* Center: Rata Tengah Navlinks */}
          <div className="nav-links">
            <a href="#features" className="nav-link">
              {t.nav.features}
            </a>
            <a href="#how-it-works" className="nav-link">
              {t.nav.howItWorks}
            </a>
          </div>

          {/* Right: Theme Toggle, Language Switcher, CTA & Hamburger */}
          <div className="nav-right">
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            <LanguageSwitcher lang={lang} onSelectLang={onSelectLang} />
            <button className="btn btn-primary btn-sm nav-btn-desktop" onClick={onStartClick}>
              {t.nav.startNow}
            </button>
            <button
              className={`mobile-menu-btn ${mobileMenuOpen ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Backdrop */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown-backdrop" onClick={closeMobileMenu} />
        )}

        {/* Mobile Dropdown Menu (Fitur, Cara Kerja, Mulai Sekarang) */}
        <div className={`mobile-dropdown-menu ${mobileMenuOpen ? "active" : ""}`}>
          <div className="mobile-dropdown-content">
            <a
              href="#features"
              className="mobile-dropdown-link"
              onClick={closeMobileMenu}
            >
              <div className="dropdown-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <span className="dropdown-link-text">{t.nav.features}</span>
            </a>

            <a
              href="#how-it-works"
              className="mobile-dropdown-link"
              onClick={closeMobileMenu}
            >
              <div className="dropdown-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="dropdown-link-text">{t.nav.howItWorks}</span>
            </a>

            <div className="mobile-dropdown-divider" />

            <button
              type="button"
              className="btn btn-primary btn-block mobile-dropdown-cta"
              onClick={() => {
                closeMobileMenu();
                onStartClick();
              }}
            >
              <span>{t.nav.startNow}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 12l4-4-4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="landing-main">
        {/* Hero Section — 2-Column Split: Text Left, Mockup Card Right */}
        <header className="hero" id="hero">
        <div className="container hero-container">
          {/* Left Column: Title, Subtitle, Badges, CTAs */}
          <div className="hero-content animate-in">
            <div className="hero-badge">
              <span className="badge-dot" />
              {t.landing.badge}
            </div>
            <h1 className="hero-title">
              {t.landing.heroTitle} <br />
              <span className="gradient-text">{t.landing.heroTitleAccent}</span>
            </h1>
            <p className="hero-subtitle">{t.landing.heroSubtitle}</p>
            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={onStartClick}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 3v14M3 10h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {t.landing.startBtn}
              </button>
              <a href="#features" className="btn btn-ghost btn-lg">
                {t.landing.exploreBtn}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3v10M4 9l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Mockup Card */}
          <div className="hero-visual animate-in delay-2">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="hero-card-title">{t.landing.heroCardTitle}</span>
              </div>
              <div className="hero-card-body">
                <div className="mock-row">
                  <div className="mock-handle" />
                  <div className="mock-num">1</div>
                  <div className="mock-url wider" />
                  <div className="mock-badge done">{t.landing.mockDone}</div>
                </div>
                <div className="mock-row">
                  <div className="mock-handle" />
                  <div className="mock-num">2</div>
                  <div className="mock-url" />
                  <div className="mock-badge progress">{t.landing.mockProgress}</div>
                </div>
                <div className="mock-row">
                  <div className="mock-handle" />
                  <div className="mock-num">3</div>
                  <div className="mock-url wider" />
                  <div className="mock-badge pending">{t.landing.mockPending}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-label">{t.landing.featuresLabel}</span>
            <h2 className="section-title">
              {t.landing.featuresTitle}
              <br />
              <span className="gradient-text">{t.landing.featuresTitleAccent}</span>
            </h2>
            <p className="section-desc">{t.landing.featuresDesc}</p>
          </div>
          <div className="features-grid">
            {[
              {
                color: "#2563eb",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: t.landing.feat1Title,
                desc: t.landing.feat1Desc,
              },
              {
                color: "#0284c7",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="7" cy="6.75" r="1.5" fill="currentColor" />
                    <circle cx="7" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="7" cy="17.25" r="1.5" fill="currentColor" />
                  </svg>
                ),
                title: t.landing.feat2Title,
                desc: t.landing.feat2Desc,
              },
              {
                color: "#10b981",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9 5a2 2 0 012-2h2a2 2 0 012 2a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: t.landing.feat3Title,
                desc: t.landing.feat3Desc,
              },
              {
                color: "#2563eb",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: t.landing.feat4Title,
                desc: t.landing.feat4Desc,
              },
              {
                color: "#059669",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeOpacity="0.4" />
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 12l3.5-3.5" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                ),
                title: t.landing.feat5Title,
                desc: t.landing.feat5Desc,
              },
              {
                color: "#8b5cf6",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                ),
                title: t.landing.feat6Title,
                desc: t.landing.feat6Desc,
              },
            ].map((f, i) => (
              <div className="feature-card animate-on-scroll" key={i}>
                <div
                  className="feature-icon"
                  style={{ background: `${f.color}15`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt" id="how-it-works">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-label">{t.landing.howLabel}</span>
            <h2 className="section-title">
              {t.landing.howTitle} <span className="gradient-text">{t.landing.howTitleAccent}</span>
            </h2>
          </div>
          <div className="steps-flow">
            {[
              {
                num: t.landing.step1Num,
                title: t.landing.step1Title,
                desc: t.landing.step1Desc,
              },
              {
                num: t.landing.step2Num,
                title: t.landing.step2Title,
                desc: t.landing.step2Desc,
              },
              {
                num: t.landing.step3Num,
                title: t.landing.step3Title,
                desc: t.landing.step3Desc,
              },
            ].map((step, i) => (
              <div key={i} className="step-flow-item">
                {i > 0 && (
                  <div className="step-connector animate-on-scroll">
                    {/* Desktop: Arrow pointing right */}
                    <svg className="step-arrow-right" width="40" height="20" viewBox="0 0 40 20" fill="none">
                      <path
                        d="M0 10h32M26 5l6 5-6 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {/* Mobile: Arrow pointing down */}
                    <svg className="step-arrow-down" width="20" height="40" viewBox="0 0 20 40" fill="none">
                      <path
                        d="M10 0v32M5 26l5 6 5-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                <div className="step-card animate-on-scroll">
                  <div className="step-number">{step.num}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card animate-on-scroll">
            <h2 className="cta-title">{t.landing.ctaTitle}</h2>
            <p className="cta-desc">{t.landing.ctaDesc}</p>
            <form className="cta-form" onSubmit={handleCtaSubmit}>
              <div className="input-group">
                <svg
                  className="input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 0114 0"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  className="input"
                  placeholder={t.landing.ctaPlaceholder}
                  value={ctaName}
                  onChange={(e) => setCtaName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                {t.landing.ctaBtn}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
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
      </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-text">
                Web<span className="logo-accent">Rev</span>
              </span>
              <p className="footer-tagline">{t.landing.footerTagline}</p>
            </div>

            {/* Legal Navlinks */}
            <nav className="footer-legal-nav" aria-label="Legal Links">
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => onOpenLegal && onOpenLegal("terms")}
              >
                {t.landing.termsTitle || "Syarat & Ketentuan"}
              </button>
              <span className="footer-legal-dot">•</span>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => onOpenLegal && onOpenLegal("privacy")}
              >
                {t.landing.privacyTitle || "Kebijakan Privasi"}
              </button>
              <span className="footer-legal-dot">•</span>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => onOpenLegal && onOpenLegal("disclaimer")}
              >
                {t.landing.disclaimerTitle || "Disclaimer"}
              </button>
            </nav>

            <p className="footer-copy">{t.landing.footerCopy}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
