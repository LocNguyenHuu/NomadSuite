import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, Search, DollarSign, FileText, Clock, CheckCircle2, AlertCircle, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface AdminInvoice {
  id: number;
  userId: number;
  clientId: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
  currency: string;
  total: number;
  userName: string;
  clientName: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-500/10 text-gray-700 border-gray-200',
  Sent: 'bg-blue-500/10 text-blue-700 border-blue-200',
  Paid: 'bg-green-500/10 text-green-700 border-green-200',
  Overdue: 'bg-red-500/10 text-red-700 border-red-200',
  Cancelled: 'bg-gray-500/10 text-gray-700 border-gray-200',
};

const statusIcons: Record<string, any> = {
  Draft: FileText,
  Sent: Clock,
  Paid: CheckCircle2,
  Overdue: AlertCircle,
  Cancelled: FileText,
};

export default function AdminInvoices() {
  const { data: invoices = [], isLoading } = useQuery<AdminInvoice[]>({
    queryKey: ['/api/admin/invoices'],
  });

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [userFilter, setUserFilter] = React.useState<string>("All");

  const uniqueUsers = Array.from(new Set(invoices.map(inv => inv.userName))).sort();
  const uniqueStatuses = Array.from(new Set(invoices.map(inv => inv.status))).sort();

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.userName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter;
    const matchesUser = userFilter === "All" || invoice.userName === userFilter;
    
    return matchesSearch && matchesStatus && matchesUser;
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingRevenue = invoices.filter(inv => inv.status === 'Sent').reduce((sum, inv) => sum + inv.total, 0);
  const overdueRevenue = invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.total, 0);

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
        <h1 className="text-3xl font-bold font-heading">All Workspace Invoices</h1>
        <p className="text-muted-foreground mt-1">View and manage all invoices across your workspace</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue, 'USD')}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(paidRevenue, 'USD')}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(pendingRevenue, 'USD')}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(overdueRevenue, 'USD')}</p>
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
              placeholder="Search by invoice number, client, or user..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-invoices"
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

      {/* Invoices Table */}
      <Card>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => {
                  const StatusIcon = statusIcons[invoice.status] || FileText;
                  return (
                    <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{invoice.userName}</Badge>
                      </TableCell>
                      <TableCell>{invoice.clientName || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(invoice.issueDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`flex items-center gap-1 w-fit ${statusColors[invoice.status]}`}>
                          <StatusIcon className="h-3 w-3" />
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No invoices found matching your filters
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
