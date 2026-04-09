# Project Memory & Design Guidelines

## Recent UI/UX Updates (April 2026)

### 1. Hero Section Animations
- **"We're Hiring!" Badge:** Flies in from the top (`y: -50` to `y: 0`) on initial load.
- **Main Title ("Find Your Desired Job Here"):** Flies in from the right (`x: 100` to `x: 0`) with a `0.6s` duration.
- **Description Paragraph:** Flies in from the right (`x: 100` to `x: 0`) with a `0.6s` duration and a `0.6s` delay (waits for the title to finish).

### 2. "Our Job Boards" Section
- **Section Title:** Scroll-triggered animation. Flies in from the right (`x: 100` to `x: 0`) when scrolled into view (`whileInView`).
- **Job Cards:** 
  - **Animation:** Scroll-triggered 3D flip (`rotateX: 90` to `rotateX: 0`), staggered by `0.1s` per card.
  - **Box Shadow:** Uses a specific custom shadow to prevent Tailwind compiler issues: `shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)]`.
  - **Hover State:** Cards lift up (`-translate-y-3`) and shadow deepens.

## Core Directives
- **DO NOT** overwrite the custom box shadow on the job cards.
- **DO NOT** alter the Framer Motion animation sequences in the Hero section without explicit permission.
- **Backend Integrity:** UI changes must strictly avoid modifying Firebase configuration, Admin Panel logic, or database synchronization code.
