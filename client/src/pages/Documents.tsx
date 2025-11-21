import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, Clock, Download, Trash2, Shield, Lock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface VaultDocument {
  id: number;
  name: string;
  type: string;
  country?: string;
  notes?: string;
  fileSize: number;
  mimeType: string;
  retentionPolicy: 'on_expiry' | 'after_upload' | 'indefinite';
  retentionMonths?: number;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface UploadFormData {
  name: string;
  type: string;
  country?: string;
  notes?: string;
  retentionPolicy: 'on_expiry' | 'after_upload' | 'indefinite';
  retentionMonths?: number;
  expiryDate?: string;
  file: FileList;
}

export default function Documents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(null);
  const { register, handleSubmit, control, reset, watch } = useForm<UploadFormData>();
  const retentionPolicy = watch('retentionPolicy');

  // Fetch vault documents
  const { data: documents = [], isLoading } = useQuery<VaultDocument[]>({
    queryKey: ['/api/vault/documents'],
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (data: UploadFormData) => {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      formData.append('metadata', JSON.stringify({
        name: data.name,
        type: data.type,
        country: data.country,
        notes: data.notes,
        retentionPolicy: data.retentionPolicy,
        retentionMonths: data.retentionMonths,
        expiryDate: data.expiryDate,
      }));

      const response = await fetch('/api/vault/documents', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vault/documents'] });
      toast({
        title: 'Document uploaded',
        description: 'Your document has been encrypted and stored securely.',
      });
      setUploadOpen(false);
      reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/vault/documents/${id}/download`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Download failed');
      }

      return response.json();
    },
    onSuccess: (data: { downloadUrl: string; filename: string }) => {
      // Open signed URL in new tab
      window.open(data.downloadUrl, '_blank');
      toast({
        title: 'Download ready',
        description: 'Your document will open in a new tab.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Download failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/vault/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Delete failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vault/documents'] });
      toast({
        title: 'Document deleted',
        description: 'Your document has been removed from the vault.',
      });
      setDeleteDialogOpen(false);
      setSelectedDoc(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: UploadFormData) => {
    if (!data.file || data.file.length === 0) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    uploadMutation.mutate(data);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">Document Vault</h2>
            <p className="text-muted-foreground">GDPR-compliant encrypted storage for your sensitive documents.</p>
          </div>
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20" data-testid="button-upload-document">
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Encrypted Document</DialogTitle>
                <DialogDescription>
                  Files are encrypted with AES-256-GCM and stored in EU-region object storage.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">File (PDF, JPG, PNG only - Max 10MB)</Label>
                  <Input 
                    id="file" 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    {...register('file', { required: true })} 
                    data-testid="input-file"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Document Name</Label>
                  <Input 
                    id="name" 
                    placeholder="My Passport" 
                    {...register('name', { required: true })} 
                    data-testid="input-name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger data-testid="select-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Passport">Passport</SelectItem>
                          <SelectItem value="Visa">Visa</SelectItem>
                          <SelectItem value="Tax Certificate">Tax Certificate</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Insurance">Insurance</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country (Optional)</Label>
                  <Input 
                    id="country" 
                    placeholder="Germany" 
                    {...register('country')} 
                    data-testid="input-country"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Additional information..." 
                    {...register('notes')} 
                    rows={3}
                    data-testid="input-notes"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="retentionPolicy">Retention Policy</Label>
                  <Controller
                    name="retentionPolicy"
                    control={control}
                    defaultValue="indefinite"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger data-testid="select-retention">
                          <SelectValue placeholder="Select retention policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="on_expiry">Delete on expiry date</SelectItem>
                          <SelectItem value="after_upload">Delete after upload (months)</SelectItem>
                          <SelectItem value="indefinite">Keep indefinitely (max 10 years)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {retentionPolicy === 'on_expiry' && (
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input 
                      id="expiryDate" 
                      type="date" 
                      {...register('expiryDate', { required: retentionPolicy === 'on_expiry' })} 
                      data-testid="input-expiry"
                    />
                  </div>
                )}
                {retentionPolicy === 'after_upload' && (
                  <div className="grid gap-2">
                    <Label htmlFor="retentionMonths">Retention Period (Months, max 120)</Label>
                    <Input 
                      id="retentionMonths" 
                      type="number" 
                      min="1"
                      max="120"
                      {...register('retentionMonths', { 
                        required: retentionPolicy === 'after_upload',
                        valueAsNumber: true 
                      })} 
                      data-testid="input-retention-months"
                    />
                  </div>
                )}
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-blue-900 dark:text-blue-100">
                    <strong>GDPR Compliance:</strong> All documents are encrypted at rest and in transit. 
                    Metadata is stored with AES-256-GCM encryption. Maximum retention is 10 years.
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={uploadMutation.isPending}
                    data-testid="button-submit-upload"
                  >
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* GDPR Notice */}
        <div className="flex items-start gap-3 p-4 bg-muted rounded-lg border">
          <Lock className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">End-to-End Encrypted Storage</p>
            <p className="text-muted-foreground">
              All documents are encrypted with AES-256-GCM before upload. Files are stored in EU-region object storage 
              with 5-minute signed URLs for secure downloads. All access is logged for GDPR compliance.
            </p>
          </div>
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading documents...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card 
                key={doc.id} 
                className="group hover:shadow-md transition-all border-border/50"
                data-testid={`card-document-${doc.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-900/20">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => downloadMutation.mutate(doc.id)}
                        disabled={downloadMutation.isPending}
                        data-testid={`button-download-${doc.id}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedDoc(doc);
                          setDeleteDialogOpen(true);
                        }}
                        data-testid={`button-delete-${doc.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1" data-testid={`text-name-${doc.id}`}>{doc.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="capitalize" data-testid={`text-type-${doc.id}`}>{doc.type}</span>
                    {doc.country && (
                      <>
                        <span>•</span>
                        <span data-testid={`text-country-${doc.id}`}>{doc.country}</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    {formatFileSize(doc.fileSize)} • {doc.mimeType.split('/')[1].toUpperCase()}
                  </div>
                  {doc.notes && (
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2" data-testid={`text-notes-${doc.id}`}>
                      {doc.notes}
                    </p>
                  )}
                  {doc.expiryDate && (
                    <div className="flex items-center gap-2 text-xs font-medium bg-orange-50 text-orange-700 px-2 py-1 rounded-md w-fit dark:bg-orange-900/20 dark:text-orange-400">
                      <Clock className="h-3 w-3" />
                      Expires: {format(new Date(doc.expiryDate), 'MMM d, yyyy')}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span>{format(new Date(doc.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Retention:</span>
                      <span className="capitalize">{doc.retentionPolicy.replace('_', ' ')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Upload Placeholder */}
            <div 
              onClick={() => setUploadOpen(true)}
              className="border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center p-6 h-full min-h-[280px] hover:bg-muted/50 transition-colors cursor-pointer"
              data-testid="button-upload-placeholder"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="font-medium text-muted-foreground">Drop files to upload</p>
              <p className="text-xs text-muted-foreground/70">PDF, JPG, PNG up to 10MB</p>
              <p className="text-xs text-muted-foreground/70 mt-1">AES-256 encrypted</p>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Document?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedDoc?.name}"? This action will soft-delete the document 
                and it will be permanently removed according to the retention policy (max 10 years).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedDoc && deleteMutation.mutate(selectedDoc.id)}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
