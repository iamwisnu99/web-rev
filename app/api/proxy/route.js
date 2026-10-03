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

    // --- Handle CSS files: rewrite url() references so fonts/images load correctly ---
    if (contentType.includes("text/css")) {
      let css = await response.text();
      // Determine the CSS file's origin for resolving relative URLs
      const cssOrigin = new URL(response.url || targetUrl).origin;
      const cssBase = (response.url || targetUrl).replace(/[^/]+$/, '');

      // Rewrite absolute same-origin url() references
      const escapedCssOrigin = cssOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      css = css.replace(new RegExp(`url\\(\\s*(['"]?)${escapedCssOrigin}(/[^)'"]+)\\1\\s*\\)`, 'gi'), (match, quote, path) => {
        return `url(${quote}/api/proxy?url=${encodeURIComponent(`${cssOrigin}${path}`)}${quote})`;
      });

      // Rewrite root-relative url(/path/...) references
      css = css.replace(/url\(\s*(['"]?)\/((?!\/|data:|api\/proxy)[^)'"]+)\1\s*\)/gi, (match, quote, path) => {
        return `url(${quote}/api/proxy?url=${encodeURIComponent(`${cssOrigin}/${path}`)}${quote})`;
      });

      // Rewrite truly relative url(path/...) references (no leading /)
      css = css.replace(/url\(\s*(['"]?)((?!\/|data:|https?:|api\/proxy|#)[^)'"]+)\1\s*\)/gi, (match, quote, path) => {
        return `url(${quote}/api/proxy?url=${encodeURIComponent(`${cssBase}${path}`)}${quote})`;
      });

      const headers = new Headers();
      headers.set("Content-Type", "text/css; charset=utf-8");
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      headers.set("Cache-Control", "public, max-age=3600");
      return new NextResponse(css, { status: 200, headers });
    }

    // --- Handle non-HTML, non-CSS (images, fonts, JS, etc.) — stream as-is with CORS ---
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

    // --- Handle HTML pages ---
    let html = await response.text();
    const finalUrl = response.url || targetUrl;
    const finalOrigin = new URL(finalUrl).origin;
    const finalBase = finalUrl.endsWith("/") ? finalUrl : finalUrl.substring(0, finalUrl.lastIndexOf("/") + 1);

    // 1. Invalidate Frame-Busting scripts
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

    // 2. Strip CSP meta tags that block framing
    html = html.replace(/<meta[^>]*http-equiv=['"]Content-Security-Policy['"][^>]*>/gi, '');
    html = html.replace(/<meta[^>]*content=['"][^'"]*frame-ancestors[^'"]*['"][^>]*>/gi, '');

    // 3. Remove any existing <base> tags (we don't want them overriding our proxy URLs)
    html = html.replace(/<base[^>]*>/gi, '');

    // 4. Strip "crossorigin" attributes from script/link tags
    //    These force CORS mode which is unnecessary when loading through our same-origin proxy
    html = html.replace(/(<(?:script|link)[^>]*?)\s+crossorigin(?:=['"]\w*['"])?/gi, '$1');

    // 5. Rewrite protocol-relative URLs (//cdn.example.com/...) through our proxy
    html = html.replace(/(src|href)=(['"])\/\/([^"']+)\2/gi, (match, attr, quote, path) => {
      return `${attr}=${quote}/api/proxy?url=${encodeURIComponent(`https://${path}`)}${quote}`;
    });

    // 6. Rewrite absolute URLs pointing to the same origin through our proxy
    //    Must be done BEFORE root-relative rewrite to avoid double-processing
    const escapedOrigin = finalOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`(src|href)=(['"])(${escapedOrigin})(/[^"']*)\\2`, 'gi'), (match, attr, quote, origin, path) => {
      return `${attr}=${quote}/api/proxy?url=${encodeURIComponent(`${origin}${path}`)}${quote}`;
    });

    // 7. Rewrite all root-relative URLs (/path/...) to go through our proxy
    html = html.replace(/(src|href)=(['"])\/((?!\/|api\/proxy|data:|mailto:|tel:|javascript:|#)[^"']*)\2/gi, (match, attr, quote, path) => {
      return `${attr}=${quote}/api/proxy?url=${encodeURIComponent(`${finalOrigin}/${path}`)}${quote}`;
    });

    // 8. Rewrite truly relative URLs in src/href (no leading /) — like "assets/file.js"
    //    These need the base path of the page to resolve correctly
    html = html.replace(/(src|href)=(['"])((?!\/|https?:|data:|mailto:|tel:|javascript:|#|api\/proxy)[^"']+)\2/gi, (match, attr, quote, path) => {
      // Skip anchors, already absolute, or fragment-only
      if (path.startsWith('#') || path.startsWith('//')) return match;
      return `${attr}=${quote}/api/proxy?url=${encodeURIComponent(`${finalBase}${path}`)}${quote}`;
    });

    // 9. Rewrite url() references in inline styles
    html = html.replace(/url\(\s*(['"]?)\/((?!\/|data:|api\/proxy)[^)'"]+)\1\s*\)/gi, (match, quote, path) => {
      return `url(${quote}/api/proxy?url=${encodeURIComponent(`${finalOrigin}/${path}`)}${quote})`;
    });

    // 10. Inject anti-frame-bust script and meta referrer (but NO <base> tag)
    const metaReferrer = `<meta name="referrer" content="no-referrer">`;

    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (match) => `${match}\n${metaReferrer}\n${antiFrameBustScript}`);
    } else {
      html = `<head>${metaReferrer}${antiFrameBustScript}</head>${html}`;
    }

    // Response headers: clean, no X-Frame-Options or CSP
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
