# Accessibility Guidelines: AXIVON LEARN

**Title:** Accessibility (a11y) & WCAG 2.1 AA Compliance  
**Purpose:** Standards for semantic HTML, keyboard focus, screen readers, and color contrast.  
**Status:** Approved Requirements  
**Owner:** UI/UX & QA Teams  
**Last Updated:** 2026-10-31  

---

## 1. Compliance Baseline: WCAG 2.1 Level AA

AXIVON LEARN strictly complies with WCAG 2.1 AA guidelines across all delivered screens.

### 1.1 Color Contrast
- Normal body text (`#F9FAFB` on `#0B0F19` or `#111827`) exceeds a 15:1 contrast ratio (far surpassing the 4.5:1 AA requirement).
- Muted secondary text (`#9CA3AF`) achieves a 5.2:1 contrast ratio.
- Status colors never rely on color alone; status is always paired with explicit textual labels and icon shapes.

### 1.2 Keyboard Operability
- Focusable elements (buttons, inputs, links) display an unmistakable focus ring: `box-shadow: 0 0 0 3px var(--color-primary-glow)`.
- Modals and drawers trap keyboard focus and allow dismissal via the `Escape` key.
- Form inputs have associated `<label>` tags with matching `htmlFor` identifiers.

### 1.3 Screen Reader Compatibility
- Interactive icons have explicit `aria-label` attributes.
- Dynamic asynchronous content (e.g., loading states) utilizes `role="status"` and `aria-live="polite"`.
- Video embeds include alternative text descriptions and clear study notes.
