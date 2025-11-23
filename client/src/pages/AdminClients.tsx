import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, Search, Users, Briefcase, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface AdminClient {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  country: string;
  taxId: string | null;
  status: string;
  createdAt: string;
  userName: string;
}

const statusColors: Record<string, string> = {
  Active: 'bg-green-500/10 text-green-700 border-green-200',
  Lead: 'bg-blue-500/10 text-blue-700 border-blue-200',
  Proposal: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  Completed: 'bg-gray-500/10 text-gray-700 border-gray-200',
};

export default function AdminClients() {
  const { data: clients = [], isLoading } = useQuery<AdminClient[]>({
    queryKey: ['/api/admin/clients'],
  });

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [userFilter, setUserFilter] = React.useState<string>("All");

  const uniqueUsers = Array.from(new Set(clients.map(c => c.userName))).sort();
  const uniqueStatuses = Array.from(new Set(clients.map(c => c.status))).sort();

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      (client.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (client.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (client.company ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (client.country ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (client.userName ?? '').toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || client.status === statusFilter;
    const matchesUser = userFilter === "All" || client.userName === userFilter;
    
    return matchesSearch && matchesStatus && matchesUser;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">All Workspace Clients</h1>
        <p className="text-muted-foreground mt-1">View and manage all clients across your workspace</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clients</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{clients.filter(c => c.status === 'Active').length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Leads</p>
              <p className="text-2xl font-bold">{clients.filter(c => c.status === 'Lead').length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Proposals</p>
              <p className="text-2xl font-bold">{clients.filter(c => c.status === 'Proposal').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, company, country, or user..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-clients"
            />
          </div>
          
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-user-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Users</SelectItem>
              {uniqueUsers.map(user => (
                <SelectItem key={user} value={user}>{user}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40" data-testid="select-status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Clients Table */}
      <Card>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id} data-testid={`row-client-${client.id}`}>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link href={`/app/clients/${client.id}`}>
                          <span className="font-medium hover:underline cursor-pointer">{client.name}</span>
                        </Link>
                        <span className="text-xs text-muted-foreground">{client.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{client.userName}</Badge>
                    </TableCell>
                    <TableCell>{client.company || '—'}</TableCell>
                    <TableCell>{client.country}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[client.status] || 'bg-gray-100 text-gray-700'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(client.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No clients found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
