import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, Clock, AlertTriangle, MoreVertical } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Documents() {
  const { documents } = useStore();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">Document Vault</h2>
            <p className="text-muted-foreground">Securely store your important travel docs.</p>
          </div>
          <Button className="shadow-lg shadow-primary/20">
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="group hover:shadow-md transition-all cursor-pointer border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-900/20">
                    <FileText className="h-6 w-6" />
                  </div>
                  <Button variant="ghost" size="icon" className="-mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-bold text-lg mb-1">{doc.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span className="capitalize">{doc.type}</span>
                </div>
                {doc.expiryDate && (
                  <div className="flex items-center gap-2 text-xs font-medium bg-orange-50 text-orange-700 px-2 py-1 rounded-md w-fit dark:bg-orange-900/20 dark:text-orange-400">
                    <Clock className="h-3 w-3" />
                    Expires: {doc.expiryDate}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {/* Upload Placeholder */}
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center p-6 h-full min-h-[200px] hover:bg-muted/50 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="font-medium text-muted-foreground">Drop files to upload</p>
            <p className="text-xs text-muted-foreground/70">PDF, JPG, PNG up to 10MB</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
