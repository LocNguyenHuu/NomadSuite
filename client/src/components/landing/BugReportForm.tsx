import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bug } from 'lucide-react';
import { getCsrfToken } from '@/lib/api';

interface BugReportFormData {
  name?: string;
  email?: string;
  description: string;
  contactConsent: boolean;
  screenshot?: FileList;
}

export default function BugReportForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BugReportFormData>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: BugReportFormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      if (data.name) formData.append('name', data.name);
      if (data.email) formData.append('email', data.email);
      formData.append('description', data.description);
      formData.append('contactConsent', String(data.contactConsent));
      
      if (data.screenshot && data.screenshot.length > 0) {
        formData.append('screenshot', data.screenshot[0]);
      }

      const headers: Record<string, string> = {};
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch('/api/bug-report', {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Something went wrong, please try again.');
      }

      toast({
        title: 'Thank you! Bug report submitted.',
        description: "We'll look into this issue and get back to you if needed.",
      });
      
      reset();
      setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" data-testid="button-bug-report-open">
          <Bug className="h-4 w-4" />
          Found a bug?
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report a Bug</DialogTitle>
          <DialogDescription>
            Help us improve NomadSuite by reporting any issues you encounter
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name (optional) */}
          <div>
            <Label htmlFor="bug-name">Name</Label>
            <Input
              id="bug-name"
              {...register('name')}
              placeholder="Your name (optional)"
              className="mt-1"
              data-testid="input-bug-name"
            />
          </div>

          {/* Email (optional) */}
          <div>
            <Label htmlFor="bug-email">Email</Label>
            <Input
              id="bug-email"
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="you@example.com (optional)"
              className="mt-1"
              data-testid="input-bug-email"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Bug Description */}
          <div>
            <Label htmlFor="description">Bug Description *</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Please describe the bug' })}
              placeholder="Describe what went wrong..."
              rows={4}
              className="mt-1"
              data-testid="textarea-bug-description"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Screenshot Upload */}
          <div>
            <Label htmlFor="screenshot">Screenshot (optional)</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              {...register('screenshot')}
              className="mt-1"
              data-testid="input-bug-screenshot"
            />
            <p className="text-xs text-muted-foreground mt-1">Upload a screenshot to help us understand the issue better</p>
          </div>

          {/* Contact Consent */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="contactConsent"
              {...register('contactConsent')}
              data-testid="checkbox-bug-consent"
            />
            <div className="flex-1">
              <Label htmlFor="contactConsent" className="text-sm font-normal cursor-pointer">
                I agree to send this report and be contacted if needed
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            data-testid="button-bug-submit"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
