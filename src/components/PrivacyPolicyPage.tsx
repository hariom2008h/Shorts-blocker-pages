import { useEffect } from 'react';
import { motion } from 'motion/react';

interface PrivacyPolicyPageProps {
  onNavigateToHelp: () => void;
}

export function PrivacyPolicyPage({
  onNavigateToHelp,
}: PrivacyPolicyPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-light-1 text-brand-dark font-sans selection:bg-brand-blue selection:text-white flex flex-col">
      {/* Top Navigation Bar (Standalone - No Home Redirect) */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-brand-blue to-brand-dark shadow-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <div className="inline-flex items-center gap-2.5 text-white whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm border border-white/20">
              <img
                src="./logo.jpg"
                alt="Shorts Blocker"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-white tracking-tight">Shorts Blocker</span>
          </div>

          <span className="text-xs sm:text-sm font-medium text-white/80 whitespace-nowrap shrink-0">
            Privacy Policy
          </span>
        </div>
      </header>

      {/* Main Legal Document */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl border border-light-2 p-6 sm:p-10 md:p-12"
        >
          {/* Document Header */}
          <div className="border-b border-light-2 pb-8 mb-8">
            <p className="text-xs sm:text-sm font-medium text-brand-dark/55 mb-2">
              Legal &amp; Privacy Disclosure &middot; Effective Date: November 2026
            </p>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-dark tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-brand-dark/70 text-base leading-relaxed">
              Shorts Blocker is developed by Hari Om Bhadana (Esech) as an open-source digital wellbeing utility for Android. We designed Shorts Blocker so that your personal data, screen activity, and browsing habits never leave your device.
            </p>
          </div>

          {/* Policy Clauses */}
          <div className="space-y-8 text-sm sm:text-base text-brand-dark/80 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-display font-bold text-brand-dark">
                1. Zero Personal Data Collection
              </h2>
              <p>
                Shorts Blocker does <strong>not</strong> collect, store, transmit, rent, or sell any personally identifiable information (PII), watched video history, search queries, messages, contacts, or keystrokes. The Android application contains no third-party analytics SDKs, advertising networks, or remote telemetry trackers.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-light-2/60">
              <h2 className="text-lg sm:text-xl font-display font-bold text-brand-dark">
                2. Android AccessibilityService API Disclosure
              </h2>
              <p>
                Shorts Blocker requests permission to use the Android{' '}
                <code className="bg-light-1 px-1.5 py-0.5 rounded font-mono text-xs border border-light-2">
                  AccessibilityService
                </code>{' '}
                API exclusively to detect and intercept short-form video feeds at the user&apos;s request.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Scope of Inspection:</strong> The service checks active foreground package names and specific view resource identifiers corresponding to short-form video containers (YouTube Shorts, Instagram Reels, and Snapchat Spotlight).
                </li>
                <li>
                  <strong>Action Taken:</strong> When a targeted short-form video feed is identified, Shorts Blocker displays a local password interception overlay or triggers a back-navigation action according to your configured preferences.
                </li>
                <li>
                  <strong>Ephemeral In-Memory Processing:</strong> All UI inspection occurs in real time within volatile memory (RAM). No screen text, personal content, or view hierarchies are ever written to storage or transmitted over a network.
                </li>
              </ul>
            </section>

            <section className="space-y-2 pt-4 border-t border-light-2/60">
              <h2 className="text-lg sm:text-xl font-display font-bold text-brand-dark">
                3. Local Preferences &amp; Password Storage
              </h2>
              <p>
                Your application preferences—including targeted apps, Strict Mode toggles, Stealth Mode visibility, and your custom interception password—are stored solely inside your device&apos;s private Android application sandbox (
                <code className="bg-light-1 px-1.5 py-0.5 rounded font-mono text-xs border border-light-2">
                  SharedPreferences
                </code>
                ). Clearing the app&apos;s storage or uninstalling Shorts Blocker permanently deletes all locally stored configuration data.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-light-2/60">
              <h2 className="text-lg sm:text-xl font-display font-bold text-brand-dark">
                4. Website &amp; GitHub Release Downloads
              </h2>
              <p>
                When you visit our web portal to download the APK, your browser requests release metadata directly from the public GitHub Releases API (
                <code className="bg-light-1 px-1.5 py-0.5 rounded font-mono text-xs border border-light-2">
                  api.github.com/repos/hariom2008h/Block-scroll/releases
                </code>
                ). Our web pages do not use tracking cookies, behavioral analytics, or advertising pixels.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-light-2/60">
              <h2 className="text-lg sm:text-xl font-display font-bold text-brand-dark">
                5. Open-Source Verification &amp; Contact
              </h2>
              <p>
                Shorts Blocker is open source, allowing anyone to inspect our implementation and verify our privacy commitments directly. If you have questions regarding this Privacy Policy or our use of Android permissions, please open an issue on our{' '}
                <a
                  href="https://github.com/hariom2008h/Block-scroll/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue font-semibold hover:underline"
                >
                  GitHub Repository Issues
                </a>{' '}
                page.
              </p>
            </section>
          </div>
        </motion.article>
      </main>

      {/* Quiet Standalone Footer */}
      <footer className="w-full bg-gradient-to-r from-brand-blue to-brand-dark text-white py-8 px-4 sm:px-6 border-t border-white/10 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-white/65">
          <span>&copy; {new Date().getFullYear()} Esech &middot; Hari Om Bhadana. All rights reserved.</span>
          <div className="flex items-center gap-5 text-white/80">
            <button
              onClick={onNavigateToHelp}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Help Center
            </button>
            <span aria-hidden="true">&middot;</span>
            <a
              href="https://github.com/hariom2008h/Block-scroll/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Report Issue
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
