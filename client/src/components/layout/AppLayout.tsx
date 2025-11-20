import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Plane, 
  FileCheck, 
  Settings, 
  LogOut,
  Menu,
  Globe,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';

const Sidebar = ({ className, onClose }: { className?: string, onClose?: () => void }) => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const navItems = [
    { href: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/app/clients', icon: Users, label: 'Clients' },
    { href: '/app/invoices', icon: FileText, label: 'Invoices' },
    { href: '/app/travel', icon: Plane, label: 'Travel Log' },
    { href: '/app/documents', icon: FileCheck, label: 'Documents' },
    ...(user?.role === 'admin' ? [{ href: '/app/admin', icon: Shield, label: 'Admin' }] : []),
    { href: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`flex h-full flex-col gap-4 bg-sidebar text-sidebar-foreground border-r border-sidebar-border ${className}`}>
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/">
          <a className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
            <Globe className="h-6 w-6" />
            <span>NomadOps</span>
          </a>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href}>
                <a 
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors 
                    ${isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={onClose}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] bg-background">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-[240px]">
          <Sidebar onClose={() => setIsMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm z-10">
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <div className="w-full flex items-center justify-between">
            <h1 className="font-heading text-lg font-semibold md:hidden">NomadOps</h1>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">📍 {user?.currentCountry}</p>
                </div>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{user?.username?.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/30">
          <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
