import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Path-based proxy for WebRev.
 *
 * URL pattern:  /api/proxy-site/{domain}/{...path}
 * Example:      /api/proxy-site/hellodesign.id/assets/index.js
 *               → fetches https://hellodesign.id/assets/index.js
 *
 * Supports ALL HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS)
 * so that proxied SPAs can communicate with their backends.
 */

// ── Cookie forwarding: transfer Set-Cookie from target response to browser ──
function forwardSetCookies(targetResponse, proxyHeaders) {
  // getSetCookie() returns an array of individual Set-Cookie header values
  const cookies = targetResponse.headers.getSetCookie?.() || [];
  for (const cookie of cookies) {
    // Strip Domain= so cookie applies to current host (localhost)
    // Strip Secure flag so it works on http://localhost
    // Set SameSite=None so cookies work in iframe context
    let adjusted = cookie
      .replace(/;\s*Domain=[^;]*/gi, "")
      .replace(/;\s*Secure/gi, "")
      .replace(/;\s*SameSite=[^;]*/gi, "");
    adjusted += "; SameSite=Lax; Path=/";
    proxyHeaders.append("Set-Cookie", adjusted);
  }
}

// ── Shared: resolve target URL from route segments ──
async function resolveTarget(request, { params }) {
  const { segments } = await params;

  if (!segments || segments.length === 0) {
    return { error: true, response: NextResponse.json({ error: "Domain is required" }, { status: 400 }) };
  }

  const domain = segments[0];
  const pathParts = segments.slice(1);
  const path = "/" + pathParts.join("/");

  const requestUrl = new URL(request.url);
  const queryString = requestUrl.search;

  return { domain, path, targetUrl: `https://${domain}${path}${queryString}` };
}

// ── Shared: forward a non-GET request (POST, PUT, DELETE, PATCH) ──
async function forwardRequest(request, context) {
  const target = await resolveTarget(request, context);
  if (target.error) return target.response;

  const { domain, path, targetUrl } = target;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    // Forward the original request body and headers
    const forwardHeaders = new Headers();
    // Copy relevant headers from the incoming request
    const headersToCopy = [
      "content-type", "accept", "authorization", "x-requested-with",
      "x-csrf-token", "x-xsrf-token", "cookie",
    ];
    for (const name of headersToCopy) {
      const val = request.headers.get(name);
      if (val) forwardHeaders.set(name, val);
    }
    forwardHeaders.set("User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 WebRev/1.0");
    forwardHeaders.set("Origin", `https://${domain}`);
    forwardHeaders.set("Referer", `https://${domain}/`);

    const fetchOpts = {
      method: request.method,
      signal: controller.signal,
      redirect: "follow",
      headers: forwardHeaders,
    };

    // Forward request body for methods that have one
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      fetchOpts.body = await request.arrayBuffer();
      fetchOpts.duplex = "half";
    }

    const response = await fetch(targetUrl, fetchOpts);
    clearTimeout(timeout);

    // Handle 204 No Content — must not have a body
    if (response.status === 204) {
      const respHeaders = new Headers();
      respHeaders.set("Access-Control-Allow-Origin", "*");
      respHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
      respHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      forwardSetCookies(response, respHeaders);
      return new NextResponse(null, { status: 204, headers: respHeaders });
    }

    const blob = await response.blob();
    const respHeaders = new Headers();
    const ct = response.headers.get("content-type");
    if (ct) respHeaders.set("Content-Type", ct);
    respHeaders.set("Access-Control-Allow-Origin", "*");
    respHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    respHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    forwardSetCookies(response, respHeaders);

    return new NextResponse(blob, { status: response.status, headers: respHeaders });
  } catch (error) {
    console.error("[WebRev Proxy Forward Error]", error);
    return NextResponse.json(
      { error: "Proxy forward failed", message: error.message },
      { status: 502 }
    );
  }
}

// ── GET: Main handler with HTML rewriting for initial page loads ──
export async function GET(request, context) {
  const target = await resolveTarget(request, context);
  if (target.error) return target.response;

  const { domain, path, targetUrl } = target;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    // Build headers for the target request, including any cookies from the browser
    const getHeaders = {
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
    };
    // Forward cookies from the browser so CSRF/session tokens reach the backend
    const browserCookies = request.headers.get("cookie");
    if (browserCookies) {
      getHeaders["Cookie"] = browserCookies;
    }

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: getHeaders,
    });

    clearTimeout(timeout);

    const contentType = response.headers.get("content-type") || "";

    // ── Non-HTML content (JS, CSS, images, fonts, etc.) ──
    // Serve as-is with CORS headers. No URL rewriting needed because
    // relative paths in JS/CSS resolve against the proxy URL path, which
    // mirrors the original site structure.
    if (!contentType.includes("text/html")) {
      const blob = await response.blob();
      const headers = new Headers();
      headers.set("Content-Type", contentType);
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      headers.set("Cache-Control", "public, max-age=3600");
      forwardSetCookies(response, headers);
      return new NextResponse(blob, { status: response.status, headers });
    }

    // ── HTML content ──
    let html = await response.text();
    const finalUrl = response.url || targetUrl;
    const finalDomain = new URL(finalUrl).host;
    const finalOrigin = new URL(finalUrl).origin;

    // 1. Strip CSP meta tags that block framing
    html = html.replace(/<meta[^>]*http-equiv=['"]Content-Security-Policy['"][^>]*>/gi, "");
    html = html.replace(/<meta[^>]*content=['"][^'"]*frame-ancestors[^'"]*['"][^>]*>/gi, "");

    // 2. Remove any existing <base> tags
    html = html.replace(/<base[^>]*>/gi, "");

    // 3. Strip "crossorigin" attributes from script/link tags
    html = html.replace(
      /(<(?:script|link)[^>]*?)\s+crossorigin(?:=['"][^'"]*['"])?/gi,
      "$1"
    );

    // 4. Rewrite protocol-relative URLs (//cdn.example.com/file.js)
    //    → /api/proxy-site/cdn.example.com/file.js
    html = html.replace(
      /(src|href)=(['"])\/\/([^"']+)\2/gi,
      (match, attr, quote, rest) => {
        return `${attr}=${quote}/api/proxy-site/${rest}${quote}`;
      }
    );

    // 5. Rewrite absolute same-origin URLs
    //    https://hellodesign.id/assets/x.js → /api/proxy-site/hellodesign.id/assets/x.js
    const escapedOrigin = finalOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(
      new RegExp(
        `(src|href)=(['"])(${escapedOrigin})(/[^"']*)\\2`,
        "gi"
      ),
      (match, attr, quote, _origin, urlPath) => {
        return `${attr}=${quote}/api/proxy-site/${finalDomain}${urlPath}${quote}`;
      }
    );

    // 6. Rewrite root-relative URLs (/assets/file.js)
    //    → /api/proxy-site/hellodesign.id/assets/file.js
    html = html.replace(
      /(src|href)=(['"])\/((?!\/|api\/|data:|mailto:|tel:|javascript:|#)[^"']*)\2/gi,
      (match, attr, quote, urlPath) => {
        return `${attr}=${quote}/api/proxy-site/${finalDomain}/${urlPath}${quote}`;
      }
    );

    // 7. Rewrite root-relative url() in inline styles
    html = html.replace(
      /url\(\s*['"]?\/((?!\/|data:|api\/)[^)'"\s]+)['"]?\s*\)/gi,
      (match, urlPath) => {
        return `url(/api/proxy-site/${finalDomain}/${urlPath})`;
      }
    );

    // 8. Strip any Permissions-Policy meta tags from the original site
    html = html.replace(/<meta[^>]*http-equiv=['"]Permissions-Policy['"][^>]*>/gi, "");
    html = html.replace(/<meta[^>]*http-equiv=['"]Feature-Policy['"][^>]*>/gi, "");

    // 9. Compute the original path (what the SPA router expects to see)
    const originalPath = path === "/" ? "/" : path;

    // 10. Inject: base tag, meta referrer, and comprehensive proxy runtime scripts
    const baseTag = `<base href="/api/proxy-site/${finalDomain}/" target="_blank">`;
    const metaReferrer = `<meta name="referrer" content="no-referrer">`;
    const injectedScripts = `
      <script>
        (function() {
          var PROXY_PREFIX = '/api/proxy-site/${finalDomain}';
          var ORIGINAL_PATH = '${originalPath.replace(/'/g, "\\'")}';

          // =============================================
          // 1. FIX SPA ROUTING: Restore the original URL
          // =============================================
          // SPA routers (React Router, Vue Router, etc.) read window.location.pathname
          // to decide which page to show. We change the URL from
          //   /api/proxy-site/domain.com/  →  /
          // so the SPA router matches the correct route.
          try {
            var currentPath = window.location.pathname;
            if (currentPath.indexOf(PROXY_PREFIX) === 0) {
              var realPath = currentPath.substring(PROXY_PREFIX.length) || '/';
              history.replaceState(null, '', realPath + window.location.search + window.location.hash);
            }
          } catch(e) {}

          // =============================================
          // 2. INTERCEPT FETCH: Route ALL API calls through proxy
          // =============================================
          var TARGET_ORIGIN = 'https://${finalDomain}';
          var TARGET_DOMAIN = '${finalDomain}';
          // Extract base domain for subdomain matching (e.g., hellodesign.id from www.hellodesign.id)
          var domainParts = TARGET_DOMAIN.split('.');
          var BASE_DOMAIN = domainParts.length > 2 ? domainParts.slice(-2).join('.') : TARGET_DOMAIN;

          function proxyRewriteUrl(url) {
            if (typeof url !== 'string') return null;

            // Already proxied
            if (url.startsWith('/api/proxy-site/')) return null;

            // Skip data:, blob:, javascript:, about:, ws:, wss:
            if (/^(data:|blob:|javascript:|about:|ws:|wss:|mailto:|tel:|#)/.test(url)) return null;

            // 1. Absolute URL to the same origin: https://hellodesign.id/api/...
            if (url.startsWith(TARGET_ORIGIN + '/') || url === TARGET_ORIGIN) {
              return '/api/proxy-site/' + TARGET_DOMAIN + url.substring(TARGET_ORIGIN.length);
            }

            // 2. Absolute URL to a subdomain: https://api.hellodesign.id/...
            try {
              if (url.startsWith('https://') || url.startsWith('http://')) {
                var urlObj = new URL(url);
                if (urlObj.hostname === TARGET_DOMAIN || urlObj.hostname.endsWith('.' + BASE_DOMAIN)) {
                  return '/api/proxy-site/' + urlObj.hostname + urlObj.pathname + urlObj.search + urlObj.hash;
                }
                // External domain — leave as-is (CDNs, third-party APIs)
                return null;
              }
            } catch(e) {}

            // 3. Protocol-relative: //api.hellodesign.id/...
            if (url.startsWith('//')) {
              var prHost = url.substring(2).split('/')[0];
              if (prHost === TARGET_DOMAIN || prHost.endsWith('.' + BASE_DOMAIN)) {
                return '/api/proxy-site/' + url.substring(2);
              }
              return null;
            }

            // 4. Root-relative: /api/analyze
            if (url.startsWith('/')) {
              return '/api/proxy-site/' + TARGET_DOMAIN + url;
            }

            // 5. Relative URL (no leading /): api/analyze, images/logo.png
            // Resolve against the proxy prefix
            return '/api/proxy-site/' + TARGET_DOMAIN + '/' + url;
          }

          try {
            var origFetch = window.fetch;
            window.fetch = function(input, init) {
              try {
                var url = (typeof input === 'string') ? input : (input instanceof Request ? input.url : String(input));
                var newUrl = proxyRewriteUrl(url);
                if (newUrl) {
                  if (typeof input === 'string') {
                    input = newUrl;
                  } else if (input instanceof Request) {
                    input = new Request(newUrl, input);
                  }
                }
              } catch(e) {}
              return origFetch.call(this, input, init);
            };
          } catch(e) {}

          // =============================================
          // 3. INTERCEPT XMLHttpRequest
          // =============================================
          try {
            var origXHROpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
              var newUrl = proxyRewriteUrl(url);
              if (newUrl) arguments[1] = newUrl;
              return origXHROpen.apply(this, arguments);
            };
          } catch(e) {}

          // =============================================
          // 4. MUTATION OBSERVER: Rewrite URLs on dynamic elements
          // =============================================
          // SPAs render content with JavaScript. Images, scripts, and links added
          // dynamically by the SPA framework use root-relative URLs that resolve
          // to localhost instead of through our proxy. This observer catches them.
          function rewriteElement(el) {
            if (!el || el.nodeType !== 1) return;
            // src, href, poster, data attributes
            ['src', 'href', 'poster', 'data'].forEach(function(attr) {
              var val = el.getAttribute(attr);
              if (val) {
                var newVal = proxyRewriteUrl(val);
                if (newVal) el.setAttribute(attr, newVal);
              }
            });
            // srcset attribute (responsive images)
            var srcset = el.getAttribute('srcset');
            if (srcset) {
              var rewritten = srcset.replace(/(^|,\s*)(\S+)/g, function(m, sep, srcUrl) {
                var nv = proxyRewriteUrl(srcUrl);
                return sep + (nv || srcUrl);
              });
              if (rewritten !== srcset) el.setAttribute('srcset', rewritten);
            }
            // Inline style url() references
            var style = el.getAttribute('style');
            if (style && style.indexOf('url(') !== -1) {
              var parts = style.split('url(');
              var rebuilt = parts[0];
              for (var pi = 1; pi < parts.length; pi++) {
                var closeIdx = parts[pi].indexOf(')');
                if (closeIdx > -1) {
                  var inner = parts[pi].substring(0, closeIdx).trim().replace(/^['"]|['"]$/g, '');
                  var nv = proxyRewriteUrl(inner);
                  rebuilt += 'url(' + (nv || inner) + ')' + parts[pi].substring(closeIdx + 1);
                } else {
                  rebuilt += 'url(' + parts[pi];
                }
              }
              if (rebuilt !== style) el.setAttribute('style', rebuilt);
            }
          }

          function rewriteTree(root) {
            rewriteElement(root);
            if (root.querySelectorAll) {
              root.querySelectorAll('[src],[href],[poster],[data],[srcset]').forEach(rewriteElement);
            }
          }

          try {
            var observer = new MutationObserver(function(mutations) {
              for (var i = 0; i < mutations.length; i++) {
                var added = mutations[i].addedNodes;
                for (var j = 0; j < added.length; j++) {
                  if (added[j].nodeType === 1) rewriteTree(added[j]);
                }
                // Also handle attribute changes on existing elements
                if (mutations[i].type === 'attributes' && mutations[i].target.nodeType === 1) {
                  rewriteElement(mutations[i].target);
                }
              }
            });
            observer.observe(document.documentElement, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['src', 'href', 'poster', 'data', 'srcset', 'style']
            });
          } catch(e) {}

          // =============================================
          // 5. ANTI-FRAME-BUSTING
          // =============================================
          try {
            window.top = window.self;
            Object.defineProperty(window, 'top', {
              get: function() { return window.self; },
              configurable: false
            });
          } catch(e) {}

          // =============================================
          // 6. PERMISSION HANDLERS
          // =============================================
          // Notification API: auto-grant
          try {
            if (typeof Notification !== 'undefined') {
              Object.defineProperty(Notification, 'permission', {
                get: function() { return 'granted'; },
                configurable: true
              });
              Notification.requestPermission = function(cb) {
                if (typeof cb === 'function') cb('granted');
                return Promise.resolve('granted');
              };
            }
          } catch(e) {}

          // navigator.permissions.query: auto-grant fallback
          try {
            if (navigator.permissions && navigator.permissions.query) {
              var origQuery = navigator.permissions.query.bind(navigator.permissions);
              navigator.permissions.query = function(desc) {
                return origQuery(desc).then(function(s) { return s; }).catch(function() {
                  return { state: 'granted', status: 'granted', onchange: null };
                });
              };
            }
          } catch(e) {}

          // Geolocation: wrap to suppress errors
          try {
            if (navigator.geolocation) {
              var origGetPos = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
              var origWatch = navigator.geolocation.watchPosition.bind(navigator.geolocation);
              navigator.geolocation.getCurrentPosition = function(s, e, o) {
                try { origGetPos(s, e, o); } catch(ex) { if (e) e({ code: 1, message: 'Unavailable in review' }); }
              };
              navigator.geolocation.watchPosition = function(s, e, o) {
                try { return origWatch(s, e, o); } catch(ex) { if (e) e({ code: 1, message: 'Unavailable in review' }); return 0; }
              };
            }
          } catch(e) {}

        })();
      </script>
    `;

    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(
        /<head[^>]*>/i,
        (match) =>
          `${match}\n${baseTag}\n${metaReferrer}\n${injectedScripts}`
      );
    } else {
      html = `<head>${baseTag}${metaReferrer}${injectedScripts}</head>${html}`;
    }

    // Response: clean headers, no X-Frame-Options or CSP
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "text/html; charset=utf-8");
    responseHeaders.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("X-WebRev-Proxied", "true");
    // Grant all common browser permissions so proxied websites can use them
    responseHeaders.set(
      "Permissions-Policy",
      [
        "accelerometer=*",
        "ambient-light-sensor=*",
        "autoplay=*",
        "battery=*",
        "camera=*",
        "display-capture=*",
        "document-domain=*",
        "encrypted-media=*",
        "fullscreen=*",
        "gamepad=*",
        "geolocation=*",
        "gyroscope=*",
        "hid=*",
        "idle-detection=*",
        "local-fonts=*",
        "magnetometer=*",
        "microphone=*",
        "midi=*",
        "payment=*",
        "picture-in-picture=*",
        "publickey-credentials-get=*",
        "screen-wake-lock=*",
        "serial=*",
        "speaker-selection=*",
        "storage-access=*",
        "usb=*",
        "web-share=*",
        "xr-spatial-tracking=*",
      ].join(", ")
    );

    forwardSetCookies(response, responseHeaders);

    return new NextResponse(html, { status: 200, headers: responseHeaders });
  } catch (error) {
    console.error("[WebRev Proxy-Site Error]", error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>Proxy Error</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 24px; text-align: center; }
            .card { max-width: 500px; background: rgba(30,41,59,0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px 24px; }
            h2 { font-size: 1.25rem; margin-top: 0; color: #f43f5e; }
            p { font-size: 0.875rem; color: #94a3b8; line-height: 1.5; margin-bottom: 24px; }
            .btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 8px; font-size: 0.875rem; font-weight: 600; text-decoration: none; background: #3b82f6; color: white; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>⚠️ Website Tidak Dapat Dimuat</h2>
            <p>Server target membatasi akses atau memerlukan verifikasi keamanan. Silakan buka langsung di Tab Baru.</p>
            <a href="https://${domain}${path}" target="_blank" rel="noopener noreferrer" class="btn">Buka di Tab Baru</a>
          </div>
        </body>
      </html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

// ── POST, PUT, DELETE, PATCH: Forward to target backend ──
export async function POST(request, context) {
  return forwardRequest(request, context);
}

export async function PUT(request, context) {
  return forwardRequest(request, context);
}

export async function DELETE(request, context) {
  return forwardRequest(request, context);
}

export async function PATCH(request, context) {
  return forwardRequest(request, context);
}

// ── OPTIONS: Handle CORS preflight requests ──
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-CSRF-Token, Accept",
      "Access-Control-Max-Age": "86400",
    },
  });
}
