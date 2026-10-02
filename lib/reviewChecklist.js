export const REVIEW_CHECKLIST = [
  {
    id: "first-impression",
    label: {
      id: "Kesan Pertama (First Impression)",
      en: "First Impression",
    },
    detail: {
      id: "Buka website dan perhatikan kesan pertama dalam 3-5 detik. Apakah tampilan profesional? Apakah jelas menjelaskan tentang apa website ini? Cek apakah desainnya menarik, warna sesuai, dan font mudah dibaca. Ini penting karena pengunjung biasanya memutuskan dalam hitungan detik apakah akan tetap di website atau pergi.",
      en: "Open the website and evaluate the first impression within 3-5 seconds. Does it look professional? Does it immediately clarify what the site is about? Ensure colors are harmonious, layout is clean, and fonts are readable.",
    },
  },
  {
    id: "navigation",
    label: {
      id: "Navigasi & Struktur Menu",
      en: "Navigation & Menu Structure",
    },
    detail: {
      id: "Cek apakah menu navigasi mudah ditemukan (biasanya di bagian atas). Klik setiap link di menu - apakah semua berfungsi? Apakah halaman yang dituju sesuai? Pastikan pengunjung bisa menemukan informasi penting (kontak, layanan, tentang) dalam maksimal 3 klik.",
      en: "Check if the navigation menu is easy to locate. Test every link in the header - do they all work and route correctly? Visitors should be able to find essential information (contact, services, about) within 3 clicks.",
    },
  },
  {
    id: "responsive",
    label: {
      id: "Tampilan Responsif (Mobile-Friendly)",
      en: "Responsive & Mobile-Friendly",
    },
    detail: {
      id: "Ubah ukuran browser atau buka di HP/tablet. Apakah layout menyesuaikan? Apakah teks tetap terbaca? Apakah tombol cukup besar untuk disentuh? Menu hamburger berfungsi? Ini sangat penting karena mayoritas pengunjung mengakses dari perangkat mobile.",
      en: "Resize the viewport or switch to tablet/mobile view. Does the layout adapt gracefully? Are fonts legible and buttons touch-friendly? Does the mobile menu toggle smoothly?",
    },
  },
  {
    id: "loading-speed",
    label: {
      id: "Kecepatan Loading",
      en: "Loading Speed & Performance",
    },
    detail: {
      id: "Perhatikan berapa lama website dimuat. Idealnya di bawah 3 detik. Bisa gunakan tool seperti Google PageSpeed Insights (pagespeed.web.dev) untuk cek skor kecepatan. Website lambat membuat pengunjung pergi dan buruk untuk SEO Google.",
      en: "Observe initial load time; ideally it loads under 3 seconds. Slow websites cause high bounce rates and hurt search engine rankings.",
    },
  },
  {
    id: "content-quality",
    label: {
      id: "Kualitas Konten & Teks",
      en: "Content Quality & Copywriting",
    },
    detail: {
      id: 'Baca teks di halaman utama. Apakah jelas dan mudah dipahami? Cek typo atau kesalahan ejaan. Apakah informasi lengkap? Apakah ada Call-to-Action (tombol ajakan bertindak) yang jelas seperti "Hubungi Kami" atau "Pesan Sekarang"?',
      en: 'Inspect text and headings. Is the messaging concise and persuasive? Look for typos or grammar mistakes. Are there clear Call-to-Actions (CTAs) like "Contact Us" or "Get Started"?',
    },
  },
  {
    id: "images-media",
    label: {
      id: "Gambar & Media Visual",
      en: "Visual Media & Graphics",
    },
    detail: {
      id: "Periksa semua gambar - apakah tajam dan tidak pecah/blur? Apakah ukurannya proporsional? Ada gambar yang tidak muncul (broken image)? Jika ada video, apakah bisa diputar? Gambar berkualitas memberi kesan profesional.",
      en: "Check all images - are they crisp, well-proportioned, and free of broken links or artifacts? High-quality visual assets reflect professionalism.",
    },
  },
  {
    id: "contact-info",
    label: {
      id: "Informasi Kontak & Formulir",
      en: "Contact Info & Forms",
    },
    detail: {
      id: "Cek apakah ada halaman kontak atau informasi kontak (telepon, email, alamat, WhatsApp). Jika ada formulir kontak, coba isi - apakah berfungsi? Apakah ada konfirmasi setelah kirim?",
      en: "Look for contact info (email, phone, address, social links, WhatsApp). Test contact forms and verification feedback - visitors must be able to reach the business easily.",
    },
  },
  {
    id: "seo-basics",
    label: {
      id: "SEO Dasar (Search Engine)",
      en: "SEO Basics & Meta Tags",
    },
    detail: {
      id: 'Cek judul halaman (title) di tab browser - apakah relevan? Cari tag <title> dan <meta description>. Apakah ada heading (H1, H2) yang terstruktur? SEO yang baik membantu website ditemukan di Google.',
      en: "Check browser tab title, meta descriptions, and semantic heading hierarchy (H1, H2, H3). Good SEO fundamentals ensure discoverability on search engines.",
    },
  },
  {
    id: "social-media",
    label: {
      id: "Integrasi Media Sosial",
      en: "Social Media Integration",
    },
    detail: {
      id: "Cek apakah ada ikon/link ke media sosial (Instagram, Facebook, X/Twitter, dll). Klik link tersebut - apakah mengarah ke akun yang benar dan aktif? Apakah terbuka di tab baru?",
      en: "Verify social media links and icons (Instagram, LinkedIn, X, YouTube). Do they open in new tabs and lead to active official channels?",
    },
  },
  {
    id: "security",
    label: {
      id: "Keamanan (SSL/HTTPS)",
      en: "Security & HTTPS / SSL",
    },
    detail: {
      id: 'Lihat address bar browser. Apakah ada ikon gembok dan URL dimulai dengan "https://"? Jika tidak, website tidak aman dan browser akan memberi peringatan bahaya.',
      en: 'Inspect the address bar. Is there a valid SSL lock icon and does the URL use "https://"? HTTPS is mandatory for visitor data safety and user trust.',
    },
  },
  {
    id: "footer",
    label: {
      id: "Footer & Informasi Tambahan",
      en: "Footer & Legal Information",
    },
    detail: {
      id: "Scroll ke bagian paling bawah website. Apakah ada footer yang berisi informasi penting: copyright, link navigasi tambahan, alamat, kebijakan privasi?",
      en: "Scroll down to the footer. Does it provide copyright, sitemap links, privacy policy, terms of service, and company credentials?",
    },
  },
  {
    id: "accessibility",
    label: {
      id: "Aksesibilitas (A11y)",
      en: "Accessibility & Readability",
    },
    detail: {
      id: "Cek apakah kontras warna teks cukup (teks gelap di latar terang, atau sebaliknya). Apakah gambar memiliki teks alternatif (alt text)? Apakah bisa navigasi menggunakan keyboard?",
      en: "Check color contrast between text and background. Check image alt tags and keyboard navigation (Tab key). Good accessibility accommodates all users.",
    },
  },
  {
    id: "overall-assessment",
    label: {
      id: "Penilaian Keseluruhan",
      en: "Overall Host Assessment",
    },
    detail: {
      id: "Berikan penilaian akhir secara keseluruhan. Rangkum kelebihan dan kekurangan website. Apa saran perbaikan utama? Sampaikan dengan konstruktif bagi pemilik website.",
      en: "Summarize top strengths and key areas for improvement. Provide actionable, constructive feedback to wrap up the live website review.",
    },
  },
];

export function getChecklist(lang = "id") {
  return REVIEW_CHECKLIST.map((item) => ({
    id: item.id,
    label:
      typeof item.label === "object"
        ? item.label[lang] || item.label.id
        : item.label,
    detail:
      typeof item.detail === "object"
        ? item.detail[lang] || item.detail.id
        : item.detail,
  }));
}
