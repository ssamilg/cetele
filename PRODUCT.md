# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are the maker and a small inner circle: people who bill or think in hourly rates, or who simply want to log working time without ceremony. They open the app to start or stop a session quickly, then review what they did—often alone, on a personal machine, mid-work.

## Product Purpose

Çetele is a frictionless personal time tracker for deep work and hourly logging. Success means starting or stopping a session feels almost as easy as jotting in a notebook—no mandatory account, no heavy form just to track something—and that logged time (and optional earnings) stays trustworthy and reviewable.

## Positioning

Simple and direct: a no-friction tracker that stays out of the way. The differentiator is how little you fill out to log time, paired with a local-first default so tracking works without signing up or depending on the cloud.

## Operating Context

Used as a browser app during solo work sessions. Typical loop: start timer with a short task title, work, stop; optionally backfill with a manual entry; glance at daily stats; filter or edit the work log; optionally export CSV or sync to Google Sheets. Settings cover currency, language (English / Turkish), theme, and hourly rate.

## Capabilities and Constraints

Confirmed today:
- One-click-style start/stop timer and manual time entries
- Work log with edit/delete, day filter, and daily stats (hours, tasks, earned)
- Hourly rate and currency for session earnings
- Local-first storage in the browser by default; no required account
- Optional Google Sheets sync and CSV export
- i18n (EN/TR) and light/dark appearance

Constraints and undecided facts:
- Cloud and export remain optional; they must not become required for core tracking
- Team/multi-user product scope is not in play
- A future Electron desktop app is under consideration; not committed yet—design should not hard-lock the product to “browser-only forever,” but platform today is web

## Brand Commitments

- Product name: **Çetele**
- Voice: simple, direct, low-ceremony; copy should not invent enterprise or “productivity suite” positioning
- Public assets: logo and favicon under `public/` (including `public/logo.webp`)
- Live demo: https://ssg-cetele.netlify.app/

## Evidence on Hand

- Runnable product and README positioning (“Frictionless time tracking, built for deep work”)
- Landing and app copy in `src/locales/en.json` and `src/locales/tr.json`
- Logo/brand imagery in `public/`
- No fabricated testimonials, customer counts, or third-party case studies—do not invent them

## Product Principles

1. **Notebook-easy tracking** — Starting or logging time must stay nearly as light as writing a line in a notebook; never force a full form for the default path.
2. **Local-first by default** — Core value works offline in the browser; cloud and export are opt-in backups, not the product center.
3. **Solo and personal** — Optimize for one person managing their own hours, not teams, orgs, or shared workspaces.
4. **Honest optional extras** — Sheets sync, CSV export, and earnings stay useful when wanted and invisible when not.
5. **Stay simple** — Prefer direct flows and plain language over feature density or dashboard theater.

## Accessibility & Inclusion

No product-specific accessibility standard was locked. Preserve bilingual EN/TR support; treat broader a11y as best-practice for web UI rather than a confirmed compliance bar.
