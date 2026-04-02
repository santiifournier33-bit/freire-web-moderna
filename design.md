# Design Manifesto: Architectural Precision & Fluid Depth

This document defines the visual soul of **Freire Real Estate**, replacing traditional luxury with **The Architectural Lens**.

## 1. Creative North Star: "The Architectural Lens"
We use depth, tonal shifts, and glass to define space. Our UI is a **Digital Magazine** that breathes.
- **Intentional Asymmetry:** Grid-breaking layouts with overlapping images for movement.
- **Atmospheric Depth:** Layered surfaces mimicking modern architectural glass.
- **Typographic Authority:** High-contrast Inter for a technical, trustworthy feel.

## 2. Color & Surface Hierarchy
We strictly follow the **"No-Line" Rule**: boundaries are created through background shifts, not 1px borders.

| Layer | Tone Name | Hex | Usage |
|-------|-----------|-----|-------|
| 0 | **Floor** | `#f9f9ff` | Base surface for the entire page. |
| 1 | **Section** | `#e7eefe` | Surface-container for large zones. |
| 2 | **Content** | `#ffffff` | Surface-container-lowest for cards/inputs. |
| 3 | **Interactive**| **Navy Gradient** | Primary CTAs (135° from #002548 to #003b6d). |
| 4 | **Anchor** | **Surface Dim** | Footer and heavy base elements. |

**Ghost Border Fallback:** For accessibility, use `outline-variant` (#c2c6d0) at 15% opacity.

## 3. Typography: Editorial Inter
- **Display Scale:** Inter (-0.02em letter-spacing). Tight and expensive.
- **Body Scale:** Inter / `#42474f` (On-surface-variant). Soft contrast, high legibility.
- **Label Scale:** All-caps (+0.05em letter-spacing). Used for technical metadata.

## 4. Elevation: Tonal Lift & Ambient Shadows
- **Tonal Lift:** Perception of elevation via hex code step-ups (Step 1 to Step 2).
- **Ambient Shadow:** Tinted glows (`rgba(0, 37, 72, 0.08)`) with 30-40px blur. No hard edges.

## 5. Kinetic Components
- **Buttons (Kinetic Core):** Signature 135° gradient. On hover, shift intensity or position slightly.
- **Cards (The Window Effect):** No dividers. Images scale 1.05x on hover inside a static container.
- **Inputs (Transparent):** `surface-container-low` fill with a bottom 15% Ghost Border.

---
*Powered by ui-ux-pro-max-skill & Architectural Vision.*
