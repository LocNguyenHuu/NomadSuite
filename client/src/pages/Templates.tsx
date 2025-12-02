import React, { useState } from 'react';
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
  DialogFooter
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy,
  Star,
  MoreHorizontal,
  FileText,
  Palette,
  Hash,
  Receipt,
  CreditCard,
  AlignLeft,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useTemplates } from '@/hooks/use-templates';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAppI18n } from '@/contexts/AppI18nContext';
import { motion, useReducedMotion } from 'framer-motion';
import { EmptyState } from '@/components/ui/empty-state';
import { staggerContainer, staggerItem, fadeInUp, reducedMotionVariants } from '@/lib/motion';
import { TablePagination, usePagination } from '@/components/ui/table-pagination';
import type { InvoiceTemplate, TemplateBranding, TemplateTaxSettings, TemplatePaymentSettings, TemplateFooterSettings, TemplateColorTheme } from '@shared/schema';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'VND', 'CHF', 'AUD', 'CAD'] as const;
const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German (Deutsch)' },
  { value: 'fr', label: 'French (Français)' },
  { value: 'vi', label: 'Vietnamese (Tiếng Việt)' },
  { value: 'ja', label: 'Japanese (日本語)' },
  { value: 'zh', label: 'Chinese (中文)' },
] as const;

interface TemplateFormData {
  name: string;
  defaultCurrency: string;
  defaultLocale: string;
  isDefault: boolean;
  // Branding
  logoUrl: string;
  companyName: string;
  address: string;
  contactInfo: string;
  vatId: string;
  // Color theme
  primaryColor: string;
  accentColor: string;
  textColor: string;
  // Numbering
  invoiceNumberMask: string;
  invoicePrefix: string;
  // Tax
  taxRate: string;
  taxLabel: string;
  taxMode: 'exclusive' | 'inclusive';
  taxIdFieldVisible: boolean;
  reverseChargeEnabled: boolean;
  // Payment
  defaultTermsDays: string;
  paymentMethods: string;
  paymentInstructions: string;
  // Footer
  footerText: string;
}

const defaultFormValues: TemplateFormData = {
  name: '',
  defaultCurrency: 'USD',
  defaultLocale: 'en',
  isDefault: false,
  logoUrl: '',
  companyName: '',
  address: '',
  contactInfo: '',
  vatId: '',
  primaryColor: '#3B82F6',
  accentColor: '#1E40AF',
  textColor: '#1F2937',
  invoiceNumberMask: '{PREFIX}{YYYY}-{####}',
  invoicePrefix: 'INV-',
  taxRate: '',
  taxLabel: 'VAT',
  taxMode: 'exclusive',
  taxIdFieldVisible: true,
  reverseChargeEnabled: false,
  defaultTermsDays: '30',
  paymentMethods: '',
  paymentInstructions: '',
  footerText: '',
};

export default function Templates() {
  const { t } = useAppI18n();
  const { 
    templates, 
    isLoading,
    createTemplateAsync, 
    updateTemplateAsync, 
    deleteTemplateAsync,
    cloneTemplateAsync,
    setDefaultTemplateAsync,
    isCreating,
    isUpdating,
    isDeleting,
    isCloning,
    isSettingDefault
  } = useTemplates();
  const { toast } = useToast();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<InvoiceTemplate | null>(null);
  const [search, setSearch] = useState('');
  
  const { register, handleSubmit, control, reset, setValue, watch } = useForm<TemplateFormData>({
    defaultValues: defaultFormValues
  });
  
  const { register: registerEdit, handleSubmit: handleEditSubmit, control: controlEdit, reset: resetEdit, setValue: setEditValue, watch: watchEdit } = useForm<TemplateFormData>();
  const shouldReduceMotion = useReducedMotion();

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(search.toLowerCase()) ||
    template.defaultCurrency.toLowerCase().includes(search.toLowerCase()) ||
    template.defaultLocale.toLowerCase().includes(search.toLowerCase())
  );

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedTemplates,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(filteredTemplates, 10);

  const formDataToTemplate = (data: TemplateFormData) => {
    const branding: TemplateBranding = {
      logoUrl: data.logoUrl || undefined,
      companyName: data.companyName || undefined,
      address: data.address || undefined,
      contactInfo: data.contactInfo || undefined,
      vatId: data.vatId || undefined,
    };
    
    const colorTheme: TemplateColorTheme = {
      primaryColor: data.primaryColor || undefined,
      accentColor: data.accentColor || undefined,
      textColor: data.textColor || undefined,
    };
    
    const taxSettings: TemplateTaxSettings = {
      taxRate: data.taxRate ? parseFloat(data.taxRate) : undefined,
      taxLabel: data.taxLabel || undefined,
      taxMode: data.taxMode,
      taxIdFieldVisible: data.taxIdFieldVisible,
      reverseChargeEnabled: data.reverseChargeEnabled,
    };
    
    const paymentSettings: TemplatePaymentSettings = {
      defaultTermsDays: data.defaultTermsDays ? parseInt(data.defaultTermsDays) : undefined,
      paymentMethods: data.paymentMethods || undefined,
      paymentInstructions: data.paymentInstructions || undefined,
    };
    
    const footerSettings: TemplateFooterSettings = {
      footerText: data.footerText || undefined,
    };

    return {
      name: data.name,
      defaultCurrency: data.defaultCurrency,
      defaultLocale: data.defaultLocale,
      isDefault: data.isDefault,
      branding,
      colorTheme,
      invoiceNumberMask: data.invoiceNumberMask,
      invoicePrefix: data.invoicePrefix,
      taxSettings,
      paymentSettings,
      footerSettings,
    };
  };

  const templateToFormData = (template: InvoiceTemplate): TemplateFormData => {
    return {
      name: template.name,
      defaultCurrency: template.defaultCurrency,
      defaultLocale: template.defaultLocale,
      isDefault: template.isDefault ?? false,
      logoUrl: template.branding?.logoUrl || '',
      companyName: template.branding?.companyName || '',
      address: template.branding?.address || '',
      contactInfo: template.branding?.contactInfo || '',
      vatId: template.branding?.vatId || '',
      primaryColor: template.colorTheme?.primaryColor || '#3B82F6',
      accentColor: template.colorTheme?.accentColor || '#1E40AF',
      textColor: template.colorTheme?.textColor || '#1F2937',
      invoiceNumberMask: template.invoiceNumberMask || '{PREFIX}{YYYY}-{####}',
      invoicePrefix: template.invoicePrefix || 'INV-',
      taxRate: template.taxSettings?.taxRate?.toString() || '',
      taxLabel: template.taxSettings?.taxLabel || 'VAT',
      taxMode: template.taxSettings?.taxMode || 'exclusive',
      taxIdFieldVisible: template.taxSettings?.taxIdFieldVisible ?? true,
      reverseChargeEnabled: template.taxSettings?.reverseChargeEnabled ?? false,
      defaultTermsDays: template.paymentSettings?.defaultTermsDays?.toString() || '30',
      paymentMethods: template.paymentSettings?.paymentMethods || '',
      paymentInstructions: template.paymentSettings?.paymentInstructions || '',
      footerText: template.footerSettings?.footerText || '',
    };
  };

  const onCreateSubmit = async (data: TemplateFormData) => {
    try {
      await createTemplateAsync(formDataToTemplate(data));
      toast({ title: "Template created", description: "Your invoice template has been created." });
      setCreateDialogOpen(false);
      reset(defaultFormValues);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create template",
        variant: "destructive" 
      });
    }
  };

  const onEditSubmit = async (data: TemplateFormData) => {
    if (!editingTemplate) return;
    try {
      await updateTemplateAsync({ id: editingTemplate.id, data: formDataToTemplate(data) });
      toast({ title: "Template updated", description: "Your template has been updated." });
      setEditDialogOpen(false);
      setEditingTemplate(null);
      resetEdit();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update template",
        variant: "destructive" 
      });
    }
  };

  const handleEdit = (template: InvoiceTemplate) => {
    setEditingTemplate(template);
    resetEdit(templateToFormData(template));
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;
    try {
      await deleteTemplateAsync(templateToDelete.id);
      toast({ title: "Template deleted", description: "The template has been deleted." });
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete template",
        variant: "destructive" 
      });
    }
  };

  const handleClone = async (template: InvoiceTemplate) => {
    try {
      await cloneTemplateAsync(template.id);
      toast({ title: "Template cloned", description: "A copy of the template has been created." });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to clone template",
        variant: "destructive" 
      });
    }
  };

  const handleSetDefault = async (template: InvoiceTemplate) => {
    try {
      await setDefaultTemplateAsync(template.id);
      toast({ title: "Default set", description: `${template.name} is now your default template.` });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to set default template",
        variant: "destructive" 
      });
    }
  };

  const TemplateFormContent = ({ 
    register: formRegister, 
    control: formControl, 
    watch: formWatch 
  }: { 
    register: typeof register; 
    control: typeof control;
    watch: typeof watch;
  }) => (
    <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
      <Accordion type="multiple" defaultValue={['general', 'branding', 'numbering', 'tax', 'payment', 'footer']}>
        {/* General Settings */}
        <AccordionItem value="general">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>General Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input 
                id="name" 
                {...formRegister('name', { required: true })} 
                placeholder="e.g., German B2B, US Standard"
                data-testid="input-template-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Controller
                  name="defaultCurrency"
                  control={formControl}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(currency => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Locale</Label>
                <Controller
                  name="defaultLocale"
                  control={formControl}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-locale">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCALES.map(locale => (
                          <SelectItem key={locale.value} value={locale.value}>{locale.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Set as Default</Label>
                <p className="text-xs text-muted-foreground">Use this template by default for new invoices</p>
              </div>
              <Controller
                name="isDefault"
                control={formControl}
                render={({ field }) => (
                  <Switch 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    data-testid="switch-default"
                  />
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Branding */}
        <AccordionItem value="branding">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Branding & Company Info</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input 
                id="logoUrl" 
                {...formRegister('logoUrl')} 
                placeholder="https://example.com/logo.png"
                data-testid="input-logo-url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                {...formRegister('companyName')} 
                placeholder="Your Company Name"
                data-testid="input-company-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                {...formRegister('address')} 
                placeholder="123 Business Street&#10;City, State 12345&#10;Country"
                rows={3}
                data-testid="input-address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Info</Label>
              <Input 
                id="contactInfo" 
                {...formRegister('contactInfo')} 
                placeholder="email@company.com | +1 234 567 890"
                data-testid="input-contact"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatId">VAT/Tax ID</Label>
              <Input 
                id="vatId" 
                {...formRegister('vatId')} 
                placeholder="DE123456789"
                data-testid="input-vat-id"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="primaryColor" 
                    type="color"
                    {...formRegister('primaryColor')} 
                    className="w-12 h-10 p-1 cursor-pointer"
                    data-testid="input-primary-color"
                  />
                  <Input 
                    {...formRegister('primaryColor')} 
                    placeholder="#3B82F6"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="accentColor" 
                    type="color"
                    {...formRegister('accentColor')} 
                    className="w-12 h-10 p-1 cursor-pointer"
                    data-testid="input-accent-color"
                  />
                  <Input 
                    {...formRegister('accentColor')} 
                    placeholder="#1E40AF"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="textColor" 
                    type="color"
                    {...formRegister('textColor')} 
                    className="w-12 h-10 p-1 cursor-pointer"
                    data-testid="input-text-color"
                  />
                  <Input 
                    {...formRegister('textColor')} 
                    placeholder="#1F2937"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Invoice Numbering */}
        <AccordionItem value="numbering">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span>Invoice Numbering</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input 
                id="invoicePrefix" 
                {...formRegister('invoicePrefix')} 
                placeholder="INV-"
                data-testid="input-invoice-prefix"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceNumberMask">Number Format Pattern</Label>
              <Input 
                id="invoiceNumberMask" 
                {...formRegister('invoiceNumberMask')} 
                placeholder="{PREFIX}{YYYY}-{####}"
                data-testid="input-number-mask"
              />
              <p className="text-xs text-muted-foreground">
                Placeholders: {'{PREFIX}'} = prefix, {'{YYYY}'} = year, {'{YY}'} = short year, {'{####}'} = 4-digit number
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tax Settings */}
        <AccordionItem value="tax">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span>Tax & Pricing</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                <Input 
                  id="taxRate" 
                  type="number"
                  step="0.01"
                  {...formRegister('taxRate')} 
                  placeholder="19"
                  data-testid="input-tax-rate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxLabel">Tax Label</Label>
                <Input 
                  id="taxLabel" 
                  {...formRegister('taxLabel')} 
                  placeholder="VAT, GST, MwSt..."
                  data-testid="input-tax-label"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tax Mode</Label>
              <Controller
                name="taxMode"
                control={formControl}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger data-testid="select-tax-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exclusive">Tax Exclusive (add tax to subtotal)</SelectItem>
                      <SelectItem value="inclusive">Tax Inclusive (tax included in prices)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Customer Tax ID Field</Label>
                <p className="text-xs text-muted-foreground">Display tax ID field on invoices</p>
              </div>
              <Controller
                name="taxIdFieldVisible"
                control={formControl}
                render={({ field }) => (
                  <Switch 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    data-testid="switch-tax-id-visible"
                  />
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Reverse Charge</Label>
                <p className="text-xs text-muted-foreground">For EU B2B transactions</p>
              </div>
              <Controller
                name="reverseChargeEnabled"
                control={formControl}
                render={({ field }) => (
                  <Switch 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    data-testid="switch-reverse-charge"
                  />
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Payment Terms */}
        <AccordionItem value="payment">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Payment Terms</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="defaultTermsDays">Payment Due (days)</Label>
              <Input 
                id="defaultTermsDays" 
                type="number"
                {...formRegister('defaultTermsDays')} 
                placeholder="30"
                data-testid="input-payment-days"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethods">Payment Methods</Label>
              <Input 
                id="paymentMethods" 
                {...formRegister('paymentMethods')} 
                placeholder="Bank Transfer, PayPal, Credit Card"
                data-testid="input-payment-methods"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentInstructions">Payment Instructions</Label>
              <Textarea 
                id="paymentInstructions" 
                {...formRegister('paymentInstructions')} 
                placeholder="Bank: Example Bank&#10;IBAN: DE89 3704 0044 0532 0130 00&#10;BIC: COBADEFFXXX"
                rows={4}
                data-testid="input-payment-instructions"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Footer */}
        <AccordionItem value="footer">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <AlignLeft className="h-4 w-4" />
              <span>Footer</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="footerText">Footer Text</Label>
              <Textarea 
                id="footerText" 
                {...formRegister('footerText')} 
                placeholder="Thank you for your business!&#10;&#10;Questions? Contact us at support@company.com"
                rows={4}
                data-testid="input-footer-text"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <AppLayout>
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={shouldReduceMotion ? reducedMotionVariants : staggerContainer}
      >
        {/* Header */}
        <motion.div 
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="text-templates-title">
              Invoice Templates
            </h1>
            <p className="text-muted-foreground">
              Create and manage templates for your invoices with custom branding, tax settings, and more.
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-template">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="flex items-center gap-4"
          variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-templates"
            />
          </div>
          <Badge variant="secondary" data-testid="badge-template-count">
            {templates.length} template{templates.length !== 1 ? 's' : ''}
          </Badge>
        </motion.div>

        {/* Templates List */}
        <motion.div variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}>
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="mt-4 text-muted-foreground">Loading templates...</p>
              </CardContent>
            </Card>
          ) : templates.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No templates yet"
              description="Create your first invoice template to get started with custom branding and settings."
              action={
                <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-first-template">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Template
                </Button>
              }
            />
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Locale</TableHead>
                    <TableHead>Tax Rate</TableHead>
                    <TableHead>Prefix</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTemplates.map((template) => (
                    <TableRow key={template.id} data-testid={`row-template-${template.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {template.name}
                          {template.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Default
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.defaultCurrency}</Badge>
                      </TableCell>
                      <TableCell>
                        {LOCALES.find(l => l.value === template.defaultLocale)?.label || template.defaultLocale}
                      </TableCell>
                      <TableCell>
                        {template.taxSettings?.taxRate ? `${template.taxSettings.taxRate}%` : '-'}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-1 py-0.5 rounded">
                          {template.invoicePrefix || 'INV-'}
                        </code>
                      </TableCell>
                      <TableCell>
                        {format(new Date(template.updatedAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-template-actions-${template.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(template)} data-testid={`button-edit-template-${template.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleClone(template)} data-testid={`button-clone-template-${template.id}`}>
                              <Copy className="mr-2 h-4 w-4" />
                              Clone
                            </DropdownMenuItem>
                            {!template.isDefault && (
                              <DropdownMenuItem onClick={() => handleSetDefault(template)} data-testid={`button-set-default-${template.id}`}>
                                <Star className="mr-2 h-4 w-4" />
                                Set as Default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setTemplateToDelete(template);
                                setDeleteDialogOpen(true);
                              }}
                              data-testid={`button-delete-template-${template.id}`}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </Card>
          )}
        </motion.div>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Invoice Template</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreateSubmit)}>
            <TemplateFormContent register={register} control={control} watch={watch} />
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating} data-testid="button-save-template">
                {isCreating ? 'Creating...' : 'Create Template'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit(onEditSubmit)}>
            <TemplateFormContent register={registerEdit} control={controlEdit} watch={watchEdit} />
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} data-testid="button-update-template">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
