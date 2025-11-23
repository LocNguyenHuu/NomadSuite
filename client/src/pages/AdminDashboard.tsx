import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Users, Briefcase, FileText, Plane, Search, DollarSign, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalInvoices: number;
  totalTrips: number;
}

interface RevenueStats {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  overdueRevenue: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  revenueByUser: Array<{ userId: number; userName: string; revenue: number }>;
}

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  homeCountry: string;
  currentCountry: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: stats, isLoading: loadingStats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
  });

  const { data: revenueStats, isLoading: loadingRevenue } = useQuery<RevenueStats>({
    queryKey: ['/api/admin/revenue-stats'],
  });

  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  const [search, setSearch] = React.useState("");

  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return format(date, 'MMM yyyy');
  };

  if (loadingStats || loadingUsers || loadingRevenue) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const revenueChartData = revenueStats?.revenueByMonth.map(item => ({
    month: formatMonthLabel(item.month),
    revenue: item.revenue / 100,
  })) || [];

  return (
    <div className="space-y-8" data-testid="admin-dashboard-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading" data-testid="admin-page-title">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Workspace-wide analytics and management</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1" data-testid="system-status-badge">System Status: Operational</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="admin-stats-grid">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          desc="Registered accounts"
          testId="stat-users"
        />
        <StatCard 
          title="Active Clients" 
          value={stats?.totalClients || 0} 
          icon={Briefcase} 
          desc="Across all users"
          testId="stat-clients"
        />
        <StatCard 
          title="Total Invoices" 
          value={stats?.totalInvoices || 0} 
          icon={FileText} 
          desc="Generated to date"
          testId="stat-invoices"
        />
        <StatCard 
          title="Trips Logged" 
          value={stats?.totalTrips || 0} 
          icon={Plane} 
          desc="Travel entries"
          testId="stat-trips"
        />
      </div>

      {/* Revenue Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueStats?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">All invoices combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(revenueStats?.paidRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">Successfully collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(revenueStats?.pendingRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Revenue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(revenueStats?.overdueRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
          <CardDescription>Paid invoices only</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value * 100)}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Earners */}
      {revenueStats && revenueStats.revenueByUser.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Earners</CardTitle>
            <CardDescription>Revenue by team member (paid invoices)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueStats.revenueByUser
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">{user.userName}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(user.revenue)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-users"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table data-testid="table-users">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user) => (
                <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium" data-testid={`text-username-${user.id}`}>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      data-testid={`badge-role-${user.id}`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>Home: {user.homeCountry}</span>
                      <span className="text-muted-foreground">Current: {user.currentCountry}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No users found matching "{search}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, desc, testId }: { title: string, value: number, icon: any, desc: string, testId: string }) {
  return (
    <Card data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}
