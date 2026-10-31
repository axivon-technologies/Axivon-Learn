# Design System Tokens: AXIVON LEARN

**Title:** Design Tokens Specification  
**Purpose:** Formal dictionary of all color codes, font scales, spacing steps, shadows, and radii.  
**Status:** Implemented in `apps/web/src/styles/index.css`  
**Owner:** UI/UX Lead Designer  
**Last Updated:** 2026-10-31  

---

## 1. Color Palette Tokens

```css
/* Brand Primary & Accents */
--color-primary: hsl(245, 82%, 60%);        /* #5D54F6 - Tech Indigo */
--color-primary-hover: hsl(245, 82%, 52%);  /* #4338CA */
--color-primary-glow: hsla(245, 82%, 60%, 0.25);
--color-secondary: hsl(192, 95%, 48%);      /* #06B6D4 - Electric Cyan */
--color-accent: hsl(270, 75%, 60%);         /* #9333EA - Violet Glow */

/* Dark Theme Backgrounds & Surfaces */
--bg-main: #0B0F19;                         /* Deep Midnight Slate */
--bg-surface: #111827;                      /* Elevated Card Surface */
--bg-surface-elevated: #1F2937;             /* Input & Secondary Surface */
--bg-surface-glass: rgba(17, 24, 39, 0.75); /* Frosted Header */

/* Border & Dividers */
--border-subtle: #1F2937;
--border-default: #374151;
--border-focus: hsl(245, 82%, 60%);

/* Typography Colors */
--text-main: #F9FAFB;                       /* High Contrast Off-White */
--text-muted: #9CA3AF;                      /* Secondary Descriptive Text */
--text-dim: #6B7280;                        /* Footers & Captions */

/* Status & Feedback */
--color-success: #10B981;                   /* Emerald 500 */
--color-warning: #F59E0B;                   /* Amber 500 */
--color-danger: #EF4444;                    /* Red 500 */
--color-info: #3B82F6;                      /* Blue 500 */
```

---

## 2. Typography Hierarchy

| Style Token | Font Family | Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display H1** | Outfit | 3.75rem (60px) | 800 | 1.15 | -0.03em |
| **Section H2** | Outfit | 2.25rem (36px) | 700 | 1.25 | -0.02em |
| **Card H3** | Inter | 1.25rem (20px) | 700 | 1.4 | -0.01em |
| **Body Text** | Inter | 1rem (16px) | 400 | 1.6 | normal |
| **Small / Caption**| Inter | 0.875rem (14px) | 400 | 1.5 | normal |
| **Badge / Tag** | Inter | 0.75rem (12px) | 600 | 1.0 | 0.04em uppercase |

---

## 3. Spacing Grid (8pt System)

`4px` (0.25rem), `8px` (0.5rem), `12px` (0.75rem), `16px` (1rem), `24px` (1.5rem), `32px` (2rem), `48px` (3rem), `64px` (4rem).
Container max-width: `1280px` centered.
