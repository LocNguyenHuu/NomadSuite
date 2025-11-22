import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  FileText, 
  Plane, 
  FileCheck, 
  Settings, 
  LogOut,
  Menu,
  Globe,
  Shield,
  Building2,
  MapPin,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Sidebar = ({ className, onClose }: { className?: string, onClose?: () => void }) => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const navItems = [
    { href: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/app/clients', icon: UsersIcon, label: 'Clients' },
    { href: '/app/invoices', icon: FileText, label: 'Invoices' },
    { href: '/app/travel', icon: Plane, label: 'Travel Log' },
    { href: '/app/documents', icon: FileCheck, label: 'Documents' },
    ...(user?.role === 'admin' ? [
      { href: '/app/admin', icon: Shield, label: 'Admin Dashboard' },
      { href: '/app/users', icon: UsersIcon, label: 'Team Members' },
      { href: '/app/workspace', icon: Building2, label: 'Workspace' },
    ] : []),
    { href: '/app/profile', icon: User, label: 'Profile' },
    { href: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`flex h-full flex-col gap-4 bg-sidebar text-sidebar-foreground border-r border-sidebar-border ${className}`}>
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/">
          <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary cursor-pointer">
            <Globe className="h-6 w-6" />
            <span>NomadSuite</span>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer
                    ${isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={onClose}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
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
        <header className="flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-md px-4 md:px-6 shadow-sm z-10">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="w-full flex items-center justify-between md:justify-end">
            <div className="flex items-center gap-2 md:hidden">
              <Globe className="h-5 w-5 text-primary" />
              <h1 className="font-heading text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                NomadSuite
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {user?.currentCountry}
                </p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.username?.substring(0,2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
