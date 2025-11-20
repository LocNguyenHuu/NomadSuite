import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
// @ts-ignore
import heroImage from '@assets/generated_images/A_minimal,_modern_hero_illustration_for_a_digital_nomad_app._f04ea532.png';

export default function AuthPage() {
  const { loginMutation, registerMutation, user } = useAuth();
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
            <span>NomadOps</span>
          </div>
          <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your workspace.</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onSubmit={(data) => loginMutation.mutate(data)} isLoading={loginMutation.isPending} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onSubmit={(data) => registerMutation.mutate(data)} isLoading={registerMutation.isPending} />
          </TabsContent>
        </Tabs>
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

function LoginForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const { register, handleSubmit } = useForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username or Email</Label>
        <Input id="username" {...register('username', { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password', { required: true })} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log In'}
      </Button>
    </form>
  );
}

function RegisterForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const { register, handleSubmit } = useForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-username">Username</Label>
        <Input id="reg-username" {...register('username', { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register('name', { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email', { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <Input id="reg-password" type="password" {...register('password', { required: true })} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}
