/**
 * Voyager subscription/download gate.
 *
 * Normal requests fall through to the static assets binding (the site
 * itself). Two JSON endpoints handle the paid-download flow:
 *
 *   POST /api/verify-subscription   { subscriptionID }
 *     -> calls PayPal's REST API server-side to confirm the subscription
 *        is actually ACTIVE, then mints a short-lived, single-use token
 *        stored in KV.
 *
 *   GET  /api/download?token=...
 *     -> checks the token in KV, marks it used, and streams the zip from
 *        the assets binding. There is no other public path to the zip:
 *        direct requests to /voyageragent.zip are blocked below.
 *
 * Required secrets (set with `wrangler secret put <NAME>`, never commit
 * these): PAYPAL_CLIENT_ID, PAYPAL_SECRET. Optional: PAYPAL_ENV = "live"
 * (defaults to sandbox if unset).
 */

const ZIP_PATH = "/voyageragent.zip";
const TOKEN_TTL_SECONDS = 300; // window to actually use the download link

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getPayPalAccessToken(env) {
  const base =
    env.PAYPAL_ENV === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  const creds = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`paypal_auth_failed:${res.status}`);
  }
  const data = await res.json();
  return { accessToken: data.access_token, base };
}

async function fetchSubscription(env, subscriptionID) {
  const { accessToken, base } = await getPayPalAccessToken(env);
  const res = await fetch(
    `${base}/v1/billing/subscriptions/${encodeURIComponent(subscriptionID)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  return res.json();
}

async function handleVerify(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const subscriptionID = (body && body.subscriptionID) || "";
  if (!subscriptionID) {
    return json({ error: "missing_subscription_id" }, 400);
  }

  let sub;
  try {
    sub = await fetchSubscription(env, subscriptionID);
  } catch (e) {
    return json({ error: "paypal_unreachable" }, 502);
  }

  if (!sub || sub.status !== "ACTIVE") {
    return json({ error: "not_active", status: sub ? sub.status : "unknown" }, 402);
  }

  const token = randomToken();
  await env.VOYAGER_FILES.put(
    `token:${token}`,
    JSON.stringify({ subscriptionID, used: false }),
    { expirationTtl: TOKEN_TTL_SECONDS }
  );

  return json({ token, expiresIn: TOKEN_TTL_SECONDS });
}

async function handleDownload(request, env, url) {
  const token = url.searchParams.get("token") || "";
  if (!token) return new Response("Missing token", { status: 400 });

  const key = `token:${token}`;
  const raw = await env.VOYAGER_FILES.get(key);
  if (!raw) return new Response("Invalid or expired link", { status: 403 });

  const record = JSON.parse(raw);
  if (record.used) {
    return new Response("This download link was already used", { status: 403 });
  }

  // Best-effort single-use: mark it before streaming so a double-click
  // can't fire two downloads off the same token.
  await env.VOYAGER_FILES.put(
    key,
    JSON.stringify({ ...record, used: true }),
    { expirationTtl: TOKEN_TTL_SECONDS }
  );

  const assetRes = await env.ASSETS.fetch(new Request(new URL(ZIP_PATH, url.origin)));
  if (!assetRes.ok) {
    return new Response("File not available", { status: 500 });
  }

  const headers = new Headers(assetRes.headers);
  headers.set("Content-Disposition", 'attachment; filename="voyageragent.zip"');
  return new Response(assetRes.body, { status: 200, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // The zip is never served as a plain static file — only through
    // /api/download after a verified token. env.ASSETS.fetch() inside
    // handleDownload() bypasses this block (it doesn't re-enter fetch()).
    if (url.pathname === ZIP_PATH) {
      return new Response("Not found", { status: 404 });
    }

    if (url.pathname === "/api/verify-subscription" && request.method === "POST") {
      return handleVerify(request, env);
    }

    if (url.pathname === "/api/download" && request.method === "GET") {
      return handleDownload(request, env, url);
    }

    return env.ASSETS.fetch(request);
  },
};
