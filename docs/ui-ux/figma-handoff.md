# Figma Handoff Guide: AXIVON LEARN

**Title:** Figma to Development Handoff Specification  
**Purpose:** Instructions for extracting design tokens, inspectable components, and SVG assets from Figma.  
**Status:** Approved Requirements  
**Owner:** UI/UX Lead Designer  
**Last Updated:** 2026-10-31  

---

## 1. Figma Source Workspace

> [!NOTE]
> **Figma Source URL:** `[PLACEHOLDER - Awaiting official Figma file URL from Axivon Design Team]`  
> **Workspace Name:** `Axivon Technologies / AXIVON LEARN Master`

Until the production Figma URL is provisioned by the design team, all frontend engineering references the approved token dictionary codified in `design/README.md` and `docs/ui-ux/design-system.md`.

---

## 2. Component Handoff Protocol

1. **Auto-Layout Inspect:** Developers must inspect auto-layout padding and gap properties to match CSS spacing tokens (`--space-4`, `--space-6`).
2. **Typography Styles:** Do not use arbitrary font sizes. Match Figma text styles directly to the typography hierarchy.
3. **Asset Export Rules:**
   - Icons: Export as optimized SVGs into `design/exported-assets/` and `apps/web/src/assets/`.
   - Illustrations: Export as vector SVGs or compressed WebP images.
   - Do not commit large uncompressed PNGs or raw bitmaps.
