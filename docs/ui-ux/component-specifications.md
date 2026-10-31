# Component Specifications: AXIVON LEARN

**Title:** UI Component Library Specifications  
**Purpose:** Implementation standards, prop interfaces, and variants for reusable components.  
**Status:** Implemented  
**Owner:** UI/UX & Frontend Teams  
**Last Updated:** 2026-10-31  

---

## 1. Button Primitive (`.btn`)

### Variants:
- `.btn-primary`: Vibrant gradient (`var(--color-primary)` to dark indigo), white text, primary glow box shadow.
- `.btn-secondary`: Neutral surface elevated (`var(--bg-surface-elevated)`), border default.
- `.btn-ghost`: Transparent background, hover tint.
- `.btn-sm`: Compact padding (`0.375rem 0.75rem`), smaller font (`0.8125rem`).

### Interactive States:
- **Hover:** Translation `translateY(-1px)`, increased glow shadow.
- **Focus:** 3px ring using `var(--color-primary-glow)`.
- **Disabled:** Opacity 0.5, cursor `not-allowed`, pointer events disabled.

---

## 2. Card Primitive (`.card`)

### Variants:
- Standard Card: Background `var(--bg-surface)`, border `var(--border-subtle)`, radius `var(--radius-lg)`.
- `.card-interactive`: Hover translation `translateY(-3px)`, border highlight, shadow glow.

---

## 3. Feedback State Components

1. **`<LoadingState message count />`:** Renders animated SVG/CSS shimmering skeleton bars and polite screen reader text.
2. **`<EmptyState title description actionLabel actionLink />`:** Centered card with dashed border, helpful copy, and recovery CTA.
3. **`<ErrorState title message onRetry />`:** Red-accented alert box with optional retry callback button.
4. **`<SuccessAlert title message />`:** Emerald-accented banner for confirmation states.
