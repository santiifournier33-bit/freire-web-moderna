/**
 * One-time script to get a Google Ads API refresh token via OAuth2.
 * Run: node scripts/get-google-ads-token.mjs
 * Then paste the resulting refresh_token into .env.local → GOOGLE_ADS_REFRESH_TOKEN
 */

import http from "http";
import { exec } from "child_process";
import { URL } from "url";

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Error: Set GOOGLE_ADS_CLIENT_ID and GOOGLE_ADS_CLIENT_SECRET in .env.local first");
  process.exit(1);
}
const REDIRECT_URI = "http://localhost:3333";
const SCOPE = "https://www.googleapis.com/auth/adwords";

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPE)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log("\n🔑 Abriendo navegador para autorización de Google Ads...\n");
console.log("Si no se abre automáticamente, copiá esta URL:\n");
console.log(authUrl + "\n");

// Try to open browser
const openCmd =
  process.platform === "win32" ? `start "" "${authUrl}"` :
  process.platform === "darwin" ? `open "${authUrl}"` :
  `xdg-open "${authUrl}"`;
exec(openCmd);

// Local server to capture redirect
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");

  if (!code) {
    res.end("Error: no code received");
    server.close();
    return;
  }

  res.end("<h2>Autorización exitosa. Podés cerrar esta pestaña.</h2>");
  server.close();

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  if (tokens.error) {
    console.error("\n❌ Error al obtener tokens:", tokens);
    process.exit(1);
  }

  console.log("\n✅ ÉXITO. Copiá esto en .env.local:\n");
  console.log(`GOOGLE_ADS_REFRESH_TOKEN=${tokens.refresh_token}\n`);
  console.log("(access_token expira en 1h — el refresh_token no expira)\n");
});

server.listen(3333, () => {
  console.log("Esperando autorización en http://localhost:3333 ...\n");
});
