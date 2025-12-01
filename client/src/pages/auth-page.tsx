import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
// @ts-ignore
import heroImage from '@assets/generated_images/A_minimal,_modern_hero_illustration_for_a_digital_nomad_app._f04ea532.png';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthPage() {
  const { loginWithGoogle, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  React.useEffect(() => {
    if (user) {
      setLocation('/app/dashboard');
    }
  }, [user, setLocation]);
  
  if (user) {
    return null;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const csrfRes = await fetch('/api/csrf-token', { credentials: 'include' });
      const { csrfToken } = await csrfRes.json();

      const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
      const body = isLoginMode 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        window.location.href = '/app/dashboard';
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.message || 'Authentication failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="auth-page">
      {/* Left: Auth Form */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:max-w-xl bg-background">
        <div className="mb-8">
          <div className="flex items-center gap-2 font-heading font-bold text-2xl text-primary mb-8">
            <Globe className="h-8 w-8" />
            <span>NomadSuite</span>
          </div>
          <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">
            {showEmailForm ? (isLoginMode ? 'Sign in with email' : 'Create your account') : 'Welcome to NomadSuite'}
          </h1>
          <p className="text-muted-foreground">
            {showEmailForm 
              ? (isLoginMode ? 'Enter your credentials to continue' : 'Fill in your details to get started')
              : 'Manage your freelance business across borders with ease.'
            }
          </p>
        </div>

        {!showEmailForm ? (
          <div className="space-y-4">
            {/* Google Sign In */}
            <Button 
              onClick={loginWithGoogle} 
              variant="outline"
              className="w-full h-12 text-base gap-3 border-2 hover:bg-muted/50 transition-colors"
              disabled={isLoading}
              data-testid="button-google-login"
            >
              <GoogleIcon className="h-5 w-5" />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Email Sign In */}
            <Button 
              onClick={() => setShowEmailForm(true)} 
              variant="secondary"
              className="w-full h-12 text-base gap-3"
              data-testid="button-email-login"
            >
              <Mail className="h-5 w-5" />
              Continue with Email
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              By continuing, you agree to our{' '}
              <a href="/terms" className="underline hover:text-primary">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLoginMode}
                  data-testid="input-name"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base gap-2"
              disabled={formLoading}
              data-testid="button-submit-auth"
            >
              {formLoading ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Create Account')}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-sm text-primary hover:underline"
                data-testid="button-toggle-mode"
              >
                {isLoginMode ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  data-testid="button-back-to-options"
                >
                  ← Back to all options
                </button>
              </div>
            </div>
          </form>
        )}
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
