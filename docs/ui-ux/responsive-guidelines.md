# Responsive Guidelines: AXIVON LEARN

**Title:** Responsive Design & Grid System  
**Purpose:** Breakpoints, stacking behaviors, and viewport testing guidelines.  
**Status:** Implemented  
**Owner:** UI/UX & Frontend Teams  
**Last Updated:** 2026-10-31  

---

## 1. Breakpoint System

| Breakpoint Name | Viewport Range | Layout Behavior | Target Devices |
| :--- | :--- | :--- | :--- |
| **Mobile (`sm`)** | 320px – 639px | Single column, stacked cards, drawer navigation | iPhone SE, 13/14, Pixel 7 |
| **Tablet (`md`)** | 640px – 1023px| 2-column card grid, collapsible sidebars | iPad Mini, iPad Air, Surface |
| **Desktop (`lg`)**| 1024px – 1279px| Multi-column grid, horizontal header nav | MacBook Air 13", 1080p laptop |
| **Wide (`xl`)** | 1280px+ | Full container (1280px max-width), fixed sidebars| 1440p / 4K Monitors |

---

## 2. Key Responsive Behaviors

1. **Header Navigation:** Below 860px, header links collapse into a hamburger menu button. Clicking toggles a mobile drawer containing all navigation links.
2. **Course Syllabus on Mobile:** The enrollment card stacks below the syllabus rather than floating as a fixed sidebar to prevent horizontal scroll.
3. **Touch Targets:** All interactive buttons on mobile are sized to a minimum of 44x44px.
