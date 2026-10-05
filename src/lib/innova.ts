/**
 * Elegibilidad del widget de financiación de Innova Hipotecaria.
 *
 * Reglas (acordadas con Innova):
 *  - Solo propiedades en VENTA con escritura (tag Tokko "Con Escritura").
 *  - Solo CABA y AMBA.
 *  - Valor mínimo USD 20.000 (préstamo mínimo USD 10.000, financian hasta 50%).
 */

export const INNOVA_MIN_PRICE_USD = 20000;
export const INNOVA_ORIGIN = "freirepropiedades";
export const INNOVA_CARD_BASE_URL = "https://www.innovahipotecaria.com/embed/card";
export const INNOVA_LOADER_URL = "https://www.innovahipotecaria.com/embed-loader.js";

// Etiqueta personalizada de Tokko: grupo "Estado De La Propiedad" > "Con Escritura".
export const CON_ESCRITURA_TAG_ID = 25415;
const CON_ESCRITURA_TAG_NAME = "con escritura";

const SALE_OPERATION_ID = 1;

/** CABA tal como la nombra Tokko en `location.full_location`. */
const CABA_NAMES = ["capital federal", "caba", "ciudad autonoma de buenos aires"];

/** 24 partidos del conurbano bonaerense (AMBA según INDEC). */
const CONURBANO_PARTIDOS = [
  "almirante brown", "avellaneda", "berazategui", "esteban echeverria", "ezeiza",
  "florencio varela", "general san martin", "hurlingham", "ituzaingo", "jose c. paz",
  "la matanza", "lanus", "lomas de zamora", "malvinas argentinas", "merlo", "moreno",
  "moron", "quilmes", "san fernando", "san isidro", "san miguel", "tigre",
  "tres de febrero", "vicente lopez",
];

/**
 * Partidos de la Región Metropolitana fuera del conurbano estricto. Pilar, Escobar,
 * Exaltación de la Cruz, Zárate y Campana están hoy en Tokko.
 * PENDIENTE: Innova debe confirmar por escrito si su "AMBA" incluye estos partidos.
 * Para excluirlos basta vaciar este arreglo.
 */
const PARTIDOS_REGION_METROPOLITANA = [
  "pilar", "escobar", "exaltacion de la cruz", "zarate", "campana", "general rodriguez",
  "marcos paz", "canuelas", "san vicente", "presidente peron", "la plata", "berisso",
  "ensenada", "lujan", "general las heras", "brandsen",
];

const AMBA_ALLOWLIST = new Set([
  ...CABA_NAMES,
  ...CONURBANO_PARTIDOS,
  ...PARTIDOS_REGION_METROPOLITANA,
]);

// ─── Tipos mínimos del objeto Tokko que usamos (el resto del objeto es `any`) ───
interface TokkoPrice {
  currency?: string;
  price?: number;
}
interface TokkoOperation {
  operation_id?: number;
  operation_type?: string;
  prices?: TokkoPrice[];
}
interface TokkoCustomTag {
  id?: number;
  name?: string;
}
export interface InnovaPropertyInput {
  operations?: TokkoOperation[] | null;
  custom_tags?: TokkoCustomTag[] | null;
  location?: { full_location?: string | null } | null;
}

export interface InnovaEligibility {
  eligible: boolean;
  /** Precio de venta en USD (entero). Solo viene si la propiedad es elegible. */
  priceUsd: number | null;
  /** Motivos de exclusión; vacío si es elegible. */
  reasons: string[];
}

function normalize(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function isSaleOperation(op: TokkoOperation): boolean {
  if (op.operation_id === SALE_OPERATION_ID) return true;
  // Sin `lang=es_ar` Tokko devuelve "Sale" en vez de "Venta".
  const type = normalize(op.operation_type);
  return type === "venta" || type === "sale";
}

/** Precio USD de la operación de venta (nunca de un alquiler). */
function getSalePriceUsd(operations: TokkoOperation[] | null | undefined): number | null {
  const sale = operations?.find(isSaleOperation);
  const usd = sale?.prices?.find((p) => p.currency === "USD" && typeof p.price === "number" && p.price > 0);
  return usd?.price ?? null;
}

function hasConEscrituraTag(tags: TokkoCustomTag[] | null | undefined): boolean {
  return (tags ?? []).some(
    (tag) => tag.id === CON_ESCRITURA_TAG_ID || normalize(tag.name) === CON_ESCRITURA_TAG_NAME
  );
}

function isInAmba(fullLocation: string | null | undefined): boolean {
  // "Argentina | G.B.A. Zona Norte | Pilar | Countries/B.Cerrado (Pilar) | Los Mirasoles"
  // CABA: "Argentina | Capital Federal | <barrio>". Tokko deja espacios finales ("Pilar ").
  const segments = (fullLocation ?? "").split("|").map(normalize);
  return segments.slice(1, 3).some((segment) => AMBA_ALLOWLIST.has(segment));
}

export function getInnovaEligibility(property: InnovaPropertyInput | null | undefined): InnovaEligibility {
  const reasons: string[] = [];

  if (process.env.INNOVA_WIDGET_ENABLED === "false") reasons.push("widget_deshabilitado");
  if (!property) return { eligible: false, priceUsd: null, reasons: [...reasons, "sin_propiedad"] };

  const hasSale = !!property.operations?.some(isSaleOperation);
  const priceUsd = getSalePriceUsd(property.operations);

  if (!hasSale) reasons.push("no_es_venta");
  else if (priceUsd === null) reasons.push("sin_precio_usd");
  else if (priceUsd < INNOVA_MIN_PRICE_USD) reasons.push("precio_menor_al_minimo");

  if (!hasConEscrituraTag(property.custom_tags)) reasons.push("sin_etiqueta_con_escritura");
  if (!isInAmba(property.location?.full_location)) reasons.push("fuera_de_caba_amba");

  if (reasons.length > 0) return { eligible: false, priceUsd: null, reasons };
  return { eligible: true, priceUsd: Math.round(priceUsd as number), reasons: [] };
}

export function buildInnovaCardUrl(priceUsd: number): string {
  const params = new URLSearchParams({
    precio: String(Math.round(priceUsd)),
    origin: INNOVA_ORIGIN,
    utm_campaign: "integracion",
    utm_content: "sidebar_ficha",
  });
  return `${INNOVA_CARD_BASE_URL}?${params.toString()}`;
}
