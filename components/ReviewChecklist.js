"use client";

import { useState, useEffect } from "react";
import { getChecklist } from "@/lib/reviewChecklist";
import { translations } from "@/lib/i18n";

export default function ReviewChecklist({ addToast, lang = "id" }) {
  const [checkedItems, setCheckedItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);

  const t = translations[lang] || translations.id;
  const checklistData = getChecklist(lang);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("webrev_data");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.checkedItems) setCheckedItems(data.checkedItems);
      }
    } catch (e) {
      console.error("Error loading checklist:", e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("webrev_data");
      const data = raw ? JSON.parse(raw) : {};
      data.checkedItems = checkedItems;
      localStorage.setItem("webrev_data", JSON.stringify(data));
    } catch (e) {
      console.error("Error saving checklist:", e);
    }
  }, [checkedItems]);

  const toggleCheck = (id) => {
    setCheckedItems((prev) => {
      const willCheck = !prev.includes(id);
      return willCheck ? [...prev, id] : prev.filter((i) => i !== id);
    });
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const resetChecklist = () => {
    setCheckedItems([]);
    if (addToast) addToast(t.checklist.toastReset, "info");
  };

  const total = checklistData.length;
  const checked = checkedItems.length;

  return (
    <div className="card checklist-card">
      <div className="card-header">
        <h2 className="card-title">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M9 5H7a2 2 0 00-2 2v9a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M9 5a1 1 0 011-1h0a1 1 0 011 1v1a1 1 0 01-1 1h0a1 1 0 01-1-1V5z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {t.checklist.title}
        </h2>
        <span className="checklist-count">
          {checked}/{total} {t.checklist.doneCount}
        </span>
      </div>
      <p className="checklist-desc">{t.checklist.desc}</p>

      <div className="checklist">
        {checklistData.map((item) => {
          const isChecked = checkedItems.includes(item.id);
          const isExpanded = expandedItems.includes(item.id);

          return (
            <div
              key={item.id}
              className={`checklist-item ${isChecked ? "checked" : ""} ${
                isExpanded ? "expanded" : ""
              }`}
            >
              <div className="checklist-header">
                <div
                  className="checklist-label"
                  onClick={() => toggleCheck(item.id)}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      toggleCheck(item.id);
                    }
                  }}
                >
                  <span className="checklist-checkbox">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{item.label}</span>
                </div>
                <button
                  type="button"
                  className="checklist-toggle"
                  onClick={() => toggleExpand(item.id)}
                  title="Toggle details"
                  aria-label="Toggle details"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3.5 5.25L7 8.75l3.5-3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="checklist-detail">
                <div className="checklist-detail-inner">{item.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "0 22px 18px" }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-full"
          onClick={resetChecklist}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 8a6 6 0 0111.46-2.46M14 8A6 6 0 012.54 10.46"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M14 2v4h-4M2 14v-4h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t.checklist.resetBtn}
        </button>
      </div>
    </div>
  );
}
