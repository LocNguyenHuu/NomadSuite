import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import AppLayout from "@/components/layout/AppLayout";

export function AdminRoute({ component: Component, path }: { component: React.ComponentType<any>, path: string }) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {(params) => {
        if (isLoading) {
           return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-border" /></div>;
        }
        if (!user || user.role !== 'admin') {
           return <Redirect to="/app/dashboard" />;
        }
        return (
          <AppLayout>
            <Component {...params} />
          </AppLayout>
        );
      }}
    </Route>
  );
}
