import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Client, ClientNote, InsertClientNote, Invoice, Trip, Document, InsertClient } from '@shared/schema';
import { Loader2, ArrowLeft, Phone, Mail, MapPin, Calendar, FileText, Plane, Plus, Clock, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

export default function ClientDetail() {
  const [match, params] = useRoute("/app/clients/:id");
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const clientId = parseInt(params?.id || '0');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: client, isLoading: clientLoading } = useQuery<Client>({
    queryKey: [`/api/clients/${clientId}`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/clients/${clientId}`);
      return res.json();
    },
    enabled: !!clientId
  });

  const { data: notes, isLoading: notesLoading } = useQuery<ClientNote[]>({
    queryKey: [`/api/clients/${clientId}/notes`],
    queryFn: async () => {
        const res = await apiRequest('GET', `/api/clients/${clientId}/notes`);
        return res.json();
    },
    enabled: !!clientId,
  });

  // We can also fetch invoices to show in timeline
  const { data: invoices } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
  });
  
  // We can fetch trips to show in timeline
  const { data: trips } = useQuery<Trip[]>({
    queryKey: ['/api/trips'],
  });

  const clientInvoices = invoices?.filter(i => i.clientId === clientId) || [];
  // Trips don't link to client directly in schema (trips table has country, notes, userId). 
  // Spec says "Button 'Add Trip'... allows user to log relevant travel (if travel is client-related)".
  // Schema update didn't link trips to clients. I'll skip trips in timeline for now unless I can infer from country match?
  // Let's just show invoices and notes in timeline.

  const createNoteMutation = useMutation({
    mutationFn: async (note: InsertClientNote) => {
      const res = await apiRequest('POST', `/api/clients/${clientId}/notes`, note);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/notes`] });
      toast({ title: "Note added" });
      resetNote();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await apiRequest('PATCH', `/api/clients/${clientId}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] }); // update list view too
      toast({ title: "Status updated" });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async (data: Partial<InsertClient>) => {
      const res = await apiRequest('PATCH', `/api/clients/${clientId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({ title: "Client updated successfully" });
      setEditDialogOpen(false);
    },
  });

  const { register: registerNote, handleSubmit: handleNoteSubmit, reset: resetNote } = useForm<InsertClientNote>();
  const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm<Partial<InsertClient>>();

  // Reset edit form when client data loads or dialog opens
  useEffect(() => {
    if (client && editDialogOpen) {
      resetEdit({
        name: client.name,
        email: client.email,
        country: client.country,
        notes: client.notes || '',
        status: client.status,
      });
    }
  }, [client, editDialogOpen, resetEdit]);

  const onNoteSubmit = (data: any) => {
    createNoteMutation.mutate({
      ...data,
      clientId,
      type: data.type || 'Note',
      date: new Date().toISOString(), // Ensure date is sent
    });
  };

  const onEditSubmit = (data: any) => {
    updateClientMutation.mutate(data);
  };

  if (clientLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </AppLayout>
    );
  }

  if (!client) {
    return (
        <AppLayout>
            <div className="p-8">Client not found</div>
        </AppLayout>
    )
  }

  // Merge notes and invoices for timeline
  const timelineItems = [
    ...(notes || []).map(n => ({ type: 'note', date: new Date(n.date), data: n })),
    ...clientInvoices.map(i => ({ type: 'invoice', date: new Date(i.issuedAt || i.createdAt || new Date()), data: i })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button variant="ghost" className="w-fit -ml-4 text-muted-foreground" onClick={() => setLocation('/app/clients')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {client.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold font-heading">{client.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{client.country}</span>
                  <span className="text-border">|</span>
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              
              <Select 
                defaultValue={client.status} 
                onValueChange={(val) => updateStatusMutation.mutate(val)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => setLocation('/app/invoices')}>
                <FileText className="mr-2 h-4 w-4" /> Create Invoice
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timeline">Timeline & Notes</TabsTrigger>
            <TabsTrigger value="details">Contact Details</TabsTrigger>
            <TabsTrigger value="projects" disabled>Projects (Coming Soon)</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            {/* Add Note */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Add Note</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNoteSubmit(onNoteSubmit)} className="space-y-4">
                  <Textarea 
                    placeholder="Log a call, meeting, or thought..." 
                    className="min-h-[100px]"
                    {...registerNote('content', { required: true })}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Select onValueChange={(val) => registerNote('type').onChange({ target: { value: val, name: 'type' } } as any)} defaultValue="Note">
                         <SelectTrigger className="w-[130px] h-8 text-xs">
                           <SelectValue placeholder="Type" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Note">Note</SelectItem>
                           <SelectItem value="Call">Call</SelectItem>
                           <SelectItem value="Email">Email</SelectItem>
                           <SelectItem value="Meeting">Meeting</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                    <Button size="sm" type="submit" disabled={createNoteMutation.isPending}>
                      {createNoteMutation.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                      Add Note
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Timeline Stream */}
            <div className="space-y-6 relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {timelineItems.length === 0 && (
                  <div className="text-muted-foreground text-sm italic">No activity yet.</div>
              )}
              
              {timelineItems.map((item: any, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-8 top-1 h-6 w-6 rounded-full border bg-background flex items-center justify-center z-10">
                    {item.type === 'note' && <FileText className="h-3 w-3 text-muted-foreground" />}
                    {item.type === 'invoice' && <FileText className="h-3 w-3 text-primary" />}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                            {format(item.date, 'MMM d, yyyy h:mm a')}
                        </span>
                        {item.type === 'invoice' && (
                            <Badge variant="outline" className="text-[10px] h-5">System</Badge>
                        )}
                        {item.type === 'note' && (
                            <Badge variant="secondary" className="text-[10px] h-5">{item.data.type}</Badge>
                        )}
                    </div>
                    
                    <Card className="p-4">
                        {item.type === 'note' ? (
                            <p className="text-sm whitespace-pre-wrap">{item.data.content}</p>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="font-medium">Invoice #{item.data.invoiceNumber} Created</span>
                                </div>
                                <span className="font-bold">{(item.data.amount / 100).toLocaleString()} {item.data.currency}</span>
                            </div>
                        )}
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Manage contact details and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Company Name</span>
                        <p className="text-lg font-medium">{client.name}</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Email Address</span>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p className="text-lg">{client.email}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Country</span>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <p className="text-lg">{client.country}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Status</span>
                        <Badge variant="outline" className="mt-1">{client.status}</Badge>
                    </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Notes</span>
                    <p className="text-sm text-muted-foreground italic">
                        {client.notes || "No initial notes provided."}
                    </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Client Name *</Label>
                <Input 
                  id="edit-name" 
                  {...registerEdit('name', { required: true })} 
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  {...registerEdit('email', { required: true })} 
                  placeholder="contact@acme.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-country">Country *</Label>
                <Input 
                  id="edit-country" 
                  {...registerEdit('country', { required: true })} 
                  placeholder="United States"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select 
                  onValueChange={(val) => registerEdit('status').onChange({ target: { value: val, name: 'status' } } as any)}
                  defaultValue={client.status}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea 
                id="edit-notes" 
                {...registerEdit('notes')} 
                placeholder="Add any notes about this client..."
                className="min-h-[100px]"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateClientMutation.isPending}>
                {updateClientMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
