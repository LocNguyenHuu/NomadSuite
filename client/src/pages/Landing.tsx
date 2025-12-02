import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ArrowRight, Globe, Shield, Check, Plane, Users, X, 
  Lock, ChevronLeft, ChevronRight, Star, Sparkles,
  CreditCard, FileCheck, Bell, Zap, BarChart3, 
  Receipt, FolderKanban, Calculator, Languages, ShieldCheck,
  KeyRound, Eye, Server, Award, CheckCircle2, MousePointer2,
  Play, Pause, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SEO, StructuredData } from '@/components/SEO';
import WaitlistForm from '@/components/landing/WaitlistForm';
import FeedbackSection from '@/components/landing/FeedbackSection';
import PublicLanguageSwitcher from '@/components/PublicLanguageSwitcher';
import { useLandingI18n } from '@/contexts/LandingI18nContext';
import { faqTranslations, type LandingLanguage } from '@/data/faqTranslations';
// @ts-ignore
import heroImage from '@assets/generated_images/A_minimal,_modern_hero_illustration_for_a_digital_nomad_app._f04ea532.png';

function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: prefersReducedMotion ? 300 : 100, 
    damping: prefersReducedMotion ? 50 : 30, 
    restDelta: 0.001 
  });
  
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
}

function Particles() {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return null;
  }
  
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() > 0.5 ? 'sm' : Math.random() > 0.5 ? 'md' : 'lg',
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
    color: ['primary', 'violet', 'cyan'][Math.floor(Math.random() * 3)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`particle particle-${p.size}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.color === 'primary' ? 'rgba(14, 165, 233, 0.5)' : 
                       p.color === 'violet' ? 'rgba(139, 92, 246, 0.5)' : 
                       'rgba(6, 182, 212, 0.5)',
          }}
          animate={{
            y: [-15, -40, -15],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`spotlight-container ${className}`}
    >
      <div
        className="spotlight"
        style={{
          left: position.x,
          top: position.y,
          opacity: isHovering ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }, [x, y, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(prefersReducedMotion ? value : 0);
  
  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(value);
      return;
    }
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value, prefersReducedMotion]);
  
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

function FloatingElement({ children, delay = 0, duration = 6, className = "", yRange = 15 }: { children: React.ReactNode, delay?: number, duration?: number, className?: string, yRange?: number }) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      animate={{ 
        y: [-yRange, yRange, -yRange],
        rotate: [-2, 2, -2],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TypewriterText({ text, className = "" }: { text: string, className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [displayedText, setDisplayedText] = useState(prefersReducedMotion ? text : "");
  const [index, setIndex] = useState(prefersReducedMotion ? text.length : 0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIndex(text.length);
      return;
    }
    if (isInView && index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, index + 1));
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isInView, index, text, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span ref={ref} className={className}>{text}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {displayedText}
      {index < text.length && <span className="animate-pulse">|</span>}
    </span>
  );
}

function MagneticButton({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;
    x.set(deltaX);
    y.set(deltaY);
  }, [x, y, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const { t, language } = useLandingI18n();
  const faq = faqTranslations[language as LandingLanguage];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], prefersReducedMotion ? [1, 1] : [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], prefersReducedMotion ? [1, 1] : [1, 0.95]);

  // Track scroll position for navbar styling
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler for anchor links
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const testimonials = [
    { quote: t('testimonials.quote1'), author: t('testimonials.author1'), role: t('testimonials.role1'), rating: 5 },
    { quote: t('testimonials.quote2'), author: t('testimonials.author2'), role: t('testimonials.role2'), rating: 5 },
    { quote: t('testimonials.quote3'), author: t('testimonials.author3'), role: t('testimonials.role3'), rating: 5 },
    { quote: t('testimonials.quote4'), author: t('testimonials.author4'), role: t('testimonials.role4'), rating: 5 },
    { quote: t('testimonials.quote5'), author: t('testimonials.author5'), role: t('testimonials.role5'), rating: 5 },
    { quote: t('testimonials.quote6'), author: t('testimonials.author6'), role: t('testimonials.role6'), rating: 5 },
  ];

  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length, isAutoPlaying, prefersReducedMotion]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const allFeatures = [
    { icon: Users, title: t('features.clientCRM'), desc: t('features.clientCRMDesc'), color: "blue" },
    { icon: CreditCard, title: t('features.invoicing'), desc: t('features.invoicingDesc'), color: "green" },
    { icon: Calculator, title: t('features.taxTracker'), desc: t('features.taxTrackerDesc'), color: "purple" },
    { icon: Plane, title: t('features.travelLog'), desc: t('features.travelLogDesc'), color: "cyan" },
    { icon: Bell, title: t('features.visaAlerts'), desc: t('features.visaAlertsDesc'), color: "orange" },
    { icon: Globe, title: t('features.schengen'), desc: t('features.schengenDesc'), color: "indigo" },
    { icon: FileCheck, title: t('features.documents'), desc: t('features.documentsDesc'), color: "teal" },
    { icon: Receipt, title: t('features.expenses'), desc: t('features.expensesDesc'), color: "pink" },
    { icon: FolderKanban, title: t('features.projects'), desc: t('features.projectsDesc'), color: "amber" },
    { icon: Languages, title: t('features.multilang'), desc: t('features.multilangDesc'), color: "rose" },
    { icon: BarChart3, title: t('features.analytics'), desc: t('features.analyticsDesc'), color: "emerald" },
    { icon: Lock, title: t('features.security'), desc: t('features.securityDesc'), color: "slate" },
  ];

  const securityFeatures = [
    { icon: KeyRound, title: t('security.aes256'), desc: t('security.aes256Desc') },
    { icon: ShieldCheck, title: t('security.gdpr'), desc: t('security.gdprDesc') },
    { icon: Eye, title: t('security.zeroKnowledge'), desc: t('security.zeroKnowledgeDesc') },
    { icon: Server, title: t('security.euHosting'), desc: t('security.euHostingDesc') },
  ];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NomadSuite",
    "url": "https://nomadsuite.io",
    "logo": "https://nomadsuite.io/logo.png",
    "description": "NomadSuite is the all-in-one CRM, invoicing, and compliance platform for digital nomads.",
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "NomadSuite - Digital Nomad Business Platform",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "127" }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <SEO 
        title="NomadSuite | Digital Nomad CRM, Invoicing & Compliance Platform"
        description="All-in-one platform for digital nomads: manage clients, send multi-currency invoices, track tax residency days, get visa alerts, and store documents securely."
      />
      <StructuredData data={organizationSchema} id="schema-organization" />
      <StructuredData data={softwareSchema} id="schema-software" />
      <ScrollProgress />
      
      {/* Navbar - Fixed with scroll-aware styling */}
      <motion.nav 
        initial={prefersReducedMotion ? false : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-background/95 backdrop-blur-xl border-b shadow-lg shadow-black/5' 
            : 'bg-background/80 backdrop-blur-xl border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <motion.div 
              className="flex items-center gap-2.5 cursor-pointer group"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300"
                whileHover={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
              >
                <Globe className="h-5 w-5 text-white" strokeWidth={2} />
              </motion.div>
              <span className="font-heading font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">NomadSuite</span>
            </motion.div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#features", label: t('nav.features') || 'Features' },
              { href: "#security", label: t('nav.security') || 'Security' },
              { href: "#how-it-works", label: t('nav.howItWorks') || 'How It Works' },
            ].map((item) => (
              <motion.a 
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group cursor-pointer"
                whileHover={prefersReducedMotion ? {} : { y: -2 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-violet-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
            <Link href="/help">
              <motion.span 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                whileHover={prefersReducedMotion ? {} : { y: -2 }}
              >
                {t('nav.help') || 'Help'}
              </motion.span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <PublicLanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">{t('nav.login')}</Button>
            </Link>
            <Link href="/register">
              <MagneticButton>
                <Button size="sm" className="cta-button font-semibold text-white border-0 shine-effect">
                  {t('nav.signup')}
                </Button>
              </MagneticButton>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-16 md:pt-24 pb-28 md:pb-40 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 aurora-bg" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute inset-0 noise-overlay" />
        <Particles />
        
        {/* Animated Gradient Orbs */}
        <motion.div 
          className="absolute top-0 left-[5%] w-[600px] h-[600px] hero-blob-1 rounded-full morph-shape opacity-60"
          style={{ y: heroY }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-20 right-[0%] w-[500px] h-[500px] hero-blob-2 rounded-full morph-shape opacity-50"
          style={{ y: heroY }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-0 left-[25%] w-[450px] h-[450px] hero-blob-3 rounded-full morph-shape opacity-40"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Floating Decorative Elements */}
        <FloatingElement delay={0} duration={7} yRange={20} className="absolute top-28 left-[12%] hidden lg:block">
          <motion.div 
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 backdrop-blur-md border border-white/30 flex items-center justify-center rotate-12 shadow-xl interactive-icon"
            whileHover={{ scale: 1.2, rotate: 20 }}
          >
            <Plane className="w-8 h-8 text-primary" />
          </motion.div>
        </FloatingElement>
        <FloatingElement delay={1.5} duration={8} yRange={18} className="absolute top-40 right-[10%] hidden lg:block">
          <motion.div 
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 backdrop-blur-md border border-white/30 flex items-center justify-center -rotate-6 shadow-xl interactive-icon"
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            <CreditCard className="w-7 h-7 text-violet-500" />
          </motion.div>
        </FloatingElement>
        <FloatingElement delay={0.5} duration={9} yRange={15} className="absolute bottom-40 left-[6%] hidden lg:block">
          <motion.div 
            className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-primary/20 backdrop-blur-md border border-white/30 flex items-center justify-center rotate-6 shadow-xl interactive-icon"
            whileHover={{ scale: 1.2, rotate: 15 }}
          >
            <Globe className="w-6 h-6 text-cyan-500" />
          </motion.div>
        </FloatingElement>
        <FloatingElement delay={2} duration={10} yRange={12} className="absolute top-60 left-[25%] hidden xl:block">
          <motion.div 
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/20 backdrop-blur-md border border-white/30 flex items-center justify-center -rotate-12 shadow-lg interactive-icon"
            whileHover={{ scale: 1.2, rotate: 0 }}
          >
            <Shield className="w-5 h-5 text-green-500" />
          </motion.div>
        </FloatingElement>
        <FloatingElement delay={3} duration={8} yRange={16} className="absolute bottom-60 right-[15%] hidden xl:block">
          <motion.div 
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-md border border-white/30 flex items-center justify-center rotate-12 shadow-lg interactive-icon"
            whileHover={{ scale: 1.2, rotate: 20 }}
          >
            <Receipt className="w-5 h-5 text-amber-500" />
          </motion.div>
        </FloatingElement>
        
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 via-violet-500/10 to-cyan-400/10 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-primary/20 backdrop-blur-sm floating-badge"
            >
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('hero.badge')}</span>
              <motion.span 
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] tracking-tight mb-6"
            >
              <span className="inline-block">{t('hero.title1')}</span>
              <motion.span 
                className="gradient-text block mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {t('hero.title2')}
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/register">
                <MagneticButton className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-violet-500 to-cyan-400 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity animate-gradient-shift" />
                  <Button size="lg" className="relative cta-button h-14 px-10 text-base font-semibold text-white border-0 shine-effect">
                    {t('hero.ctaPrimary')}
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" strokeWidth={2} />
                    </motion.span>
                  </Button>
                </MagneticButton>
              </Link>
              <a href="#features">
                <MagneticButton>
                  <Button size="lg" variant="outline" className="h-14 px-10 text-base font-semibold bg-background/60 backdrop-blur-md hover:bg-background/80 border-border/50 glow-border">
                    <MousePointer2 className="mr-2 h-5 w-5" strokeWidth={2} />
                    {t('hero.ctaSecondary')}
                  </Button>
                </MagneticButton>
              </a>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm"
            >
              {[
                { icon: Check, text: t('hero.trust1'), color: "text-green-500" },
                { icon: ShieldCheck, text: t('hero.trustEncrypted'), color: "text-green-500" },
                { icon: Check, text: t('hero.trust3'), color: "text-green-500" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 text-muted-foreground bg-background/40 backdrop-blur-sm px-4 py-2 rounded-full border border-border/30"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} strokeWidth={2.5} />
                  </motion.div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Hero Image with 3D Effect */}
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-violet-500/30 to-cyan-400/30 rounded-3xl blur-3xl opacity-50 animate-gradient-shift" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
            <TiltCard className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src={heroImage} 
                  alt="NomadSuite Dashboard - Digital Nomad CRM and Compliance Platform"
                  className="relative rounded-2xl shadow-2xl border border-white/30 w-full preview-card"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/5 via-transparent to-violet-500/5" />
                
                {/* Floating UI Elements */}
                <motion.div 
                  className="absolute -right-4 top-1/4 glass-card-strong px-4 py-3 rounded-xl shadow-lg hidden lg:flex items-center gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Invoice Sent</p>
                    <p className="text-xs text-muted-foreground">€2,500.00</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute -left-4 bottom-1/3 glass-card-strong px-4 py-3 rounded-xl shadow-lg hidden lg:flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Days in Schengen</p>
                    <p className="text-xs text-muted-foreground">67/90 days</p>
                  </div>
                </motion.div>
              </motion.div>
            </TiltCard>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <a href="#stats" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-xs font-medium">Scroll to explore</span>
              <ChevronDown className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section id="stats" className="py-20 border-y bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <SpotlightCard className="container mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 12, suffix: "+", label: t('stats.features'), icon: Zap },
              { value: 50, suffix: "+", label: t('stats.currencies'), icon: CreditCard },
              { value: 6, suffix: "", label: t('stats.languages'), icon: Languages },
              { value: 256, prefix: "AES-", suffix: "", label: t('stats.encryption'), icon: Lock },
            ].map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div 
                  className="text-center stat-card rounded-2xl p-8 border border-border/50 card-stack hover-lift"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div className="text-3xl md:text-4xl font-bold font-heading gradient-text mb-2">
                    {stat.value === 256 ? (
                      <span>{stat.prefix}{stat.value}</span>
                    ) : (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </SpotlightCard>
      </section>

      {/* Security Section */}
      <section id="security" className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 via-background to-background dark:from-green-950/20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl morph-shape" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl morph-shape" style={{ animationDelay: '5s' }} />
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <motion.div 
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-green-200/50 dark:border-green-800/50 floating-badge"
            >
              <Shield className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('security.badge')}</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              {t('security.title')} <span className="gradient-text">{t('security.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('security.subtitle')}
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {securityFeatures.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <TiltCard>
                  <motion.div 
                    className="p-8 h-full rounded-2xl bg-gradient-to-br from-white to-green-50/50 dark:from-slate-800 dark:to-green-950/30 border border-green-100 dark:border-green-900/50 shadow-lg shadow-green-500/5 hover-lift"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-5 interactive-icon"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <feature.icon className="h-8 w-8" strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </motion.div>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection delay={0.4}>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Award, text: t('security.badgeGDPR') },
                { icon: Lock, text: t('security.badgeEncrypted') },
                { icon: Server, text: t('security.badgeEU') },
                { icon: CheckCircle2, text: t('security.badgeAudit') },
              ].map((badge, i) => (
                <motion.div 
                  key={i}
                  className="security-badge flex items-center gap-2 px-5 py-3 rounded-xl shine-effect"
                  whileHover={{ scale: 1.05, y: -3 }}
                >
                  <badge.icon className="h-5 w-5 text-green-600 dark:text-green-400" strokeWidth={2} />
                  <span className="font-medium text-green-700 dark:text-green-300">{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 text-violet-700 dark:text-violet-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-violet-200/50 dark:border-violet-800/50 floating-badge"
            >
              <Star className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('features.badge')}</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              {t('features.title')} <span className="gradient-text">{t('features.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </AnimatedSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allFeatures.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <FeatureCard {...feature} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 md:py-36 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40 text-cyan-700 dark:text-cyan-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-cyan-200/50 dark:border-cyan-800/50 floating-badge"
            >
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('howItWorks.badge')}</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              {t('howItWorks.title')} <span className="gradient-text">{t('howItWorks.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{t('howItWorks.subtitle')}</p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
            {/* Animated Connection Line */}
            <motion.div 
              className="hidden md:block absolute top-12 left-[14%] right-[14%] h-1 overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-violet-500 to-cyan-400"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>
            
            {[1, 2, 3, 4].map((num, index) => (
              <AnimatedSection key={num} delay={index * 0.2}>
                <StepCard 
                  number={num.toString()} 
                  title={t(`howItWorks.step${num}Title`)} 
                  desc={t(`howItWorks.step${num}Desc`)} 
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <AnimatedSection>
              <motion.div 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 text-red-700 dark:text-red-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-red-200/50 dark:border-red-800/50"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
                <span>{t('problems.badge')}</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
                {t('problems.title')}
              </h2>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <motion.li 
                    key={num}
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: num * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 hover:shadow-lg transition-shadow"
                  >
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0"
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    </motion.div>
                    <span className="text-muted-foreground">{t(`problems.item${num}`)}</span>
                  </motion.li>
                ))}
              </ul>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <motion.div 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-green-200/50 dark:border-green-800/50"
              >
                <Check className="h-4 w-4" strokeWidth={2.5} />
                <span>{t('solutions.badge')}</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
                {t('solutions.title')}
              </h2>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <motion.li 
                    key={num}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: num * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ x: -5 }}
                    className="flex items-start gap-4 p-5 rounded-xl bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 hover:shadow-lg transition-shadow"
                  >
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </motion.div>
                    <span>{t(`solutions.item${num}`)}</span>
                  </motion.li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 md:py-36 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              {t('testimonials.title')} <span className="gradient-text">{t('testimonials.titleHighlight')}</span>
            </h2>
          </AnimatedSection>
          
          <AnimatedSection className="max-w-3xl mx-auto">
            <motion.div 
              className="testimonial-card p-10 md:p-14 rounded-3xl border border-border/50 shadow-2xl relative overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-full -translate-y-24 translate-x-24" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-400/10 to-primary/10 rounded-full translate-y-20 -translate-x-20" />
              
              <div className="flex justify-center mb-6 relative">
                {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                  >
                    <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.p 
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl md:text-2xl text-center mb-8 leading-relaxed relative"
                >
                  "{testimonials[currentTestimonial]?.quote}"
                </motion.p>
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`author-${currentTestimonial}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center justify-center gap-4 relative"
                >
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    {testimonials[currentTestimonial]?.author?.[0] || 'U'}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-lg">{testimonials[currentTestimonial]?.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial]?.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center gap-4 mt-10">
                <motion.button 
                  onClick={prevTestimonial} 
                  className="w-12 h-12 rounded-full border border-border bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => { setIsAutoPlaying(false); setCurrentTestimonial(i); }}
                      className={`rounded-full transition-all ${i === currentTestimonial ? 'w-8 h-2 bg-gradient-to-r from-primary to-violet-500' : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
                      whileHover={{ scale: 1.3 }}
                    />
                  ))}
                </div>
                <motion.button 
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="w-12 h-12 rounded-full border border-border bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </motion.button>
                <motion.button 
                  onClick={nextTestimonial} 
                  className="w-12 h-12 rounded-full border border-border bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.1, x: 3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2} className="flex flex-wrap justify-center gap-4 mt-12">
            {[
              { icon: Globe, text: t('testimonials.countries') },
              { icon: Shield, text: t('testimonials.gdpr') },
              { icon: Lock, text: t('testimonials.security') },
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg border border-border/50 shine-effect"
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <item.icon className="h-5 w-5 text-primary" strokeWidth={2} />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 md:py-36">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">{faq.title}</h2>
            <p className="text-muted-foreground text-lg">{faq.subtitle}</p>
          </AnimatedSection>
          
          <AnimatedSection>
            <Accordion type="single" collapsible className="space-y-4">
              {faq.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-lg transition-all hover-lift"
                  >
                    <AccordionTrigger className="hover:no-underline text-left font-semibold py-6 text-lg">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-cyan-500" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <motion.div 
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl morph-shape"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl morph-shape"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ animationDelay: '5s' }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <AnimatedSection>
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t('cta.title')}
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              {t('cta.subtitle')}
            </motion.p>
            <Link href="/register">
              <MagneticButton className="inline-block relative group">
                <div className="absolute -inset-1 bg-white/30 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                <Button size="lg" variant="secondary" className="relative h-16 px-12 text-lg font-semibold shadow-2xl bg-white text-primary hover:bg-white/90 shine-effect">
                  {t('cta.button')}
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Button>
              </MagneticButton>
            </Link>
            <motion.p 
              className="mt-6 text-white/60 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              {t('cta.note')}
            </motion.p>
          </AnimatedSection>
        </div>
      </section>

      {/* Waitlist */}
      <WaitlistForm />

      {/* Feedback */}
      <FeedbackSection />

      {/* Footer */}
      <footer className="py-16 bg-background border-t relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <motion.div 
                className="flex items-center gap-2.5 mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Globe className="h-5 w-5 text-white" strokeWidth={2} />
                </motion.div>
                <span className="font-heading font-bold text-xl">NomadSuite</span>
              </motion.div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('footer.tagline')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.product')}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><motion.a href="#features" className="hover:text-primary transition-colors" whileHover={{ x: 3 }}>{t('nav.features') || 'Features'}</motion.a></li>
                <li><motion.a href="#security" className="hover:text-primary transition-colors" whileHover={{ x: 3 }}>{t('nav.security') || 'Security'}</motion.a></li>
                <li><motion.a href="#how-it-works" className="hover:text-primary transition-colors" whileHover={{ x: 3 }}>{t('nav.howItWorks') || 'How It Works'}</motion.a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.resources')}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/blog"><motion.span className="hover:text-primary transition-colors cursor-pointer" whileHover={{ x: 3 }}>{t('footer.blog')}</motion.span></Link></li>
                <li><Link href="/help"><motion.span className="hover:text-primary transition-colors cursor-pointer" whileHover={{ x: 3 }}>{t('footer.helpCenter')}</motion.span></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy"><motion.span className="hover:text-primary transition-colors cursor-pointer" whileHover={{ x: 3 }}>{t('footer.privacy')}</motion.span></Link></li>
                <li><Link href="/terms"><motion.span className="hover:text-primary transition-colors cursor-pointer" whileHover={{ x: 3 }}>{t('footer.terms')}</motion.span></Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} NomadSuite. {t('footer.copyright')}</p>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="h-4 w-4 text-green-500" />
              <span>{t('footer.gdprNote')}</span>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400 group-hover:from-blue-500 group-hover:to-blue-600',
    green: 'from-green-500/20 to-green-600/20 text-green-600 dark:text-green-400 group-hover:from-green-500 group-hover:to-green-600',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-600 dark:text-purple-400 group-hover:from-purple-500 group-hover:to-purple-600',
    cyan: 'from-cyan-500/20 to-cyan-600/20 text-cyan-600 dark:text-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-600',
    orange: 'from-orange-500/20 to-orange-600/20 text-orange-600 dark:text-orange-400 group-hover:from-orange-500 group-hover:to-orange-600',
    indigo: 'from-indigo-500/20 to-indigo-600/20 text-indigo-600 dark:text-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-600',
    teal: 'from-teal-500/20 to-teal-600/20 text-teal-600 dark:text-teal-400 group-hover:from-teal-500 group-hover:to-teal-600',
    pink: 'from-pink-500/20 to-pink-600/20 text-pink-600 dark:text-pink-400 group-hover:from-pink-500 group-hover:to-pink-600',
    amber: 'from-amber-500/20 to-amber-600/20 text-amber-600 dark:text-amber-400 group-hover:from-amber-500 group-hover:to-amber-600',
    rose: 'from-rose-500/20 to-rose-600/20 text-rose-600 dark:text-rose-400 group-hover:from-rose-500 group-hover:to-rose-600',
    emerald: 'from-emerald-500/20 to-emerald-600/20 text-emerald-600 dark:text-emerald-400 group-hover:from-emerald-500 group-hover:to-emerald-600',
    slate: 'from-slate-500/20 to-slate-600/20 text-slate-600 dark:text-slate-400 group-hover:from-slate-500 group-hover:to-slate-600',
  };

  return (
    <TiltCard>
      <motion.div 
        className="feature-card p-7 h-full rounded-2xl cursor-pointer group shine-effect"
        whileHover={{ y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color]} mb-5 flex items-center justify-center transition-all duration-300`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="h-7 w-7 group-hover:text-white transition-colors duration-300" strokeWidth={1.75} />
        </motion.div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </motion.div>
    </TiltCard>
  );
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <motion.div 
      className="text-center group"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="step-number w-20 h-20 rounded-2xl text-white flex items-center justify-center font-bold text-3xl mx-auto mb-6"
        whileHover={{ scale: 1.15, rotate: 10 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      >
        {number}
      </motion.div>
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}
