import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Info, Download, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
  amount: number;
  currency: string;
  language?: string | null;
  country?: string | null;
  customerVatId?: string | null;
  reverseCharge?: boolean | null;
  exchangeRate?: string | null;
}

interface Client {
  id: number;
  name: string;
  email: string;
  country: string;
}

interface JurisdictionRule {
  id: number;
  country: string;
  countryName: string;
  supportedLanguages: string[];
  defaultLanguage: string;
  defaultCurrency: string;
  requiresVatId: boolean;
  requiresCustomerVatId: boolean;
  supportsReverseCharge: boolean;
  languageNote?: string;
  complianceNotes?: string;
}

interface InvoiceExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  client: Client | null;
  mode: 'pdf' | 'email';
}

export function InvoiceExportDialog({ 
  open, 
  onOpenChange, 
  invoice, 
  client,
  mode 
}: InvoiceExportDialogProps) {
  const queryClient = useQueryClient();
  
  // Form state
  const [language, setLanguage] = useState<string>('en');
  const [currency, setCurrency] = useState<string>('USD');
  const [customerVatId, setCustomerVatId] = useState<string>('');
  const [reverseCharge, setReverseCharge] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<string>('');
  
  // Fetch jurisdiction rules
  const { data: jurisdictionRules = [] } = useQuery<JurisdictionRule[]>({
    queryKey: ['/api/jurisdictions'],
  });
  
  // Get jurisdiction rule for client's country
  const clientJurisdiction = jurisdictionRules.find(
    rule => rule.country === client?.country
  );
  
  // Initialize form with invoice/jurisdiction defaults
  useEffect(() => {
    if (invoice && open) {
      setLanguage(invoice.language || clientJurisdiction?.defaultLanguage || 'en');
      setCurrency(invoice.currency || clientJurisdiction?.defaultCurrency || 'USD');
      setCustomerVatId(invoice.customerVatId || '');
      setReverseCharge(invoice.reverseCharge || false);
      setExchangeRate(invoice.exchangeRate || '');
    }
  }, [invoice, clientJurisdiction, open]);
  
  // PDF download mutation
  const downloadMutation = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams({
        language,
        currency,
        ...(customerVatId && { customerVatId }),
        ...(reverseCharge && { reverseCharge: 'true' }),
        ...(exchangeRate && { exchangeRate }),
      });
      
      const res = await fetch(`/api/invoices/${invoice!.id}/pdf?${params}`);
      if (!res.ok) throw new Error('Failed to generate PDF');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice!.invoiceNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('PDF downloaded successfully');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to download PDF');
    },
  });
  
  // Email mutation
  const emailMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/invoices/${invoice!.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          currency,
          customerVatId: customerVatId || undefined,
          reverseCharge,
          exchangeRate: exchangeRate || undefined,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to send email' }));
        throw new Error(errorData.error || 'Failed to send email');
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast.success(`Invoice emailed to ${client?.email}`);
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  
  const handleExport = () => {
    if (mode === 'pdf') {
      downloadMutation.mutate();
    } else {
      emailMutation.mutate();
    }
  };
  
  const availableLanguages = clientJurisdiction?.supportedLanguages || ['en'];
  const isPending = downloadMutation.isPending || emailMutation.isPending;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'pdf' ? 'Export Invoice PDF' : 'Email Invoice'}
          </DialogTitle>
          <DialogDescription>
            Configure invoice settings for {client?.name} before {mode === 'pdf' ? 'exporting' : 'sending'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Client Info */}
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Invoice Number</p>
                <p className="font-medium">{invoice?.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Client</p>
                <p className="font-medium">{client?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Country</p>
                <p className="font-medium">{client?.country}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-medium">{currency} {invoice?.amount?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Compliance Info */}
          {clientJurisdiction && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>{clientJurisdiction.countryName} Requirements:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  {clientJurisdiction.requiresVatId && (
                    <li>• Your VAT ID is required</li>
                  )}
                  {clientJurisdiction.requiresCustomerVatId && (
                    <li>• Customer VAT ID recommended for B2B transactions</li>
                  )}
                  {clientJurisdiction.supportsReverseCharge && (
                    <li>• Reverse charge may apply for cross-border B2B services</li>
                  )}
                  {clientJurisdiction.languageNote && (
                    <li>• {clientJurisdiction.languageNote}</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Configuration Form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Invoice Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" data-testid="select-invoice-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                placeholder="USD, EUR, GBP..."
                data-testid="input-currency"
              />
            </div>
            
            {clientJurisdiction?.requiresCustomerVatId && (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="customerVatId">Customer VAT ID (Optional)</Label>
                <Input
                  id="customerVatId"
                  value={customerVatId}
                  onChange={(e) => setCustomerVatId(e.target.value)}
                  placeholder="e.g., DE123456789"
                  data-testid="input-customer-vat-id"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="exchangeRate">Exchange Rate (Optional)</Label>
              <Input
                id="exchangeRate"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                placeholder="e.g., 1.27"
                type="number"
                step="0.01"
                data-testid="input-exchange-rate"
              />
            </div>
            
            {clientJurisdiction?.supportsReverseCharge && (
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="reverseCharge"
                  checked={reverseCharge}
                  onCheckedChange={(checked) => setReverseCharge(checked as boolean)}
                  data-testid="checkbox-reverse-charge"
                />
                <Label
                  htmlFor="reverseCharge"
                  className="text-sm font-normal cursor-pointer"
                >
                  Apply reverse charge (B2B cross-border)
                </Label>
              </div>
            )}
          </div>
          
          {mode === 'email' && (
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Invoice will be sent to: <strong>{client?.email}</strong>
                <br />
                Make sure you have configured your RESEND_API_KEY environment variable.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isPending}
            data-testid={mode === 'pdf' ? 'button-export-pdf' : 'button-send-email'}
          >
            {isPending ? (
              mode === 'pdf' ? 'Generating...' : 'Sending...'
            ) : (
              <>
                {mode === 'pdf' ? (
                  <><Download className="h-4 w-4 mr-2" /> Export PDF</>
                ) : (
                  <><Mail className="h-4 w-4 mr-2" /> Send Email</>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
