"use client";

import { useState } from "react";
import { formatTime } from "@/lib/utils";
import { translations } from "@/lib/i18n";
import { getDonationTier, formatRupiah, parseDonationMeta } from "@/lib/donationTiers";

export default function UrlItem({
  item,
  index,
  totalItems,
  onCycleStatus,
  onOpenUrl,
  onStartReview,
  onTestSpeed,
  onEdit,
  onDelete,
  onEditDonation,
  onVerifyDonation,
  onRejectDonation,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDragging,
  dragOverPosition,
  lang = "id",
}) {
  const t = translations[lang] || translations.id;

  const STATUS_CONFIG = {
    pending: {
      label: lang === "en" ? "Pending" : "Menunggu",
      badgeClass: "pending",
    },
    "in-progress": {
      label: lang === "en" ? "In Progress" : "Dalam Proses",
      badgeClass: "in-progress",
    },
    reviewed: {
      label: lang === "en" ? "Completed" : "Selesai",
      badgeClass: "reviewed",
    },
  };

  const statusInfo = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;

  // Extract donation metadata safely so raw tags are never shown
  const meta = (item.donationAmount === undefined || !item.donationStatus) && item.note
    ? parseDonationMeta(item.note)
    : null;
  const donationAmount = item.donationAmount !== undefined ? item.donationAmount : (meta ? meta.donationAmount : 0);
  const donationTxId = item.donationTxId !== undefined ? item.donationTxId : (meta ? meta.donationTxId : "");
  const donationStatus = item.donationStatus !== undefined ? item.donationStatus : (meta ? meta.donationStatus : "none");
  const displayNote = (meta ? meta.cleanNote : item.note || "").replace(/^\[DONASI:[^\]]+\]\s*/i, "").trim();

  const isPendingVerification = donationAmount > 0 && donationStatus === "pending_verification";
  const tier = donationAmount > 0 && donationStatus !== "rejected" ? getDonationTier(donationAmount) : null;

  return (
    <div
      className={`url-item ${item.status === "reviewed" ? "reviewed" : ""} ${
        isDragging ? "dragging" : ""
      } ${dragOverPosition === "top" ? "drag-over-top" : ""} ${
        dragOverPosition === "bottom" ? "drag-over-bottom" : ""
      } ${isPendingVerification ? "item-pending-verify" : tier ? `item-${tier.tier}` : ""} ${
        tier?.hasGlow && !isPendingVerification ? "item-gold-glow" : ""
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
    >
      {/* Drag handle with modern 6-dot grip icon */}
      <div
        className="drag-handle"
        title={t.dashboard.dragTooltip}
        aria-label="Drag to reorder"
      >
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
          <circle cx="4" cy="4" r="1.5" fill="currentColor" />
          <circle cx="10" cy="4" r="1.5" fill="currentColor" />
          <circle cx="4" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="4" cy="16" r="1.5" fill="currentColor" />
          <circle cx="10" cy="16" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Queue Order Number */}
      <div className={`url-order-num ${tier ? "order-priority" : ""}`} title={`${t.dashboard.orderTooltip}${index + 1}`}>
        {tier ? (
          <span className="order-tier-icon" title={`Prioritas Donasi: ${formatRupiah(donationAmount)}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </span>
        ) : (
          index + 1
        )}
      </div>

      {/* URL Content */}
      <div className="url-content">
        {/* Header Row: URL & Priority / Pending Badge */}
        <div className="url-header-row">
          <div className="url-text" title={item.url}>
            {item.url}
          </div>

          {/* Priority Status Badge */}
          {isPendingVerification ? (
            <span
              className="url-pending-badge"
              title={lang === "en" ? "Awaiting Host Verification" : "Menunggu Verifikasi Host"}
            >
              <span className="verify-pulse-dot"></span>
              <span>{lang === "en" ? "Pending Verification" : "Perlu Verifikasi"}</span>
              <span className="pending-badge-amount">{formatRupiah(donationAmount)}</span>
            </span>
          ) : tier ? (
            <span
              className={`url-tier-badge ${tier.badgeClass} ${tier.hasGlow ? "tier-glow" : ""}`}
              title={`${tier.name}: ${formatRupiah(donationAmount)}`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <strong>{tier.name}</strong>
              <span className="tier-amount">{formatRupiah(donationAmount)}</span>
            </span>
          ) : null}
        </div>

        {/* Dedicated Verification Card Box for Host */}
        {isPendingVerification && (
          <div className="url-verify-card">
            <div className="verify-card-header">
              <div className="verify-card-status">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="verify-card-title">
                  {lang === "en" ? "Donation Verification" : "Konfirmasi Bukti Donasi"}
                </span>
              </div>
              <div className="verify-card-actions">
                <button
                  type="button"
                  className="btn-verify-approve"
                  onClick={() => onVerifyDonation?.(item.id)}
                  title={lang === "en" ? "Approve VIP Priority" : "Setujui & aktifkan antrean VIP"}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{lang === "en" ? "Approve" : "Setujui"}</span>
                </button>
                <button
                  type="button"
                  className="btn-verify-reject"
                  onClick={() => onRejectDonation?.(item.id)}
                  title={lang === "en" ? "Reject & drop to normal queue" : "Tolak & kembalikan ke antrean normal"}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>{lang === "en" ? "Reject" : "Tolak"}</span>
                </button>
              </div>
            </div>

            <div className="verify-card-body">
              <div className="verify-info-item">
                <span className="verify-info-label">{lang === "en" ? "Amount:" : "Nominal:"}</span>
                <span className="verify-info-nominal">{formatRupiah(donationAmount)}</span>
              </div>
              <div className="verify-info-divider"></div>
              <div className="verify-info-item">
                <span className="verify-info-label">{lang === "en" ? "ID / Donor:" : "ID Transaksi / Donatur:"}</span>
                <span className="verify-info-tx" title={donationTxId || "-"}>
                  {donationTxId || (lang === "en" ? "No Tx ID specified" : "Tanpa ID")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submitter Note displayed in clean dedicated bubble */}
        {displayNote && (
          <div className="url-note-bubble" title={displayNote}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="url-note-text">"{displayNote}"</span>
          </div>
        )}

        {/* URL Meta (Submitter & Time) */}
        <div className="url-meta">
          {item.submitterName && (
            <span
              className="url-submitter-badge"
              title={`${lang === "en" ? "Submitted by viewer: " : "Dikirim oleh penonton: "}${item.submitterName}`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{item.submitterName}</span>
            </span>
          )}
          {donationStatus === "verified" && (
            <span className="url-verified-badge" title={lang === "en" ? "Donation verified by host" : "Donasi telah diverifikasi oleh host"}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{lang === "en" ? "Verified" : "Terverifikasi"}</span>
            </span>
          )}
          <span className="url-time">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1" />
              <path d="M7 3.5V7l2.5 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            {formatTime(item.createdAt)}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <button
        className={`url-status-badge ${statusInfo.badgeClass}`}
        onClick={() => onCycleStatus(item.id)}
        title={t.dashboard.statusTooltip}
      >
        {statusInfo.label}
      </button>

      {/* Action Buttons */}
      <div className="url-actions">
        {/* Manage / Add Donation Priority */}
        <button
          className={`url-action-btn donate-btn ${tier ? "active-donated" : ""}`}
          onClick={() => onEditDonation?.(item)}
          title={lang === "en" ? "Set Priority Donation" : "Kelola Nominal & Prioritas Donasi"}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 6v12M15 9.5a2.5 2.5 0 00-5 0c0 3 5 2 5 5a2.5 2.5 0 01-5 0" />
          </svg>
        </button>

        {/* Start Review button */}
        <button
          className="url-action-btn start-btn"
          onClick={() => onStartReview(item.id)}
          title={t.dashboard.startItemTooltip}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2.5a.75.75 0 011.13-.65l9 5.5a.75.75 0 010 1.3l-9 5.5A.75.75 0 014 13.5v-11z" />
          </svg>
        </button>

        {/* Open in new tab */}
        <button
          className="url-action-btn open-btn"
          onClick={() => onOpenUrl(item.id)}
          title={t.dashboard.openTabTooltip}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 8.67v4a1.33 1.33 0 01-1.33 1.33H3.33A1.33 1.33 0 012 12.67V5.33A1.33 1.33 0 013.33 4h4M10 2h4v4M6.67 9.33L14 2"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* PageSpeed Audit */}
        <button
          className="url-action-btn speed-btn"
          onClick={() => onTestSpeed?.(item.url)}
          title={t.pagespeed?.title || "PageSpeed & Lighthouse Audit"}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeOpacity="0.3" />
            <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
            <path d="M12 12l3.5-3.5" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        </button>

        {/* Edit modal */}
        <button
          className="url-action-btn"
          onClick={() => onEdit(item.id)}
          title={t.dashboard.editTooltip}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M11.33 2a1.89 1.89 0 012.67 2.67L5.33 13.33 2 14l.67-3.33L11.33 2z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Delete button */}
        <button
          className="url-action-btn delete-btn"
          onClick={() => onDelete?.(item)}
          title={t.dashboard.deleteItemTooltip || "Hapus dari Antrean"}
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
        </button>
      </div>
    </div>
  );
}
