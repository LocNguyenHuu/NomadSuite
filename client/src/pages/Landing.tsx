import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Globe, Shield, Wallet, FileText, Check, Plane, Users, Calendar, X, MapPin, TrendingUp, DollarSign, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
// @ts-ignore
import heroImage from '@assets/generated_images/A_minimal,_modern_hero_illustration_for_a_digital_nomad_app._f04ea532.png';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-primary cursor-pointer">
              <Globe className="h-8 w-8" />
              <span>NomadSuite</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium" data-testid="button-login">Log In</Button>
            </Link>
            <Link href="/register">
              <Button className="font-medium" data-testid="button-get-started">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight text-foreground">
              Run your freelance business and global lifestyle—<span className="text-primary">effortlessly.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              NomadSuite gives you client CRM, invoices, travel & visa tracking, and tax-residency alerts—all from one web-app.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" data-testid="button-hero-cta">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full" data-testid="button-demo">
                See Demo
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Used in 40+ countries</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>256-bit encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Free trial, no card required</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl opacity-30 rounded-full" />
            <img 
              src={heroImage} 
              alt="NomadSuite Dashboard" 
              className="relative rounded-2xl shadow-2xl border border-white/20 w-full object-cover hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Section 2: The Pain & Why It Matters */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Your one-stop tool because generic CRMs and travel trackers aren't built for you.</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16 max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center shrink-0 mt-1">
                  <X className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">CRMs like Salesforce create more work than help.</h3>
                  <p className="text-sm text-muted-foreground">Bloated, expensive, built for sales teams—not solo freelancers.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center shrink-0 mt-1">
                  <X className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Tracking where you spend your days, when your visa expires and if you're suddenly tax resident is confusing.</h3>
                  <p className="text-sm text-muted-foreground">Spreadsheets don't cut it. Miss one detail and face compliance issues.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center shrink-0 mt-1">
                  <X className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Juggling clients in different countries, invoices in different currencies, and mobility rules drains your energy.</h3>
                  <p className="text-sm text-muted-foreground">Every country has different tax rules. You lose time and money trying to stay on top of it all.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Solution + Key Features */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Everything you need in one dashboard.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Manage your freelance business and global lifestyle without the stress.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <FeatureCard 
              icon={Users}
              title="Freelance CRM & Billing"
              desc="Manage clients, send invoices, track revenue."
              color="blue"
            />
            <FeatureCard 
              icon={Plane}
              title="Travel & Residency Tracker"
              desc="Log trips, auto-calculate days abroad, monitor tax-residency risk."
              color="purple"
            />
            <FeatureCard 
              icon={Shield}
              title="Visa & Document Vault"
              desc="Store passports, permits, contracts. Get automatic expiry reminders."
              color="teal"
            />
          </div>
          
          <div className="bg-muted/30 p-6 md:p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="font-bold mb-4 text-center">Plus these powerful features:</h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <FeatureItem text="Multi-currency invoicing" />
              <FeatureItem text="Schengen 90/180 day visualization" />
              <FeatureItem text="Client pipeline board (Kanban)" />
              <FeatureItem text="Exportable CSV/PDF reports" />
              <FeatureItem text="Mobile-responsive UI" />
              <FeatureItem text="Secure document storage" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Start in under 5 minutes</h2>
            <p className="text-muted-foreground">Simple setup, powerful results</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4 md:gap-6 relative max-w-6xl mx-auto">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border -z-10" />
            
            <WorkflowStep number="1" title="Sign up" desc="Quick setup wizard sets your nationality, home country, and primary currency." />
            <WorkflowStep number="2" title="Add your first client" desc="Minimal fields, hit save, you're tracking." />
            <WorkflowStep number="3" title="Log travel & trips" desc="Instantly see your days abroad counted and residency status updated." />
            <WorkflowStep number="4" title="Upload documents" desc="Get alerts when visas or passports are expiring." />
            <WorkflowStep number="5" title="Dashboard shows everything" desc="Relax or plan your next move." />
          </div>
        </div>
      </section>

      {/* Section 5: Insights & Charts */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Real numbers, real focus</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See your business and lifestyle in data. Know when a visa is at risk. Know when you'll hit tax-resident status. Know your revenue flows at a glance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ChartCard title="Days abroad this year" chart={<DaysAbroadChart />} />
            <ChartCard title="Clients by country" chart={<ClientsByCountryChart />} />
            <ChartCard title="Invoice status" chart={<InvoiceStatusChart />} />
          </div>
        </div>
      </section>

      {/* Section 6: Social Proof & Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Trusted by freelancers around the world</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <TestimonialCard 
              quote="Since using NomadSuite, I never worry about Schengen days again – and I have more time for work & travel."
              author="Alex R."
              role="Digital Nomad"
            />
            <TestimonialCard 
              quote="Finally one tool for clients + invoices + travel alerts. Huge time saver."
              author="Priya K."
              role="Freelance Developer"
            />
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Freelancers from 30+ countries</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>GDPR-Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span>Data encrypted at rest</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>100k+ secure documents stored</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Pricing */}
      <section className="py-16 md:py-24 bg-background" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Cancel anytime. No credit card for Free plan.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              name="Free" 
              price="€0" 
              features={[
                "Up to 5 clients",
                "Basic travel log",
                "Manual document uploads"
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
                "Residency tracker",
                "Invoicing",
                "Visa expiry alerts"
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
                "Multi-currency",
                "Exportable reports",
                "Priority support"
              ]} 
              cta="See Premium"
              variant="outline"
            />
          </div>
        </div>
      </section>

      {/* Section 8: FAQ */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">FAQ</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-card border rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">Is NomadSuite legal/tax advice?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No, our service gives informational tools only. Always consult a qualified tax professional or legal advisor for advice specific to your situation.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-card border rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">Which countries supported for travel/visa tracking?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                All countries supported; instant support for Schengen and major nomad-visas. We track your days in any location worldwide.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="bg-card border rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">How secure is my data?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                AES-256 encryption, secure hosting, GDPR-compliant. Your documents and personal data are protected with industry-leading security standards.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-card border rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">Can I cancel anytime?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes — downgrade or cancel within your account settings. No long-term contracts or cancellation fees.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary to-purple-600 text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">Ready to relax and run your business from anywhere?</h2>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join freelancers worldwide who've simplified their work and travel life with NomadSuite.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full shadow-2xl hover:scale-105 transition-transform" data-testid="button-final-cta">
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-background border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary mb-4">
                <Globe className="h-6 w-6" />
                <span>NomadSuite</span>
              </div>
              <p className="text-sm text-muted-foreground">Designed for freelancers & digital nomads. Work anywhere, worry less.</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} NomadSuite Inc. NomadSuite is a registered trademark.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-components
function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600',
    teal: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600'
  };
  
  return (
    <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow">
      <div className={`w-14 h-14 rounded-2xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-6`}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold mb-3 font-heading">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-primary shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function WorkflowStep({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="bg-card p-6 rounded-xl border shadow-sm relative z-10 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-bold mb-2 text-center">{title}</h3>
      <p className="text-sm text-muted-foreground text-center leading-relaxed">{desc}</p>
    </div>
  );
}

function ChartCard({ title, chart }: { title: string, chart: React.ReactNode }) {
  return (
    <Card className="p-6">
      <h3 className="font-bold mb-6 text-center">{title}</h3>
      <div className="h-48">
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
      <BarChart data={data}>
        <XAxis dataKey="country" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
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
          label={(entry) => entry.name}
          outerRadius={60}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
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
      <LineChart data={data}>
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="paid" stroke="hsl(var(--primary))" strokeWidth={2} />
        <Line type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow">
      <p className="text-lg mb-6 leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
          {author[0]}
        </div>
        <div>
          <p className="font-bold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </Card>
  );
}

function PricingCard({ name, price, period = "", features, cta, variant = "outline", popular }: { name: string, price: string, period?: string, features: string[], cta: string, variant?: "default" | "outline", popular?: boolean }) {
  return (
    <Card className={`p-8 relative flex flex-col hover:shadow-xl transition-shadow ${popular ? 'border-primary shadow-lg scale-105 z-10' : ''}`}>
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl md:text-5xl font-bold font-heading">{price}</span>
        <span className="text-muted-foreground">{period}</span>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feat, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
      <Link href="/register">
        <Button variant={variant} className="w-full" data-testid={`button-pricing-${name.toLowerCase()}`}>
          {cta}
        </Button>
      </Link>
    </Card>
  );
}
