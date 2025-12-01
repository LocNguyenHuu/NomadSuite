import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, Globe, Shield, Check, Plane, Users, X, 
  Lock, ChevronLeft, ChevronRight, Star, Sparkles,
  CreditCard, FileCheck, Bell, Zap, BarChart3, 
  Receipt, FolderKanban, Calculator, Languages, ShieldCheck,
  KeyRound, Eye, Server, Award, CheckCircle2, MousePointer2
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

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2500;
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
  }, [isInView, value]);
  
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

function FloatingElement({ children, delay = 0, duration = 6, className = "" }: { children: React.ReactNode, delay?: number, duration?: number, className?: string }) {
  return (
    <motion.div
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
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
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const testimonials = [
    { quote: t('testimonials.quote1'), author: t('testimonials.author1'), role: t('testimonials.role1'), rating: 5 },
    { quote: t('testimonials.quote2'), author: t('testimonials.author2'), role: t('testimonials.role2'), rating: 5 },
    { quote: t('testimonials.quote3'), author: t('testimonials.author3'), role: t('testimonials.role3'), rating: 5 },
    { quote: t('testimonials.quote4'), author: t('testimonials.author4'), role: t('testimonials.role4'), rating: 5 },
    { quote: t('testimonials.quote5'), author: t('testimonials.author5'), role: t('testimonials.role5'), rating: 5 },
    { quote: t('testimonials.quote6'), author: t('testimonials.author6'), role: t('testimonials.role6'), rating: 5 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

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
      
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b bg-background/70 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <motion.div 
              className="flex items-center gap-2.5 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300">
                <Globe className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                whileHover={{ y: -1 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
            <Link href="/help">
              <motion.span 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                whileHover={{ y: -1 }}
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
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="sm" className="cta-button font-semibold text-white border-0">
                  {t('nav.signup')}
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-12 md:pt-20 pb-24 md:pb-36 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute inset-0 noise-overlay" />
        
        {/* Floating Blobs */}
        <motion.div 
          className="absolute top-10 left-[10%] w-[500px] h-[500px] hero-blob-1 rounded-full animate-blob"
          style={{ y: heroY }}
        />
        <motion.div 
          className="absolute top-40 right-[5%] w-[400px] h-[400px] hero-blob-2 rounded-full animate-blob"
          style={{ animationDelay: "2s", y: heroY }}
        />
        <motion.div 
          className="absolute bottom-20 left-[30%] w-[350px] h-[350px] hero-blob-3 rounded-full animate-blob"
          style={{ animationDelay: "4s" }}
        />
        
        {/* Floating Decorative Elements */}
        <FloatingElement delay={0} duration={8} className="absolute top-32 left-[15%] hidden lg:block">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center rotate-12">
            <Plane className="w-8 h-8 text-primary/60" />
          </div>
        </FloatingElement>
        <FloatingElement delay={2} duration={7} className="absolute top-48 right-[12%] hidden lg:block">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 backdrop-blur-sm border border-white/20 flex items-center justify-center -rotate-6">
            <CreditCard className="w-7 h-7 text-violet-500/60" />
          </div>
        </FloatingElement>
        <FloatingElement delay={1} duration={9} className="absolute bottom-48 left-[8%] hidden lg:block">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-primary/20 backdrop-blur-sm border border-white/20 flex items-center justify-center rotate-6">
            <Globe className="w-6 h-6 text-cyan-500/60" />
          </div>
        </FloatingElement>
        
        <motion.div style={{ opacity: heroOpacity }} className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 via-violet-500/10 to-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-primary/20 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 animate-bounce-subtle" strokeWidth={2.5} />
              <span>{t('hero.badge')}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.08] tracking-tight mb-6"
            >
              {t('hero.title1')}
              <span className="gradient-text block mt-2">{t('hero.title2')}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/register">
                <motion.div 
                  whileHover={{ scale: 1.03, y: -3 }} 
                  whileTap={{ scale: 0.97 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-violet-500 to-cyan-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <Button size="lg" className="relative cta-button h-14 px-8 text-base font-semibold text-white border-0">
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                  </Button>
                </motion.div>
              </Link>
              <a href="#features">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold bg-background/50 backdrop-blur-sm hover:bg-background/80">
                    <MousePointer2 className="mr-2 h-5 w-5" strokeWidth={2} />
                    {t('hero.ctaSecondary')}
                  </Button>
                </motion.div>
              </a>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm"
            >
              {[
                { icon: Check, text: t('hero.trust1'), color: "text-green-500" },
                { icon: ShieldCheck, text: t('hero.trustEncrypted'), color: "text-green-500" },
                { icon: Check, text: t('hero.trust3'), color: "text-green-500" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} strokeWidth={2.5} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-violet-500/30 to-cyan-400/30 rounded-3xl blur-3xl opacity-50 animate-gradient-shift" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img 
                src={heroImage} 
                alt="NomadSuite Dashboard - Digital Nomad CRM and Compliance Platform"
                className="relative rounded-2xl shadow-2xl border border-white/30 w-full"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/5 via-transparent to-violet-500/5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 border-y bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 12, suffix: "+", label: t('stats.features') },
              { value: 50, suffix: "+", label: t('stats.currencies') },
              { value: 6, suffix: "", label: t('stats.languages') },
              { value: 256, prefix: "AES-", suffix: "", label: t('stats.encryption') },
            ].map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div 
                  className="text-center stat-card rounded-2xl p-6 border border-border/50"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
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
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 via-background to-background dark:from-green-950/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <motion.div 
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-green-200/50 dark:border-green-800/50"
            >
              <Shield className="h-4 w-4 animate-bounce-subtle" strokeWidth={2.5} />
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
                <motion.div 
                  className="p-6 h-full rounded-2xl bg-gradient-to-br from-white to-green-50/50 dark:from-slate-800 dark:to-green-950/30 border border-green-100 dark:border-green-900/50 shadow-lg shadow-green-500/5"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <feature.icon className="h-7 w-7" strokeWidth={1.75} />
                  </motion.div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
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
                  className="security-badge flex items-center gap-2 px-5 py-3 rounded-xl"
                  whileHover={{ scale: 1.05 }}
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
      <section id="features" className="py-24 md:py-32 relative">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 text-violet-700 dark:text-violet-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-violet-200/50 dark:border-violet-800/50"
            >
              <Star className="h-4 w-4 animate-bounce-subtle" strokeWidth={2.5} />
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
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40 text-cyan-700 dark:text-cyan-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-cyan-200/50 dark:border-cyan-800/50"
            >
              <Zap className="h-4 w-4 animate-bounce-subtle" strokeWidth={2.5} />
              <span>{t('howItWorks.badge')}</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('howItWorks.title')} <span className="gradient-text">{t('howItWorks.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{t('howItWorks.subtitle')}</p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-violet-500 to-cyan-400 opacity-20" />
            
            {[1, 2, 3, 4].map((num, index) => (
              <AnimatedSection key={num} delay={index * 0.15}>
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
      <section className="py-24 md:py-32 relative">
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
              <ul className="space-y-5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <motion.li 
                    key={num}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: num * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <span className="text-muted-foreground">{t(`problems.item${num}`)}</span>
                  </motion.li>
                ))}
              </ul>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <motion.div 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-green-200/50 dark:border-green-800/50"
              >
                <Check className="h-4 w-4" strokeWidth={2.5} />
                <span>{t('solutions.badge')}</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
                {t('solutions.title')}
              </h2>
              <ul className="space-y-5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <motion.li 
                    key={num}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: num * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <span>{t(`solutions.item${num}`)}</span>
                  </motion.li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('testimonials.title')} <span className="gradient-text">{t('testimonials.titleHighlight')}</span>
            </h2>
          </AnimatedSection>
          
          <AnimatedSection className="max-w-3xl mx-auto">
            <motion.div 
              className="testimonial-card p-8 md:p-12 rounded-3xl border border-border/50 shadow-xl relative overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-full -translate-y-20 translate-x-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-400/10 to-primary/10 rounded-full translate-y-16 -translate-x-16" />
              
              <div className="flex justify-center mb-6 relative">
                {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              
              <motion.p 
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-2xl text-center mb-8 leading-relaxed relative"
              >
                "{testimonials[currentTestimonial]?.quote}"
              </motion.p>
              
              <motion.div 
                key={`author-${currentTestimonial}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center justify-center gap-4 relative"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {testimonials[currentTestimonial]?.author?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-lg">{testimonials[currentTestimonial]?.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial]?.role}</p>
                </div>
              </motion.div>
              
              <div className="flex justify-center gap-4 mt-10">
                <motion.button 
                  onClick={prevTestimonial} 
                  className="w-12 h-12 rounded-full border border-border bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`rounded-full transition-all ${i === currentTestimonial ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
                <motion.button 
                  onClick={nextTestimonial} 
                  className="w-12 h-12 rounded-full border border-border bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.1 }}
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
                className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg border border-border/50"
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <item.icon className="h-5 w-5 text-primary" strokeWidth={2} />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{faq.title}</h2>
            <p className="text-muted-foreground">{faq.subtitle}</p>
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
                    className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="hover:no-underline text-left font-semibold py-5">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
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
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-cyan-500" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <AnimatedSection>
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t('cta.title')}
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              {t('cta.subtitle')}
            </motion.p>
            <Link href="/register">
              <motion.div 
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.95 }}
                className="inline-block relative group"
              >
                <div className="absolute -inset-1 bg-white/30 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <Button size="lg" variant="secondary" className="relative h-14 px-10 text-lg font-semibold shadow-xl bg-white text-primary hover:bg-white/90">
                  {t('cta.button')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
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
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg">
                  <Globe className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <span className="font-heading font-bold text-xl">NomadSuite</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('footer.tagline')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.product')}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">{t('nav.features') || 'Features'}</a></li>
                <li><a href="#security" className="hover:text-primary transition-colors">{t('nav.security') || 'Security'}</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">{t('nav.howItWorks') || 'How It Works'}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.resources')}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-primary transition-colors">{t('footer.blog')}</Link></li>
                <li><Link href="/help" className="hover:text-primary transition-colors">{t('footer.helpCenter')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} NomadSuite. {t('footer.copyright')}</p>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>{t('footer.gdprNote')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400',
    green: 'from-green-500/20 to-green-600/20 text-green-600 dark:text-green-400',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-600 dark:text-purple-400',
    cyan: 'from-cyan-500/20 to-cyan-600/20 text-cyan-600 dark:text-cyan-400',
    orange: 'from-orange-500/20 to-orange-600/20 text-orange-600 dark:text-orange-400',
    indigo: 'from-indigo-500/20 to-indigo-600/20 text-indigo-600 dark:text-indigo-400',
    teal: 'from-teal-500/20 to-teal-600/20 text-teal-600 dark:text-teal-400',
    pink: 'from-pink-500/20 to-pink-600/20 text-pink-600 dark:text-pink-400',
    amber: 'from-amber-500/20 to-amber-600/20 text-amber-600 dark:text-amber-400',
    rose: 'from-rose-500/20 to-rose-600/20 text-rose-600 dark:text-rose-400',
    emerald: 'from-emerald-500/20 to-emerald-600/20 text-emerald-600 dark:text-emerald-400',
    slate: 'from-slate-500/20 to-slate-600/20 text-slate-600 dark:text-slate-400',
  };

  return (
    <motion.div 
      className="feature-card p-6 h-full rounded-2xl cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`feature-icon bg-gradient-to-br ${colorMap[color]} mb-5`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </motion.div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <motion.div 
      className="text-center group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="step-number w-16 h-16 rounded-2xl text-white flex items-center justify-center font-bold text-2xl mx-auto mb-5"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        {number}
      </motion.div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}
