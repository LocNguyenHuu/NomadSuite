import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Globe, Shield, Wallet, FileText, Check, Plane, Users, Calendar, X, MapPin, TrendingUp, DollarSign, Lock, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { SEO, StructuredData } from '@/components/SEO';
// @ts-ignore
import heroImage from '@assets/generated_images/A_minimal,_modern_hero_illustration_for_a_digital_nomad_app._f04ea532.png';

const testimonials = [
  {
    quote: "Since using NomadSuite, I never worry about Schengen days again – and I have more time for work & travel. The residency calculator is a lifesaver.",
    author: "Alex Rodriguez",
    role: "Digital Nomad & UX Designer",
    rating: 5
  },
  {
    quote: "Finally one tool for clients + invoices + travel alerts. Huge time saver. I used to juggle 4 different apps, now it's all in one place.",
    author: "Priya Kumar",
    role: "Freelance Developer",
    rating: 5
  },
  {
    quote: "The visa expiry alerts saved me from a costly mistake. Got notified 30 days before my work permit expired. Worth every penny.",
    author: "Marcus Chen",
    role: "Remote Software Engineer",
    rating: 5
  },
  {
    quote: "As a tax consultant for digital nomads, I recommend NomadSuite to all my clients. Clean interface, accurate tracking, and it just works.",
    author: "Sarah Williams",
    role: "International Tax Consultant",
    rating: 5
  },
  {
    quote: "Love the pipeline board for managing clients. It's like Trello meets accounting software, built specifically for freelancers on the move.",
    author: "João Silva",
    role: "Freelance Marketing Consultant",
    rating: 5
  },
  {
    quote: "Been using it for 8 months across 12 countries. The multi-currency invoicing alone paid for itself. Highly recommend for any location-independent professional.",
    author: "Emma Thompson",
    role: "Content Strategist",
    rating: 5
  }
];

export default function Landing() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NomadSuite",
    "url": "https://nomadsuite.io",
    "logo": "https://nomadsuite.io/logo.png",
    "description": "All-in-one platform for digital nomads: manage clients, track invoices, monitor tax residency days, and get visa expiry alerts.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/nomadsuite",
      "https://linkedin.com/company/nomadsuite"
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "NomadSuite",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "0",
      "highPrice": "59",
      "offerCount": "3"
    },
    "operatingSystem": "Web",
    "description": "Comprehensive CRM, invoicing, and travel tracking platform for digital nomads and location-independent professionals.",
    "featureList": [
      "Client CRM & Pipeline Management",
      "Multi-currency Invoicing",
      "Tax Residency Tracker",
      "Visa Expiry Alerts",
      "Schengen 90/180 Calculator",
      "Secure Document Vault"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "127"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is NomadSuite legal or tax advice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, NomadSuite provides informational tools only. We help you track and organize your data, but we are not tax advisors or legal professionals. Always consult a qualified tax professional or legal advisor for advice specific to your situation and jurisdiction."
        }
      },
      {
        "@type": "Question",
        "name": "How does the 183-day tax residency tracker work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our residency tracker automatically counts the days you spend in each country based on your travel log entries. Many countries use the 183-day rule to determine tax residency—if you spend 183+ days in a country during a calendar year, you may become a tax resident there. NomadSuite shows you real-time counts and alerts you when approaching thresholds, but tax rules vary by country, so always verify with a tax professional."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Schengen 90/180 rule and how do you track it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Schengen 90/180 rule means you can stay in the Schengen Area for up to 90 days within any 180-day rolling period without a visa (for most nationalities). NomadSuite automatically calculates your remaining days by analyzing your travel entries and exit dates across all Schengen countries. We show you exactly how many days you have left and when your counter resets."
        }
      },
      {
        "@type": "Question",
        "name": "Which countries are supported for travel and visa tracking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All countries worldwide are supported. You can log trips to any location globally, and we'll track your days in each country. We have specialized calculators for Schengen area, US tax residency rules (substantial presence test), and major digital nomad visa programs."
        }
      },
      {
        "@type": "Question",
        "name": "How secure is my data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Security is our top priority. We use AES-256 encryption (the same standard used by banks and government institutions) for all data at rest. All data in transit is encrypted with TLS/SSL. We're fully GDPR-compliant, ISO 27001 certified, and undergo regular third-party security audits. Your documents, passport scans, and financial data are stored in secure, encrypted databases. We never sell your data to third parties."
        }
      },
      {
        "@type": "Question",
        "name": "Can I import existing client data and invoices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Pro and Premium users can import data via CSV upload. We support imports from popular tools like Excel, Google Sheets, and other CRMs. You can bulk-import clients, past invoices, and travel history. Our support team can also help with custom migration from other platforms if you're switching to NomadSuite."
        }
      },
      {
        "@type": "Question",
        "name": "Do you integrate with accounting software like QuickBooks or Xero?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Direct integrations with QuickBooks, Xero, and FreshBooks are on our roadmap and coming in Q2 2025. Currently, you can export invoices and financial reports as CSV or PDF files and import them into your accounting software manually. Premium plan users get API access to build custom integrations."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use NomadSuite if I work with a team or have employees?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! NomadSuite supports workspace collaboration. You can invite team members, assign roles (admin, user), and manage client relationships together. Each workspace member gets their own travel tracking and document vault, while sharing access to the client CRM and invoicing system. Team plans are available for workspaces with 3+ users."
        }
      },
      {
        "@type": "Question",
        "name": "What happens to my data if I cancel my subscription?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You keep full access to your data even after canceling. You can export all your information (clients, invoices, travel logs, documents) as CSV/PDF files at any time. We retain your data for 90 days after cancellation in case you want to reactivate. After 90 days, data is permanently deleted from our servers unless you request an extension."
        }
      },
      {
        "@type": "Question",
        "name": "Can I cancel anytime? Are there long-term contracts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can cancel anytime with a single click in your account settings. We offer monthly billing with no long-term contracts or commitments. There are no cancellation fees, and you can downgrade from Premium → Pro → Free at any time. Annual plans (with 2 months free) are available if you prefer to pay yearly, but even those can be canceled with a prorated refund."
        }
      },
      {
        "@type": "Question",
        "name": "How do visa expiry alerts work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When you upload visa documents, work permits, or residency cards, our AI scans them and automatically extracts expiry dates. You'll receive email and in-app notifications 90 days, 30 days, and 7 days before any document expires. You can also set custom reminder schedules. This ensures you never miss a renewal deadline and avoid potential legal issues."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a mobile app?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently, NomadSuite is a web application that works perfectly on mobile browsers (fully responsive design). Native iOS and Android apps are in development and scheduled for launch in Q3 2025. You can add the web app to your home screen on iPhone/Android for an app-like experience. Push notifications for visa alerts and invoice reminders are already supported on mobile web."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO />
      <StructuredData data={organizationSchema} id="schema-organization" />
      <StructuredData data={softwareSchema} id="schema-software" />
      <StructuredData data={faqSchema} id="schema-faq" />
      
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-1.5 sm:gap-2 font-heading font-bold text-xl sm:text-2xl text-primary cursor-pointer hover:opacity-80 transition-opacity">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">NomadSuite</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="nav-features">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="nav-pricing">
              Pricing
            </a>
            <Link href="/help">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="nav-help">
                Help
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium hover:bg-primary/5 text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4" data-testid="button-login">Log In</Button>
            </Link>
            <Link href="/register">
              <Button className="font-medium shadow-md hover:shadow-lg transition-all text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4" data-testid="button-get-started">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="relative pt-12 sm:pt-16 md:pt-28 pb-16 sm:pb-20 md:pb-36 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:32px_32px]" />
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center relative z-10">
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-block">
              <div className="bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                ✨ Trusted by 10,000+ digital nomads
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-[1.1] tracking-tight text-foreground">
              Run your freelance business and global lifestyle—
              <span className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent animate-gradient">
                effortlessly
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-lg leading-relaxed font-light">
              Client CRM, invoices, travel & visa tracking, and tax-residency alerts—all from one powerful web-app.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-purple-600" data-testid="button-hero-cta">
                  Start Free Trial <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-full border-2 hover:bg-primary/5" data-testid="button-demo">
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 text-xs sm:text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2 bg-muted/50 px-3 sm:px-4 py-2 rounded-lg">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm">40+ countries</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 sm:px-4 py-2 rounded-lg">
                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm">Bank-level encryption</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 sm:px-4 py-2 rounded-lg">
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm">No credit card</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-0 animate-in fade-in slide-in-from-right duration-700 delay-300 mt-8 lg:mt-0">
            <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-3xl opacity-40 rounded-full animate-pulse" />
            <img 
              src={heroImage} 
              alt="NomadSuite Dashboard showing client management, invoicing, and travel tracking features" 
              className="relative rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full object-cover hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Section 2: The Pain & Why It Matters */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">
              Your one-stop tool because generic CRMs aren't built for <span className="text-primary">nomads</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-light">
              Stop juggling multiple tools, spreadsheets, and anxiety about compliance.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <PainCard 
              title="Bloated CRMs create more work"
              desc="Tools like Salesforce are built for sales teams with 100+ people, not solo freelancers. You need simple, not enterprise."
            />
            <PainCard 
              title="Compliance is a nightmare"
              desc="Tracking visa expiry dates, tax residency days, and Schengen 90/180 rules manually is error-prone and stressful."
            />
            <PainCard 
              title="Billing across borders is chaos"
              desc="Different currencies, tax rules, and payment methods make invoicing clients a time-consuming mess."
            />
          </div>
        </div>
      </section>

      {/* Section 3: Solution + Key Features */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 sm:mb-6">
              Everything you need in <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">one dashboard</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light px-4">
              Designed specifically for location-independent professionals who need to stay compliant while staying mobile.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16">
            <FeatureCard 
              icon={Users}
              title="Freelance CRM & Billing"
              desc="Manage clients with a visual pipeline board, send professional invoices, and track revenue—all in one place."
              color="blue"
            />
            <FeatureCard 
              icon={Plane}
              title="Travel & Residency Tracker"
              desc="Automatically calculate days abroad, get alerts for tax residency thresholds, and stay compliant with visa rules."
              color="purple"
            />
            <FeatureCard 
              icon={Shield}
              title="Visa & Document Vault"
              desc="Securely store passports, permits, and contracts. AI reads expiry dates and sends automatic reminders."
              color="teal"
            />
          </div>
          
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 p-8 md:p-10 rounded-3xl max-w-5xl mx-auto shadow-lg">
            <h3 className="font-bold text-lg mb-6 text-center">Plus these powerful features:</h3>
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-4">
              <FeatureItem text="Multi-currency invoicing" />
              <FeatureItem text="Schengen 90/180 calculator" />
              <FeatureItem text="Client pipeline board (Kanban)" />
              <FeatureItem text="Exportable CSV/PDF reports" />
              <FeatureItem text="Mobile-responsive interface" />
              <FeatureItem text="Bank-level security (AES-256)" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Start in under 5 minutes</h2>
            <p className="text-xl text-muted-foreground font-light">Simple setup, powerful results—no technical skills required</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6 relative max-w-6xl mx-auto">
            <div className="hidden md:block absolute top-14 left-[10%] right-[10%] h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -z-10 rounded-full" />
            
            <WorkflowStep number="1" title="Sign up" desc="Quick setup wizard sets your nationality, home country, and primary currency in 60 seconds." />
            <WorkflowStep number="2" title="Add clients" desc="Import existing contacts or create new ones with minimal required fields." />
            <WorkflowStep number="3" title="Log travel" desc="Instantly see your days abroad counted and residency status updated in real-time." />
            <WorkflowStep number="4" title="Upload docs" desc="AI reads dates from passports and visas, setting up automatic expiry alerts." />
            <WorkflowStep number="5" title="Stay compliant" desc="Dashboard shows your complete status at a glance. Relax and focus on your work." />
          </div>
        </div>
      </section>

      {/* Section 5: Insights & Charts */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Real numbers, <span className="text-primary">real insights</span></h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              See your business and lifestyle in data. Know when a visa is at risk. Know when you'll hit tax-resident status. Know your revenue flows at a glance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ChartCard 
              title="Days abroad this year" 
              subtitle="Track your time in each country"
              chart={<DaysAbroadChart />} 
            />
            <ChartCard 
              title="Clients by country" 
              subtitle="Geographic distribution of your client base"
              chart={<ClientsByCountryChart />} 
            />
            <ChartCard 
              title="Invoice status trends" 
              subtitle="Payment performance over time"
              chart={<InvoiceStatusChart />} 
            />
          </div>
        </div>
      </section>

      {/* Section 6: Social Proof & Testimonials Carousel */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Trusted by professionals worldwide</h2>
            <p className="text-xl text-muted-foreground font-light">Join thousands of digital nomads who've simplified their work-life</p>
          </div>
          
          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full translate-x-20 translate-y-20" />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                
                <div className="transition-all duration-500 ease-in-out">
                  <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-center">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {testimonials[currentTestimonial].author[0]}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg">{testimonials[currentTestimonial].author}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={prevTestimonial}
                  className="rounded-full hover:bg-primary/10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentTestimonial ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={nextTestimonial}
                  className="rounded-full hover:bg-primary/10"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-lg shadow-sm">
              <Globe className="h-5 w-5 text-primary" />
              <span>Freelancers from 30+ countries</span>
            </div>
            <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-lg shadow-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span>GDPR-Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-lg shadow-sm">
              <Lock className="h-5 w-5 text-primary" />
              <span>Data encrypted at rest</span>
            </div>
            <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-lg shadow-sm">
              <FileText className="h-5 w-5 text-primary" />
              <span>100k+ secure documents</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Pricing */}
      <section className="py-20 md:py-28 bg-background" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground font-light">No hidden fees. Cancel anytime. No credit card for Free plan.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              name="Free" 
              price="€0" 
              features={[
                "Up to 5 clients",
                "Basic travel log",
                "Manual document uploads",
                "Community support"
              ]} 
              cta="Start Free"
              variant="outline"
            />
            <PricingCard 
              name="Pro" 
              price="€29" 
              period="/month"
              features={[
                "Unlimited clients",
                "Residency calculator",
                "Professional invoicing",
                "Visa expiry alerts",
                "Email support"
              ]} 
              cta="Upgrade to Pro"
              variant="default"
              popular
            />
            <PricingCard 
              name="Premium" 
              price="€59" 
              period="/month"
              features={[
                "Everything in Pro",
                "Multi-currency support",
                "Exportable tax reports",
                "Priority support",
                "API access"
              ]} 
              cta="Get Premium"
              variant="outline"
            />
          </div>
        </div>
      </section>

      {/* Section 8: FAQ */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Frequently asked questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about NomadSuite</p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                Is NomadSuite legal or tax advice?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                No, NomadSuite provides informational tools only. We help you track and organize your data, but we are not tax advisors or legal professionals. Always consult a qualified tax professional or legal advisor for advice specific to your situation and jurisdiction.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                How does the 183-day tax residency tracker work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Our residency tracker automatically counts the days you spend in each country based on your travel log entries. Many countries use the 183-day rule to determine tax residency—if you spend 183+ days in a country during a calendar year, you may become a tax resident there. NomadSuite shows you real-time counts and alerts you when approaching thresholds, but tax rules vary by country, so always verify with a tax professional.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                What is the Schengen 90/180 rule and how do you track it?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                The Schengen 90/180 rule means you can stay in the Schengen Area for up to 90 days within any 180-day rolling period without a visa (for most nationalities). NomadSuite automatically calculates your remaining days by analyzing your travel entries and exit dates across all Schengen countries (Austria, Belgium, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, and Switzerland). We show you exactly how many days you have left and when your counter resets.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                Which countries are supported for travel and visa tracking?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                All countries worldwide are supported. You can log trips to any location globally, and we'll track your days in each country. We have specialized calculators for Schengen area, US tax residency rules (substantial presence test), and major digital nomad visa programs (Portugal D7, Spain digital nomad visa, Estonia e-Residency, etc.).
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                How secure is my data?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Security is our top priority. We use AES-256 encryption (the same standard used by banks and government institutions) for all data at rest. All data in transit is encrypted with TLS/SSL. We're fully GDPR-compliant, ISO 27001 certified, and undergo regular third-party security audits. Your documents, passport scans, and financial data are stored in secure, encrypted databases. We never sell your data to third parties.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                Can I import existing client data and invoices?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes! Pro and Premium users can import data via CSV upload. We support imports from popular tools like Excel, Google Sheets, and other CRMs. You can bulk-import clients, past invoices, and travel history. Our support team can also help with custom migration from other platforms if you're switching to NomadSuite.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                Do you integrate with accounting software like QuickBooks or Xero?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Direct integrations with QuickBooks, Xero, and FreshBooks are on our roadmap and coming in Q2 2025. Currently, you can export invoices and financial reports as CSV or PDF files and import them into your accounting software manually. Premium plan users get API access to build custom integrations.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                Can I use NomadSuite if I work with a team or have employees?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes! NomadSuite supports workspace collaboration. You can invite team members, assign roles (admin, user), and manage client relationships together. Each workspace member gets their own travel tracking and document vault, while sharing access to the client CRM and invoicing system. Team plans are available for workspaces with 3+ users.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                What happens to my data if I cancel my subscription?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                You keep full access to your data even after canceling. You can export all your information (clients, invoices, travel logs, documents) as CSV/PDF files at any time. We retain your data for 90 days after cancellation in case you want to reactivate. After 90 days, data is permanently deleted from our servers unless you request an extension.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                Can I cancel anytime? Are there long-term contracts?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes, you can cancel anytime with a single click in your account settings. We offer monthly billing with no long-term contracts or commitments. There are no cancellation fees, and you can downgrade from Premium → Pro → Free at any time. Annual plans (with 2 months free) are available if you prefer to pay yearly, but even those can be canceled with a prorated refund.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-11" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                How do visa expiry alerts work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                When you upload visa documents, work permits, or residency cards, our AI scans them and automatically extracts expiry dates. You'll receive email and in-app notifications 90 days, 30 days, and 7 days before any document expires. You can also set custom reminder schedules. This ensures you never miss a renewal deadline and avoid potential legal issues.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-12" className="bg-background border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                Is there a mobile app?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Currently, NomadSuite is a web application that works perfectly on mobile browsers (fully responsive design). Native iOS and Android apps are in development and scheduled for launch in Q3 2025. You can add the web app to your home screen on iPhone/Android for an app-like experience. Push notifications for visa alerts and invoice reminders are already supported on mobile web.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="py-24 md:py-36 bg-gradient-to-br from-primary via-primary to-purple-600 text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
            Ready to organize your freedom?
          </h2>
          <p className="text-primary-foreground/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Join thousands of digital nomads who've simplified their work and travel life with NomadSuite.
          </p>
          <Link href="/register">
            <Button 
              size="lg" 
              variant="secondary" 
              className="h-16 px-12 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform font-semibold" 
              data-testid="button-final-cta"
            >
              Start Free Today
            </Button>
          </Link>
          <p className="mt-6 text-primary-foreground/70 text-sm">No credit card required • 5-minute setup • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-20 bg-background border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 font-heading font-bold text-xl mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">NomadSuite</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Designed for freelancers & digital nomads. Work anywhere, worry less.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} NomadSuite Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Built with ❤️ for digital nomads</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-components
function PainCard({ title, desc }: { title: string, desc: string }) {
  return (
    <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 duration-300 border-border/50">
      <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center mb-6">
        <X className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-4 font-heading">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600',
    teal: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600'
  };
  
  return (
    <Card className="p-8 md:p-10 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 border-border/50 group">
      <div className={`w-16 h-16 rounded-3xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold mb-4 font-heading">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg font-light">{desc}</p>
    </Card>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="h-5 w-5 text-primary shrink-0" />
      <span className="font-medium">{text}</span>
    </div>
  );
}

function WorkflowStep({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <Card className="p-8 relative z-10 hover:shadow-xl transition-all hover:-translate-y-2 duration-300 border-border/50 group">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
        {number}
      </div>
      <h3 className="font-bold text-lg mb-3 text-center">{title}</h3>
      <p className="text-sm text-muted-foreground text-center leading-relaxed">{desc}</p>
    </Card>
  );
}

function ChartCard({ title, subtitle, chart }: { title: string, subtitle: string, chart: React.ReactNode }) {
  return (
    <Card className="p-8 hover:shadow-xl transition-all duration-300 border-border/50">
      <div className="mb-6">
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="h-56">
        {chart}
      </div>
    </Card>
  );
}

function DaysAbroadChart() {
  const data = [
    { country: 'Portugal', days: 45 },
    { country: 'Spain', days: 32 },
    { country: 'Thailand', days: 28 },
    { country: 'Mexico', days: 18 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <XAxis dataKey="country" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '14px'
          }} 
        />
        <Bar dataKey="days" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ClientsByCountryChart() {
  const data = [
    { name: 'USA', value: 35 },
    { name: 'UK', value: 25 },
    { name: 'Germany', value: 20 },
    { name: 'Other', value: 20 },
  ];
  
  const COLORS = ['hsl(var(--primary))', '#8884d8', '#82ca9d', '#ffc658'];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => `${entry.name}: ${entry.value}%`}
          outerRadius={70}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '14px'
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function InvoiceStatusChart() {
  const data = [
    { month: 'Jan', paid: 12, overdue: 3 },
    { month: 'Feb', paid: 15, overdue: 2 },
    { month: 'Mar', paid: 18, overdue: 1 },
    { month: 'Apr', paid: 20, overdue: 1 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '14px'
          }} 
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line type="monotone" dataKey="paid" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function PricingCard({ name, price, period = "", features, cta, variant = "outline", popular }: { name: string, price: string, period?: string, features: string[], cta: string, variant?: "default" | "outline", popular?: boolean }) {
  return (
    <Card className={`p-10 relative flex flex-col hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${popular ? 'border-primary border-2 shadow-xl scale-105 z-10' : 'border-border/50'}`}>
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-5xl md:text-6xl font-bold font-heading bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{price}</span>
        <span className="text-muted-foreground text-lg">{period}</span>
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((feat, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span className="font-medium">{feat}</span>
          </li>
        ))}
      </ul>
      <Link href="/register">
        <Button 
          variant={variant} 
          className={`w-full h-12 text-lg font-semibold ${popular ? 'shadow-lg' : ''}`}
          data-testid={`button-pricing-${name.toLowerCase()}`}
        >
          {cta}
        </Button>
      </Link>
    </Card>
  );
}
