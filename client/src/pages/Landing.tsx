import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  ArrowRight, Globe, Shield, FileText, Check, Plane, Users, X, 
  DollarSign, Lock, ChevronLeft, ChevronRight, Star, 
  CreditCard, FileCheck, Bell, Zap, BarChart3, 
  Receipt, FolderKanban, Calculator, Languages
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

const testimonials = [
  {
    quote: "Since using NomadSuite, I never worry about Schengen days again – and I have more time for work & travel.",
    author: "Alex Rodriguez",
    role: "Digital Nomad & UX Designer",
    rating: 5
  },
  {
    quote: "Finally one tool for clients + invoices + travel alerts. I used to juggle 4 different apps.",
    author: "Priya Kumar",
    role: "Freelance Developer",
    rating: 5
  },
  {
    quote: "The visa expiry alerts saved me from a costly mistake. Got notified 30 days before my work permit expired.",
    author: "Marcus Chen",
    role: "Remote Software Engineer",
    rating: 5
  },
  {
    quote: "Clean interface, accurate tracking, and it just works. I recommend it to all my clients.",
    author: "Sarah Williams",
    role: "International Tax Consultant",
    rating: 5
  },
  {
    quote: "Love the pipeline board for managing clients. Built specifically for freelancers on the move.",
    author: "João Silva",
    role: "Marketing Consultant",
    rating: 5
  },
  {
    quote: "Been using it for 8 months across 12 countries. The multi-currency invoicing alone paid for itself.",
    author: "Emma Thompson",
    role: "Content Strategist",
    rating: 5
  }
];

export default function Landing() {
  const { t, language } = useLandingI18n();
  const faq = faqTranslations[language as LandingLanguage];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NomadSuite",
    "url": "https://nomadsuite.io",
    "logo": "https://nomadsuite.io/logo.png",
    "description": "All-in-one platform for digital nomads: manage clients, track invoices, monitor tax residency days, and get visa expiry alerts."
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "NomadSuite",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "Comprehensive CRM, invoicing, and travel tracking platform for digital nomads."
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO />
      <StructuredData data={organizationSchema} id="schema-organization" />
      <StructuredData data={softwareSchema} id="schema-software" />
      
      {/* Navbar */}
      <nav className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <Globe className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">NomadSuite</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.features') || 'Features'}</a>
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
              <Button size="sm" className="font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                {t('nav.signup')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight mb-6">
              {t('hero.title1')}
              <span className="gradient-text block mt-2">{t('hero.title2')}</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5">
                  {t('hero.ctaPrimary')}
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold">
                  {t('hero.ctaSecondary')}
                </Button>
              </a>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" strokeWidth={2.5} />
                <span>{t('hero.trust1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" strokeWidth={2.5} />
                <span>{t('hero.trust2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" strokeWidth={2.5} />
                <span>{t('hero.trust3')}</span>
              </div>
            </div>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-violet-500/20 to-primary/20 rounded-3xl blur-2xl opacity-60" />
            <img 
              src={heroImage} 
              alt="NomadSuite Dashboard" 
              className="relative rounded-2xl shadow-2xl border border-white/20 w-full animate-float"
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold font-heading gradient-text">12+</div>
              <div className="text-sm text-muted-foreground mt-1">{t('stats.features')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-heading gradient-text">50+</div>
              <div className="text-sm text-muted-foreground mt-1">{t('stats.currencies')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-heading gradient-text">6</div>
              <div className="text-sm text-muted-foreground mt-1">{t('stats.languages')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-heading gradient-text">AES-256</div>
              <div className="text-sm text-muted-foreground mt-1">{t('stats.encryption')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Star className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('features.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              {t('features.title')} <span className="gradient-text">{t('features.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('howItWorks.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('howItWorks.title')} <span className="gradient-text">{t('howItWorks.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{t('howItWorks.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <StepCard number="1" title={t('howItWorks.step1Title')} desc={t('howItWorks.step1Desc')} />
            <StepCard number="2" title={t('howItWorks.step2Title')} desc={t('howItWorks.step2Desc')} />
            <StepCard number="3" title={t('howItWorks.step3Title')} desc={t('howItWorks.step3Desc')} />
            <StepCard number="4" title={t('howItWorks.step4Title')} desc={t('howItWorks.step4Desc')} />
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <X className="h-4 w-4" strokeWidth={2.5} />
                <span>{t('problems.badge')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                {t('problems.title')}
              </h2>
              <ul className="space-y-4">
                <ProblemItem text={t('problems.item1')} />
                <ProblemItem text={t('problems.item2')} />
                <ProblemItem text={t('problems.item3')} />
                <ProblemItem text={t('problems.item4')} />
                <ProblemItem text={t('problems.item5')} />
              </ul>
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Check className="h-4 w-4" strokeWidth={2.5} />
                <span>{t('solutions.badge')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                {t('solutions.title')}
              </h2>
              <ul className="space-y-4">
                <SolutionItem text={t('solutions.item1')} />
                <SolutionItem text={t('solutions.item2')} />
                <SolutionItem text={t('solutions.item3')} />
                <SolutionItem text={t('solutions.item4')} />
                <SolutionItem text={t('solutions.item5')} />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('testimonials.title')} <span className="gradient-text">{t('testimonials.titleHighlight')}</span>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
              
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-xl md:text-2xl text-center mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold">
                  {testimonials[currentTestimonial].author[0]}
                </div>
                <div>
                  <p className="font-semibold">{testimonials[currentTestimonial].author}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
              
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
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm">
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
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{faq.title}</h2>
            <p className="text-muted-foreground">{faq.subtitle}</p>
          </div>
          
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
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-violet-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMTJjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            {t('cta.subtitle')}
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold shadow-xl">
              {t('cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-6 text-white/60 text-sm">{t('cta.note')}</p>
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
    blue: 'bg-blue-500/10 text-blue-600',
    green: 'bg-green-500/10 text-green-600',
    purple: 'bg-purple-500/10 text-purple-600',
    cyan: 'bg-cyan-500/10 text-cyan-600',
    orange: 'bg-orange-500/10 text-orange-600',
    indigo: 'bg-indigo-500/10 text-indigo-600',
    teal: 'bg-teal-500/10 text-teal-600',
    pink: 'bg-pink-500/10 text-pink-600',
    amber: 'bg-amber-500/10 text-amber-600',
    rose: 'bg-rose-500/10 text-rose-600',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    slate: 'bg-slate-500/10 text-slate-600',
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 duration-300 group border-border/50">
      <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="text-center group">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
        {number}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function ProblemItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
        <X className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <span className="text-muted-foreground">{text}</span>
    </li>
  );
}

function SolutionItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <span>{text}</span>
    </li>
  );
}
