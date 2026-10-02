"use client";

import { useState, useEffect } from "react";
import { DONATION_TIERS, formatRupiah } from "@/lib/donationTiers";

export default function DonationEditModal({
  isOpen,
  onClose,
  item,
  onSaveDonation,
  lang = "id",
}) {
  const [amount, setAmount] = useState("");
  const [txId, setTxId] = useState("");
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    if (item) {
      setAmount(item.donationAmount ? String(item.donationAmount) : "");
      setTxId(item.donationTxId || "");
      setIsVerified(item.donationStatus !== "pending_verification" && item.donationStatus !== "rejected");
    }
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const num = parseInt(amount, 10) || 0;
    onSaveDonation(item.id, {
      donationAmount: num,
      donationTxId: txId.trim(),
      donationStatus: num > 0 ? (isVerified ? "verified" : "pending_verification") : "none",
    });
    onClose();
  };

  const handleRemoveDonation = () => {
    onSaveDonation(item.id, {
      donationAmount: 0,
      donationTxId: "",
      donationStatus: "none",
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 1300 }}
    >
      <div
        className="modal donation-edit-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "460px",
          width: "92vw",
          padding: "24px",
          position: "relative",
          boxShadow: "var(--shadow-lg), 0 20px 45px -15px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(245, 158, 11, 0.15)",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 6v12M15 9.5a2.5 2.5 0 00-5 0c0 3 5 2 5 5a2.5 2.5 0 01-5 0" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {lang === "en" ? "Manage Queue Priority" : "Kelola Prioritas Donasi"}
              </h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
                {item.submitterName} · {item.url}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-tertiary)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Custom Amount Input */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              {lang === "en" ? "Donation Amount (Rp)" : "Nominal Donasi (Rp)"}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 25000"
              className="input"
              style={{ width: "100%", paddingLeft: "14px", height: "42px", fontSize: "0.95rem" }}
            />
          </div>

          {/* TX ID / Note */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              {lang === "en" ? "Transaction ID / Donor Note (Optional)" : "ID Transaksi / Nama Donatur di Saweria (Opsional)"}
            </label>
            <input
              type="text"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="Contoh: TRX-9821 atau Nama di Saweria"
              className="input"
              style={{ width: "100%", paddingLeft: "14px", height: "42px", fontSize: "0.88rem" }}
            />
          </div>

          {/* Verification Status Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-tertiary)",
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              marginBottom: "20px",
              border: "1px solid var(--border-color)",
            }}
          >
            <div>
              <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {lang === "en" ? "Verification Status" : "Status Verifikasi"}
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)" }}>
                {isVerified
                  ? (lang === "en" ? "Verified (Auto-prioritized)" : "Terverifikasi (Otomatis naik ke atas)")
                  : (lang === "en" ? "Pending Confirmation" : "Menunggu Konfirmasi")}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsVerified(!isVerified)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.76rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: isVerified ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                color: isVerified ? "#059669" : "#d97706",
              }}
            >
              {isVerified ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{lang === "en" ? "Verified" : "Terverifikasi"}</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{lang === "en" ? "Pending" : "Menunggu"}</span>
                </>
              )}
            </button>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            {item.donationAmount > 0 && (
              <button
                type="button"
                onClick={handleRemoveDonation}
                className="btn btn-ghost"
                style={{ color: "var(--color-danger)", marginRight: "auto" }}
              >
                {lang === "en" ? "Reset to Free" : "Hapus Prioritas"}
              </button>
            )}
            <button type="button" onClick={onClose} className="btn btn-secondary">
              {lang === "en" ? "Cancel" : "Batal"}
            </button>
            <button type="submit" className="btn btn-primary">
              {lang === "en" ? "Save & Re-rank" : "Simpan & Urutkan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
