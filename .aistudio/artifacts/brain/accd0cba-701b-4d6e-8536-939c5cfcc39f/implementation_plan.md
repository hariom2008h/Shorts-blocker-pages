# Shorts Blocker — Unified Help Center & Privacy Policy Page

A dedicated, shareable **Help & Privacy Policy** view integrated seamlessly into the Shorts Blocker web application, providing clear technical troubleshooting guides, setup instructions, and transparent zero-data-collection privacy disclosures.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and design choices have been confirmed from your selections and are incorporated into this plan:

- **Confirmed Decision 1 (Page Structure)**: A **Single Combined Help & Privacy Policy Page** accessible from both the navigation header and footer, with deep-link support (`#help` and `#privacy`) and a quick-switch segmented control at the top of the page so users or Play Store/GitHub reviewers can jump directly to either section.
- **Confirmed Decision 2 (Help & Troubleshooting Scope)**: Full coverage of all four essential guides:
  1. Step-by-step Android Accessibility Service setup guide
  2. Battery optimization & OEM background service troubleshooting (Xiaomi/MIUI, Samsung OneUI, Oppo/Vivo/Realme)
  3. Master Password & Stealth Mode launcher recovery instructions
  4. Direct bug report and support links
- **Confirmed Decision 3 (Support & Contact Channel)**: Strictly **GitHub Issues & Repository Discussions only** (`github.com/hariom2008h/Block-scroll/issues`), keeping personal email addresses private.

---

## 1. Overview & Core Concept

- **What It Does**: Provides an interactive, easy-to-navigate Legal & Support hub within the Shorts Blocker website where users can learn how to configure Android Accessibility permissions, prevent background service termination, recover access when Stealth Mode is active, and verify how their privacy is protected.
- **Target Audience / Persona**:
  - **Android Users**: People installing the Shorts Blocker APK who need clear instructions on granting Accessibility permissions, bypassing "Restricted Settings" on Android 13+, or keeping the blocker alive in the background.
  - **Privacy-Conscious Users & Reviewers**: Users verifying why Accessibility Service is needed and confirming that zero personal data or screen history ever leaves their device.
- **Key Value**: Eliminates setup confusion on Android 13/14+ and builds strong user trust through transparent, plain-language privacy commitments.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Entry Points**: Users click **"Help & Privacy"** (or individual **"Help Guide"** / **"Privacy Policy"** links in the header and footer, or the "Still need help?" card in the FAQ section).
  2. **Unified Hub with Section Switcher**: Opening the page scrolls smoothly to the top and displays a clean header bar with a **"Back to Home"** action and an interactive section tab bar (`Help & Setup Guide` | `Privacy Policy`) so users can either read the entire page or jump straight to the section they need.
  3. **Direct Hash Linking**: Sharing a URL ending in `#privacy` or `#help` automatically opens the combined page and scrolls/focuses the requested section.
  4. **Interactive Troubleshooting**: Users can switch between Android device brands (Stock Android/Pixel, Samsung, Xiaomi/POCO, Vivo/Oppo/Realme) in the Battery Optimization section to see exact step-by-step instructions for their phone.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Minimalist, high-trust editorial utility matching the existing Shorts Blocker landing page.
  - *Color Palette & Mood*:
    - Dominant Canvas (60%): Crisp cool off-white (`--color-light-1: #F8F8FC`) and pure white content surfaces (`#FFFFFF`).
    - Structural Surfaces (30%): Deep slate typography (`--color-brand-dark: #262A32`) with soft slate hairline borders (`--color-light-2: #CBD8E4`).
    - Accent Budget (10%): Brand Blue gradient (`--color-brand-blue: #035A9B` to `--color-brand-dark: #262A32`) for active section tabs, step indicators, and primary GitHub support CTAs.
  - *Typography & Hierarchy*:
    - Display Headings: `Plus Jakarta Sans` (`font-display`, bold/extrabold, tight tracking, `text-wrap: balance`).
    - Body Prose & Documentation: Clean, high-legibility body copy (`15px–16px`, relaxed line height) with unboxed metadata separators (`·`) for effective dates and reading times.
  - *Component Styling & Layout*:
    - 1440px desktop baseline with a focused `max-w-5xl` container, 12-column responsive layout with a sticky left table-of-contents sidebar on desktop and a clean stacked layout on mobile.
    - Single-level card elevation with hairline borders (`border-light-2`) and generous whitespace (`p-8` to `p-10`) rather than nested boxes.

- **Interactive Feedback & Motion**:
  - Smooth view transitions using `motion/react` (`opacity` and `transform` settling under 200ms).
  - Interactive OEM manufacturer selector tabs in the Battery Optimization guide.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Hash-Synchronized Single Combined View vs. Separate Multi-Page Bundle**
  - *Chosen Approach*: A unified client-side view synchronized with `window.location.hash` (`#help`, `#privacy`, `#legal`).
  - *Why*: Works out-of-the-box on GitHub Pages without 404 routing issues on page refresh, while still allowing you to paste a direct `#privacy` link into your Android app or GitHub README.
  - *Alternatives Considered*: Separate HTML files or history-API routes, which often fail with 404s on static GitHub Pages hosting unless custom redirect hacks are maintained.

- **Decision 2: Explicit Android 13+ "Restricted Settings" Walkthrough**
  - *Chosen Approach*: Include a dedicated step inside the Accessibility Setup guide explaining how to click "Allow restricted settings" in App Info on Android 13/14/15 when sideloading an APK.
  - *Why*: Sideloaded APKs that use Accessibility Services are blocked by default on modern Android until the user enables Restricted Settings in App Info; documenting this prevents 90% of user installation issues.

- **Decision 3: Strict Local-Only Privacy Commitments**
  - *Chosen Approach*: Explicitly document how `AccessibilityService` is used solely to detect short-form video UI node IDs (YouTube Shorts, Instagram Reels, Snapchat Spotlight) in real time on-device, with zero internet permission required for core blocking and zero analytics/telemetry servers.
  - *Why*: Addresses the #1 concern Android users have when granting Accessibility permissions.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        Shorts Blocker Web App                           │
│                  (Hash & View State: 'home' | 'legal')                  │
└───────────────────┬─────────────────────────────────┬───────────────────┘
                    │                                 │
         [View = 'home']                   [View = 'legal' (#help / #privacy)]
                    ▼                                 ▼
┌───────────────────────────────────┐   ┌─────────────────────────────────┐
│         Landing Page View         │   │   Unified Help & Privacy View   │
├───────────────────────────────────┤   ├─────────────────────────────────┤
│ • Sticky Header (with Help/Legal) │   │ • Top Navigation & Back to Home │
│ • Hero & APK Download CTA         │   │ • Section Jump Tabs             │
│ • Why Shorts Blocker Features     │   │   ├─ 1. Help & Setup Center     │
│ • Latest Release Notes            │   │   │  ├─ Accessibility Guide     │
│ • App Screenshots Carousel        │   │   │  ├─ Android 13+ Restricted  │
│ • FAQ + "Open Help Center" CTA    │   │   │  ├─ OEM Battery Optimizer   │
│ • Version History (Show More)     │   │   │  └─ Password & Stealth Mode │
│ • Footer (Help & Privacy Links)   │   │   ├─ 2. Privacy Policy          │
└───────────────────────────────────┘   │   │  ├─ Zero Data Collection    │
                                        │   │  ├─ Accessibility Disclosure│
                                        │   │  ├─ Local Storage & Pin     │
                                        │   │  └─ Open-Source Transparency│
                                        │   └─ 3. GitHub Support Card     │
                                        │      └─ Issues & Discussions CTA│
                                        └─────────────────────────────────┘
```

### Interactive Component & State Mapping

- **Route & Scroll Controller**: Listens to `hashchange` events (`#help`, `#privacy`, `#troubleshooting`, `#permissions`) and header/footer button clicks. Updates active view state, scrolls smoothly to the requested section anchor, and provides a 1-click "Back to Home" button.
- **OEM Battery Troubleshooting Switcher**: Interactive tab state (`selectedOem: 'pixel' | 'Xiaomi' | 'samsung' | 'oppo'`) allowing users to view tailored background execution & autostart steps for their specific Android skin.
- **Expandable Recovery Walkthroughs**: Step-by-step interactive cards for recovering the launcher icon when **Stealth Mode** is enabled (via Android System Settings → Accessibility → Installed Apps → Shorts Blocker) and resetting/managing the Master Password.
- **GitHub Support Action**: Direct external links wired to `https://github.com/hariom2008h/Block-scroll/issues` for bug reports and feature requests.
