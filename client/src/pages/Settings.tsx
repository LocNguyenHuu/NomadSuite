import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Globe, DollarSign, FileText } from "lucide-react";
import type { User as UserType } from "@shared/schema";

const settingsSchema = z.object({
  primaryLanguage: z.enum(["en", "de", "fr"]),
  defaultCurrency: z.string().min(1, "Currency is required"),
  defaultInvoiceLanguage: z.enum(["en", "de", "fr"]),
  timezone: z.string().min(1, "Timezone is required"),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "DD.MM.YYYY"]),
  invoicePrefix: z.string().min(1, "Invoice prefix is required"),
});

type SettingsForm = z.infer<typeof settingsSchema>;

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch (German)" },
  { value: "fr", label: "Français (French)" },
];

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "AUD", label: "AUD - Australian Dollar" },
];

const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (US)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (UK/International)" },
  { value: "DD.MM.YYYY", label: "DD.MM.YYYY (German)" },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris, Berlin, Rome" },
  { value: "Europe/Athens", label: "Athens, Bucharest" },
  { value: "Asia/Tokyo", label: "Tokyo, Osaka" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Bangkok", label: "Bangkok" },
  { value: "Australia/Sydney", label: "Sydney" },
];

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<SettingsForm>) => {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update settings");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    values: user ? {
      primaryLanguage: (user.primaryLanguage || "en") as "en" | "de" | "fr",
      defaultCurrency: user.defaultCurrency || "USD",
      defaultInvoiceLanguage: (user.defaultInvoiceLanguage || "en") as "en" | "de" | "fr",
      timezone: user.timezone || "UTC",
      dateFormat: (user.dateFormat || "MM/DD/YYYY") as "MM/DD/YYYY" | "DD/MM/YYYY" | "DD.MM.YYYY",
      invoicePrefix: user.invoicePrefix || "NS-",
    } : undefined,
  });

  const onSubmit = (data: SettingsForm) => {
    updateSettingsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences and default settings
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Language & Regional Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Regional Settings
              </CardTitle>
              <CardDescription>
                Set your preferred language, timezone, and date format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="primaryLanguage">Primary Language</Label>
                <Select
                  value={form.watch("primaryLanguage")}
                  onValueChange={(value) => form.setValue("primaryLanguage", value as "en" | "de" | "fr")}
                >
                  <SelectTrigger id="primaryLanguage" data-testid="select-primary-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.primaryLanguage && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.primaryLanguage.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={form.watch("timezone")}
                  onValueChange={(value) => form.setValue("timezone", value)}
                >
                  <SelectTrigger id="timezone" data-testid="select-timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.timezone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.timezone.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={form.watch("dateFormat")}
                  onValueChange={(value) => form.setValue("dateFormat", value as "MM/DD/YYYY" | "DD/MM/YYYY" | "DD.MM.YYYY")}
                >
                  <SelectTrigger id="dateFormat" data-testid="select-date-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.dateFormat && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.dateFormat.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Settings
              </CardTitle>
              <CardDescription>
                Configure default invoice preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select
                  value={form.watch("defaultCurrency")}
                  onValueChange={(value) => form.setValue("defaultCurrency", value)}
                >
                  <SelectTrigger id="defaultCurrency" data-testid="select-default-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.defaultCurrency && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.defaultCurrency.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="defaultInvoiceLanguage">Default Invoice Language</Label>
                <Select
                  value={form.watch("defaultInvoiceLanguage")}
                  onValueChange={(value) => form.setValue("defaultInvoiceLanguage", value as "en" | "de" | "fr")}
                >
                  <SelectTrigger id="defaultInvoiceLanguage" data-testid="select-default-invoice-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.defaultInvoiceLanguage && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.defaultInvoiceLanguage.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                <Input
                  id="invoicePrefix"
                  {...form.register("invoicePrefix")}
                  placeholder="NS-"
                  data-testid="input-invoice-prefix"
                />
                <p className="text-sm text-muted-foreground">
                  Invoices will be numbered as: {form.watch("invoicePrefix")}2025-00001
                </p>
                {form.formState.errors.invoicePrefix && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.invoicePrefix.message}
                  </p>
                )}
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">PDF Template Style</h4>
                <p className="text-sm text-muted-foreground">
                  Default template (MVP version)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateSettingsMutation.isPending}
              data-testid="button-save-settings"
            >
              {updateSettingsMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
