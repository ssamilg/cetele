---
name: Çetele
description: Frictionless time tracking — Deep Work Console
colors:
  deep-work-violet: "hsl(262.1 83.3% 57.8%)"
  deep-work-violet-dark: "hsl(263.4 70% 50.4%)"
  primary-foreground: "hsl(210 20% 98%)"
  canvas-light: "hsl(224 18% 92%)"
  canvas-dark: "hsl(224 20% 8%)"
  ink-light: "hsl(224 40% 12%)"
  ink-dark: "hsl(210 20% 98%)"
  surface-card-light: "hsl(220 28% 97%)"
  surface-card-dark: "hsl(224 71.4% 4.1%)"
  muted-surface: "hsl(224 14% 88%)"
  muted-surface-dark: "hsl(215 27.9% 16.9%)"
  muted-ink: "hsl(224 12% 38%)"
  muted-ink-dark: "hsl(217.9 10.6% 64.9%)"
  border-light: "hsl(224 12% 82%)"
  border-dark: "hsl(215 27.9% 16.9%)"
  destructive: "hsl(0 84.2% 60.2%)"
  destructive-dark: "hsl(0 62.8% 30.6%)"
  landing-void: "#060912"
typography:
  display:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(4rem, 12vw, 8rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0.025em"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  container: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.deep-work-violet}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "2.25rem"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "hsl(262.1 83.3% 52%)"
    textColor: "{colors.primary-foreground}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "2.25rem"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
    height: "2rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.md}"
    padding: "0.25rem 0.75rem"
    height: "2.25rem"
  card:
    backgroundColor: "{colors.surface-card-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.xl}"
    padding: "1.25rem"
  badge-active:
    backgroundColor: "{colors.deep-work-violet}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0.125rem 0.625rem"
---

# Design System: Çetele

## Overview

**Creative North Star: "Deep Work Console"**

Çetele is a personal work console: friendly tool chrome with soft corners, clear hierarchy, and almost no ceremony. The app shell stays quiet and scannable so starting or stopping a session feels notebook-easy. The landing can be cinematic—deep void, soft orbs, large type—but once inside, expression steps back and the timer, stats, and log take the stage.

The system is direct and approachable: a simple dashboard, not a corporate one. Color is intentional and balanced—Deep Work Violet as the single accent voice, neutrals carrying most of the surface. Motion is soft (blur/fade, ease `[0.22, 1, 0.36, 1]`), used for entrances and live-timer feedback, not decoration.

**Key Characteristics:**
- One geometric sans (Outfit) for brand, UI, and display
- Hybrid depth: calm flat/tonal app shell; landing may glow and blur
- Violet as the only primary accent; no color soup, no colorless blandness
- Soft radii (~10px base); cards slightly rounder
- Local-first tool density: sticky nav, stats row, filter + table—not feature theater

## Colors

A violet-led shadcn palette on cool neutrals: one accent voice, quiet surfaces, optional secondary hues only for export/sync affordances.

### Primary
- **Deep Work Violet** (`hsl(262.1 83.3% 57.8%)` light / `hsl(263.4 70% 50.4%)` dark): Primary buttons, focus rings, active badges, and brand accent. On the landing, related violet–fuchsia–blue gradients highlight the final headline word only.

### Secondary
- Soft slate-gray fills (`hsl(220 14.3% 95.9%)` light / `hsl(215 27.9% 16.9%)` dark): Secondary buttons, muted chips, and hover washes—supporting surfaces, never competing with violet.

### Neutral
- **Canvas** (`hsl(224 18% 92%)` / `hsl(224 20% 8%)`): App background. Light mode uses soft cool slate paper—not near-white glare—so accents and borders stay readable.
- **Ink** (`hsl(224 40% 12%)` / `hsl(210 20% 98%)`): Primary text.
- **Card surface** (`hsl(220 28% 97%)` / `hsl(224 71.4% 4.1%)`): Cards, sticky header—lifted a step above the canvas.
- **Muted ink** (`hsl(224 12% 38%)` / `hsl(217.9 10.6% 64.9%)`): Descriptions, labels, placeholders.
- **Border** (`hsl(224 12% 82%)` / `hsl(215 27.9% 16.9%)`): Dividers and field strokes with enough contrast to separate surfaces in light mode.
- **Landing void** (`#060912`): Persuade-only hero field; not the in-app canvas.

### Named Rules
**The One Accent Rule.** Deep Work Violet is the only primary brand accent. Optional blues/greens on Export/Sync are functional cues, not a second brand palette—keep them sparse.

**The Balanced Color Rule.** Avoid a colorless gray UI and avoid bright multi-hue soup. Neutrals carry the shell; violet (and rare functional hues) punctuate.

## Typography

**Display Font:** Outfit (ui-sans-serif, system-ui)
**Body Font:** Outfit (same family)
**Label/Mono Font:** Outfit for labels; system mono (`font-mono`) only for live elapsed clock digits

**Character:** One modern geometric sans—confident at display sizes, calm at UI sizes. No serif pairing; hierarchy comes from weight and scale, not font switching.

### Hierarchy
- **Display** (900, `clamp(4rem, 12vw, 8rem)`, line-height 0.9, tight tracking): Landing headline only.
- **Headline** (600, ~1.5rem on desktop / 1.25rem mobile, tight tracking): In-app page titles (e.g. Time Log).
- **Title** (600–700, ~1.25–1.875rem): Brand wordmark beside the logo.
- **Body** (400, 0.875rem–1rem): Descriptions, table cells, dialog copy.
- **Label** (500, 0.75rem, slight tracking, often uppercase): Stat card labels and small UI captions.

### Named Rules
**The Single Family Rule.** Outfit everywhere for brand and UI. Do not introduce a second display face.

## Layout

Operate surfaces use a centered console: `max-w-6xl` (`72rem`) content column, horizontal padding `1rem` mobile / `1.5rem` desktop, vertical rhythm of ~`1.5rem` between major blocks. Sticky top nav holds brand, timer controls, and settings. Below: title row + rate/export actions, three-up stats, day filter, then the work log table. Density is tool-like—scannable, not sparse marketing whitespace.

Landing is a full-viewport centered stack (logo + wordmark → massive headline → subcopy → feature chips → CTA), with soft radial vignette over the void.

Responsive: navbar collapses from a single `h-14` flex row into a two-row grid on small screens; stats stack; filters wrap.

## Elevation & Depth

**Hybrid.** In the app shell, depth is mostly tonal: bordered cards, sticky header with bottom border, light `shadow-sm` on cards and `shadow-xs` on outline controls. Landing may use large blurred color orbs, inner shadows on chips, and blur/fade motion freely.

### Shadow Vocabulary
- **Card rest** (`shadow-sm`): Default card lift—subtle structure, not drama.
- **Control rest** (`shadow-xs`): Outline buttons and inputs at rest.
- **Landing atmosphere**: Soft blurred orbs + radial vignette; not reused as in-app chrome.

### Named Rules
**The Hybrid Depth Rule.** App shell stays flat-first with light structural shadows. Glow, large blur, and atmospheric orbs belong on the landing (and similar persuade moments), not on every operate surface.

## Shapes

Gently curved tool chrome. Base radius is `0.625rem` (~10px); buttons and inputs use the medium step (`rounded-md`); cards use the extra-large step (`rounded-xl`, ~14px). Landing feature chips are fully pill-shaped (`rounded-full`) as a persuade-only silhouette—do not turn the operate UI into a pill farm.

Borders are hairline semantic borders (`border-border` / `border-input`), not heavy frames.

### Named Rules
**The Soft Console Rule.** Prefer medium soft corners for controls and slightly rounder cards. Reserve full pills for sparse marketing chips, not primary app controls.

## Components

Friendly tool chrome—clear, soft corners, no theater.

### Buttons
- **Shape:** Medium soft corners (`rounded-md` / ~8px from the scale)
- **Primary:** Deep Work Violet fill, light foreground text; hover at ~90% opacity
- **Destructive:** Used for Stop when a timer is running—red fill, clear halt signal
- **Outline / Ghost:** Secondary actions (manual entry, settings, export/sync shells); outline may use a faint primary ring for the manual-entry affordance
- **Focus:** 3px ring at `ring` / primary color, 50% opacity

### Chips
- **Landing feature chips:** Pill, translucent slate glass, emoji + label—persuade only
- **Active task badge:** Compact primary badge with pulse dot while the timer runs
- **Day filter:** Compact selectable chips/controls aligned with muted/selected tool patterns

### Cards / Containers
- **Corner Style:** Extra-round (`rounded-xl`)
- **Background:** Card token (white / deep slate)
- **Shadow Strategy:** Light structural `shadow-sm`
- **Border:** Semantic border
- **Internal Padding:** ~`1.25rem` on compact stats; default card padding scale elsewhere

### Inputs / Fields
- **Style:** Transparent (or slight dark fill) with input border, medium radius, height `2.25rem`
- **Focus:** Border shifts to ring color + 3px primary ring
- **Hourly rate control:** Segmented border group (currency | input | `/hr`)—compact tool pattern, not a heavy form

### Navigation
- Sticky header on card surface with bottom border; logo + wordmark left; timer cluster center; settings right. Mobile: brand/settings on row one, timer controls centered on row two.

### Signature: Timer Cluster
Start/Stop primary (or destructive Stop), optional active-task badge + mono elapsed clock, and outline manual-entry control. This cluster is the product’s heartbeat—keep it visible, compact, and never buried behind chrome.

## Do's and Don'ts

### Do:
- **Do** keep Deep Work Violet as the single primary accent and use it for primary actions, focus, and live-timer status.
- **Do** treat the landing as the cinematic doorway and the app shell as a calm console.
- **Do** favor Outfit-only type, soft medium radii, and light structural shadows in-app.
- **Do** keep optional sync/export visually secondary and functionally tinted at most.

### Don't:
- **Don't** build a corporate, dense analytics dashboard look—friendly simple dashboard density is the ceiling.
- **Don't** drain the UI to colorless gray blandness or splash multiple competing bright hues (color soup).
- **Don't** bring landing orbs, heavy gradients, or glow into everyday operate chrome.
- **Don't** invent a second brand typeface or replace violet without an explicit redesign.
