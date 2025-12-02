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
  User,
  Briefcase,
  Receipt,
  FolderKanban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAppI18n } from '@/contexts/AppI18nContext';

const Sidebar = ({ className, onClose }: { className?: string, onClose?: () => void }) => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { t } = useAppI18n();
  
  const mainNavItems = [
    { href: '/app/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { href: '/app/clients', icon: UsersIcon, label: t('nav.clients') },
    { href: '/app/projects', icon: FolderKanban, label: t('nav.projects') },
    { href: '/app/invoices', icon: FileText, label: t('nav.invoices') },
    { href: '/app/expenses', icon: Receipt, label: t('nav.expenses') },
    { href: '/app/travel', icon: Plane, label: t('nav.travelLog') },
    { href: '/app/documents', icon: FileCheck, label: t('nav.documents') },
  ];

  const adminNavItems = user?.role === 'admin' ? [
    { href: '/app/admin', icon: Shield, label: t('nav.adminDashboard') },
    { href: '/app/admin/clients', icon: Briefcase, label: t('nav.allClients') },
    { href: '/app/admin/invoices', icon: FileText, label: t('nav.allInvoices') },
    { href: '/app/users', icon: UsersIcon, label: t('nav.teamMembers') },
    { href: '/app/workspace', icon: Building2, label: t('nav.workspace') },
  ] : [];

  const settingsNavItems = [
    { href: '/app/profile', icon: User, label: t('nav.profile') },
    { href: '/app/settings', icon: Settings, label: t('nav.settings') },
  ];

  const NavItem = ({ item }: { item: { href: string; icon: any; label: string } }) => {
    const isActive = location === item.href || location.startsWith(`${item.href}/`);
    return (
      <Link key={item.href} href={item.href}>
        <div 
          className={`nav-item cursor-pointer ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
          onClick={onClose}
        >
          <item.icon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className={`flex h-full flex-col bg-card border-r ${className}`}>
      {/* Logo */}
      <div className="flex h-14 items-center px-5 border-b">
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg">NomadSuite</span>
          </div>
        </Link>
      </div>
      
      {/* Main Navigation */}
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="space-y-1">
          {mainNavItems.map((item) => <NavItem key={item.href} item={item} />)}
        </nav>
        
        {/* Admin Section */}
        {adminNavItems.length > 0 && (
          <div className="mt-6">
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</p>
            <nav className="space-y-1">
              {adminNavItems.map((item) => <NavItem key={item.href} item={item} />)}
            </nav>
          </div>
        )}
        
        {/* Settings Section */}
        <div className="mt-6">
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
          <nav className="space-y-1">
            {settingsNavItems.map((item) => <NavItem key={item.href} item={item} />)}
          </nav>
        </div>
      </div>
      
      {/* Logout */}
      <div className="p-3 border-t">
        <button 
          className="nav-item nav-item-inactive w-full text-left hover:text-red-600 dark:hover:text-red-400"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>{t('common.signOut')}</span>
        </button>
      </div>
    </div>
  );
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] bg-muted/30">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-[260px]">
          <Sidebar onClose={() => setIsMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col h-screen overflow-hidden">
        {/* Clean Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={() => setIsMobileOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          
          <div className="w-full flex items-center justify-between md:justify-end">
            {/* Mobile Logo */}
            <Link href="/" className="flex items-center gap-2 md:hidden">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                <Globe className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-heading font-bold text-base">NomadSuite</span>
            </Link>
            
            {/* User Section */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  {user?.currentCountry && (
                    <p className="text-xs text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {user.currentCountry}
                    </p>
                  )}
                </div>
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
