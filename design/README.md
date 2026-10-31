# AXIVON LEARN — UI/UX Design System & Handoff Hub

**Organization:** Axivon Technologies  
**Product:** AXIVON LEARN  
**Tagline:** Learn. Build. Grow.  
**Version:** 1.0  
**Status:** Working Baseline  

---

## 1. Overview & Design Mission

AXIVON LEARN provides a clean, modern, and trustworthy technology learning experience. Its design emphasizes curriculum structure, clear learning sequences, distraction-free studying, verifiable progress tracking, and effortless navigation between courses, lessons, quizzes, and projects.

This directory serves as the single source of truth for the UI/UX Design Team and the primary handoff bridge to the Frontend Development Team.

---

## 2. Directory Structure

```
design/
├── README.md                   # This master design and handoff guide
├── design-system/              # Design tokens (colors, typography, spacing, shadows, radii)
├── user-flows/                 # End-to-end journey maps (Visitor to Learner, Admin CMS, etc.)
├── wireframes/                 # Low-fidelity structural wireframes and layout schematics
├── screen-specifications/      # Detailed screen-by-screen UX specifications and responsive rules
├── exported-assets/            # Optimized SVGs, icons, illustrations, and brand assets
└── handoff/                    # Developer checklists, component variant matrices, and token mappings
```

---

## 3. Figma Source References & Workspace Links

| Asset / File | Description | Ownership |
| :--- | :--- | :--- |
| **AXIVON-LEARN Master Design System** | Components, variants, typography, and color tokens | UI/UX Lead |
| **AXIVON-LEARN Public & Learner Screens**| Home, Catalog, Course Detail, Lesson Player, Quizzes, Dashboard | UI/UX Design Team |
| **AXIVON-LEARN Admin CMS Screens** | Course Editor, Module/Lesson Manager, Quiz Builder | UI/UX & Full Stack |
| **Figma Project Workspace** | `https://figma.com/@axivon-technologies/axivon-learn` *(Internal Team Project)* | Axivon Design Team |

---

## 4. Core User Flows

### Flow A: Visitor to Enrolled Learner (P0)
```
[Home Page /] 
      │ (Browse featured paths & courses)
      ▼
[Catalog /courses] 
      │ (Filter by category: AI/ML, Web Dev)
      ▼
[Course Detail /courses/:slug] 
      │ (Review syllabus, outcomes, prerequisites)
      ▼
[Register / Login] 
      │ (Authenticate session)
      ▼
[Lesson Player /learn/:courseSlug/:lessonId] 
      │ (Watch video embed, read resources, mark complete)
      ▼
[Quiz /quiz/:quizId] 
      │ (Attempt questions, submit answers, review score)
      ▼
[Learner Dashboard /dashboard]
        (Saved progress visible and updated)
```

### Flow B: Admin Content Publishing (P0)
```
[Admin Login] ──► [Admin Overview /admin] ──► [Course Manager /admin/courses]
      │
      ▼
[Create Draft Course] ──► [Add Syllabus & Lessons] ──► [Attach Quiz & Questions]
      │
      ▼
[Preview Content] ──► [Publish Course] ──► [Verify Public Catalog Visibility]
```

### Flow C: Returning Learner (P0)
```
[Login] ──► [Dashboard /dashboard] ──► [Click 'Continue Learning'] ──► [Resume Last Lesson]
```

### Flow D: Access Control Boundary (P0)
```
[Unauthenticated Request to /dashboard or /learn/*] ──► Redirect to /login
[Learner Access to /admin/*] ──► Immediate 403 Forbidden Error State
```

---

## 5. Design Tokens Baseline

### 5.1 Color Palette
* **Brand Primary:** Deep Tech Indigo (`hsl(245, 82%, 58%)` / `#4F46E5`)
* **Brand Secondary:** Electric Cyan (`hsl(192, 95%, 48%)` / `#06B6D4`)
* **Brand Accent:** Violet Glow (`hsl(270, 75%, 60%)` / `#8B5CF6`)
* **Neutral Dark (Backgrounds & Text):**
  - Dark Surface 900: `#0F172A` (Slate 900)
  - Dark Surface 800: `#1E293B` (Slate 800)
  - Dark Border: `#334155` (Slate 700)
* **Neutral Light:**
  - Light Background: `#F8FAFC` (Slate 50)
  - Light Card Surface: `#FFFFFF`
  - Light Border: `#E2E8F0` (Slate 200)
* **Feedback Colors:**
  - Success: `#10B981` (Emerald 500)
  - Warning: `#F59E0B` (Amber 500)
  - Danger / Error: `#EF4444` (Red 500)
  - Info: `#3B82F6` (Blue 500)

### 5.2 Typography
* **Primary Sans-Serif:** Inter or Outfit (Google Fonts)
* **Code / Monospace:** JetBrains Mono or Fira Code
* **Hierarchy:**
  - `Display / H1`: 36px (Mobile) / 48px (Desktop) | SemiBold (600)
  - `H2`: 28px (Mobile) / 32px (Desktop) | SemiBold (600)
  - `H3`: 20px (Mobile) / 24px (Desktop) | Medium (500)
  - `Body Regular`: 16px | Line-height 1.6 | Regular (400)
  - `Body Small / Caption`: 14px | Line-height 1.4 | Regular (400)
  - `Overline / Tag`: 12px | Letter-spacing 0.05em | SemiBold (600) uppercase

### 5.3 Spacing & Grid System
* Base Grid unit: 4px / 8px scale (`8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
* Container Max-Width: `1280px` centered with responsive side padding (`16px` on mobile, `24px` on tablet, `32px` on desktop).

### 5.4 Responsive Breakpoints
* **Mobile (sm):** `320px` to `639px` (Single column layout, bottom or drawer navigation)
* **Tablet (md):** `640px` to `1023px` (Two column grid, adaptive navigation)
* **Desktop (lg):** `1024px` to `1279px` (Sidebar + content layout)
* **Wide (xl):** `1280px+` (Full spacious layout with fixed sidebar where needed)

---

## 6. Shared Component Inventory & State Guidelines

Every component delivered for frontend implementation must account for all necessary interactive states:

| Component | Required Variants & States | Accessibility & UX Rules |
| :--- | :--- | :--- |
| **Global Header** | Logged-out, Logged-in Learner, Logged-in Admin, Mobile drawer open/closed | Keyboard focusable, aria-expanded on menu toggle |
| **Course Card** | Default, Hover/Focus, Loading Skeleton, Missing Thumbnail Fallback, Progress variant | Never use color alone to signal level; use text badges |
| **Category Chip** | Default, Selected (active filter), Disabled/Empty | Clear contrast ring on active filter |
| **Buttons** | Primary, Secondary, Ghost, Danger, Disabled, Loading (with spinner) | Accessible touch target (min 44x44px on mobile) |
| **Form Inputs** | Default, Focus ring, Filled, Error (with inline message), Disabled | Always associate label with `htmlFor`/`id` |
| **Lesson Player** | Current lesson active, Completed checkmark, Locked/Unavailable fallback | Video embeds must preserve aspect ratio (16:9) |
| **Quiz Interface** | Unselected option, Selected, Submitted, Correct/Incorrect review, Score summary | Do not expose answer key prior to submission |
| **Feedback Alerts** | Loading skeleton, Empty state (with CTA), Error banner (with retry action), Success toast | Polite ARIA live regions for dynamic alerts |

---

## 7. Developer Handoff Checklist

Before a design is approved for frontend development:
- [ ] Responsive specifications exist for Mobile (375px) and Desktop (1280px).
- [ ] Color contrast passes WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text and UI components).
- [ ] Form controls define explicit error messages and focus states.
- [ ] All icons and assets are exported as optimized SVGs in `design/exported-assets/`.
- [ ] No fake or unrealistic placeholder text that distorts layout boundaries.
