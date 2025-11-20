import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Globe, Shield, Wallet, FileText, Check, Plane, Users, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// @ts-ignore
import heroImage from '@assets/generated_images/A_minimal,_modern_hero_illustration_for_a_digital_nomad_app._f04ea532.png';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. Navbar */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-heading font-bold text-2xl text-primary">
            <Globe className="h-8 w-8" />
            <span>NomadSuite</span>
          </div>
          <div className="w-full flex items-center justify-between">
            <h1 className="font-heading text-lg font-semibold md:hidden">NomadSuite</h1>
            <div className="ml-auto flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">Log In</Button>
              </Link>
              <Link href="/register">
                <Button className="font-medium">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight tracking-tight text-foreground">
              Run your freelance business and your <br />
              <span className="text-primary">global lifestyle</span> — simplified.
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              CRM, invoicing, travel residency & visa tracking all in one web-app built for nomads.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative z-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl opacity-30 rounded-full" />
            <img 
              src={heroImage} 
              alt="Digital Nomad Dashboard" 
              className="relative rounded-2xl shadow-2xl border border-white/20 w-full object-cover hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* 3. Problem & Pain Points */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl font-heading font-bold">Stop juggling spreadsheets and anxiety</h2>
            <p className="text-xl text-muted-foreground">
              You’re a freelancer or digital nomad. Generic CRMs are too bulky. Tracking days abroad, visas and tax status is confusing. You waste time, miss deadlines, and risk compliance issues.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <PainPointCard 
              title="Bloated Tools"
              desc="Too many CRMs built for large sales teams, not solo operators."
            />
            <PainPointCard 
              title="Compliance Nightmares"
              desc="Keeping track of where you’re tax resident, visas expiring, flights logged is impossible."
            />
            <PainPointCard 
              title="Billing Chaos"
              desc="Billing clients across borders, handling different currencies & tax rules = stress."
            />
          </div>
        </div>
      </section>

      {/* 4. Solution + Key Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-heading font-bold leading-tight">
                Meet <span className="text-primary">NomadSuite</span> — the OS for your freedom.
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need in one place: clients, projects, travel logs, visa alerts, invoices. Designed specifically for freelancers who live and work anywhere.
              </p>
              <div className="space-y-4">
                <FeatureItem icon={Users} text="Lightweight CRM & client pipeline" />
                <FeatureItem icon={Wallet} text="Invoicing + payments (multi-currency)" />
                <FeatureItem icon={Plane} text="Travel log & residency calculator (183-day rule)" />
                <FeatureItem icon={Shield} text="Visa & permit tracker with alerts" />
                <FeatureItem icon={FileText} text="Secure document vault + AI metadata extraction" />
              </div>
            </div>
            <div className="relative">
               {/* Placeholder for a feature grid or abstract visual */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-primary/5 p-6 rounded-2xl aspect-square flex flex-col justify-center items-center text-center">
                   <Users className="h-10 w-10 text-primary mb-4" />
                   <h3 className="font-bold">CRM</h3>
                 </div>
                 <div className="bg-primary/10 p-6 rounded-2xl aspect-square flex flex-col justify-center items-center text-center mt-8">
                   <Plane className="h-10 w-10 text-primary mb-4" />
                   <h3 className="font-bold">Travel</h3>
                 </div>
                 <div className="bg-primary/10 p-6 rounded-2xl aspect-square flex flex-col justify-center items-center text-center -mt-8">
                   <Wallet className="h-10 w-10 text-primary mb-4" />
                   <h3 className="font-bold">Invoices</h3>
                 </div>
                 <div className="bg-primary/5 p-6 rounded-2xl aspect-square flex flex-col justify-center items-center text-center">
                   <Shield className="h-10 w-10 text-primary mb-4" />
                   <h3 className="font-bold">Visas</h3>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works / Workflow */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold">How it works</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border -z-10" />
            
            <StepCard number="1" title="Sign Up" desc="Profile wizard sets your nationality & currency." />
            <StepCard number="2" title="Add Clients" desc="Create invoices in minutes." />
            <StepCard number="3" title="Log Travel" desc="Log trips & see residency status." />
            <StepCard number="4" title="Upload Docs" desc="Get alerted ahead of visa deadlines." />
            <StepCard number="5" title="Relax" desc="Dashboard shows your status in one glance." />
          </div>
        </div>
      </section>

      {/* 6. Benefits */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-12">Why it matters</h2>
          <div className="grid md:grid-cols-3 gap-8">
             <BenefitCard title="Stay Compliant" desc="Stay compliant while you roam. Know your tax-residency risk before it becomes a problem." />
             <BenefitCard title="Save Time" desc="Spend less time on admin, more on work or travel. No bulky CRM, no separate spreadsheets." />
             <BenefitCard title="Global Billing" desc="Bill clients anywhere from one tool. Multi-currency support built-in." />
          </div>
        </div>
      </section>

      {/* 7. Feature Deep-Dives */}
      <section className="py-24 bg-muted/30 space-y-32">
        <DeepDive 
          title="CRM & Invoicing"
          desc="Manage your clients, proposals and billing from one place."
          points={["Client Pipeline Board", "Professional PDF Invoices", "Payment Status Tracking"]}
          reversed={false}
          icon={Wallet}
        />
        <DeepDive 
          title="Travel & Residency Tracking"
          desc="Log your trips, see where you stand on 183-day & Schengen rules."
          points={["Automatic Day Counting", "Schengen 90/180 Calculator", "Tax Residency Warnings"]}
          reversed={true}
          icon={Plane}
        />
        <DeepDive 
          title="Visa & Document Vault"
          desc="Upload passports, visas, contracts. AI reads dates, reminders sent automatically."
          points={["Secure Encrypted Storage", "AI Metadata Extraction", "Expiry Alerts"]}
          reversed={false}
          icon={Shield}
        />
      </section>

      {/* 8. Social Proof */}
      <section className="py-24 bg-background border-y">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
             <div className="flex -space-x-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full bg-muted border-4 border-background flex items-center justify-center font-bold">
                    {String.fromCharCode(64+i)}
                  </div>
                ))}
             </div>
          </div>
          <h2 className="text-2xl font-heading font-bold mb-8">"Since I started using NomadSuite I finally know how many days I’ve spent in Europe — peace of mind!"</h2>
          <p className="font-bold text-primary">— Jane D., Digital Nomad</p>
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-muted-foreground font-medium">
             <span>Used by freelancers from 30+ countries</span>
             <span>•</span>
             <span>Secure & GDPR-compliant</span>
             <span>•</span>
             <span>256-bit encryption</span>
          </div>
        </div>
      </section>

      {/* 9. Pricing */}
      <section className="py-24 bg-muted/30" id="pricing">
         <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading font-bold">Simple, transparent pricing</h2>
              <p className="text-muted-foreground mt-2">Cancel anytime.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               <PricingCard 
                 name="Free" 
                 price="$0" 
                 features={["5 Clients", "Basic Invoicing", "Manual Travel Log"]} 
                 cta="Start Free"
                 variant="outline"
               />
               <PricingCard 
                 name="Pro" 
                 price="$19" 
                 period="/mo"
                 features={["Unlimited Clients", "Residency Calculator", "Visa Alerts", "AI Document Scan"]} 
                 cta="Upgrade to Pro"
                 variant="default"
                 popular
               />
               <PricingCard 
                 name="Premium" 
                 price="$49" 
                 period="/mo"
                 features={["Everything in Pro", "Tax Report Export", "Priority Support", "Multiple Currencies"]} 
                 cta="Get Premium"
                 variant="outline"
               />
            </div>
         </div>
      </section>

      {/* 10. FAQ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is this tool legal/tax advice?</AccordionTrigger>
              <AccordionContent>No, NomadSuite provides informational tools only. Always consult a qualified professional for legal and tax advice.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What happens if I have clients in different countries?</AccordionTrigger>
              <AccordionContent>You can manage clients globally and issue invoices in different currencies. We handle the organization for you.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How secure is my data?</AccordionTrigger>
              <AccordionContent>We use industry-standard 256-bit encryption for all stored documents and secure connections for all data transmission.</AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Do you integrate with Stripe?</AccordionTrigger>
              <AccordionContent>Direct payment integrations are on our roadmap and coming soon!</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="py-32 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-heading font-bold mb-6">Ready to organize your freedom?</h2>
          <p className="text-primary-foreground/80 text-xl mb-10 max-w-2xl mx-auto">
            Get started in under 2 minutes. No credit card required.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full shadow-2xl">
              Try NomadSuite Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
            <Globe className="h-6 w-6" />
            <span>NomadSuite</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 NomadSuite Inc. Built for the world.</p>
        </div>
      </footer>
    </div>
  );
}

// Sub-components
function PainPointCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-card p-8 rounded-2xl border shadow-sm">
      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <X className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-bold mb-3 font-heading">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}

function FeatureItem({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="bg-card p-6 rounded-xl border shadow-sm text-center relative z-10">
      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function BenefitCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6">
      <div className="w-12 h-1 bg-primary mx-auto mb-6 rounded-full" />
      <h3 className="text-xl font-bold mb-3 font-heading">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function DeepDive({ title, desc, points, reversed, icon: Icon }: { title: string, desc: string, points: string[], reversed: boolean, icon: any }) {
  return (
    <div className="container mx-auto px-6">
      <div className={`flex flex-col lg:flex-row items-center gap-16 ${reversed ? 'lg:flex-row-reverse' : ''}`}>
        <div className="flex-1 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
            <Icon className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-heading font-bold">{title}</h2>
          <p className="text-xl text-muted-foreground">{desc}</p>
          <ul className="space-y-3 pt-4">
            {points.map((point, i) => (
              <li key={i} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span className="font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 w-full">
           <div className="bg-card border shadow-xl rounded-2xl aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
              <span className="text-muted-foreground font-medium">App Screenshot: {title}</span>
           </div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ name, price, period = "", features, cta, variant = "outline", popular }: { name: string, price: string, period?: string, features: string[], cta: string, variant?: "default" | "outline", popular?: boolean }) {
  return (
    <div className={`bg-card p-8 rounded-2xl border shadow-sm relative flex flex-col ${popular ? 'border-primary shadow-lg scale-105 z-10' : ''}`}>
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-bold font-heading">{price}</span>
        <span className="text-muted-foreground">{period}</span>
      </div>
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feat, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
      <Button variant={variant} className="w-full">{cta}</Button>
    </div>
  );
}
