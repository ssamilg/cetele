<div align="center">
  <img src="public/logo.webp" alt="Çetele Logo" width="120" />

  # Çetele

  **Frictionless time tracking, built for deep work.**
</div>

## 📌 Overview

Çetele is a modern, minimalist time-tracking application designed to eliminate friction from logging work hours. Built with a local-first philosophy, it allows users to start tracking immediately without creating an account, while offering seamless, opt-in synchronization with Google Sheets for robust data backup and analysis.

**Live Demo:** [https://ssg-cetele.netlify.app/](https://ssg-cetele.netlify.app/)
> **Note:** This project was created by me, with coding assistance from Cursor IDE. [Learn more about this approach](#-development-assistance).

## ✨ Features

- **Frictionless Tracking:** One-click start/stop timer for immediate deep work.
- **Manual Logging:** Easily backfill completed tasks with custom time ranges.
- **Financial Tracking:** Set hourly rates to automatically calculate session earnings.
- **Google Sheets Sync (Opt-in):** Connect your Google account to automatically push logs to a private spreadsheet.
- **Local-First Architecture:** All data is stored locally in the browser by default. No mandatory accounts.
- **Daily Analytics:** Quick dashboard for hours tracked, tasks completed, and total earned today.
- **Internationalization:** Full i18n support (English & Turkish).
- **Theming:** Clean Dark and Light modes.

## 🛠 Tech Stack

- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Authentication & Sync:** Google Identity Services (OAuth 2.0) & Google Sheets API v4
- **Deployment:** [Netlify](https://www.netlify.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- A Google Cloud Project with the **Google Sheets API** enabled.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ssamilg/cetele.git
   cd cetele


2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
    Create a `.env.local` file in the root directory and add your Google Client ID:
    ```bash
    VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
    ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🤖 Development Assistance

This project was developed by me, utilizing a hybrid AI workflow combining **Bolt.new**, **Gemini** and **Cursor IDE** (running Claude-4.6-Sonnet).

I created the application logic, made all architectural decisions and directed the implementation process while using Cursor as a coding tool to execute my specific directives.

As part of exploring AI-assisted development, I used this workflow to:
*   Generate boilerplate code based on my specific instructions.
*   Create documentation following my outlined structure.
*   **Asset Generation:** The project logo and favicon were created using the **Nano Banana 2** (Gemini 3 Flash Image) model.

I believe in transparent disclosure about AI tool usage in development. I maintained complete control over the application design, logic, and feature decisions, with these tools serving purely as assistants rather than autonomous agents.