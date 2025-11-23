import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bug, Camera, MessageSquare, Zap, Heart, CheckCircle2 } from 'lucide-react';
import { getCsrfToken } from '@/lib/api';

interface BugReportFormData {
  name?: string;
  email?: string;
  description: string;
  contactConsent: boolean;
  screenshot?: FileList;
}

export default function BugReportSection() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BugReportFormData>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
        title: '🎉 Thank you for helping us improve!',
        description: "Your feedback is invaluable. We'll review this and fix it ASAP.",
      });
      
      setIsSuccess(true);
      reset();
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
      <section id="bug-report" className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-2 border-orange-200">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Report Submitted Successfully! 🙌
              </h3>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                You're helping us build a better product! We'll investigate this issue and keep improving NomadSuite based on feedback from amazing MVP testers like you.
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline" className="gap-2">
                <Bug className="h-4 w-4" />
                Report Another Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="bug-report" className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            MVP Testing Phase - Your Feedback Matters!
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Found a Bug? Help Us Fix It! 🐛
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            You're using an <span className="font-semibold text-orange-600">early MVP version</span> of NomadSuite. 
            Every bug you report helps us build a better product for the entire digital nomad community.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-orange-200 hover:border-orange-400 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="bg-orange-100 rounded-full p-3 w-fit mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Direct Impact</h3>
              <p className="text-sm text-gray-600">Your report goes straight to our dev team and gets prioritized</p>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 hover:border-orange-400 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="bg-orange-100 rounded-full p-3 w-fit mx-auto mb-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Fixes</h3>
              <p className="text-sm text-gray-600">We push updates frequently during MVP testing</p>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 hover:border-orange-400 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="bg-orange-100 rounded-full p-3 w-fit mx-auto mb-4">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Shape the Product</h3>
              <p className="text-sm text-gray-600">Help us build the perfect tool for digital nomads</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Form */}
        <Card className="border-2 border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Bug className="h-6 w-6 text-orange-600" />
              Report an Issue
            </CardTitle>
            <CardDescription className="text-base">
              Describe what went wrong. Screenshots are super helpful! 📸
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Description */}
              <div>
                <Label htmlFor="bug-description" className="text-base font-semibold">
                  What happened? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="bug-description"
                  {...register('description', { 
                    required: 'Please describe the issue',
                    minLength: { value: 10, message: 'Please provide more details (at least 10 characters)' }
                  })}
                  placeholder="Example: When I click 'Create Invoice', nothing happens and I see an error message..."
                  rows={5}
                  className="mt-2"
                  data-testid="textarea-bug-description"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  💡 Tip: Include what you were trying to do, what you expected, and what actually happened
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <Label htmlFor="bug-name">Your Name (Optional)</Label>
                  <Input
                    id="bug-name"
                    {...register('name')}
                    placeholder="Alex"
                    className="mt-2"
                    data-testid="input-bug-name"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="bug-email">Email (Optional)</Label>
                  <Input
                    id="bug-email"
                    type="email"
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    placeholder="alex@example.com"
                    className="mt-2"
                    data-testid="input-bug-email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    So we can follow up if needed
                  </p>
                </div>
              </div>

              {/* Screenshot Upload */}
              <div>
                <Label htmlFor="bug-screenshot" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Screenshot (Optional but Recommended!)
                </Label>
                <Input
                  id="bug-screenshot"
                  type="file"
                  accept="image/*"
                  {...register('screenshot')}
                  className="mt-2"
                  data-testid="input-bug-screenshot"
                />
                <p className="text-xs text-gray-500 mt-1">
                  📸 A picture is worth a thousand words! Upload a screenshot to help us understand the issue faster.
                </p>
              </div>

              {/* Contact Consent */}
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <Checkbox
                  id="bug-contact-consent"
                  {...register('contactConsent')}
                  defaultChecked={false}
                  data-testid="checkbox-bug-contact"
                />
                <div className="flex-1">
                  <Label htmlFor="bug-contact-consent" className="text-sm font-normal cursor-pointer">
                    It's okay to contact me about this issue or for product feedback
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isSubmitting}
                data-testid="button-submit-bug-report"
              >
                {isSubmitting ? (
                  <>Submitting Report...</>
                ) : (
                  <>
                    <Bug className="mr-2 h-5 w-5" />
                    Submit Bug Report
                  </>
                )}
              </Button>
              
              <p className="text-center text-sm text-gray-500">
                Thank you for being an early adopter and helping us improve NomadSuite! 🙏
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
