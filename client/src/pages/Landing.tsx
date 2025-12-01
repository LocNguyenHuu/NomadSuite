import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { motion, useInView } from 'framer-motion';
import { 
  ArrowRight, Globe, Shield, FileText, Check, Plane, Users, X, 
  Lock, ChevronLeft, ChevronRight, Star, 
  CreditCard, FileCheck, Bell, Zap, BarChart3, 
  Receipt, FolderKanban, Calculator, Languages, ShieldCheck,
  KeyRound, Eye, Server, Award, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix = "" }: { value: number, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
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
  }, [isInView, value]);
  
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Landing() {
  const { t, language } = useLandingI18n();
  const faq = faqTranslations[language as LandingLanguage];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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
    }, 5000);
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
    "description": "NomadSuite is the all-in-one CRM, invoicing, and compliance platform for digital nomads. Manage clients, track tax residency, monitor visa deadlines, and send multi-currency invoices from anywhere in the world.",
    "sameAs": []
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "NomadSuite - Digital Nomad Business Platform",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "Comprehensive CRM, multi-currency invoicing, tax residency tracking, visa alerts, and GDPR-compliant document vault for freelancers and digital nomads.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "127"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="NomadSuite | Digital Nomad CRM, Invoicing & Compliance Platform"
        description="All-in-one platform for digital nomads: manage clients, send multi-currency invoices, track tax residency days, get visa alerts, and store documents securely. GDPR compliant with AES-256 encryption."
      />
      <StructuredData data={organizationSchema} id="schema-organization" />
      <StructuredData data={softwareSchema} id="schema-software" />
      
      {/* Navbar */}
      <nav className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <motion.div 
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="h-5 w-5 text-white" strokeWidth={2} />
              </motion.div>
              <span className="font-heading font-bold text-xl tracking-tight">NomadSuite</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.features') || 'Features'}</a>
            <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.security') || 'Security'}</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.howItWorks') || 'How It Works'}</a>
            <Link href="/help">
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{t('nav.help') || 'Help'}</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <PublicLanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">{t('nav.login')}</Button>
            </Link>
            <Link href="/register">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="sm" className="font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  {t('nav.signup')}
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <motion.div 
          className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.7, 0.5, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8"
            >
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('hero.badge')}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight mb-6"
            >
              {t('hero.title1')}
              <span className="gradient-text block mt-2">{t('hero.title2')}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all">
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                  </Button>
                </motion.div>
              </Link>
              <a href="#features">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold">
                    {t('hero.ctaSecondary')}
                  </Button>
                </motion.div>
              </a>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" strokeWidth={2.5} />
                <span>{t('hero.trust1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" strokeWidth={2.5} />
                <span>{t('hero.trustEncrypted')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" strokeWidth={2.5} />
                <span>{t('hero.trust3')}</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-violet-500/20 to-primary/20 rounded-3xl blur-2xl opacity-60" />
            <motion.img 
              src={heroImage} 
              alt="NomadSuite Dashboard - Digital Nomad CRM and Compliance Platform"
              className="relative rounded-2xl shadow-2xl border border-white/20 w-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedSection>
              <div className="text-3xl md:text-4xl font-bold font-heading gradient-text">
                <AnimatedCounter value={12} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{t('stats.features')}</div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="text-3xl md:text-4xl font-bold font-heading gradient-text">
                <AnimatedCounter value={50} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{t('stats.currencies')}</div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="text-3xl md:text-4xl font-bold font-heading gradient-text">
                <AnimatedCounter value={6} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{t('stats.languages')}</div>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <div className="text-3xl md:text-4xl font-bold font-heading gradient-text">AES-256</div>
              <div className="text-sm text-muted-foreground mt-1">{t('stats.encryption')}</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-background dark:from-slate-900/50 dark:to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('security.badge')}</span>
            </div>
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
                <Card className="p-6 h-full bg-background/50 backdrop-blur border-green-200/50 dark:border-green-800/30 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection delay={0.4}>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-lg shadow-sm border">
                <Award className="h-5 w-5 text-green-600" strokeWidth={2} />
                <span className="font-medium">{t('security.badgeGDPR')}</span>
              </div>
              <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-lg shadow-sm border">
                <Lock className="h-5 w-5 text-green-600" strokeWidth={2} />
                <span className="font-medium">{t('security.badgeEncrypted')}</span>
              </div>
              <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-lg shadow-sm border">
                <Server className="h-5 w-5 text-green-600" strokeWidth={2} />
                <span className="font-medium">{t('security.badgeEU')}</span>
              </div>
              <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-lg shadow-sm border">
                <CheckCircle2 className="h-5 w-5 text-green-600" strokeWidth={2} />
                <span className="font-medium">{t('security.badgeAudit')}</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Star className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('features.badge')}</span>
            </div>
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
      <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('howItWorks.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('howItWorks.title')} <span className="gradient-text">{t('howItWorks.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{t('howItWorks.subtitle')}</p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
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
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <X className="h-4 w-4" strokeWidth={2.5} />
                <span>{t('problems.badge')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                {t('problems.title')}
              </h2>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <motion.li 
                    key={num}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: num * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <span className="text-muted-foreground">{t(`problems.item${num}`)}</span>
                  </motion.li>
                ))}
              </ul>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Check className="h-4 w-4" strokeWidth={2.5} />
                <span>{t('solutions.badge')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                {t('solutions.title')}
              </h2>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <motion.li 
                    key={num}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: num * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 mt-0.5">
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
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('testimonials.title')} <span className="gradient-text">{t('testimonials.titleHighlight')}</span>
            </h2>
          </AnimatedSection>
          
          <AnimatedSection className="max-w-3xl mx-auto">
            <Card className="p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
              
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <motion.p 
                key={currentTestimonial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl md:text-2xl text-center mb-8 leading-relaxed"
              >
                "{testimonials[currentTestimonial]?.quote}"
              </motion.p>
              
              <motion.div 
                key={`author-${currentTestimonial}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold">
                  {testimonials[currentTestimonial]?.author?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold">{testimonials[currentTestimonial]?.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial]?.role}</p>
                </div>
              </motion.div>
              
              <div className="flex justify-center gap-4 mt-8">
                <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`h-2 rounded-full transition-all ${i === currentTestimonial ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'}`}
                    />
                  ))}
                </div>
                <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2} className="flex flex-wrap justify-center gap-6 mt-12 text-sm">
            <div className="flex items-center gap-2 bg-background px-4 py-2.5 rounded-lg shadow-sm">
              <Globe className="h-4 w-4 text-primary" strokeWidth={2} />
              <span>{t('testimonials.countries')}</span>
            </div>
            <div className="flex items-center gap-2 bg-background px-4 py-2.5 rounded-lg shadow-sm">
              <Shield className="h-4 w-4 text-primary" strokeWidth={2} />
              <span>{t('testimonials.gdpr')}</span>
            </div>
            <div className="flex items-center gap-2 bg-background px-4 py-2.5 rounded-lg shadow-sm">
              <Lock className="h-4 w-4 text-primary" strokeWidth={2} />
              <span>{t('testimonials.security')}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{faq.title}</h2>
            <p className="text-muted-foreground">{faq.subtitle}</p>
          </AnimatedSection>
          
          <AnimatedSection>
            <Accordion type="single" collapsible className="space-y-3">
              {faq.items.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="bg-muted/30 border-0 rounded-xl px-6"
                >
                  <AccordionTrigger className="hover:no-underline text-left font-semibold py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-violet-600 text-white relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMTJjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')" }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              {t('cta.subtitle')}
            </p>
            <Link href="/register">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold shadow-xl">
                  {t('cta.button')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <p className="mt-6 text-white/60 text-sm">{t('cta.note')}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Waitlist */}
      <WaitlistForm />

      {/* Feedback */}
      <FeedbackSection />

      {/* Footer */}
      <footer className="py-16 bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <span className="font-heading font-bold text-lg">NomadSuite</span>
              </div>
              <p className="text-sm text-muted-foreground">
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
              <Shield className="h-4 w-4 text-primary" />
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
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  };

  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300 border-border/50 group">
        <motion.div 
          className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center mb-4`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </motion.div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </Card>
    </motion.div>
  );
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="text-center group">
      <motion.div 
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg shadow-primary/25"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.2 }}
      >
        {number}
      </motion.div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
