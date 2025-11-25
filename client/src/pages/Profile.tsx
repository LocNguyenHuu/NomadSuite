import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Building, CreditCard, Lock } from "lucide-react";
import type { User as UserType } from "@shared/schema";
import { useAppI18n } from "@/contexts/AppI18nContext";

const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  homeCountry: z.string().optional(),
  currentCountry: z.string().optional(),
});

const businessInfoSchema = z.object({
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  vatId: z.string().optional(),
  taxRegime: z.string().optional(),
});

const bankInfoSchema = z.object({
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  iban: z.string().optional(),
  swift: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PersonalInfo = z.infer<typeof personalInfoSchema>;
type BusinessInfo = z.infer<typeof businessInfoSchema>;
type BankInfo = z.infer<typeof bankInfoSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { t } = useAppI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("personal");

  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserType>) => {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
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

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const personalForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    values: user ? {
      name: user.name,
      email: user.email,
      homeCountry: user.homeCountry || "",
      currentCountry: user.currentCountry || "",
    } : undefined,
  });

  const businessForm = useForm<BusinessInfo>({
    resolver: zodResolver(businessInfoSchema),
    values: user ? {
      businessName: user.businessName || "",
      businessAddress: user.businessAddress || "",
      vatId: user.vatId || "",
      taxRegime: user.taxRegime || "",
    } : undefined,
  });

  const bankForm = useForm<BankInfo>({
    resolver: zodResolver(bankInfoSchema),
    values: user ? {
      bankName: user.bankName || "",
      accountNumber: user.accountNumber || "",
      iban: user.iban || "",
      swift: user.swift || "",
    } : undefined,
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPersonalSubmit = (data: PersonalInfo) => {
    updateProfileMutation.mutate(data);
  };

  const onBusinessSubmit = (data: BusinessInfo) => {
    updateProfileMutation.mutate(data);
  };

  const onBankSubmit = (data: BankInfo) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
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
          <h1 className="text-3xl font-bold mb-2">{t('profile.title')}</h1>
          <p className="text-muted-foreground">
            Manage your account settings and business information
          </p>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" data-testid="tab-personal">
            <User className="h-4 w-4 mr-2" />
            {t('profile.personalInfo')}
          </TabsTrigger>
          <TabsTrigger value="business" data-testid="tab-business">
            <Building className="h-4 w-4 mr-2" />
            {t('profile.businessInfo')}
          </TabsTrigger>
          <TabsTrigger value="bank" data-testid="tab-bank">
            <CreditCard className="h-4 w-4 mr-2" />
            {t('profile.bankDetails')}
          </TabsTrigger>
          <TabsTrigger value="security" data-testid="tab-security">
            <Lock className="h-4 w-4 mr-2" />
            {t('profile.security')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...personalForm.register("name")}
                    data-testid="input-name"
                  />
                  {personalForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {personalForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...personalForm.register("email")}
                    data-testid="input-email"
                  />
                  {personalForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {personalForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="homeCountry">Home Country</Label>
                    <Input
                      id="homeCountry"
                      placeholder="e.g., USA"
                      {...personalForm.register("homeCountry")}
                      data-testid="input-home-country"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="currentCountry">Current Country</Label>
                    <Input
                      id="currentCountry"
                      placeholder="e.g., Japan"
                      {...personalForm.register("currentCountry")}
                      data-testid="input-current-country"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-personal"
                >
                  {updateProfileMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Manage your business details for invoicing and tax compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="Your Company LLC"
                    {...businessForm.register("businessName")}
                    data-testid="input-business-name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input
                    id="businessAddress"
                    placeholder="123 Main St, City, Country"
                    {...businessForm.register("businessAddress")}
                    data-testid="input-business-address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vatId">VAT ID / Tax ID</Label>
                    <Input
                      id="vatId"
                      placeholder="DE123456789"
                      {...businessForm.register("vatId")}
                      data-testid="input-vat-id"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="taxRegime">Tax Regime</Label>
                    <Input
                      id="taxRegime"
                      placeholder="e.g., standard, kleinunternehmer"
                      {...businessForm.register("taxRegime")}
                      data-testid="input-tax-regime"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-business"
                >
                  {updateProfileMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <CardTitle>Bank Information</CardTitle>
              <CardDescription>
                Add your bank details for invoice payment instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Your Bank"
                    {...bankForm.register("bankName")}
                    data-testid="input-bank-name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="1234567890"
                    {...bankForm.register("accountNumber")}
                    data-testid="input-account-number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="iban">IBAN</Label>
                    <Input
                      id="iban"
                      placeholder="DE89370400440532013000"
                      {...bankForm.register("iban")}
                      data-testid="input-iban"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="swift">SWIFT / BIC</Label>
                    <Input
                      id="swift"
                      placeholder="COBADEFFXXX"
                      {...bankForm.register("swift")}
                      data-testid="input-swift"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-bank"
                >
                  {updateProfileMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register("currentPassword")}
                    data-testid="input-current-password"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword")}
                    data-testid="input-new-password"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    data-testid="input-confirm-password"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  data-testid="button-change-password"
                >
                  {changePasswordMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AppLayout>
  );
}
