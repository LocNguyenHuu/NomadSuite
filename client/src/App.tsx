import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Blog from "@/pages/Blog";
import Help from "@/pages/Help";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import ClientDetail from "@/pages/ClientDetail";
import Invoices from "@/pages/Invoices";
import Travel from "@/pages/Travel";
import Documents from "@/pages/Documents";
import AuthPage from "@/pages/auth-page";
import Settings from "@/pages/Settings";
import AdminDashboard from "@/pages/AdminDashboard";
import Users from "@/pages/Users";
import WorkspaceSettings from "@/pages/WorkspaceSettings";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminRoute } from "@/lib/admin-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/blog" component={Blog} />
      <Route path="/help" component={Help} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/login" component={AuthPage} />
      <Route path="/register" component={AuthPage} />
      
      {/* App Routes */}
      <ProtectedRoute path="/app/dashboard" component={Dashboard} />
      <ProtectedRoute path="/app/clients" component={Clients} />
      <ProtectedRoute path="/app/clients/:id" component={ClientDetail} />
      <ProtectedRoute path="/app/invoices" component={Invoices} />
      <ProtectedRoute path="/app/travel" component={Travel} />
      <ProtectedRoute path="/app/documents" component={Documents} />
      <ProtectedRoute path="/app/settings" component={Settings} />

      {/* Admin Routes */}
      <AdminRoute path="/app/admin" component={AdminDashboard} />
      <AdminRoute path="/app/users" component={Users} />
      <AdminRoute path="/app/workspace" component={WorkspaceSettings} />
      
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
