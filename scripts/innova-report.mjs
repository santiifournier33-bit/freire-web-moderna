// Reporte read-only: qué propiedades de Tokko mostrarían el widget de Innova.
// Uso: node --experimental-strip-types scripts/innova-report.mjs  (Node >= 22; usa TOKKOBROKER_API_KEY de .env.local)
import fs from "node:fs";
import { getInnovaEligibility } from "../src/lib/innova.ts";

const env = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const key = env.match(/^TOKKOBROKER_API_KEY\s*=\s*["']?([^\s"']+)/m)?.[1];
if (!key) throw new Error("Falta TOKKOBROKER_API_KEY en .env.local");

let url = `https://www.tokkobroker.com/api/v1/property/?key=${key}&limit=100&lang=es_ar&format=json`;
const all = [];
while (url) {
  const json = await (await fetch(url)).json();
  all.push(...(json.objects ?? []));
  url = json.meta?.next ? `https://www.tokkobroker.com${json.meta.next}` : null;
}

const csv = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const rows = all.map((p) => {
  const e = getInnovaEligibility(p);
  const sale = p.operations?.find((o) => o.operation_id === 1);
  const loc = (p.location?.full_location ?? "").split("|").map((s) => s.trim());
  return [p.id, p.publication_title, p.operations?.map((o) => o.operation_type).join("/"),
    sale?.prices?.map((x) => `${x.currency} ${x.price}`).join("/"), loc[2],
    p.custom_tags?.some((t) => t.id === 25415) ? "SI" : "NO", e.eligible ? "SI" : "NO", e.reasons.join(";")].map(csv).join(",");
});
const out = ["id,titulo,operacion,precio_venta,partido,con_escritura,elegible,motivos", ...rows].join("\n");
fs.writeFileSync(new URL("../innova-report.csv", import.meta.url), out);
const elegibles = rows.filter((r) => r.includes('"SI","SI"')).length;
console.log(`${all.length} propiedades · ${elegibles} elegibles · CSV: innova-report.csv`);
