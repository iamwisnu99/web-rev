import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  // Normalize URL
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = "https://" + targetUrl;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid URL provided: " + e.message },
      { status: 400 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 WebRev/1.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "id,en-US;q=0.9,en;q=0.8",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    clearTimeout(timeout);

    const contentType = response.headers.get("content-type") || "";

    // If not HTML (e.g., image, pdf, json, js, css), stream as-is with CORS enabled
    if (!contentType.includes("text/html")) {
      const blob = await response.blob();
      const headers = new Headers();
      headers.set("Content-Type", contentType);
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      headers.set("Cache-Control", "public, max-age=3600");
      return new NextResponse(blob, {
        status: response.status,
        headers,
      });
    }

    let html = await response.text();
    const finalUrl = response.url || targetUrl;
    const finalOrigin = new URL(finalUrl).origin;
    const finalBase = finalUrl.endsWith("/") ? finalUrl : finalUrl.substring(0, finalUrl.lastIndexOf("/") + 1);

    // 1. Invalidate Frame-Busting scripts (scripts that try `if (top !== self) top.location = self.location`)
    const antiFrameBustScript = `
      <script>
        (function() {
          try {
            window.top = window.self;
            Object.defineProperty(window, 'top', { get: function() { return window.self; }, configurable: false });
          } catch(e) {}
        })();
      </script>
    `;

    // 2. Rewrite root-relative scripts and stylesheets to go through proxy with CORS
    html = html.replace(/(src|href)=(["'])\/(assets\/[^"']+)\2/gi, (match, attr, quote, path) => {
      return `${attr}=${quote}/api/proxy?url=${encodeURIComponent(`${finalOrigin}/${path}`)}${quote}`;
    });

    // 3. Inject <base> tag so other relative assets (CSS images, fonts) resolve to target site domain
    const baseTag = `<base href="${finalBase}" target="_blank">`;

    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (match) => `${match}\n${baseTag}\n${antiFrameBustScript}`);
    } else {
      html = `<head>${baseTag}${antiFrameBustScript}</head>${html}`;
    }

    // Response headers: Stripping X-Frame-Options and Content-Security-Policy that block framing
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "text/html; charset=utf-8");
    responseHeaders.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("X-WebRev-Proxied", "true");

    return new NextResponse(html, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[WebRev Proxy Error]", error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bypass Gagal Dimuat</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 24px; text-align: center; box-sizing: border-box; }
            .card { max-width: 500px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px 24px; }
            h2 { font-size: 1.25rem; margin-top: 0; color: #f43f5e; }
            p { font-size: 0.875rem; color: #94a3b8; line-height: 1.5; margin-bottom: 24px; }
            .btn-group { display: flex; gap: 12px; justify-content: center; }
            .btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 8px; font-size: 0.875rem; font-weight: 600; text-decoration: none; cursor: pointer; border: none; }
            .btn-primary { background: #3b82f6; color: white; }
            .btn-secondary { background: rgba(255, 255, 255, 0.1); color: #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>⚠️ Website Tidak Dapat Dimuat via Proxy</h2>
            <p>Server target membatasi akses otomatis atau memerlukan verifikasi keamanan (seperti Cloudflare Turnstile / Captcha). Silakan buka melalui Pop-up Studio atau Tab Baru.</p>
            <div class="btn-group">
              <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Buka di Tab Baru</a>
            </div>
          </div>
        </body>
      </html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}
