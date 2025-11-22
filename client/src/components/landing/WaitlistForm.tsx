import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getCsrfToken } from '@/lib/api';

interface WaitlistFormData {
  name: string;
  email: string;
  country: string;
  role: string;
  useCase: string;
  referralCode?: string;
  emailConsent: boolean;
}

export default function WaitlistForm() {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<WaitlistFormData>({
    defaultValues: {
      emailConsent: true,
    },
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Something went wrong, please try again.');
      }

      setIsSuccess(true);
      reset();
      toast({
        title: "Thank you! You're on the waitlist 🎉",
        description: "We'll notify you when we launch with exclusive founding member pricing.",
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong, please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="waitlist" className="py-20 bg-blue-50 transition-all duration-500">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              MVP Phase - Validating Idea
            </div>
            <p className="text-gray-600 max-w-xl mx-auto">
              We're verifying demand before launch. Join our waitlist to help us validate the idea and get exclusive early access.
            </p>
          </div>
          <Card className="border-2 border-blue-200">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                You're on the waitlist!
              </h3>
              <p className="text-gray-600 mb-6">
                We'll send you an email when we launch with exclusive founding member pricing.
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline">
                Join another person
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-20 bg-blue-50 transition-all duration-500">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            MVP Phase - Validating Idea
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            We're verifying demand before launch. Join our waitlist to help us validate the idea and get exclusive early access.
          </p>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Join the waitlist</CardTitle>
            <CardDescription className="text-lg mt-2">
              Be among the first to experience NomadSuite with exclusive early-bird pricing
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Your full name"
                  className="mt-1"
                  data-testid="input-waitlist-name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="you@example.com"
                  className="mt-1"
                  data-testid="input-waitlist-email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder="e.g., Portugal, Thailand, etc."
                  className="mt-1"
                  data-testid="input-waitlist-country"
                />
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role">What best describes you? *</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => {
                    setSelectedRole(value);
                    setValue('role', value);
                  }}
                >
                  <SelectTrigger className="mt-1" data-testid="select-waitlist-role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digital Nomad">Digital Nomad</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                    <SelectItem value="Agency/Team">Agency/Team</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('role', { required: 'Please select a role' })} />
                {errors.role && (
                  <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
                )}
              </div>

              {/* Use Case */}
              <div>
                <Label htmlFor="useCase">How do you plan to use NomadSuite?</Label>
                <Textarea
                  id="useCase"
                  {...register('useCase')}
                  placeholder="Tell us about your business and travel needs..."
                  rows={4}
                  className="mt-1"
                  data-testid="textarea-waitlist-usecase"
                />
              </div>

              {/* Referral Code */}
              <div>
                <Label htmlFor="referralCode">Referral Code (optional)</Label>
                <Input
                  id="referralCode"
                  {...register('referralCode')}
                  placeholder="Enter code if you have one"
                  className="mt-1"
                  data-testid="input-waitlist-referral"
                />
              </div>

              {/* Email Consent */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="emailConsent"
                  {...register('emailConsent', {
                    required: 'You must agree to receive updates',
                  })}
                  defaultChecked={true}
                  data-testid="checkbox-email-consent"
                />
                <div className="flex-1">
                  <Label htmlFor="emailConsent" className="text-sm font-normal cursor-pointer">
                    I agree to receive emails about NomadSuite *
                  </Label>
                  {errors.emailConsent && (
                    <p className="text-sm text-red-600 mt-1">{errors.emailConsent.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                data-testid="button-waitlist-submit"
              >
                {isSubmitting ? 'Joining waitlist...' : 'Join the waitlist'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
