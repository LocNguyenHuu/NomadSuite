import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Globe, LogIn } from 'lucide-react';
import { useLocation } from 'wouter';
// @ts-ignore
import heroImage from '@assets/generated_images/A_minimal,_modern_hero_illustration_for_a_digital_nomad_app._f04ea532.png';

export default function AuthPage() {
  const { login, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  React.useEffect(() => {
    if (user) {
      setLocation('/app/dashboard');
    }
  }, [user, setLocation]);
  
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Auth Form */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:max-w-xl bg-background">
        <div className="mb-8">
          <div className="flex items-center gap-2 font-heading font-bold text-2xl text-primary mb-8">
            <Globe className="h-8 w-8" />
            <span>NomadSuite</span>
          </div>
          <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">Welcome to NomadSuite</h1>
          <p className="text-muted-foreground">Sign in with your Google, GitHub, X, Apple, or email account to get started.</p>
        </div>

        <div className="space-y-6">
          <Button 
            onClick={login} 
            className="w-full h-12 text-lg gap-3"
            disabled={isLoading}
          >
            <LogIn className="h-5 w-5" />
            {isLoading ? 'Loading...' : 'Sign In / Sign Up'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Supports Google, GitHub, X (Twitter), Apple, and email login
            </p>
          </div>
        </div>
      </div>

      {/* Right: Hero */}
      <div className="hidden lg:flex flex-1 bg-muted relative overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 bg-primary/10 z-0" />
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl opacity-30" />
        
        <div className="relative z-10 max-w-lg text-center">
          <img 
            src={heroImage} 
            alt="Digital Nomad Workspace" 
            className="rounded-2xl shadow-2xl border border-white/20 w-full mb-8 hover:scale-[1.02] transition-transform duration-700"
          />
          <h2 className="text-3xl font-heading font-bold mb-4">Your Freedom, Organized.</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of freelancers managing their clients, invoices, and visas in one beautiful dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
