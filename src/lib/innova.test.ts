import { afterEach, describe, expect, it } from "vitest";
import { buildInnovaCardUrl, getInnovaEligibility, type InnovaPropertyInput } from "./innova";

const CON_ESCRITURA = { id: 25415, name: "Con Escritura" };

function property(overrides: Partial<InnovaPropertyInput> = {}): InnovaPropertyInput {
  return {
    operations: [{ operation_id: 1, operation_type: "Venta", prices: [{ currency: "USD", price: 140000 }] }],
    custom_tags: [CON_ESCRITURA],
    location: { full_location: "Argentina | G.B.A. Zona Norte | Pilar | Countries/B.Cerrado (Pilar) | Los Mirasoles" },
    ...overrides,
  };
}

afterEach(() => {
  delete process.env.INNOVA_WIDGET_ENABLED;
});

describe("getInnovaEligibility", () => {
  it("venta USD con escritura en Pilar es elegible", () => {
    expect(getInnovaEligibility(property())).toEqual({ eligible: true, priceUsd: 140000, reasons: [] });
  });

  it("USD 20.000 es elegible y USD 19.999 no", () => {
    const at = (price: number) =>
      getInnovaEligibility(property({ operations: [{ operation_id: 1, prices: [{ currency: "USD", price }] }] }));
    expect(at(20000).eligible).toBe(true);
    expect(at(19999)).toMatchObject({ eligible: false, reasons: ["precio_menor_al_minimo"] });
  });

  it("alquiler con la etiqueta no es elegible", () => {
    const result = getInnovaEligibility(
      property({ operations: [{ operation_id: 2, operation_type: "Alquiler", prices: [{ currency: "USD", price: 900000 }] }] })
    );
    expect(result).toMatchObject({ eligible: false, reasons: ["no_es_venta"] });
  });

  it("precio en ARS no es elegible", () => {
    const result = getInnovaEligibility(
      property({ operations: [{ operation_id: 1, prices: [{ currency: "ARS", price: 90000000 }] }] })
    );
    expect(result).toMatchObject({ eligible: false, reasons: ["sin_precio_usd"] });
  });

  it("sin etiqueta Con Escritura no es elegible (aunque sea apto crédito)", () => {
    const result = getInnovaEligibility({ ...property({ custom_tags: [{ id: 25413, name: "Exclusiva" }] }), credit_eligible: "Apto crédito" } as InnovaPropertyInput);
    expect(result).toMatchObject({ eligible: false, reasons: ["sin_etiqueta_con_escritura"] });
  });

  it("reconoce la etiqueta por nombre aunque cambie el id", () => {
    expect(getInnovaEligibility(property({ custom_tags: [{ id: 1, name: "  CON ESCRITURA " }] })).eligible).toBe(true);
  });

  it("Mar del Plata no es elegible", () => {
    const result = getInnovaEligibility(property({ location: { full_location: "Argentina | Costa Atlantica | Mar Del Plata " } }));
    expect(result).toMatchObject({ eligible: false, reasons: ["fuera_de_caba_amba"] });
  });

  it("CABA es elegible", () => {
    expect(getInnovaEligibility(property({ location: { full_location: "Argentina | Capital Federal | Palermo" } })).eligible).toBe(true);
  });

  it("tolera espacios finales y tildes (\"Pilar \", \"Exaltacion De La Cruz\")", () => {
    expect(getInnovaEligibility(property({ location: { full_location: "Argentina | G.B.A. Zona Norte | Pilar " } })).eligible).toBe(true);
    expect(getInnovaEligibility(property({ location: { full_location: "Argentina | G.B.A. Zona Norte | Exaltación De La Cruz" } })).eligible).toBe(true);
  });

  it("sin operaciones o sin ubicación no es elegible", () => {
    expect(getInnovaEligibility(property({ operations: [] })).eligible).toBe(false);
    expect(getInnovaEligibility(property({ operations: null })).eligible).toBe(false);
    expect(getInnovaEligibility(property({ location: null })).eligible).toBe(false);
    expect(getInnovaEligibility(null).eligible).toBe(false);
  });

  it("con Alquiler primero y Venta después usa el precio de la Venta", () => {
    const result = getInnovaEligibility(
      property({
        operations: [
          { operation_id: 2, operation_type: "Alquiler", prices: [{ currency: "USD", price: 800 }] },
          { operation_id: 1, operation_type: "Venta", prices: [{ currency: "USD", price: 95000 }] },
        ],
      })
    );
    expect(result).toEqual({ eligible: true, priceUsd: 95000, reasons: [] });
  });

  it("detecta venta por texto \"Sale\" cuando Tokko no manda operation_id", () => {
    const result = getInnovaEligibility(
      property({ operations: [{ operation_type: "Sale", prices: [{ currency: "USD", price: 50000 }] }] })
    );
    expect(result.eligible).toBe(true);
  });

  it("INNOVA_WIDGET_ENABLED=false apaga el widget", () => {
    process.env.INNOVA_WIDGET_ENABLED = "false";
    expect(getInnovaEligibility(property())).toMatchObject({ eligible: false, reasons: ["widget_deshabilitado"] });
  });

  it("acumula todos los motivos de exclusión", () => {
    const result = getInnovaEligibility({ operations: [], custom_tags: [], location: null });
    expect(result.reasons).toEqual(["no_es_venta", "sin_etiqueta_con_escritura", "fuera_de_caba_amba"]);
  });
});

describe("buildInnovaCardUrl", () => {
  it("arma la URL con los parámetros de la guía de Innova", () => {
    expect(buildInnovaCardUrl(165000)).toBe(
      "https://www.innovahipotecaria.com/embed/card?precio=165000&origin=freirepropiedades&utm_campaign=integracion&utm_content=sidebar_ficha"
    );
  });

  it("redondea el precio a entero", () => {
    expect(buildInnovaCardUrl(99999.6)).toContain("precio=100000");
  });
});
