import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { 
  DollarSign, 
  Users, 
  Calendar, 
  AlertTriangle, 
  FileText,
  FolderKanban,
  Receipt,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Target,
  PieChart,
  BarChart3,
  Wallet
} from 'lucide-react';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Bar,
  BarChart,
  Cell,
  PieChart as RechartsPie,
  Pie,
  Legend
} from 'recharts';
import { differenceInDays, format, startOfMonth, subMonths, isAfter, isBefore, parseISO } from 'date-fns';
import { useAppI18n } from '@/contexts/AppI18nContext';
import { Link } from 'wouter';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308'];
const STATUS_COLORS: Record<string, string> = {
  'Planning': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-amber-100 text-amber-800',
  'On Hold': 'bg-gray-100 text-gray-800',
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

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
  const pendingInvoices = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').length;
  const totalRevenue = invoices.reduce((acc, curr) => acc + (curr.status === 'Paid' ? curr.amount : 0), 0);
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length;

  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const planningProjects = projects.filter(p => p.status === 'Planning').length;
  
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const pendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;

  const currentTrip = trips.find(t => !t.exitDate);
  const daysInCountry = currentTrip ? differenceInDays(new Date(), new Date(currentTrip.entryDate)) : 0;

  const generateMonthlyData = () => {
    const months: { name: string; revenue: number; expenses: number }[] = [];
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
      });
    }
    return months;
  };

  const monthlyData = generateMonthlyData();

  const expenseCategoryData = expenseStats?.expensesByCategory?.slice(0, 6).map(cat => ({
    name: cat.category,
    value: Math.round(cat.total / 100),
    count: cat.count,
  })) || [];

  const projectStatusData = [
    { name: 'Planning', value: planningProjects, color: '#3b82f6' },
    { name: 'In Progress', value: activeProjects, color: '#f59e0b' },
    { name: 'Completed', value: completedProjects, color: '#22c55e' },
    { name: 'On Hold', value: projects.filter(p => p.status === 'On Hold').length, color: '#6b7280' },
  ].filter(item => item.value > 0);

  const upcomingDeadlines = projects
    .filter(p => p.endDate && p.status !== 'Completed' && p.status !== 'Cancelled')
    .map(p => ({
      id: p.id,
      name: p.name,
      endDate: new Date(p.endDate!),
      status: p.status,
      daysLeft: differenceInDays(new Date(p.endDate!), new Date()),
    }))
    .filter(p => p.daysLeft >= 0 && p.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const upcomingActions = clients
    .filter(c => c.nextActionDate)
    .sort((a, b) => new Date(a.nextActionDate!).getTime() - new Date(b.nextActionDate!).getTime())
    .slice(0, 5);

  const topProjects = projects
    .filter(p => p.status === 'In Progress')
    .map(p => ({
      ...p,
      progress: p.taskCount > 0 ? Math.round((p.completedTaskCount / p.taskCount) * 100) : 0,
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  return (
    <AppLayout>
      <div className="space-y-6" data-testid="dashboard-page">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight" data-testid="text-dashboard-title">
              {t('dashboard.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('dashboard.welcome')}, {user?.name}. {t('dashboard.overview')}.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/app/projects">
              <Button variant="outline" size="sm" data-testid="button-new-project">
                <Plus className="h-4 w-4 mr-1" />
                {t('projects.createProject') || 'New Project'}
              </Button>
            </Link>
            <Link href="/app/invoices">
              <Button size="sm" data-testid="button-new-invoice">
                <Plus className="h-4 w-4 mr-1" />
                {t('dashboard.createInvoice')}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <StatCard 
            title={t('dashboard.totalRevenue')} 
            value={`$${(totalRevenue / 100).toLocaleString()}`} 
            icon={DollarSign} 
            desc={`${invoices.filter(i => i.status === 'Paid').length} paid invoices`}
            trend="up"
          />
          <StatCard 
            title="Total Expenses" 
            value={`$${(totalExpenses / 100).toLocaleString()}`} 
            icon={Receipt} 
            desc={`${expenses.length} expenses tracked`}
            trend="neutral"
          />
          <StatCard 
            title="Net Profit" 
            value={`$${(netProfit / 100).toLocaleString()}`} 
            icon={netProfit >= 0 ? TrendingUp : TrendingDown} 
            desc={`${profitMargin}% profit margin`}
            trend={netProfit >= 0 ? "up" : "down"}
            alert={netProfit < 0}
          />
          <StatCard 
            title={t('dashboard.activeClients')} 
            value={activeClients.toString()} 
            icon={Users} 
            desc={`${leadClients} leads in pipeline`}
          />
          <StatCard 
            title="Active Projects" 
            value={activeProjects.toString()} 
            icon={FolderKanban} 
            desc={`${planningProjects} in planning`}
          />
          <StatCard 
            title={t('dashboard.pendingInvoices')} 
            value={overdueInvoices.toString()} 
            icon={AlertTriangle} 
            desc={`${pendingInvoices} total pending`}
            alert={overdueInvoices > 0}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Revenue vs Expenses
              </CardTitle>
              <CardDescription>Monthly comparison for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barGap={8}>
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
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderRadius: '8px', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Project Status
              </CardTitle>
              <CardDescription>{projects.length} total projects</CardDescription>
            </CardHeader>
            <CardContent>
              {projectStatusData.length > 0 ? (
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderRadius: '8px', 
                          border: '1px solid hsl(var(--border))' 
                        }}
                      />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[240px] flex items-center justify-center text-muted-foreground">
                  No projects yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-primary" />
                  Active Projects
                </span>
                <Link href="/app/projects">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProjects.map((project) => (
                  <Link key={project.id} href={`/app/projects/${project.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" data-testid={`card-project-${project.id}`}>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.completedTaskCount}/{project.taskCount} tasks
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Progress value={project.progress} className="w-16 h-2" />
                        <span className="text-xs font-medium w-8">{project.progress}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {topProjects.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No active projects
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Project Deadlines
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((project) => (
                  <Link key={project.id} href={`/app/projects/${project.id}`}>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          project.daysLeft <= 3 ? 'bg-red-100 text-red-600' : 
                          project.daysLeft <= 7 ? 'bg-amber-100 text-amber-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[140px]">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(project.endDate, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={project.daysLeft <= 3 ? "destructive" : project.daysLeft <= 7 ? "default" : "secondary"}>
                        {project.daysLeft === 0 ? 'Today' : `${project.daysLeft}d`}
                      </Badge>
                    </div>
                  </Link>
                ))}
                {upcomingDeadlines.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No upcoming deadlines
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Task Overview
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <div className="text-2xl font-bold text-amber-600">{pendingTasks}</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
                    <div className="text-xs text-muted-foreground">Overdue</div>
                  </div>
                </div>
                {tasks.length > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">{tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%</span>
                    </div>
                    <Progress value={tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Expenses by Category
                </span>
                <Link href="/app/expenses">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expenseCategoryData.length > 0 ? (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseCategoryData} layout="vertical">
                      <XAxis 
                        type="number" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderRadius: '8px', 
                          border: '1px solid hsl(var(--border))' 
                        }}
                        formatter={(value: number, name: string, props: any) => [
                          `$${value.toLocaleString()} (${props.payload.count} items)`,
                          'Amount'
                        ]}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {expenseCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No expenses recorded yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  Recent Expenses
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50" data-testid={`row-expense-${expense.id}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Receipt className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[180px]">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{expense.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${(expense.amount / 100).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(expense.date), 'MMM d')}</p>
                    </div>
                  </div>
                ))}
                {recentExpenses.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No expenses yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {t('dashboard.upcomingDeadlines') || 'Upcoming Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingActions.map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        new Date(client.nextActionDate!) < new Date() 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {client.nextActionDescription || "Follow up"}
                        </p>
                        <p className="text-xs text-muted-foreground">{client.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium ${
                        new Date(client.nextActionDate!) < new Date() 
                          ? 'text-red-600' 
                          : 'text-muted-foreground'
                      }`}>
                        {new Date(client.nextActionDate!) < new Date() 
                          ? 'Overdue' 
                          : differenceInDays(new Date(client.nextActionDate!), new Date()) + ' days'}
                      </span>
                    </div>
                  </div>
                ))}
                {upcomingActions.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No upcoming actions.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Travel & Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('dashboard.daysInCountry')}</span>
                  </div>
                  <div className="text-3xl font-bold">{daysInCountry}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentTrip ? currentTrip.country : "Not traveling"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Total Trips</span>
                  </div>
                  <div className="text-3xl font-bold">{trips.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Set(trips.map(t => t.country)).size} countries
                  </p>
                </div>
              </div>
              {currentTrip && (
                <div className="mt-4 p-3 rounded-lg border bg-primary/5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Location</span>
                    <Badge variant="secondary">{currentTrip.country}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Since {format(new Date(currentTrip.entryDate), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  desc, 
  alert,
  trend 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  desc: string; 
  alert?: boolean;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow border-border/50 ${
      alert ? 'border-orange-200 bg-orange-50/30 dark:bg-orange-900/10' : ''
    }`} data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${
          alert ? 'text-orange-500' : 
          trend === 'up' ? 'text-green-500' : 
          trend === 'down' ? 'text-red-500' : 
          'text-muted-foreground'
        }`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold font-heading ${
          alert ? 'text-orange-600 dark:text-orange-400' : ''
        }`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}
