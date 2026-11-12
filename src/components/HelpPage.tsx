import { useState, useEffect } from 'react';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface HelpPageProps {
  showBackButton?: boolean;
  onNavigateToPrivacy: () => void;
}

type OemKey = 'pixel' | 'xiaomi' | 'samsung' | 'oppo';

const OEM_GUIDES: Record<
  OemKey,
  {
    label: string;
    subtitle: string;
    steps: { title: string; detail: string }[];
  }
> = {
  pixel: {
    label: 'Pixel & Stock',
    subtitle: 'Google Pixel, Motorola, Nothing OS, Asus, Nokia',
    steps: [
      {
        title: 'Set App Battery Usage to Unrestricted',
        detail:
          'Open Settings → Apps → See all apps → Shorts Blocker → App battery usage, and select "Unrestricted" so Android does not suspend the service while idle.',
      },
      {
        title: 'Check Adaptive Battery Preferences',
        detail:
          'Go to Settings → Battery → Adaptive Preferences and ensure Shorts Blocker is not restricted during extended background sessions.',
      },
      {
        title: 'Verify Accessibility Service Toggle',
        detail:
          'Go to Settings → Accessibility → Shorts Blocker and confirm "Use Shorts Blocker" remains enabled.',
      },
    ],
  },
  xiaomi: {
    label: 'Xiaomi / POCO',
    subtitle: 'Xiaomi, Redmi, and POCO devices running MIUI or HyperOS',
    steps: [
      {
        title: 'Enable Background Autostart',
        detail:
          'Open Settings → Apps → Manage apps → Shorts Blocker, and enable "Autostart" (or Background Autostart in HyperOS).',
      },
      {
        title: 'Remove MIUI Battery Saver Restrictions',
        detail:
          'On the Shorts Blocker App Info screen, tap "Battery saver" and select "No restrictions".',
      },
      {
        title: 'Lock App in Recent Apps Overview',
        detail:
          'Open the Recent Apps switcher, long-press the Shorts Blocker card (before enabling Stealth Mode), and tap the Lock icon so system memory cleanup does not terminate the service.',
      },
    ],
  },
  samsung: {
    label: 'Samsung',
    subtitle: 'Samsung Galaxy devices running One UI 5, 6, or 7',
    steps: [
      {
        title: 'Set Battery Policy to Unrestricted',
        detail:
          'Navigate to Settings → Apps → Shorts Blocker → Battery, and select "Unrestricted" instead of Optimized.',
      },
      {
        title: 'Add to Never Auto-Sleeping Apps',
        detail:
          'Open Settings → Battery and device care → Battery → Background usage limits → Never auto sleeping apps → tap (+) and add Shorts Blocker.',
      },
      {
        title: 'Confirm Installed App Accessibility Permission',
        detail:
          'Go to Settings → Accessibility → Installed apps → Shorts Blocker and verify the service switch is turned ON.',
      },
    ],
  },
  oppo: {
    label: 'Vivo / Oppo / Realme',
    subtitle: 'OnePlus, Oppo, Realme, and Vivo devices (OxygenOS, ColorOS, FuntouchOS)',
    steps: [
      {
        title: 'Allow Background Activity & Auto-Launch',
        detail:
          'Go to Settings → Apps → App Management → Shorts Blocker → Battery usage, and enable both "Allow background activity" and "Allow auto-launch".',
      },
      {
        title: 'Disable Battery Optimization',
        detail:
          'Open Settings → Battery → More settings → Optimize battery use → select Shorts Blocker and choose "Don\'t optimize".',
      },
      {
        title: 'Re-verify Accessibility After System Updates',
        detail:
          'After an OTA system update, open Settings → Additional settings → Accessibility → Shorts Blocker and toggle the service off and back on if interception pauses.',
      },
    ],
  },
};

const SETUP_STEPS = [
  {
    number: '01',
    title: 'Open Accessibility Settings from Shorts Blocker',
    description:
      'Open Shorts Blocker and follow the prompt to open your device\'s Accessibility Settings, then locate "Shorts Blocker" under Installed Apps or Downloaded Services.',
  },
  {
    number: '02',
    title: 'Acknowledge the "Restricted Setting" Dialog (Android 13+)',
    description:
      'On Android 13, 14, and 15, tapping a sideloaded Accessibility service shows a security notice ("Restricted setting"). Tap OK to dismiss the dialog—this unlocks the permission option inside App Info.',
  },
  {
    number: '03',
    title: 'Allow Restricted Settings in App Info',
    description:
      'Open Android Settings → Apps → Shorts Blocker. Tap the three-dot menu (⋮) in the top-right corner, select "Allow restricted settings", and authenticate with your device PIN or fingerprint.',
  },
  {
    number: '04',
    title: 'Enable Shorts Blocker Service',
    description:
      'Return to Settings → Accessibility → Installed apps → Shorts Blocker and toggle ON "Use Shorts Blocker". Interception for YouTube Shorts, Instagram Reels, and Snapchat Spotlight is now active.',
  },
];

export function HelpPage({ showBackButton = false, onNavigateToPrivacy }: HelpPageProps) {
  const [selectedOem, setSelectedOem] = useState<OemKey>('pixel');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-light-1 text-brand-dark font-sans selection:bg-brand-blue selection:text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-brand-blue to-brand-dark shadow-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <div className="inline-flex items-center gap-3 text-white whitespace-nowrap shrink-0">
            {showBackButton && (
              <button
                type="button"
                onClick={() => window.history.back()}
                aria-label="Go back"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/85 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
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
            Help Center
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          {/* Page Title Header */}
          <div className="border-b border-light-2 pb-8">
            <p className="text-xs sm:text-sm font-medium text-brand-dark/55 mb-2">
              Documentation &amp; Support &middot; Android 13, 14 &amp; 15
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-brand-dark tracking-tight mb-4">
              Help Center
            </h1>
            <p className="text-brand-dark/70 text-base sm:text-lg leading-relaxed">
              Complete setup instructions for enabling Android Accessibility permissions, keeping background interception reliable across device manufacturers, and managing Stealth Mode or password recovery.
            </p>
          </div>

          {/* Section 1: Accessibility Setup */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-dark tracking-tight">
                1. Accessibility Service Setup
              </h2>
              <p className="text-sm sm:text-base text-brand-dark/65 mt-1">
                Required on first install so Shorts Blocker can detect and intercept short-form video feeds.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-light-2 divide-y divide-light-2/70">
              {SETUP_STEPS.map((step) => (
                <div key={step.number} className="p-5 sm:p-6 flex gap-4 sm:gap-5 items-start">
                  <span className="text-xs font-mono font-bold text-brand-blue pt-1 shrink-0 tabular-nums">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-display font-bold text-brand-dark mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-brand-dark/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Battery Optimization & Background Reliability */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-dark tracking-tight">
                2. Battery Optimization &amp; Background Reliability
              </h2>
              <p className="text-sm sm:text-base text-brand-dark/65 mt-1">
                If interception stops after a few hours, your device manufacturer&apos;s battery manager is suspending the Accessibility service. Select your phone brand below:
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-light-2 overflow-hidden">
              {/* Brand Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1.5 bg-light-1 border-b border-light-2">
                {(Object.keys(OEM_GUIDES) as OemKey[]).map((key) => {
                  const active = selectedOem === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedOem(key)}
                      className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap truncate cursor-pointer ${
                        active
                          ? 'bg-white text-brand-dark shadow-xs border border-light-2/80'
                          : 'text-brand-dark/60 hover:text-brand-dark'
                      }`}
                    >
                      {OEM_GUIDES[key].label}
                    </button>
                  );
                })}
              </div>

              {/* Steps for Selected Brand */}
              <div className="p-5 sm:p-6">
                <p className="text-xs font-medium text-brand-dark/55 mb-4">
                  Applies to: {OEM_GUIDES[selectedOem].subtitle}
                </p>
                <div className="divide-y divide-light-2/70">
                  {OEM_GUIDES[selectedOem].steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start"
                    >
                      <span className="text-xs font-mono font-bold text-brand-blue pt-1 shrink-0 tabular-nums">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-display font-bold text-brand-dark mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm sm:text-base text-brand-dark/70 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Stealth Mode & Password Recovery */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-dark tracking-tight">
                3. Stealth Mode &amp; Password Recovery
              </h2>
              <p className="text-sm sm:text-base text-brand-dark/65 mt-1">
                How to access Shorts Blocker when hidden from your launcher or reset a forgotten password.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-light-2 divide-y divide-light-2/70">
              <div className="p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-display font-bold text-brand-dark mb-2">
                  Opening Shorts Blocker While Stealth Mode is Active
                </h3>
                <p className="text-sm sm:text-base text-brand-dark/70 leading-relaxed mb-3">
                  When Stealth Mode is enabled, Shorts Blocker hides its icon from your home screen and app drawer so it feels like a built-in system feature. To open its settings:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-sm sm:text-base text-brand-dark/75">
                  <li>Open your device&apos;s main <strong>Android Settings</strong> app.</li>
                  <li>Go to <strong>Accessibility</strong> → <strong>Installed apps</strong> (or Downloaded Services).</li>
                  <li>Select <strong>Shorts Blocker</strong> and tap <strong>Settings</strong> to open the app interface.</li>
                </ol>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-display font-bold text-brand-dark mb-2">
                  Resetting a Forgotten Master Password
                </h3>
                <p className="text-sm sm:text-base text-brand-dark/70 leading-relaxed mb-3">
                  Shorts Blocker stores your password strictly offline on your device and never syncs it to any server. If you forget your password:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-sm sm:text-base text-brand-dark/75">
                  <li>Open <strong>Android Settings → Apps → See all apps → Shorts Blocker</strong>.</li>
                  <li>Tap <strong>Storage &amp; cache</strong> and select <strong>Clear storage</strong> (Clear data).</li>
                  <li>Re-open Shorts Blocker to set a new password and verify your Accessibility permission.</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 4: GitHub Support */}
          <section className="pt-2">
            <div className="bg-white rounded-2xl border border-light-2 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-brand-dark mb-1">
                  Still need technical assistance?
                </h2>
                <p className="text-sm sm:text-base text-brand-dark/65">
                  Report bugs, request device compatibility improvements, or browse open discussions on GitHub.
                </p>
              </div>
              <a
                href="https://github.com/hariom2008h/Block-scroll/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-brand-dark text-white px-5 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
              >
                <Github className="w-4 h-4" />
                <span>Open GitHub Issues</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>
            </div>
          </section>
        </motion.div>
      </main>

      {/* Quiet Standalone Footer */}
      <footer className="w-full bg-gradient-to-r from-brand-blue to-brand-dark text-white py-8 px-4 sm:px-6 border-t border-white/10 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-white/65">
          <span>&copy; {new Date().getFullYear()} Esech &middot; Hari Om Bhadana. All rights reserved.</span>
          <div className="flex items-center gap-5 text-white/80">
            <button
              onClick={onNavigateToPrivacy}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Privacy Policy
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
