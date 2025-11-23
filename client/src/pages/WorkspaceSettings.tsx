import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Building2, Globe, DollarSign } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Workspace } from '@shared/schema';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MXN'];
const countries = [
  'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 
  'Netherlands', 'Japan', 'Singapore', 'Mexico', 'Brazil', 'India', 'China'
];

export default function WorkspaceSettings() {
  const queryClient = useQueryClient();
  const { data: workspace } = useQuery<Workspace>({ queryKey: ['/api/workspace'] });
  
  const { register, handleSubmit, setValue, watch } = useForm<{
    name: string;
    defaultCurrency: string;
    defaultTaxCountry: string;
  }>();

  const updateWorkspaceMutation = useMutation({
    mutationFn: async (data: Partial<Workspace>) => {
      const res = await fetch('/api/workspace', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workspace'] });
      toast.success('Workspace settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update workspace settings');
    },
  });

  const onSubmit = (data: any) => {
    updateWorkspaceMutation.mutate(data);
  };

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading workspace settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-3xl font-heading font-bold tracking-tight">Workspace Settings</h2>
        <p className="text-muted-foreground">Configure your workspace defaults and preferences.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic information about your workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input 
                  id="name" 
                  defaultValue={workspace.name}
                  {...register('name')}
                  data-testid="input-workspace-name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Defaults
              </CardTitle>
              <CardDescription>Default currency for invoices and financial reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select 
                  defaultValue={workspace.defaultCurrency}
                  onValueChange={(value) => setValue('defaultCurrency', value)}
                >
                  <SelectTrigger id="defaultCurrency" data-testid="select-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Tax Settings
              </CardTitle>
              <CardDescription>Default country for tax calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="defaultTaxCountry">Default Tax Country</Label>
                <Select 
                  defaultValue={workspace.defaultTaxCountry || undefined}
                  onValueChange={(value) => setValue('defaultTaxCountry', value)}
                >
                  <SelectTrigger id="defaultTaxCountry" data-testid="select-tax-country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Your current plan and usage limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold capitalize">{workspace.plan} Plan</p>
                  <p className="text-sm text-muted-foreground">Upgrade to unlock more features</p>
                </div>
                <Button variant="outline" disabled>
                  Manage Plan
                </Button>
              </div>
            </CardContent>
          </Card>

        <div className="flex justify-end">
          <Button type="submit" data-testid="button-save-settings">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
