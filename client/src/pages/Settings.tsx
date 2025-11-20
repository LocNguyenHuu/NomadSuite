import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { User } from '@shared/schema';
import { Loader2 } from 'lucide-react';

type SettingsFormData = {
  name: string;
  homeCountry: string;
  currentCountry: string;
};

export default function Settings() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { isDirty }, reset } = useForm<SettingsFormData>({
    defaultValues: {
      name: user?.name || '',
      homeCountry: user?.homeCountry || '',
      currentCountry: user?.currentCountry || '',
    },
    values: user ? {
      name: user.name,
      homeCountry: user.homeCountry || '',
      currentCountry: user.currentCountry || '',
    } : undefined
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      const res = await apiRequest("PATCH", "/api/user", data);
      return await res.json();
    },
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Profile updated",
        description: "Your settings have been saved successfully.",
      });
      reset({
        name: updatedUser.name,
        homeCountry: updatedUser.homeCountry || '',
        currentCountry: updatedUser.currentCountry || '',
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-2xl mx-auto">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account preferences and profile.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details and location.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name', { required: true })} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Contact support to change your email address.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="homeCountry">Home Country</Label>
                  <Input id="homeCountry" placeholder="e.g. USA" {...register('homeCountry')} />
                  <p className="text-xs text-muted-foreground">Used for tax residency calculations.</p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="currentCountry">Current Location</Label>
                  <Input id="currentCountry" placeholder="e.g. Japan" {...register('currentCountry')} />
                  <p className="text-xs text-muted-foreground">Your current base of operations.</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={!isDirty || updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Role</CardTitle>
            <CardDescription>Your current permission level.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div>
                <p className="font-medium capitalize">{user?.role}</p>
                <p className="text-sm text-muted-foreground">
                  {user?.role === 'admin' 
                    ? 'You have full access to all features and admin dashboard.' 
                    : 'You have access to standard features.'}
                </p>
              </div>
              {user?.role === 'admin' && (
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Admin
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
