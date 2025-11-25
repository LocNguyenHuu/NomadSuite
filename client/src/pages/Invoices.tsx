import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Download, Info, Globe, Mail, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { useInvoices } from '@/hooks/use-invoices';
import { useClients } from '@/hooks/use-clients';
import { InsertInvoice, JurisdictionRule, User } from '@shared/schema';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { InvoiceExportDialog } from '@/components/InvoiceExportDialog';

export default function Invoices() {
  const { invoices, createInvoiceAsync } = useInvoices();
  const { clients } = useClients();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'pdf' | 'email'>('pdf');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  
  const { data: jurisdictions = [] } = useQuery<JurisdictionRule[]>({ 
    queryKey: ['/api/jurisdictions'] 
  });

  const { data: user } = useQuery<User>({
    queryKey: ['/api/user']
  });

  const { register, handleSubmit, control, reset, watch, setValue } = useForm<Omit<InsertInvoice, 'clientId'> & { clientId: string }>();
  const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit, setValue: setEditValue, control: controlEdit } = useForm();

  const selectedClient = clients.find(c => c.id.toString() === selectedClientId);
  const selectedJurisdiction = jurisdictions.find(j => j.country === selectedCountry);

  // Auto-set country when client is selected, with user defaults as fallback
  useEffect(() => {
    if (selectedClient) {
      setSelectedCountry(selectedClient.country);
      setValue('country', selectedClient.country);
      setValue('language', selectedJurisdiction?.defaultLanguage || user?.defaultInvoiceLanguage || 'en');
      setValue('currency', selectedJurisdiction?.defaultCurrency || user?.defaultCurrency || 'USD');
    }
  }, [selectedClient, setValue, selectedJurisdiction, user]);

  const getClientName = (id: number) => {
    return clients.find(c => c.id === id)?.name || 'Unknown Client';
  };

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const clientName = getClientName(invoice.clientId);
    const matchesSearch = 
      (invoice.invoiceNumber ?? '').toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      (invoice.country ?? '').toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest('PATCH', `/api/invoices/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({ title: "Invoice updated successfully" });
      setEditDialogOpen(false);
      setEditingInvoice(null);
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const amountInCents = parseInt(data.amount) * 100; // Convert to cents
      await createInvoiceAsync({ 
        clientId: parseInt(data.clientId),
        amount: amountInCents,
        currency: data.currency || 'USD',
        dueDate: new Date(data.dueDate),
        status: 'Sent',
        items: [{
          description: 'Consulting Services',
          quantity: 1,
          unitPrice: amountInCents,
          subtotal: amountInCents,
          tax: 0
        }],
        tax: 0,
        country: selectedCountry,
        language: data.language || 'en',
        reverseCharge: data.reverseCharge || false,
        customerVatId: data.customerVatId || undefined,
        complianceChecked: true
      });
      setOpen(false);
      reset();
      setSelectedClientId('');
      setSelectedCountry('');
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  const onEditSubmit = (data: any) => {
    if (!editingInvoice) return;
    
    const updateData: any = {};

    // Only include changed fields
    if (data.status && data.status !== editingInvoice.status) {
      updateData.status = data.status;
    }

    if (data.dueDate) {
      const newDueDate = data.dueDate; // Keep as yyyy-MM-dd string
      const existingDueDate = format(new Date(editingInvoice.dueDate), 'yyyy-MM-dd');
      if (newDueDate !== existingDueDate) {
        // Send as Date object - the server will handle conversion
        updateData.dueDate = new Date(data.dueDate + 'T12:00:00Z');
      }
    }

    if (data.notesToClient !== (editingInvoice.notesToClient || '')) {
      updateData.notesToClient = data.notesToClient || null;
    }

    if (data.amount && parseFloat(data.amount) !== (editingInvoice.amount / 100)) {
      const amountInCents = Math.round(parseFloat(data.amount) * 100);
      updateData.amount = amountInCents;
    }

    if (data.currency && data.currency !== editingInvoice.currency) {
      updateData.currency = data.currency;
    }

    // Only send update if there are actual changes
    if (Object.keys(updateData).length === 0) {
      toast({ title: "No changes detected" });
      setEditDialogOpen(false);
      return;
    }

    updateInvoiceMutation.mutate({ id: editingInvoice.id, data: updateData });
  };

  const openEditDialog = (invoice: any) => {
    setEditingInvoice(invoice);
    resetEdit({
      amount: (invoice.amount / 100).toString(),
      currency: invoice.currency,
      status: invoice.status,
      dueDate: format(new Date(invoice.dueDate), 'yyyy-MM-dd'),
      notesToClient: invoice.notesToClient || '',
    });
    setEditDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">Invoices</h2>
            <p className="text-muted-foreground">Track payments and outstanding balances.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Create New Invoice
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                <Alert className="bg-muted/50">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Invoice number will be generated automatically using your custom prefix ({user?.invoicePrefix || "NS-"})
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input data-testid="input-due-date" id="dueDate" type="date" {...register('dueDate', { required: true })} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="clientId">Client</Label>
                  <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={(value) => { field.onChange(value); setSelectedClientId(value); }} value={field.value?.toString()}>
                        <SelectTrigger data-testid="select-client">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name} ({client.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {selectedJurisdiction && (
                  <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Invoicing {selectedJurisdiction.countryName}:</strong> {selectedJurisdiction.complianceNotes}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input data-testid="input-amount" id="amount" type="number" placeholder="1000" {...register('amount', { required: true })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Controller
                      name="currency"
                      control={control}
                      defaultValue="USD"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger data-testid="select-currency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="language">Language</Label>
                    <Controller
                      name="language"
                      control={control}
                      defaultValue="en"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || 'en'}>
                          <SelectTrigger data-testid="select-language">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedJurisdiction?.supportedLanguages.map(lang => (
                              <SelectItem key={lang} value={lang}>
                                {lang === 'en' ? 'English' : lang === 'de' ? 'German' : lang === 'fr' ? 'French' : lang.toUpperCase()}
                              </SelectItem>
                            )) || <SelectItem value="en">English</SelectItem>}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {selectedJurisdiction?.languageNote && (
                  <Alert variant="default" className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-sm text-amber-900 dark:text-amber-100">
                      {selectedJurisdiction.languageNote}
                    </AlertDescription>
                  </Alert>
                )}

                {selectedJurisdiction?.requiresCustomerVatId && (
                  <div className="grid gap-2">
                    <Label htmlFor="customerVatId">Customer VAT ID (for B2B)</Label>
                    <Input data-testid="input-customer-vat" id="customerVatId" placeholder="DE123456789" {...register('customerVatId')} />
                  </div>
                )}

                {selectedJurisdiction?.supportsReverseCharge && (
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="reverseCharge"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox 
                          data-testid="checkbox-reverse-charge"
                          id="reverseCharge" 
                          checked={field.value as boolean} 
                          onCheckedChange={field.onChange} 
                        />
                      )}
                    />
                    <Label htmlFor="reverseCharge" className="text-sm font-normal cursor-pointer">
                      Apply reverse charge (intra-EU B2B)
                    </Label>
                  </div>
                )}

                <DialogFooter>
                  <Button type="submit" data-testid="button-create-invoice">Create Invoice</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by invoice number, client, or country..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-invoices"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="group" data-testid={`row-invoice-${invoice.id}`}>
                  <TableCell className="font-mono font-medium" data-testid={`text-invoice-number-${invoice.id}`}>{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    <div>{getClientName(invoice.clientId)}</div>
                    {invoice.language && invoice.language !== 'en' && (
                      <div className="text-xs text-muted-foreground">
                        {invoice.language === 'de' ? '🇩🇪 German' : invoice.language === 'fr' ? '🇫🇷 French' : invoice.language}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{invoice.country || '-'}</TableCell>
                  <TableCell className="font-medium">
                    {invoice.amount.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}
                    {invoice.reverseCharge && (
                      <div className="text-xs text-blue-600 dark:text-blue-400">Reverse Charge</div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.issuedAt && format(new Date(invoice.issuedAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => openEditDialog(invoice)}
                        data-testid={`button-edit-invoice-${invoice.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setSelectedInvoiceId(invoice.id);
                          setExportMode('pdf');
                          setExportDialogOpen(true);
                        }}
                        data-testid={`button-download-invoice-${invoice.id}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setSelectedInvoiceId(invoice.id);
                          setExportMode('email');
                          setExportDialogOpen(true);
                        }}
                        data-testid={`button-email-invoice-${invoice.id}`}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInvoices.length === 0 && invoices.length > 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No invoices match your search criteria.
                  </TableCell>
                </TableRow>
              )}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No invoices found. Create your first invoice to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Invoice Dialog */}
      {editingInvoice && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Invoice {editingInvoice.invoiceNumber}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount</Label>
                  <Input 
                    id="edit-amount" 
                    type="number"
                    step="0.01"
                    {...registerEdit('amount', { required: true })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-currency">Currency</Label>
                  <Controller
                    name="currency"
                    control={controlEdit}
                    defaultValue={editingInvoice.currency}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Controller
                    name="status"
                    control={controlEdit}
                    defaultValue={editingInvoice.status}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Sent">Sent</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Input 
                    id="edit-dueDate" 
                    type="date"
                    {...registerEdit('dueDate', { required: true })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notesToClient">Notes to Client</Label>
                <Input 
                  id="edit-notesToClient" 
                  {...registerEdit('notesToClient')} 
                  placeholder="Optional notes for this invoice"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateInvoiceMutation.isPending}>
                  {updateInvoiceMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Export Dialog */}
      <InvoiceExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        invoice={invoices.find(inv => inv.id === selectedInvoiceId) || null}
        client={clients.find(c => c.id === invoices.find(inv => inv.id === selectedInvoiceId)?.clientId) || null}
        mode={exportMode}
      />
    </AppLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'Paid': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Sent': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Overdue': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Draft': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
