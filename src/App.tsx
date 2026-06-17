import { useEffect, useState } from 'react';
import { Download, Shield, Smartphone, ArrowDownToLine, CheckCircle2, Clock, Share2, ChevronDown, ChevronUp, EyeOff, Ban } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface Asset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface Release {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  assets: Asset[];
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function ReleaseNotes({ body, noBox = false }: { body: string; noBox?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  
  const isLong = body.length > 300 || body.split('\n').length > 5;

  return (
    <div className="text-brand-dark transition-colors">
      <motion.div 
        layout
        className={`markdown-body flex flex-col gap-2 font-sans text-[15px] leading-relaxed opacity-90 ${!expanded && isLong ? 'max-h-32 overflow-hidden relative' : ''}`}
      >
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-md font-bold mt-3 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="mb-2" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
            li: ({node, ...props}) => <li className="" {...props} />,
            a: ({node, ...props}) => <a className="text-brand-blue hover:underline" {...props} />,
            code: ({node, ...props}) => <code className="bg-light-2/50 px-1.5 py-0.5 rounded font-mono text-sm" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
          }}
        >
          {body || 'No release notes provided.'}
        </ReactMarkdown>
        
        {!expanded && isLong && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </motion.div>
      
      {isLong && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center justify-start gap-1 font-semibold text-brand-blue hover:underline transition-colors w-full py-1"
        >
          {expanded ? (
            <>Read Less <ChevronUp className="w-5 h-5" /></>
          ) : (
            <>Read More <ChevronDown className="w-5 h-5" /></>
          )}
        </button>
      )}
    </div>
  );
}

function FAQItem({ question, answer, delay }: { question: string, answer: string, delay: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay }}
      className="bg-white border border-light-2 rounded-2xl overflow-hidden shadow-sm"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none focus-visible:bg-light-1/50 transition-colors hover:bg-light-1/50"
      >
        <span className="font-semibold text-lg text-brand-dark pr-4">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-brand-dark/50 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 pt-1 text-brand-dark/70 font-medium leading-relaxed border-t border-light-2/30 mt-2 mx-6">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function App() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReleases() {
      try {
        const response = await fetch('https://api.github.com/repos/hariom2008h/Block-scroll/releases');
        if (!response.ok) {
          throw new Error('Failed to fetch releases');
        }
        const data = await response.json();
        setReleases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();
  }, []);

  const latestRelease = releases.length > 0 ? releases[0] : null;
  const latestApk = latestRelease?.assets.find(a => a.name.endsWith('.apk'));
  const latestApkSizeMB = latestApk ? (latestApk.size / (1024 * 1024)).toFixed(1) : null;

  const handleShare = async () => {
    const shareData = {
      title: 'Shorts Blocker',
      text: 'Reclaim Your Time & Focus with Shorts Blocker',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-light-1 text-brand-dark font-sans selection:bg-brand-blue selection:text-white pb-12">
      {/* Hero Section */}
      <section className="relative px-6 py-20 min-h-[100dvh] flex flex-col items-center justify-center text-center overflow-hidden w-full">
        {/* Subtle, soft radial background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-gradient-to-b from-brand-blue/5 via-transparent to-transparent opacity-100 pointer-events-none -z-10 blur-3xl mix-blend-multiply" />
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="flex flex-col items-center"
        >
          {/* App Logo */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#1A1A1A] rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 relative z-10 ring-4 ring-white border border-light-2/50">
            <Ban className="w-12 h-12 sm:w-16 sm:h-16 text-[#FF5A5F]" strokeWidth={2.5} />
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-light-2 text-sm font-bold text-brand-dark mb-8 shadow-sm">
            <span>Shorts Blocker for Android</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-brand-dark max-w-4xl mb-6 leading-tight">
            Reclaim Your Time & <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-brand-blue to-brand-dark bg-clip-text text-transparent">Focus</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-brand-dark/70 max-w-3xl mb-12 leading-relaxed font-medium">
            A powerful, distraction-free Android utility to regain control over your attention by elegantly stopping addictive short-form video feeds.
          </p>

          {loading ? (
            <div className="h-16 w-80 bg-light-2 animate-pulse rounded-full" />
          ) : latestApk ? (
            <a
              href={latestApk.browser_download_url}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-blue to-brand-dark text-white px-8 py-5 rounded-full text-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Download className="w-6 h-6" />
              Download Latest APK
            </a>
          ) : (
            <div className="text-brand-dark/60 font-medium px-8 py-4 bg-light-2 border border-light-2/50 rounded-full inline-flex items-center gap-2">
              Releases temporarily unavailable
            </div>
          )}
        </motion.div>
      </section>

      {/* Application Features Section */}
      <section className="py-24 bg-white border-t border-light-2/50 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-display font-bold text-brand-dark tracking-tight mb-4">Why Shorts Blocker?</h2>
            <p className="text-brand-dark/60 text-lg font-medium max-w-2xl mx-auto">
              Other blockers lock you out completely. We take a different, more effective approach.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-light-1 p-8 rounded-3xl border border-light-2 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 border border-light-2 shadow-sm">
                <Shield className="w-7 h-7 text-brand-blue" />
              </div>
              <h3 className="font-bold text-xl mb-3 font-display text-brand-dark">Smart Interception</h3>
              <p className="text-brand-dark/70 leading-relaxed font-medium">
                Instead of locking the entire app and making it useless, we intercept you <i>while</i> you scroll. A password prompt breaks the dopamine loop exactly when you need it.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-light-1 p-8 rounded-3xl border border-light-2 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 border border-light-2 shadow-sm">
                <CheckCircle2 className="w-7 h-7 text-brand-blue" />
              </div>
              <h3 className="font-bold text-xl mb-3 font-display text-brand-dark">Keep Useful Content</h3>
              <p className="text-brand-dark/70 leading-relaxed font-medium">
                Want to watch news or educational videos? You still can. Our selective blocking means you never lose access to the productive side of your favorite apps.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-light-1 p-8 rounded-3xl border border-light-2 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 border border-light-2 shadow-sm">
                <Smartphone className="w-7 h-7 text-brand-blue" />
              </div>
              <h3 className="font-bold text-xl mb-3 font-display text-brand-dark">Strict App Targeting</h3>
              <p className="text-brand-dark/70 leading-relaxed font-medium">
                For those highly addictive apps where you simply can't resist, use App Targeting to activate Strict Mode and block short form feeds completely without exceptions.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-light-1 p-8 rounded-3xl border border-light-2 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 border border-light-2 shadow-sm">
                <EyeOff className="w-7 h-7 text-brand-blue" />
              </div>
              <h3 className="font-bold text-xl mb-3 font-display text-brand-dark">Stealth Mode</h3>
              <p className="text-brand-dark/70 leading-relaxed font-medium">
                Hide the app from your home screen and drawer. Accessible only via Accessibility settings, making it feel like a native, built-in feature rather than a third-party app.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-24 bg-light-3/50 border-t border-light-2/50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-display font-bold text-brand-dark tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-brand-dark/60 text-lg font-medium">Common questions about functionality, privacy, and accessibility.</p>
          </motion.div>

          <div className="space-y-4">
            <FAQItem 
              question="Why does Shorts Blocker need Accessibility permissions?"
              answer="Shorts Blocker uses Android's Accessibility Services to detect when you are scrolling through short-form video feeds (like YouTube Shorts or Instagram Reels). This permission is required to analyze the screen content and intercept the scroll event with our custom overlay."
              delay={0.1}
            />
            <FAQItem 
              question="Does the app collect or track my personal data?"
              answer="Absolutely not. Privacy is our core principle. The Accessibility service only monitors for specific UI elements related to short-form video scroll feeds. All processing happens locally on your device, and we do not collect, store, or transmit any of your personal data or browsing history."
              delay={0.2}
            />
            <FAQItem 
              question="Can I easily bypass the block?"
              answer="Shorts Blocker is built with 'friction-by-design'. When you try to access a blocked feed, you must enter a complex master password. The goal isn't to lock your phone down completely, but to introduce enough friction to break the subconscious dopamine loop."
              delay={0.3}
            />
            <FAQItem 
              question="Will it block regular YouTube videos?"
              answer="No! Our smart interception technology only targets the 'Shorts' UI. You can still watch proper, long-form educational or entertainment videos without any interruptions. The app distinguishes between short-form feeds and standard video players."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* About Latest Version Section */}
      {!loading && !error && latestRelease && (
        <section className="py-20 bg-white border-y border-light-2/50">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-6"
          >
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-display font-bold text-brand-dark tracking-tight mb-2">About Latest Version</h2>
              <p className="text-brand-dark/60 text-lg font-medium">What's new in {latestRelease.name || latestRelease.tag_name}</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 md:items-start justify-between">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-2xl font-bold font-display text-brand-dark">{latestRelease.name || latestRelease.tag_name}</h3>
                  <span className="bg-brand-blue/10 border border-brand-blue/20 text-brand-blue px-2.5 py-1 rounded-lg text-sm font-mono font-semibold uppercase">
                    Latest Release
                  </span>
                  <span className="bg-white border border-light-2 text-brand-dark px-2.5 py-1 rounded-lg text-sm font-mono font-semibold">
                    {latestRelease.tag_name}
                  </span>
                </div>
                <p className="text-brand-dark/50 text-sm mb-6 font-medium flex items-center gap-2">
                  <span>Released on {new Date(latestRelease.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  {latestApk && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-brand-dark/30"></span>
                      <span>{formatBytes(latestApk.size)}</span>
                    </>
                  )}
                </p>
                
                <ReleaseNotes body={latestRelease.body} noBox={true} />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* App Screenshots Preview */}
      <section className="py-24 bg-white border-y border-light-2/50 relative overflow-hidden">
        <div className="max-w-[90rem] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center px-6"
          >
            <h2 className="text-4xl font-display font-bold text-brand-dark tracking-tight mb-4">Inside Shorts Blocker</h2>
            <p className="text-brand-dark/60 text-lg font-medium">A look at our powerful, distraction-free interface.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory px-6 md:px-12 justify-start md:justify-center" style={{ scrollbarWidth: 'none' }}
          >
            
            {/* Screenshot 1 */}
            <div className="snap-center shrink-0 w-[240px] md:w-[280px] relative rounded-[2.5rem] overflow-hidden border-[8px] border-light-2 shadow-2xl aspect-[9/19.5] bg-light-1 flex items-center justify-center group flex-col">
              {/* Fake Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-1/3 h-full bg-light-2 rounded-b-2xl"></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-brand-dark/40 z-0 mt-8">
                <Shield className="w-12 h-12 mb-3 opacity-50" />
                <span className="font-semibold mb-1 text-lg">Scroll Intercepted</span>
                <span className="text-[11px] bg-light-2/60 px-3 py-1.5 rounded-full mt-3 font-mono leading-tight">Drop image here as<br/>public/ui-1.png</span>
              </div>
              <img src="/ui-1.png" alt="Scroll Intercepted Screen" className="absolute inset-0 w-full h-full object-cover object-top z-10 transition-transform duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.opacity = '0')} />
            </div>

            {/* Screenshot 2 */}
            <div className="snap-center shrink-0 w-[240px] md:w-[280px] relative rounded-[2.5rem] overflow-hidden border-[8px] border-light-2 shadow-2xl aspect-[9/19.5] bg-light-1 flex items-center justify-center group flex-col">
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-1/3 h-full bg-light-2 rounded-b-2xl"></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-brand-dark/40 z-0 mt-8">
                <Smartphone className="w-12 h-12 mb-3 opacity-50" />
                <span className="font-semibold mb-1 text-lg">Security Settings</span>
                <span className="text-[11px] bg-light-2/60 px-3 py-1.5 rounded-full mt-3 font-mono leading-tight">Drop image here as<br/>public/ui-2.png</span>
              </div>
              <img src="/ui-2.png" alt="Security Settings" className="absolute inset-0 w-full h-full object-cover object-top z-10 transition-transform duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.opacity = '0')} />
            </div>

            {/* Screenshot 3 */}
            <div className="snap-center shrink-0 w-[240px] md:w-[280px] relative rounded-[2.5rem] overflow-hidden border-[8px] border-light-2 shadow-2xl aspect-[9/19.5] bg-light-1 flex items-center justify-center group flex-col">
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-1/3 h-full bg-light-2 rounded-b-2xl"></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-brand-dark/40 z-0 mt-8">
                <Clock className="w-12 h-12 mb-3 opacity-50" />
                <span className="font-semibold mb-1 text-lg">Target Apps</span>
                <span className="text-[11px] bg-light-2/60 px-3 py-1.5 rounded-full mt-3 font-mono leading-tight">Drop image here as<br/>public/ui-3.png</span>
              </div>
              <img src="/ui-3.png" alt="Target Apps Config" className="absolute inset-0 w-full h-full object-cover object-top z-10 transition-transform duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.opacity = '0')} />
            </div>
            
            {/* Screenshot 4 */}
            <div className="snap-center shrink-0 w-[240px] md:w-[280px] relative rounded-[2.5rem] overflow-hidden border-[8px] border-light-2 shadow-2xl aspect-[9/19.5] bg-light-1 flex items-center justify-center group flex-col">
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-1/3 h-full bg-light-2 rounded-b-2xl"></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-brand-dark/40 z-0 mt-8">
                <Smartphone className="w-12 h-12 mb-3 opacity-50" />
                <span className="font-semibold mb-1 text-lg">System & Theme</span>
                <span className="text-[11px] bg-light-2/60 px-3 py-1.5 rounded-full mt-3 font-mono leading-tight">Drop image here as<br/>public/ui-4.png</span>
              </div>
              <img src="/ui-4.png" alt="System Settings" className="absolute inset-0 w-full h-full object-cover object-top z-10 transition-transform duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.opacity = '0')} />
            </div>

          </motion.div>
        </div>
      </section>

      {/* Version History & Downloads Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mb-14 border-b border-light-2 pb-6"
          >
            <h2 className="text-4xl font-display font-bold text-brand-dark tracking-tight mb-4 text-center md:text-left">Version History & Downloads</h2>
            <p className="text-brand-dark/60 text-lg font-medium text-center md:text-left">Download any previous or current stable release of the application.</p>
          </motion.div>

          {loading && (
            <div className="flex justify-center my-24">
              <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center font-medium">
              Failed to load releases from GitHub: {error}
            </div>
          )}

          {!loading && !error && releases.length <= 1 && (
            <div className="text-center py-16 text-brand-dark/60 font-medium">
              No previous releases found for this repository.
            </div>
          )}

          {!loading && !error && releases.length > 1 && (
            <div className="space-y-6">
              {releases.slice(1).map((release, index) => {
                const apkAsset = release.assets.find(a => a.name.endsWith('.apk'));
                const isLatest = false;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.5, delay: Math.min(0.1 * index, 0.4) }}
                    key={release.id} 
                    className="bg-white rounded-3xl p-6 md:p-8 border border-light-2 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-light-2/80 group"
                  >
                    
                    {isLatest && (
                      <div className="absolute top-0 right-0 bg-brand-blue text-white text-[11px] font-bold px-4 py-1.5 rounded-bl-2xl tracking-wider uppercase">
                        Current Latest Release
                      </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 md:items-start justify-between">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-2xl font-bold font-display text-brand-dark">{release.name || release.tag_name}</h3>
                          <span className="bg-light-1 border border-light-2 text-brand-dark px-2.5 py-1 rounded-lg text-sm font-mono font-semibold">
                            {release.tag_name}
                          </span>
                        </div>
                        <p className="text-brand-dark/50 text-sm mb-6 font-medium flex items-center gap-2">
                          <span>Released on {new Date(release.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          {apkAsset && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-brand-dark/30"></span>
                              <span>{formatBytes(apkAsset.size)}</span>
                            </>
                          )}
                        </p>
                        
                        {/* Release Notes */}
                        <ReleaseNotes body={release.body} />
                      </div>
                      
                      <div className="shrink-0 flex items-center md:items-start md:pt-2 w-full md:w-auto">
                        {apkAsset ? (
                          <a
                            href={apkAsset.browser_download_url}
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 md:py-3 rounded-2xl font-semibold transition-all bg-gradient-to-r from-brand-blue to-brand-dark text-white shadow-md hover:opacity-90 border-0"
                          >
                            <ArrowDownToLine className="w-5 h-5" />
                            <span>Download APK</span>
                            <span className="opacity-70 text-sm font-normal hidden sm:inline-block">
                              ({(apkAsset.size / (1024 * 1024)).toFixed(1)} MB)
                            </span>
                          </a>
                        ) : (
                          <div className="text-brand-dark/40 italic px-4 py-2 text-sm w-full text-center md:text-left">
                            No APK available for this release
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer Share Section */}
      <footer className="pb-12 text-center">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onClick={handleShare}
          className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-full border border-light-2 hover:bg-light-1 transition-all shadow-sm font-medium"
        >
          <Share2 className="w-5 h-5 text-brand-blue" />
          Share This Page
        </motion.button>
      </footer>
      
    </div>
  );
}
