import { Switch, Route } from "wouter";
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
import AuthPage from "@/pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={AuthPage} />
      <Route path="/register" component={AuthPage} />
      
      {/* App Routes */}
      <ProtectedRoute path="/app/dashboard" component={Dashboard} />
      <ProtectedRoute path="/app/clients" component={Clients} />
      <ProtectedRoute path="/app/invoices" component={Invoices} />
      <ProtectedRoute path="/app/travel" component={Travel} />
      <ProtectedRoute path="/app/documents" component={Documents} />
      <ProtectedRoute path="/app/settings" component={() => <div className="p-8">Settings (Coming Soon)</div>} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
