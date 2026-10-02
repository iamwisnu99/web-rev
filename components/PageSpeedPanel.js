"use client";

import { useState, useEffect } from "react";
import PageSpeedGauge from "./PageSpeedGauge";
import { translations } from "@/lib/i18n";

export default function PageSpeedPanel({ url, lang = "id", autoRun = true }) {
  const [strategy, setStrategy] = useState("mobile"); // 'mobile' | 'desktop'
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [error, setError] = useState(null);

  const t = translations[lang] || translations.id;

  const runAudit = async (targetUrl = url, targetStrategy = strategy) => {
    if (!targetUrl) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(targetUrl)}&strategy=${targetStrategy}&lang=${lang}`
      );
      const json = await res.json();
      if (json.success) {
        setAuditData(json);
      } else {
        setError(json.error || "Gagal memuat audit / Audit failed");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // Run automatically when URL or lang changes
  useEffect(() => {
    if (autoRun && url) {
      runAudit(url, strategy);
    }
  }, [url, lang]);

  const handleStrategyChange = (newStrategy) => {
    setStrategy(newStrategy);
    if (url) {
      runAudit(url, newStrategy);
    }
  };

  return (
    <div className="pagespeed-panel">
      {/* Google Cloud API Status Notice Banner */}
      {auditData?.apiNotice && (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.28)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            marginBottom: "14px",
            fontSize: "0.78rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            lineHeight: "1.45",
          }}
        >
          <div style={{ color: "#d97706", flexShrink: 0, marginTop: "1px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
              {auditData.apiNotice.message}
            </div>
            {auditData.apiNotice.actionUrl && (
              <a
                href={auditData.apiNotice.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--accent-primary)",
                  fontWeight: 700,
                  textDecoration: "underline",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "3px",
                }}
              >
                <span>{auditData.apiNotice.actionText || "Aktifkan di Google Cloud"}</span>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3h7v7M13 3L6 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Strategy Toggle & Re-run Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Device Switcher */}
        <div
          style={{
            display: "inline-flex",
            background: "var(--bg-tertiary)",
            borderRadius: "var(--radius-sm)",
            padding: "3px",
            border: "1px solid var(--border-color)",
          }}
        >
          <button
            type="button"
            style={{
              padding: "4px 10px",
              borderRadius: "4px",
              background: strategy === "mobile" ? "var(--bg-secondary)" : "transparent",
              color: strategy === "mobile" ? "var(--accent-primary)" : "var(--text-secondary)",
              fontSize: "0.75rem",
              fontWeight: 600,
              boxShadow: strategy === "mobile" ? "var(--shadow-xs)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            onClick={() => handleStrategyChange("mobile")}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="1" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="12" r="1" fill="currentColor" />
            </svg>
            {t.pagespeed.strategyMobile}
          </button>
          <button
            type="button"
            style={{
              padding: "4px 10px",
              borderRadius: "4px",
              background: strategy === "desktop" ? "var(--bg-secondary)" : "transparent",
              color: strategy === "desktop" ? "var(--accent-primary)" : "var(--text-secondary)",
              fontSize: "0.75rem",
              fontWeight: 600,
              boxShadow: strategy === "desktop" ? "var(--shadow-xs)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            onClick={() => handleStrategyChange("desktop")}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 14h6M8 12v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {t.pagespeed.strategyDesktop}
          </button>
        </div>

        {/* Run/Re-run Button */}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => runAudit()}
          disabled={loading}
          style={{ height: "30px", fontSize: "0.75rem", padding: "0 10px" }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            style={{ animation: loading ? "spin 1s linear infinite" : "none" }}
          >
            <path
              d="M14 8A6 6 0 114.54 3.54"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M14 2v4h-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {loading ? t.pagespeed.analyzing : t.pagespeed.reRunBtn}
        </button>
      </div>

      {/* Loading state animation */}
      {loading && (
        <div
          style={{
            padding: "36px 16px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            background: "var(--bg-tertiary)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid var(--border-color)",
              borderTopColor: "var(--accent-primary)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "4px",
              }}
            >
              {t.pagespeed.analyzing}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
              {t.pagespeed.analyzingDesc}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          style={{
            padding: "16px",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-danger)",
            fontSize: "0.8rem",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* Results View */}
      {!loading && auditData && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* 4 Score Gauges */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
              padding: "14px 10px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <PageSpeedGauge
              score={auditData.scores.performance}
              title={t.pagespeed.performance}
              size={68}
            />
            <PageSpeedGauge
              score={auditData.scores.accessibility}
              title={t.pagespeed.accessibility}
              size={68}
            />
            <PageSpeedGauge
              score={auditData.scores.bestPractices}
              title={t.pagespeed.bestPractices}
              size={68}
            />
            <PageSpeedGauge
              score={auditData.scores.seo}
              title={t.pagespeed.seo}
              size={68}
            />
          </div>

          {/* Core Web Vitals Metrics Grid */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "14px",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{t.pagespeed.coreWebVitals}</span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "var(--accent-primary)",
                  background: "var(--accent-subtle)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {strategy.toUpperCase()}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
              }}
            >
              {[
                { label: "FCP (First Contentful Paint)", value: auditData.metrics.fcp },
                { label: "LCP (Largest Contentful Paint)", value: auditData.metrics.lcp },
                { label: "CLS (Cumulative Layout Shift)", value: auditData.metrics.cls },
                { label: "TBT (Total Blocking Time)", value: auditData.metrics.tbt },
                { label: "Speed Index", value: auditData.metrics.speedIndex },
              ].map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px 10px",
                    background: "var(--bg-tertiary)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--text-tertiary)",
                      marginBottom: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={m.label}
                  >
                    {m.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                    }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Opportunities */}
          {auditData.opportunities && auditData.opportunities.length > 0 && (
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "14px",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                {t.pagespeed.opportunities}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {auditData.opportunities.map((opp, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "8px 10px",
                      background: "var(--bg-tertiary)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {opp.title}
                      </span>
                      {opp.displayValue && (
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: "#d97706",
                            background: "rgba(245, 158, 11, 0.12)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {opp.displayValue}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer source badge */}
          <div
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L2 4v5c0 3.5 2.5 6.5 6 7 3.5-.5 6-3.5 6-7V4l-6-3z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
            <span>{auditData.source || t.pagespeed.poweredBy}</span>
          </div>
        </div>
      )}
    </div>
  );
}
