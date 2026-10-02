"use client";

import { useState, useEffect } from "react";

/**
 * Mendeteksi apakah perangkat saat ini adalah perangkat mobile (smartphone),
 * termasuk saat pengguna mengaktifkan fitur "Desktop Site / Minta Situs Desktop" di browser mobile.
 */
export function detectIsMobile() {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent || navigator.vendor || window.opera || "";

  // 1. Deteksi User Agent mobile standar
  const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
  if (isMobileUA) {
    return true;
  }

  // 2. Deteksi iPad / tablet lama
  if (/iPad/i.test(ua)) {
    return true;
  }

  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const hasTouch = maxTouchPoints > 0 || "ontouchstart" in window;

  // 3. Pointer media queries (coarse = jari/touchscreen, fine = mouse/trackpad presisi)
  const isCoarse = window.matchMedia ? window.matchMedia("(pointer: coarse)").matches : false;
  const isFine = window.matchMedia ? window.matchMedia("(pointer: fine)").matches : false;

  // 4. Dimensi layar fisik perangkat (tidak terpengaruh oleh zoom desktop mode browser)
  const screenMin = Math.min(window.screen.width || 9999, window.screen.height || 9999);

  // 5. Android dalam "Desktop Mode":
  // Di Chrome Android saat "Desktop Site" dicentang, UA berubah menjadi "X11; Linux x86_64",
  // NAMUN maxTouchPoints tetap >= 2, pointer tetap coarse, dan dimensi fisik screenMin < 768px.
  if (hasTouch && isCoarse && screenMin < 768) {
    return true;
  }

  // 6. iOS iPhone dalam "Desktop Mode":
  // Safari iPhone mengirimkan UA Macintosh, tapi maxTouchPoints >= 2 dan screenMin < 768px.
  if (/Macintosh/i.test(ua) && maxTouchPoints > 1 && screenMin < 768) {
    return true;
  }

  // 7. Deteksi lebar viewport layar kecil dengan input touchscreen
  if (window.innerWidth < 992 && hasTouch && isCoarse) {
    return true;
  }

  // 8. Lebar layar murni di bawah 768px selalu dianggap mobile
  if (window.innerWidth < 768) {
    return true;
  }

  return false;
}

/**
 * Custom React Hook untuk mendeteksi perangkat mobile secara reaktif
 * terhadap resize dan perubahan orientasi layar.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(detectIsMobile());
    };

    check();

    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  return isMobile;
}
