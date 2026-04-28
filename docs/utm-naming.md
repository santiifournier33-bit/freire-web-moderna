# Convención de nomenclatura UTM — Freire Propiedades

Toda URL pegada a un anuncio (Meta Ads, Google Ads, post orgánico con link, email, QR, etc.) debe llevar UTMs siguiendo estas reglas. La consistencia es lo único que hace que los reportes en GA4 / Brevo / Tokko / GHL sean comparables.

## Reglas universales

| Regla | Ejemplo correcto | Ejemplo incorrecto |
|---|---|---|
| Solo minúsculas | `utm_source=meta` | `utm_source=Meta` |
| `snake_case`, sin espacios | `utm_campaign=captacion_vendedores_2604` | `utm_campaign=Captación Vendedores` |
| Sin tildes ni `ñ` | `utm_content=video_stella_pilar` | `utm_content=video_estaña` |
| Sin caracteres especiales (`/`, `&`, `?`, `=`, espacios) | `utm_term=vender_rapido` | `utm_term=vender/rápido` |
| Fechas en sufijo `YYMM` | `utm_campaign=tasacion_pilar_2604` | `utm_campaign=tasacion_abril2026` |

> El código (`src/lib/utm.ts`) normaliza valores a lowercase automáticamente para los 5 utm estándar — pero no inventa nombres bien formados. **Escribir bien las UTMs en cada anuncio sigue siendo manual.**

## Valores válidos por parámetro

### `utm_source` — qué plataforma originó el click

| Valor | Cuándo |
|---|---|
| `meta` | Anuncios pagos en Facebook + Instagram (Meta Ads Manager) |
| `google` | Anuncios pagos en Google Ads (Search / Display / YouTube) |
| `instagram_bio` | Link en bio de Instagram |
| `instagram_organic` | Post / reel orgánico con link en swipe-up o sticker |
| `facebook_organic` | Publicación orgánica en página FB |
| `whatsapp` | Mensaje en estado o conversación |
| `email` | Newsletter o email transaccional con link |
| `qr_print` | Códigos QR en folletos / cartelería física |
| `referral` | Link compartido por partner / referido |

### `utm_medium` — categoría general del canal

| Valor | Cuándo |
|---|---|
| `cpc` | Pago por click (Google Ads Search) |
| `paid_social` | Pago en redes sociales (Meta) |
| `organic_social` | Orgánico en redes |
| `email` | Email marketing |
| `referral` | Referido / partner |
| `print` | Material físico (QR en folleto) |

### `utm_campaign` — campaña concreta

Formato: `{objetivo}_{publico}_{YYMM}` o `{objetivo}_{zona}_{YYMM}`.

| Valor | Cuándo |
|---|---|
| `captacion_vendedores_2604` | Campaña principal de captación, abril 2026 |
| `tasacion_pilar_2604` | Campaña Google Ads — keyword "tasar propiedad pilar" |
| `vender_propiedad_2604` | Campaña Google Ads — keyword "vender propiedad" |
| `inmobiliaria_pilar_2604` | Campaña Google Ads — keyword "inmobiliaria pilar" |
| `tofu_autoridad_pilar_2606` | Campaña TOFU paralela (mes 3) |

### `utm_content` — variante específica del creativo / anuncio

Formato: `{tipo}_{tema}_{version}` o `{tipo}_{persona}_{nichoo}`.

| Valor | Cuándo |
|---|---|
| `video_stella_errores_v1` | Video Stella "3 errores al vender" — versión 1 |
| `video_stella_errores_v2` | Misma idea — segunda iteración |
| `video_santiago_caso_lopez` | Mini-caso Santiago narrando familia López |
| `carrusel_zona_pilar_v1` | Carrusel datos zona Pilar |
| `testimonio_lopez_v1` | Testimonio cliente real |
| `lead_magnet_guia_v1` | Anuncio que linkea a `/guia-vendedores` |

### `utm_term` — opcional (palabra clave / variante A/B)

Solo lo usamos cuando hace falta un eje extra. En Google Ads suele ser la keyword. En Meta, una variante A/B del copy.

| Valor | Cuándo |
|---|---|
| `vender_rapido` | A/B copy enfatizando rapidez |
| `sin_comision_alta` | A/B copy enfatizando comisión |
| `pilar_centro` | Segmentación geográfica del creativo |

### `utm_id` — opcional (ID único de campaña)

Estándar GA4 reciente. Cargarlo solo si querés sincronizar costos con GA4 vía CSV upload. Por ahora **no obligatorio**.

## Ejemplos completos

```
# Anuncio Meta principal
freirepropiedades.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=captacion_vendedores_2604&utm_content=video_stella_errores_v1

# Anuncio Google Ads — conjunto Tasación
freirepropiedades.com/tasar-propiedad?utm_source=google&utm_medium=cpc&utm_campaign=tasacion_pilar_2604&utm_term=tasar_propiedad_pilar

# Link en bio Instagram
freirepropiedades.com/guia-vendedores?utm_source=instagram_bio&utm_medium=organic_social&utm_campaign=lead_magnet_guia_perm

# QR de folleto en evento físico
freirepropiedades.com/?utm_source=qr_print&utm_medium=print&utm_campaign=evento_pilar_2605
```

## Errores típicos a evitar

1. **No copiar URLs entre campañas sin actualizar UTMs.** Si reusás un link viejo, los nuevos clicks se atribuyen a la campaña vieja.
2. **No usar mayúsculas ni acentos** — fragmenta los reportes (`Meta` ≠ `meta`).
3. **No olvidar el `YYMM`** en `utm_campaign` — sin fecha, no sabés cuándo arrancó.
4. **No usar `utm_*` para tracking interno** (ej: clicks dentro del propio sitio). Eso ensucia la atribución original. Usar otro mecanismo (data-attributes + GA4 events).
5. **No alterar UTMs después de publicar el anuncio** — si cambian a mitad de campaña, perdés continuidad histórica.

## Cómo usar el [Campaign URL Builder de Google](https://ga-dev-tools.google/campaign-url-builder/)

1. URL final: la página de destino (ej `https://www.freirepropiedades.com/tasar-propiedad`).
2. Llenar `source`, `medium`, `campaign`, opcionalmente `term` y `content`.
3. Copiar la URL generada → pegarla en el campo "URL del anuncio" de Meta Ads o Google Ads.

Para cada anuncio nuevo: builder → URL pegada → validar minúsculas + sin espacios → guardar.

## Verificación del flujo (QA después de publicar)

URL test:
```
freirepropiedades.com/tasar-propiedad?utm_source=meta&utm_medium=paid_social&utm_campaign=qa_e2e_2604&utm_content=qa_link
```

Después de completar el form, comprobar:
- [ ] Cookie `_fp_utms` en DevTools → contiene `first` y `last` con los valores normalizados a lowercase.
- [ ] Brevo → contacto creado → atributos `UTM_SOURCE=meta`, `UTM_CAMPAIGN=qa_e2e_2604`, etc.
- [ ] Tokko → webcontact con línea `Atribución: utm_source=meta | utm_campaign=qa_e2e_2604 ...` + tags `source:meta` `campaign:qa_e2e_2604`.
- [ ] Meta Events Manager → evento `Lead` con `event_source_url` conteniendo el querystring + `custom_data` con utm_*.
- [ ] GA4 Realtime → adquisición `meta / paid_social` (no "directo").

Si Brevo NO muestra los atributos UTM → falta crearlos como custom fields tipo TEXT en el panel: Contacts → Settings → Contact Attributes.
