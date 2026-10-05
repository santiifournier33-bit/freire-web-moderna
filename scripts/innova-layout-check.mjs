// QA de layout del widget de Innova en la ficha, para una matriz de dispositivos.
// Uso: PW_DIR=<carpeta con node_modules/playwright> node scripts/innova-layout-check.mjs <baseUrl> [outDir] [path]
//   ej: node scripts/innova-layout-check.mjs http://localhost:3110 ./qa-shots /p/11169332-prop
// Playwright no es dependencia del repo: se resuelve desde PW_DIR y usa el Chrome instalado en el sistema.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const [baseUrl = "http://localhost:3000", outDir = "./qa-shots", pagePath = "/p/11169332-prop"] = process.argv.slice(2);
const pwDir = process.env.PW_DIR;
if (!pwDir) throw new Error("Falta PW_DIR (carpeta que contiene node_modules/playwright)");
const { chromium } = createRequire(path.resolve(pwDir) + path.sep)("playwright");

const IFRAME_PAD = 8; // padding transparente del embed de Innova
const SIDEBAR_GAP = 32; // space-y-8

const DEVICES = [
  // móviles
  { name: "iPhone SE 1ra gen", w: 320, h: 568, dpr: 2, mobile: true },
  { name: "Galaxy S9+", w: 320, h: 658, dpr: 4, mobile: true },
  { name: "Galaxy Fold (cubierta)", w: 280, h: 653, dpr: 3, mobile: true },
  { name: "Galaxy Z Fold plegado", w: 344, h: 882, dpr: 3, mobile: true },
  { name: "iPhone SE 3ra gen", w: 375, h: 667, dpr: 2, mobile: true },
  { name: "iPhone 12/13/14", w: 390, h: 844, dpr: 3, mobile: true },
  { name: "iPhone 16", w: 393, h: 852, dpr: 3, mobile: true },
  { name: "Pixel 7 / S20 Ultra", w: 412, h: 915, dpr: 2.6, mobile: true },
  { name: "iPhone 14 Pro Max", w: 430, h: 932, dpr: 3, mobile: true },
  { name: "iPhone 16 Pro Max", w: 440, h: 956, dpr: 3, mobile: true },
  // tablets
  { name: "iPad mini", w: 768, h: 1024, dpr: 2, mobile: true },
  { name: "iPad 10.2", w: 810, h: 1080, dpr: 2, mobile: true },
  { name: "iPad Pro 11", w: 834, h: 1194, dpr: 2, mobile: true },
  { name: "iPad Pro 11 horizontal", w: 1194, h: 834, dpr: 2, mobile: true },
  // desktop
  { name: "Desktop 1024", w: 1024, h: 768, dpr: 1, mobile: false },
  { name: "Desktop 1280", w: 1280, h: 800, dpr: 1, mobile: false },
  { name: "Desktop 1366", w: 1366, h: 768, dpr: 1, mobile: false },
  { name: "Desktop 1440", w: 1440, h: 900, dpr: 1, mobile: false },
  { name: "Desktop 1920", w: 1920, h: 1080, dpr: 1, mobile: false },
];

// Se ejecuta en la página: mide las cajas del sidebar.
function measurePage(pad, gapExpected) {
  const r = (el) => {
    const b = el.getBoundingClientRect();
    return { left: b.left, right: b.right, top: b.top + scrollY, bottom: b.bottom + scrollY, width: b.width, height: b.height };
  };
  const form = document.getElementById("seccion-contacto");
  const stack = form?.parentElement;
  const iframe = document.querySelector("iframe[data-innova-embed]");
  if (!stack || !iframe) return { error: "no se encontró sidebar o iframe" };
  const panel = [...stack.children].find((c) => c.contains(iframe));
  const idx = [...stack.children].indexOf(panel);
  const prev = [...stack.children].slice(0, idx).reverse().find((c) => getComputedStyle(c).display !== "none");
  return {
    innerWidth, scrollWidth: document.documentElement.scrollWidth,
    isLg: matchMedia("(min-width:1024px)").matches,
    panel: r(panel), form: r(form), iframe: r(iframe), prev: prev ? r(prev) : null,
    iframeInlineHeight: iframe.style.height || null,
    gapExpected, pad,
  };
}

const results = [];
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });

for (const d of DEVICES) {
  const ctx = await browser.newContext({
    viewport: { width: d.w, height: d.h }, deviceScaleFactor: d.dpr, isMobile: d.mobile, hasTouch: d.mobile,
  });
  const page = await ctx.newPage();
  const fails = [];
  let info = {};
  try {
    await page.goto(baseUrl + pagePath, { waitUntil: "load", timeout: 60000 });
    const iframeEl = page.locator("iframe[data-innova-embed]");
    await iframeEl.scrollIntoViewIfNeeded({ timeout: 30000 });
    // esperar a que el loader de Innova ajuste la altura del iframe
    await page.waitForFunction(() => !!document.querySelector("iframe[data-innova-embed]")?.style.height, null, { timeout: 30000 }).catch(() => {});
    const frame = await (await iframeEl.elementHandle()).contentFrame();
    await frame.waitForSelector("article", { timeout: 30000 });
    await page.waitForTimeout(600);

    const m = await page.evaluate(measurePage, [IFRAME_PAD, SIDEBAR_GAP]);
    if (m.error) throw new Error(m.error);
    const card = await frame.evaluate(() => {
      const b = document.querySelector("article").getBoundingClientRect();
      return { width: b.width, height: b.height, left: b.left, top: b.top, docH: document.documentElement.scrollHeight };
    });

    const p = m.panel, f = m.form, i = m.iframe;
    const cardL = i.left + card.left, cardR = cardL + card.width, cardT = i.top + card.top, cardB = cardT + card.height;
    const mL = cardL - p.left, mR = p.right - cardR, mT = cardT - p.top, mB = p.bottom - cardB;
    const gapForm = f.top - p.bottom;
    const gapPrev = m.prev ? p.top - m.prev.bottom : null;
    const tol = 1.5;

    // En tablet vertical (md) el panel se acota a 340px y se centra a propósito.
    const isMd = d.w >= 768 && d.w < 1024;
    if (isMd) {
      if (Math.abs((p.left + p.right) / 2 - (f.left + f.right) / 2) > tol) fails.push("panel no centrado respecto al formulario (tablet)");
      if (Math.abs(p.width - 340) > tol) fails.push(`ancho de panel ${p.width.toFixed(0)} ≠ 340 (tablet)`);
    } else if (Math.abs(p.left - f.left) > tol || Math.abs(p.right - f.right) > tol) fails.push(`panel no alinea con formulario (${p.left.toFixed(1)}-${p.right.toFixed(1)} vs ${f.left.toFixed(1)}-${f.right.toFixed(1)})`);
    if (m.prev && (Math.abs(p.left - m.prev.left) > tol || Math.abs(p.right - m.prev.right) > tol)) fails.push("panel no alinea con bloque de precio");
    if (Math.abs(gapForm - SIDEBAR_GAP) > tol) fails.push(`gap panel→form ${gapForm.toFixed(1)} ≠ ${SIDEBAR_GAP}`);
    if (gapPrev !== null && Math.abs(gapPrev - SIDEBAR_GAP) > tol) fails.push(`gap precio→panel ${gapPrev.toFixed(1)} ≠ ${SIDEBAR_GAP}`);
    if (Math.abs(mL - mR) > tol) fails.push(`card descentrado (izq ${mL.toFixed(1)} / der ${mR.toFixed(1)})`);
    if (Math.abs(mT - mB) > 2.5) fails.push(`margen vertical dispar (arr ${mT.toFixed(1)} / abj ${mB.toFixed(1)})`);
    if (Math.abs((mL + mR) / 2 - (mT + mB) / 2) > 12) fails.push(`margen lateral ${((mL + mR) / 2).toFixed(0)} vs vertical ${((mT + mB) / 2).toFixed(0)} desparejo (>12px)`);
    if (!m.iframeInlineHeight) fails.push("el loader de Innova no ajustó la altura del iframe");
    if (m.scrollWidth > m.innerWidth + 1) fails.push(`scroll horizontal (${m.scrollWidth} > ${m.innerWidth})`);
    if (card.width < 164) fails.push(`card muy angosto (${card.width.toFixed(0)}px)`);
    if (i.height - (card.height + 2 * IFRAME_PAD) > 6) fails.push(`espacio muerto en iframe (${(i.height - card.height - 2 * IFRAME_PAD).toFixed(0)}px)`);
    if (card.docH > i.height + 1) fails.push(`contenido cortado/scroll interno (doc ${card.docH} > iframe ${i.height.toFixed(0)})`);

    info = {
      panelW: p.width.toFixed(0), cardW: card.width.toFixed(0), margenes: `${mL.toFixed(0)}/${mR.toFixed(0)}/${mT.toFixed(0)}/${mB.toFixed(0)}`,
      gaps: `${gapPrev === null ? "-" : gapPrev.toFixed(0)}/${gapForm.toFixed(0)}`, lg: m.isLg,
    };
    // Captura de viewport (la de elemento sale en blanco para iframes cross-origin con emulación móvil).
    await iframeEl.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${d.name.replace(/[^a-z0-9]+/gi, "_")}_${d.w}.png`) });
  } catch (e) {
    fails.push("ERROR: " + String(e.message).split("\n")[0]);
  }
  results.push({ device: `${d.name} (${d.w}px)`, ok: fails.length === 0, info, fails });
  await ctx.close();
}
await browser.close();

console.log("\ndispositivo".padEnd(34), "panel card  márgenes(I/D/Ar/Ab)  gaps(prev/form)  estado");
for (const r of results) {
  const i = r.info;
  console.log(
    r.device.padEnd(33), String(i.panelW ?? "-").padEnd(5), String(i.cardW ?? "-").padEnd(5), String(i.margenes ?? "-").padEnd(20), String(i.gaps ?? "-").padEnd(16), r.ok ? "OK" : "FALLA",
  );
  for (const f of r.fails) console.log("     ↳", f);
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} dispositivos OK`);
process.exit(failed ? 1 : 0);
