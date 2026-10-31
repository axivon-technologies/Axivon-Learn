# Design Overview: AXIVON LEARN

**Title:** UI/UX Design System & Experience Overview  
**Purpose:** Establishes the visual language, design philosophies, and brand identity of AXIVON LEARN.  
**Status:** Approved Requirements  
**Owner:** UI/UX Lead Designer  
**Last Updated:** 2026-10-31  

---

## 1. Design Vision

AXIVON LEARN embodies a modern, technical aesthetic. Rather than mimicking generic bright-white classroom portals, the platform adopts a curated high-contrast dark aesthetic that reduces eye fatigue during extended technical reading and code study sessions.

### Brand Identity Tokens:
- **Brand Tagline:** *Learn. Build. Grow.*
- **Primary Brand Theme:** Deep Slate surfaces (`#0B0F19`, `#111827`) highlighted by vibrant Tech Indigo (`hsl(245, 82%, 60%)`), Electric Cyan (`hsl(192, 95%, 48%)`), and subtle purple glows.
- **Typography:** Google Font **Inter** for crisp, highly readable UI text and **Outfit** for distinctive display headings.
- **Micro-Interactions:** Subtle hover translations (`translateY(-2px)`), smooth CSS cubic-bezier transitions, and ambient glow rings on focused inputs.

---

## 2. Core Experience Tenets

1. **Information Hierarchy Before Decoration:** Content cards highlight prerequisites, lesson count, and duration prominently.
2. **Predictable Interaction States:** Every card, button, and input clearly communicates its state (Default, Hover, Focus, Active, Disabled, Loading, Error).
3. **Inclusive Accessibility (WCAG 2.1 AA):** High contrast (> 4.5:1), visible keyboard focus rings, and explicit text labels paired with all icons.
