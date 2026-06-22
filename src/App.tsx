import { useEffect, useState } from 'react';
import { Download, Shield, Smartphone, ArrowDownToLine, CheckCircle2, Clock, Share2, ChevronDown, ChevronUp, EyeOff, Ban, Github, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

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

function TypewriterText({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const word = words[currentWordIndex];

    if (isDeleting) {
      timeout = setTimeout(() => {
        const nextText = word.substring(0, currentText.length - 1);
        setCurrentText(nextText);
        if (nextText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }, 50);
    } else {
      timeout = setTimeout(() => {
        const nextText = word.substring(0, currentText.length + 1);
        setCurrentText(nextText);
        if (nextText === word) {
          timeout = setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="inline-flex items-center">
      <span className="bg-gradient-to-r from-brand-blue to-brand-dark bg-clip-text text-transparent pb-1">{currentText || '\u200B'}</span>
      <span className="inline-block animate-pulse text-brand-dark opacity-40 font-light -translate-y-[2px] ml-[2px]">|</span>
    </span>
  );
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
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-md font-bold mt-3 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="mb-2" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
            li: ({node, ...props}) => <li className="" {...props} />,
            a: ({node, ...props}) => <a className="text-brand-blue hover:underline break-all" {...props} />,
            code: ({node, ...props}) => <code className="bg-light-2/50 px-1.5 py-0.5 rounded font-mono text-sm" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
            img: ({node, ...props}) => <img className="inline-block max-w-full m-1" {...props} />,
            div: ({node, ...props}) => <div className="my-2 max-w-full overflow-hidden" {...props} />,
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

function FAQItem({ question, answer, delay, index }: { question: string, answer: string, delay: number, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay }}
      className={`border-b border-light-2/60 overflow-hidden last:border-0 ${isOpen ? 'bg-light-1/50 rounded-2xl border-transparent px-2 md:px-6 my-4 shadow-sm' : ''} transition-all duration-300`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left py-6 flex items-center justify-between focus:outline-none transition-all ${isOpen ? 'px-4' : ''}`}
      >
        <div className="flex items-start md:items-center gap-4 md:gap-6 w-full">
          <span className="text-sm font-bold text-brand-blue/50 font-mono mt-1 md:mt-0 shrink-0">0{index + 1}</span>
          <span className="font-bold text-[1.1rem] md:text-xl text-brand-dark pr-4 leading-snug flex-1">{question}</span>
        </div>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-gradient-to-r from-brand-blue to-brand-dark text-white shadow-md rotate-180' : 'bg-light-2 text-brand-dark hover:bg-light-3'}`}>
            <ChevronDown className="w-5 h-5 transition-transform duration-300" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 pb-6 md:pl-16 text-brand-dark/70 font-medium leading-relaxed mt-2 text-base md:text-lg">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const imageModules = import.meta.glob('/public/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });

const screenshots = Object.keys(imageModules)
  .filter(key => !key.endsWith('logo.jpg') && !key.endsWith('favicon.ico'))
  .map(key => {
    const filename = key.replace('/public/', '');
    let title = "App Screen";
    let Icon = Smartphone;
    
    if (filename === 'ui-1.png') { title = "Scroll Intercepted"; Icon = Shield; }
    else if (filename === 'ui-2.png') { title = "Security Settings"; Icon = Smartphone; }
    else if (filename === 'ui-3.png') { title = "Target Apps"; Icon = Clock; }
    else if (filename === 'ui-4.png') { title = "System & Theme"; Icon = Smartphone; }
    else {
      title = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    }
    
    return {
      url: `./${filename}`,
      filename,
      title,
      Icon
    };
  })
  .sort((a, b) => a.filename.localeCompare(b.filename));

export default function App() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [window.innerHeight * 0.6, window.innerHeight * 0.85], [0, 1]);
  const headerY = useTransform(scrollY, [window.innerHeight * 0.6, window.innerHeight * 0.85], [10, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div className="min-h-screen bg-light-1 text-brand-dark font-sans selection:bg-brand-blue selection:text-white pb-0">
      {/* Sticky Header / Navbar */}
      <motion.header
        style={{ opacity: headerOpacity, y: headerY, pointerEvents: isScrolled ? 'auto' : 'none' }}
        className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-brand-blue to-brand-dark shadow-lg border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm border border-white/20">
              <img src="./logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-white tracking-tight">Shorts Blocker</span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-xs sm:text-sm font-medium text-white/80 hidden min-[400px]:block">
              Product by <strong className="text-white font-bold">Esech</strong>
            </span>
            <a 
              href="https://github.com/hariom2008h/Block-scroll"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-white border border-white/20 shrink-0 whitespace-nowrap"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:block">GitHub Repository</span>
              <span className="sm:hidden">GitHub</span>
            </a>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20 min-h-[100dvh] flex flex-col items-center justify-center text-center overflow-hidden w-full">
        {/* Subtle, soft radial background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-gradient-to-b from-brand-blue/5 via-transparent to-transparent opacity-100 pointer-events-none -z-10 blur-3xl mix-blend-multiply" />
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="flex flex-col items-center justify-center w-full max-w-[100vw] mt-[-5dvh]"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-light-2 text-[11px] sm:text-xs md:text-sm font-bold text-brand-dark mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
            </span>
            <span>Shorts Blocker for Android</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-brand-dark max-w-4xl mb-6 leading-[1.1] sm:leading-[1.15] px-2 text-center flex flex-col items-center">
            <span className="block mb-2 text-brand-dark">Stop endless scrolling.</span>
            <span className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
              <span className="text-brand-dark">Reclaim your</span>
              <span className="flex items-center justify-center min-w-[3.5em] text-left">
                 <TypewriterText words={["Focus.", "Time.", "Attention."]} />
              </span>
            </span>
          </h1>

          <p className="text-[15px] sm:text-lg md:text-xl text-brand-dark/60 max-w-2xl mb-10 leading-relaxed font-medium px-6 text-center">
            A minimalist utility to block addictive short-form video feeds and regain control over your digital habits.
          </p>

          <div className="flex flex-col items-center gap-6 w-full px-4">
            {/* App Logo and Name */}
            <div className="flex items-center gap-3 sm:gap-4 px-4 py-2 sm:px-5 sm:py-3 rounded-[1.25rem] bg-white border border-light-2/60 shadow-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-sm shadow-brand-blue/10 border border-light-2/20 bg-white p-[2px] shrink-0">
                <div className="w-full h-full rounded-[0.8rem] overflow-hidden bg-light-1">
                   <img src="./logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-display font-extrabold text-brand-dark tracking-tight pr-2">Shorts Blocker</span>
            </div>

            <div className="flex w-full sm:w-auto">
              {loading ? (
                <div className="h-14 w-full sm:w-64 bg-light-2 animate-pulse rounded-full" />
              ) : latestApk ? (
                <a
                  href={latestApk.browser_download_url}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 sm:gap-3 bg-gradient-to-r from-brand-blue to-brand-dark text-white px-8 py-4 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:opacity-90 transition-all shadow-[0_8px_30px_rgb(59,130,246,0.2)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Download className="w-5 h-5 shrink-0" />
                  <span>Download Latest APK</span>
                </a>
              ) : (
                <div className="w-full sm:w-auto text-brand-dark/60 font-medium px-6 py-3 sm:px-8 sm:py-4 bg-light-2 border border-light-2/50 rounded-full inline-flex justify-center items-center gap-2 text-sm sm:text-base text-center">
                  Releases temporarily unavailable
                </div>
              )}
            </div>
          </div>
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-light-1 p-8 rounded-3xl border border-light-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-light-1 p-8 rounded-3xl border border-light-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-light-1 p-8 rounded-3xl border border-light-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-light-1 p-8 rounded-3xl border border-light-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
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
            
            {screenshots.length > 0 ? (
              screenshots.map((s, idx) => {
                const Icon = s.Icon;
                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="snap-center shrink-0 w-[240px] md:w-[280px] relative rounded-[2.5rem] overflow-hidden border-[8px] border-light-2 shadow-2xl aspect-[9/19.5] bg-light-1 flex items-center justify-center group flex-col"
                  >
                    {/* Fake Phone Notch */}
                    <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                      <div className="w-1/3 h-full bg-light-2 rounded-b-2xl"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-brand-dark/40 z-0 mt-8">
                      <Icon className="w-12 h-12 mb-3 opacity-50" />
                      <span className="font-semibold mb-1 text-lg">{s.title}</span>
                      <span className="text-[11px] bg-light-2/60 px-3 py-1.5 rounded-full mt-3 font-mono leading-tight">public/{s.filename}</span>
                    </div>
                    <img src={s.url} alt={s.title} className="absolute inset-0 w-full h-full object-cover object-top z-10 transition-transform duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.opacity = '0')} />
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-brand-dark/50 border-2 border-dashed border-light-2/50 rounded-[2.5rem] w-full max-w-sm mx-auto">
                <Smartphone className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No screenshots found</p>
                <p className="text-sm mt-2">Drop images into the public/ folder.</p>
              </div>
            )}

          </motion.div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-24 bg-light-1 border-t border-light-2/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            <div className="lg:col-span-5 lg:sticky lg:top-32 relative z-10">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-light-2 flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-brand-blue" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-brand-dark tracking-tight mb-4 leading-tight">
                  Got Questions? <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-dark">We've Got Answers.</span>
                </h2>
                <p className="text-brand-dark/70 text-lg md:text-xl font-medium leading-relaxed max-w-md">
                  Everything you need to know about how Shorts Blocker works, privacy, and technical details.
                </p>
                
                <div className="mt-10 hidden lg:block">
                  <div className="p-6 bg-white border border-light-2 rounded-3xl shadow-sm inline-block">
                     <p className="font-semibold text-brand-dark mb-1">Still need help?</p>
                     <p className="text-sm text-brand-dark/60 mb-4">Reach out on GitHub repository issues.</p>
                     <a href="https://github.com/hariom2008h" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-sm bg-light-2 hover:bg-light-3 px-4 py-2 rounded-full transition-colors text-brand-dark">
                       <Github className="w-4 h-4"/> Talk to us
                     </a>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7 z-10">
              <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-brand-dark/5 border border-light-2">
                <FAQItem 
                  index={0}
                  question="Why does Shorts Blocker need Accessibility permissions?"
                  answer="Shorts Blocker uses Android's Accessibility Services to detect when you are scrolling through short-form video feeds (like YouTube Shorts or Instagram Reels). This permission is required to analyze the screen content and intercept the scroll event with our custom overlay."
                  delay={0.1}
                />
                <FAQItem 
                  index={1}
                  question="Does the app collect or track my personal data?"
                  answer="Absolutely not. Privacy is our core principle. The Accessibility service only monitors for specific UI elements related to short-form video scroll feeds. All processing happens locally on your device, and we do not collect, store, or transmit any of your personal data or browsing history."
                  delay={0.2}
                />
                <FAQItem 
                  index={2}
                  question="Can I easily bypass the block?"
                  answer="Shorts Blocker is built with 'friction-by-design'. When you try to access a blocked feed, you must enter a complex master password. The goal isn't to lock your phone down completely, but to introduce enough friction to break the subconscious dopamine loop."
                  delay={0.3}
                />
                <FAQItem 
                  index={3}
                  question="Will it block regular YouTube videos?"
                  answer="No! Our smart interception technology only targets the 'Shorts' UI. You can still watch proper, long-form educational or entertainment videos without any interruptions. The app distinguishes between short-form feeds and standard video players."
                  delay={0.4}
                />
              </div>
            </div>
            
          </div>
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

      {/* Footer Creator Section */}
      <footer className="w-full bg-gradient-to-r from-brand-blue to-brand-dark relative overflow-hidden pt-12 pb-6 flex flex-col items-center text-center text-white mt-12">
        {/* Background artistic flairs */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-72 h-72 rounded-full bg-black/20 blur-3xl pointer-events-none mix-blend-overlay" />

        <div className="w-full max-w-4xl px-4 flex flex-col items-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full group"
          >
            <div className="flex items-center gap-3 mb-4 group-hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-xl shadow-brand-dark/20 ring-1 ring-white/20">
                <img src="./logo.jpg" alt="Shorts Blocker" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                Shorts Blocker
              </span>
            </div>
            
            <h3 className="text-base sm:text-lg font-medium mb-3 tracking-tight text-white/80">
              Created by Hari Om Bhadana
            </h3>
            
            <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed font-medium font-sans">
              Passionate about building tools that help people regain their focus and take control.
            </p>
            
            <a 
              href="https://github.com/hariom2008h"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-2.5 rounded-full hover:bg-light-1 transition-all shadow-md font-bold hover:scale-105 active:scale-95 text-xs sm:text-sm"
            >
              <Github className="w-4 h-4" />
              Follow on GitHub
            </a>
          </motion.div>

          <div className="mt-8 text-xs font-medium text-white/50 w-full border-t border-white/10 pt-6 text-center">
            &copy; {new Date().getFullYear()} Esech &middot; Hari Om Bhadana. All rights reserved.
          </div>
        </div>
      </footer>
      
    </div>
  );
}
