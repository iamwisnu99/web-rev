export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const rawHost = resolvedParams?.hostSlug ? decodeURIComponent(resolvedParams.hostSlug) : "Host";
  const cleanHost = rawHost.replace(/^@/, "");

  return {
    title: `Live Room @${cleanHost} - Kirim Website Anda`,
    description: `Kirimkan link website atau portofolio Anda untuk direview langsung oleh @${cleanHost} di layar live stream melalui WebRev.`,
    alternates: {
      canonical: `/room/@${cleanHost}`,
    },
    openGraph: {
      title: `Live Review Room @${cleanHost}`,
      description: `Kirimkan URL website Anda untuk dibahas dan direview langsung saat live streaming bareng @${cleanHost}.`,
      siteName: "WebRev",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RoomLayout({ children }) {
  return children;
}
