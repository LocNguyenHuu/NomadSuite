import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Invoices from "@/pages/Invoices";
import Travel from "@/pages/Travel";
import Documents from "@/pages/Documents";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={() => <AuthPage mode="login" />} />
      <Route path="/register" component={() => <AuthPage mode="register" />} />
      
      {/* App Routes */}
      <Route path="/app/dashboard" component={Dashboard} />
      <Route path="/app/clients" component={Clients} />
      <Route path="/app/invoices" component={Invoices} />
      <Route path="/app/travel" component={Travel} />
      <Route path="/app/documents" component={Documents} />
      <Route path="/app/settings" component={() => <div className="p-8">Settings (Coming Soon)</div>} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

// Simple Auth Stub
function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-2xl shadow-xl border">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-heading font-bold">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h1>
          <p className="text-muted-foreground">Enter your credentials to continue</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="alex@nomad.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <Button className="w-full" onClick={() => setLocation('/app/dashboard')}>
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
