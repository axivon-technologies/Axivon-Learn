# Visual QA Process: AXIVON LEARN

**Title:** Visual Quality Assurance & Acceptance Review  
**Purpose:** Audit procedures for validating design fidelity, responsiveness, and state handling before PR approval.  
**Status:** Approved Requirements  
**Owner:** UI/UX Lead & QA Lead  
**Last Updated:** 2026-10-31  

---

## 1. Visual QA Protocol

Before any frontend Pull Request (`feature/frontend-*`) is approved for merge into `develop`, the UI/UX Lead must sign off on the visual implementation.

### Review Checklist:
- [ ] **Typography & Hierarchy:** Heading weights and font sizes strictly match `Outfit` and `Inter` specs. No default system serif/sans-serif bleed.
- [ ] **Spacing & Alignment:** Padding and margin steps conform to the 8pt grid (`--space-4`, `--space-6`).
- [ ] **Interactive Micro-Interactions:** Hover states, active buttons, and focus rings conform to tokens.
- [ ] **Multi-Viewport Audit:**
  - Mobile (375px): Hamburger navigation drawer opens smoothly, cards stack without horizontal overflow.
  - Tablet (768px): 2-column grid aligns cleanly.
  - Desktop (1280px+): Max-width container centered with clean margins.
- [ ] **State Coverage:** Loading skeletons, empty states, error fallbacks, and success banners render cleanly with consistent design styling.
