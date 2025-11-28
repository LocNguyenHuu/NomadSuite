import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb } from 'lucide-react';
import { getCsrfToken } from '@/lib/api';

interface FeatureRequestFormData {
  name?: string;
  email?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  contactConsent: boolean;
}

export default function FeatureRequestForm() {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FeatureRequestFormData>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  const onSubmit = async (data: FeatureRequestFormData) => {
    setIsSubmitting(true);
    
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch('/api/feature-request', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Something went wrong, please try again.');
      }

      toast({
        title: 'Thank you! Feature request submitted.',
        description: "We'll review your idea and keep you updated on its progress.",
      });
      
      reset();
      setSelectedCategory('');
      setSelectedPriority('');
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
        <Button variant="ghost" size="sm" className="gap-2" data-testid="button-feature-request-open">
          <Lightbulb className="h-4 w-4" />
          Request a feature
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Feature</DialogTitle>
          <DialogDescription>
            Have an idea to improve NomadSuite? We'd love to hear it!
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name (optional) */}
          <div>
            <Label htmlFor="feature-name">Name</Label>
            <Input
              id="feature-name"
              {...register('name')}
              placeholder="Your name (optional)"
              className="mt-1"
              data-testid="input-feature-name"
            />
          </div>

          {/* Email (optional) */}
          <div>
            <Label htmlFor="feature-email">Email</Label>
            <Input
              id="feature-email"
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="you@example.com (optional)"
              className="mt-1"
              data-testid="input-feature-email"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Feature Title */}
          <div>
            <Label htmlFor="feature-title">Feature Title *</Label>
            <Input
              id="feature-title"
              {...register('title', { required: 'Please provide a title for your feature request' })}
              placeholder="e.g., Dark mode support"
              className="mt-1"
              data-testid="input-feature-title"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="feature-category">Category *</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setValue('category', value);
              }}
            >
              <SelectTrigger className="mt-1" data-testid="select-feature-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Invoicing">Invoicing</SelectItem>
                <SelectItem value="Clients/CRM">Clients / CRM</SelectItem>
                <SelectItem value="Travel Tracking">Travel Tracking</SelectItem>
                <SelectItem value="Visa/Tax Alerts">Visa / Tax Alerts</SelectItem>
                <SelectItem value="Documents">Documents</SelectItem>
                <SelectItem value="UI/UX">UI / UX</SelectItem>
                <SelectItem value="Integrations">Integrations</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register('category', { required: 'Please select a category' })} />
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="feature-priority">How important is this to you?</Label>
            <Select
              value={selectedPriority}
              onValueChange={(value) => {
                setSelectedPriority(value);
                setValue('priority', value);
              }}
            >
              <SelectTrigger className="mt-1" data-testid="select-feature-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nice to have">Nice to have</SelectItem>
                <SelectItem value="Would use regularly">Would use regularly</SelectItem>
                <SelectItem value="Critical for my workflow">Critical for my workflow</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register('priority')} />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="feature-description">Description *</Label>
            <Textarea
              id="feature-description"
              {...register('description', { required: 'Please describe the feature you want' })}
              placeholder="Describe your feature idea in detail. What problem does it solve? How would it work?"
              rows={4}
              className="mt-1"
              data-testid="textarea-feature-description"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Contact Consent */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="feature-contactConsent"
              {...register('contactConsent')}
              data-testid="checkbox-feature-consent"
            />
            <div className="flex-1">
              <Label htmlFor="feature-contactConsent" className="text-sm font-normal cursor-pointer">
                I agree to be contacted about this feature request
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            data-testid="button-feature-submit"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feature Request'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
