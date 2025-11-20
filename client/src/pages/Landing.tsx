import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Globe, Shield, Wallet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
// @ts-ignore
import heroImage from '@assets/generated_images/A_minimal,_modern_hero_illustration_for_a_digital_nomad_app._f04ea532.png';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-heading font-bold text-2xl text-primary">
            <Globe className="h-8 w-8" />
            <span>NomadOps</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Log In</Button>
            </Link>
            <Link href="/register">
              <Button className="font-medium">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight tracking-tight text-foreground">
              Your Freedom, <br />
              <span className="text-primary">Organized.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              The all-in-one operating system for freelancers and digital nomads. Track clients, invoices, and visas in one beautiful dashboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/app/dashboard">
                <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full">
                View Demo
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(64+i)}
                  </div>
                ))}
              </div>
              <p>Trusted by 2,000+ nomads</p>
            </div>
          </div>
          <div className="relative z-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl opacity-30 rounded-full" />
            <img 
              src={heroImage} 
              alt="Digital Nomad Workspace" 
              className="relative rounded-2xl shadow-2xl border border-white/20 w-full object-cover aspect-[4/3] hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">Everything you need to roam free</h2>
            <p className="text-muted-foreground text-lg">Stop worrying about tax residency and unpaid invoices. focus on your work and your travels.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Wallet}
              title="Smart Invoicing" 
              desc="Create multi-currency invoices in seconds. Automated follow-ups so you get paid while you sleep."
            />
            <FeatureCard 
              icon={Shield}
              title="Visa & Tax Tracker" 
              desc="Stay compliant with 183-day rule calculators and Schengen visa tracking alerts."
            />
            <FeatureCard 
              icon={FileText}
              title="Document Vault" 
              desc="Securely store passports, contracts, and insurance. Access them anywhere, anytime."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
            <Globe className="h-6 w-6" />
            <span>NomadOps</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 NomadOps Inc. Built for the world.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-3 font-heading">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
