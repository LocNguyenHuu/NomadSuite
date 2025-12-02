import React, { useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useClients } from '@/hooks/use-clients';
import { useInvoices } from '@/hooks/use-invoices';
import { useTrips } from '@/hooks/use-trips';
import { useProjects } from '@/hooks/use-projects';
import { useExpenses } from '@/hooks/use-expenses';
import { useTasks } from '@/hooks/use-projects';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  AlertTriangle, 
  FileText,
  FolderKanban,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  Plus,
  Plane,
  UserPlus,
  MapPin,
  ChevronRight,
  CalendarDays,
  Wallet,
  Target,
  AlertCircle,
  CheckCircle2,
  Receipt,
  Globe
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Area,
  AreaChart
} from 'recharts';
import { differenceInDays, format, startOfMonth, subMonths } from 'date-fns';
import { useAppI18n } from '@/contexts/AppI18nContext';
import { Link } from 'wouter';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useAppI18n();
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const { trips } = useTrips();
  const { projects } = useProjects();
  const { expenses, stats: expenseStats } = useExpenses();
  const { tasks } = useTasks();

  const activeClients = clients.filter(c => c.status === 'Active').length;
  const leadClients = clients.filter(c => c.status === 'Lead').length;
  const totalRevenue = invoices.reduce((acc, curr) => acc + (curr.status === 'Paid' ? curr.amount : 0), 0);
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue');
  const pendingInvoices = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue');
  const outstandingAmount = pendingInvoices.reduce((acc, curr) => acc + curr.amount, 0);

  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const pendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;

  const currentTrip = trips.find(t => !t.exitDate);
  const lastTrip = !currentTrip && trips.length > 0 
    ? trips.sort((a, b) => new Date(b.exitDate || b.entryDate).getTime() - new Date(a.exitDate || a.entryDate).getTime())[0]
    : null;
  const daysInCountry = currentTrip ? differenceInDays(new Date(), new Date(currentTrip.entryDate)) : 0;
  const daysRemaining = currentTrip ? Math.max(0, 90 - daysInCountry) : 90;
  const countriesVisited = new Set(trips.map(t => t.country)).size;

  const monthlyData = useMemo(() => {
    const months: { name: string; revenue: number; expenses: number; net: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthName = format(monthStart, 'MMM');
      
      const monthRevenue = invoices
        .filter(inv => {
          if (inv.status !== 'Paid') return false;
          const invoiceDate = inv.issuedAt ? new Date(inv.issuedAt) : new Date();
          return format(invoiceDate, 'MMM yyyy') === format(monthStart, 'MMM yyyy');
        })
        .reduce((sum, inv) => sum + inv.amount, 0);

      const monthExpenses = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return format(expDate, 'MMM yyyy') === format(monthStart, 'MMM yyyy');
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      months.push({
        name: monthName,
        revenue: Math.round(monthRevenue / 100),
        expenses: Math.round(monthExpenses / 100),
        net: Math.round((monthRevenue - monthExpenses) / 100),
      });
    }
    return months;
  }, [invoices, expenses]);

  const actionItems = useMemo(() => {
    const items: { 
      id: string; 
      type: 'urgent' | 'warning' | 'info'; 
      title: string; 
      subtitle: string;
      href: string;
      icon: any;
    }[] = [];
    
    if (overdueInvoices.length > 0) {
      const totalOverdue = overdueInvoices.reduce((acc, inv) => acc + inv.amount, 0);
      items.push({
        id: 'overdue',
        type: 'urgent',
        title: `${overdueInvoices.length} overdue invoice${overdueInvoices.length > 1 ? 's' : ''}`,
        subtitle: `$${(totalOverdue / 100).toLocaleString()} outstanding`,
        href: '/app/invoices',
        icon: AlertTriangle
      });
    }
    
    if (daysInCountry >= 75 && daysInCountry < 90) {
      items.push({
        id: 'visa-warning',
        type: 'warning',
        title: 'Visa limit approaching',
        subtitle: `${90 - daysInCountry} days remaining`,
        href: '/app/travel',
        icon: Plane
      });
    } else if (daysInCountry >= 90) {
      items.push({
        id: 'visa-exceeded',
        type: 'urgent',
        title: 'Visa limit exceeded',
        subtitle: `${daysInCountry} days in ${currentTrip?.country || 'country'}`,
        href: '/app/travel',
        icon: AlertCircle
      });
    }
    
    if (daysInCountry >= 150) {
      items.push({
        id: 'tax-residency',
        type: 'warning',
        title: 'Tax residency alert',
        subtitle: 'May trigger tax obligations',
        href: '/app/travel',
        icon: FileText
      });
    }
    
    if (overdueTasks > 0) {
      items.push({
        id: 'overdue-tasks',
        type: 'warning',
        title: `${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}`,
        subtitle: 'Needs immediate attention',
        href: '/app/projects',
        icon: Target
      });
    }
    
    if (leadClients > 0) {
      items.push({
        id: 'leads',
        type: 'info',
        title: `${leadClients} lead${leadClients > 1 ? 's' : ''} to follow up`,
        subtitle: 'Potential new business',
        href: '/app/clients',
        icon: UserPlus
      });
    }
    
    const clientsWithActions = clients.filter(c => 
      c.nextActionDate && new Date(c.nextActionDate) <= new Date()
    );
    if (clientsWithActions.length > 0) {
      items.push({
        id: 'client-actions',
        type: 'info',
        title: `${clientsWithActions.length} client action${clientsWithActions.length > 1 ? 's' : ''} due`,
        subtitle: 'Follow-ups pending',
        href: '/app/clients',
        icon: Users
      });
    }
    
    return items.slice(0, 5);
  }, [overdueInvoices, daysInCountry, currentTrip, overdueTasks, leadClients, clients]);

  const activeProjectsList = projects
    .filter(p => p.status === 'In Progress')
    .map(p => ({
      ...p,
      progress: p.taskCount > 0 ? Math.round((p.completedTaskCount / p.taskCount) * 100) : 0,
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  const upcomingDeadlines = projects
    .filter(p => p.endDate && p.status !== 'Completed' && p.status !== 'Cancelled')
    .map(p => ({
      id: p.id,
      name: p.name,
      endDate: new Date(p.endDate!),
      daysLeft: differenceInDays(new Date(p.endDate!), new Date()),
    }))
    .filter(p => p.daysLeft >= 0 && p.daysLeft <= 14)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  const topExpenseCategories = expenseStats?.expensesByCategory?.slice(0, 3) || [];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto" data-testid="dashboard-page">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-dashboard-title">
              {t('dashboard.welcome')}, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-muted-foreground mt-1" data-testid="text-dashboard-subtitle">
              Here's your business at a glance
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/app/invoices">
              <Button size="sm" data-testid="button-new-invoice">
                <Plus className="h-4 w-4 mr-1.5" />
                New Invoice
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <KPICard
            testId="kpi-net-profit"
            label="Net Profit"
            value={`$${(netProfit / 100).toLocaleString()}`}
            subtext={`${profitMargin}% margin`}
            trend={netProfit >= 0 ? 'up' : 'down'}
            icon={netProfit >= 0 ? TrendingUp : TrendingDown}
          />
          <KPICard
            testId="kpi-outstanding"
            label="Outstanding"
            value={`$${(outstandingAmount / 100).toLocaleString()}`}
            subtext={`${pendingInvoices.length} pending invoice${pendingInvoices.length !== 1 ? 's' : ''}`}
            alert={overdueInvoices.length > 0}
            icon={Wallet}
          />
          <KPICard
            testId="kpi-active-projects"
            label="Active Projects"
            value={activeProjects.toString()}
            subtext={`${completedProjects} completed`}
            icon={FolderKanban}
          />
          <KPICard
            testId="kpi-travel-status"
            label="Travel Status"
            value={currentTrip ? `${daysRemaining}d` : `${countriesVisited}`}
            subtext={currentTrip 
              ? `in ${currentTrip.country}` 
              : countriesVisited > 0 
                ? `countries visited`
                : 'No trips yet'
            }
            alert={daysRemaining <= 15 && currentTrip !== undefined}
            icon={currentTrip ? MapPin : Globe}
          />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full" data-testid="card-financial-trend">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Financial Trend</CardTitle>
                  <span className="text-xs text-muted-foreground">Last 6 months</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                        width={60}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderRadius: '8px', 
                          border: '1px solid hsl(var(--border))',
                          fontSize: '12px'
                        }}
                        formatter={(value: number, name: string) => [
                          `$${value.toLocaleString()}`,
                          name === 'revenue' ? 'Revenue' : 'Expenses'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorExpenses)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="text-sm font-medium" data-testid="text-total-revenue">${(totalRevenue / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-muted-foreground">Expenses</span>
                    <span className="text-sm font-medium" data-testid="text-total-expenses">${(totalExpenses / 100).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="h-full" data-testid="card-needs-attention">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Needs Attention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {actionItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center" data-testid="text-all-caught-up">
                    <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
                    <p className="font-medium text-green-600">All caught up!</p>
                    <p className="text-sm text-muted-foreground mt-1">No urgent actions needed</p>
                  </div>
                ) : (
                  actionItems.map((item) => (
                    <Link key={item.id} href={item.href}>
                      <div 
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                          item.type === 'urgent' ? 'border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10' :
                          item.type === 'warning' ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10' :
                          'border-border'
                        }`}
                        data-testid={`action-item-${item.id}`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${
                          item.type === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                          item.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card data-testid="card-active-projects">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Active Projects</CardTitle>
                  <Link href="/app/projects">
                    <Button variant="ghost" size="sm" className="text-xs" data-testid="button-view-all-projects">
                      View all <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {activeProjectsList.length === 0 ? (
                  <div className="text-center py-6" data-testid="text-no-active-projects">
                    <FolderKanban className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No active projects</p>
                    <Link href="/app/projects">
                      <Button variant="outline" size="sm" className="mt-3" data-testid="button-create-project">
                        <Plus className="h-4 w-4 mr-1" />
                        Create Project
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeProjectsList.map((project) => (
                      <Link key={project.id} href={`/app/projects/${project.id}`}>
                        <div 
                          className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          data-testid={`project-item-${project.id}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{project.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {project.completedTaskCount}/{project.taskCount} tasks
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Progress value={project.progress} className="w-16 h-2" />
                            <span className="text-xs font-medium w-7 text-right">{project.progress}%</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card data-testid="card-deadlines-expenses">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Deadlines & Expenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDeadlines.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">UPCOMING DEADLINES</p>
                    <div className="space-y-2">
                      {upcomingDeadlines.map((deadline) => (
                        <Link key={deadline.id} href={`/app/projects/${deadline.id}`}>
                          <div 
                            className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            data-testid={`deadline-item-${deadline.id}`}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className={`h-4 w-4 ${deadline.daysLeft <= 3 ? 'text-red-500' : 'text-amber-500'}`} />
                              <span className="text-sm truncate max-w-[140px]">{deadline.name}</span>
                            </div>
                            <Badge variant={deadline.daysLeft <= 3 ? "destructive" : "secondary"} className="text-xs">
                              {deadline.daysLeft === 0 ? 'Today' : `${deadline.daysLeft}d`}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {topExpenseCategories.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">TOP EXPENSE CATEGORIES</p>
                    <div className="space-y-2">
                      {topExpenseCategories.map((cat, index) => (
                        <div 
                          key={cat.category} 
                          className="flex items-center justify-between"
                          data-testid={`expense-category-${index}`}
                        >
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{cat.category}</span>
                          </div>
                          <span className="text-sm font-medium">${(cat.total / 100).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {upcomingDeadlines.length === 0 && topExpenseCategories.length === 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground" data-testid="text-no-deadlines-expenses">
                    No deadlines or expenses to show
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card data-testid="card-business-overview">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/app/clients">
                    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer" data-testid="stat-clients">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-xs">Clients</span>
                      </div>
                      <div className="text-xl font-bold">{activeClients}</div>
                      <p className="text-xs text-muted-foreground">
                        {leadClients > 0 ? `+${leadClients} leads` : 'Active'}
                      </p>
                    </div>
                  </Link>
                  <Link href="/app/invoices">
                    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer" data-testid="stat-invoices">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        <span className="text-xs">Paid</span>
                      </div>
                      <div className="text-xl font-bold">{invoices.filter(i => i.status === 'Paid').length}</div>
                      <p className="text-xs text-muted-foreground">Invoices</p>
                    </div>
                  </Link>
                  <Link href="/app/projects">
                    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer" data-testid="stat-tasks">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Target className="h-3.5 w-3.5" />
                        <span className="text-xs">Tasks</span>
                      </div>
                      <div className="text-xl font-bold">{pendingTasks}</div>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </Link>
                  <Link href="/app/travel">
                    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer" data-testid="stat-travel">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Plane className="h-3.5 w-3.5" />
                        <span className="text-xs">Travel</span>
                      </div>
                      <div className="text-xl font-bold">{trips.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {countriesVisited} {countriesVisited === 1 ? 'country' : 'countries'}
                      </p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}

function KPICard({ 
  testId,
  label, 
  value, 
  subtext,
  icon: Icon, 
  alert,
  trend 
}: { 
  testId: string;
  label: string; 
  value: string; 
  subtext: string;
  icon: any; 
  alert?: boolean;
  trend?: 'up' | 'down';
}) {
  return (
    <Card 
      className={`relative overflow-hidden ${alert ? 'border-amber-300 dark:border-amber-700' : ''}`}
      data-testid={testId}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold tracking-tight ${
              alert ? 'text-amber-600 dark:text-amber-400' :
              trend === 'up' ? 'text-green-600 dark:text-green-400' :
              trend === 'down' ? 'text-red-600 dark:text-red-400' : ''
            }`}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{subtext}</p>
          </div>
          <div className={`p-2.5 rounded-xl ${
            alert ? 'bg-amber-100 dark:bg-amber-900/30' :
            trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' :
            trend === 'down' ? 'bg-red-100 dark:bg-red-900/30' :
            'bg-muted'
          }`}>
            <Icon className={`h-5 w-5 ${
              alert ? 'text-amber-600 dark:text-amber-400' :
              trend === 'up' ? 'text-green-600 dark:text-green-400' :
              trend === 'down' ? 'text-red-600 dark:text-red-400' :
              'text-muted-foreground'
            }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
