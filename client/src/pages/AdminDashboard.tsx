import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Users, Briefcase, FileText, Plane, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalInvoices: number;
  totalTrips: number;
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

  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  const [search, setSearch] = React.useState("");

  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loadingStats || loadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="admin-dashboard-container">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading" data-testid="admin-page-title">Admin Dashboard</h1>
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
