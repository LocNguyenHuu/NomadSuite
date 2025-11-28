import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Bug, Camera, Lightbulb, Zap, Heart, CheckCircle2, Sparkles, MessageSquare, Send } from 'lucide-react';
import { getCsrfToken } from '@/lib/api';

interface BugReportFormData {
  name?: string;
  email?: string;
  description: string;
  contactConsent: boolean;
  screenshot?: FileList;
}

interface FeatureRequestFormData {
  name?: string;
  email?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  contactConsent: boolean;
}

export default function FeedbackSection() {
  const { toast } = useToast();
  
  const bugForm = useForm<BugReportFormData>();
  const featureForm = useForm<FeatureRequestFormData>();
  
  const [isBugSubmitting, setIsBugSubmitting] = useState(false);
  const [isFeatureSubmitting, setIsFeatureSubmitting] = useState(false);
  const [bugSuccess, setBugSuccess] = useState(false);
  const [featureSuccess, setFeatureSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('bug');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  const onBugSubmit = async (data: BugReportFormData) => {
    setIsBugSubmitting(true);
    
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
        title: 'Thank you for helping us improve!',
        description: "Your feedback is invaluable. We'll review this and fix it ASAP.",
      });
      
      setBugSuccess(true);
      bugForm.reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong, please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBugSubmitting(false);
    }
  };

  const onFeatureSubmit = async (data: FeatureRequestFormData) => {
    setIsFeatureSubmitting(true);
    
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
        title: 'Feature request submitted!',
        description: "We'll review your idea and keep you updated on its progress.",
      });
      
      setFeatureSuccess(true);
      featureForm.reset();
      setSelectedCategory('');
      setSelectedPriority('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong, please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsFeatureSubmitting(false);
    }
  };

  const SuccessMessage = ({ type, onReset }: { type: 'bug' | 'feature', onReset: () => void }) => (
    <Card className={`border-2 ${type === 'bug' ? 'border-orange-200' : 'border-purple-200'}`}>
      <CardContent className="pt-12 pb-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {type === 'bug' ? 'Bug Report Submitted!' : 'Feature Request Submitted!'}
        </h3>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          {type === 'bug' 
            ? "Thank you for helping us improve! We'll investigate this issue and work on a fix."
            : "Great idea! We'll review your suggestion and consider it for future updates."
          }
        </p>
        <Button onClick={onReset} variant="outline" className="gap-2">
          {type === 'bug' ? <Bug className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
          Submit Another {type === 'bug' ? 'Bug Report' : 'Feature Request'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section id="feedback" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-purple-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4 text-orange-600" />
            MVP Testing Phase - Your Feedback Shapes the Product!
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Help Us Build Better
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Found a bug? Have an idea? Your feedback directly influences what we build next.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-gray-200 hover:border-primary/50 transition-colors hover:shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-full p-3 w-fit mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Direct Impact</h3>
              <p className="text-sm text-gray-600">Your reports go straight to our dev team</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 hover:border-primary/50 transition-colors hover:shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-full p-3 w-fit mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Iterations</h3>
              <p className="text-sm text-gray-600">We push updates weekly during MVP</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 hover:border-primary/50 transition-colors hover:shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-full p-3 w-fit mx-auto mb-4">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Shape the Product</h3>
              <p className="text-sm text-gray-600">Help us build the perfect nomad tool</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Bug Report / Feature Request */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-14">
            <TabsTrigger 
              value="bug" 
              className="text-base gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700"
              data-testid="tab-bug-report"
            >
              <Bug className="h-5 w-5" />
              Report a Bug
            </TabsTrigger>
            <TabsTrigger 
              value="feature" 
              className="text-base gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
              data-testid="tab-feature-request"
            >
              <Lightbulb className="h-5 w-5" />
              Request a Feature
            </TabsTrigger>
          </TabsList>

          {/* Bug Report Tab */}
          <TabsContent value="bug">
            {bugSuccess ? (
              <SuccessMessage type="bug" onReset={() => setBugSuccess(false)} />
            ) : (
              <Card className="border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Bug className="h-6 w-6 text-orange-600" />
                    Report an Issue
                  </CardTitle>
                  <CardDescription className="text-base">
                    Describe what went wrong. Screenshots are super helpful!
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <form onSubmit={bugForm.handleSubmit(onBugSubmit)} className="space-y-6">
                    {/* Description */}
                    <div>
                      <Label htmlFor="bug-description" className="text-base font-semibold">
                        What happened? <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="bug-description"
                        {...bugForm.register('description', { 
                          required: 'Please describe the issue',
                          minLength: { value: 10, message: 'Please provide more details' }
                        })}
                        placeholder="Example: When I click 'Create Invoice', nothing happens..."
                        rows={4}
                        className="mt-2"
                        data-testid="textarea-bug-description"
                      />
                      {bugForm.formState.errors.description && (
                        <p className="text-sm text-red-600 mt-1">{bugForm.formState.errors.description.message}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="bug-name">Your Name (Optional)</Label>
                        <Input
                          id="bug-name"
                          {...bugForm.register('name')}
                          placeholder="Your name"
                          className="mt-2"
                          data-testid="input-bug-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bug-email">Email (Optional)</Label>
                        <Input
                          id="bug-email"
                          type="email"
                          {...bugForm.register('email')}
                          placeholder="you@example.com"
                          className="mt-2"
                          data-testid="input-bug-email"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bug-screenshot" className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Screenshot (Optional)
                      </Label>
                      <Input
                        id="bug-screenshot"
                        type="file"
                        accept="image/*"
                        {...bugForm.register('screenshot')}
                        className="mt-2"
                        data-testid="input-bug-screenshot"
                      />
                    </div>

                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                      <Checkbox
                        id="bug-contact-consent"
                        {...bugForm.register('contactConsent')}
                        data-testid="checkbox-bug-contact"
                      />
                      <Label htmlFor="bug-contact-consent" className="text-sm font-normal cursor-pointer">
                        I agree to be contacted about this issue
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={isBugSubmitting}
                      data-testid="button-submit-bug-report"
                    >
                      {isBugSubmitting ? 'Submitting...' : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit Bug Report
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Feature Request Tab */}
          <TabsContent value="feature">
            {featureSuccess ? (
              <SuccessMessage type="feature" onReset={() => setFeatureSuccess(false)} />
            ) : (
              <Card className="border-2 border-purple-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                    Request a Feature
                  </CardTitle>
                  <CardDescription className="text-base">
                    Have an idea to make NomadSuite better? We'd love to hear it!
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <form onSubmit={featureForm.handleSubmit(onFeatureSubmit)} className="space-y-6">
                    {/* Feature Title */}
                    <div>
                      <Label htmlFor="feature-title" className="text-base font-semibold">
                        Feature Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="feature-title"
                        {...featureForm.register('title', { required: 'Please provide a title' })}
                        placeholder="e.g., Dark mode support"
                        className="mt-2"
                        data-testid="input-feature-title"
                      />
                      {featureForm.formState.errors.title && (
                        <p className="text-sm text-red-600 mt-1">{featureForm.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Category */}
                      <div>
                        <Label htmlFor="feature-category">Category <span className="text-red-500">*</span></Label>
                        <Select
                          value={selectedCategory}
                          onValueChange={(value) => {
                            setSelectedCategory(value);
                            featureForm.setValue('category', value);
                          }}
                        >
                          <SelectTrigger className="mt-2" data-testid="select-feature-category">
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
                        <input type="hidden" {...featureForm.register('category', { required: 'Please select a category' })} />
                        {featureForm.formState.errors.category && (
                          <p className="text-sm text-red-600 mt-1">{featureForm.formState.errors.category.message}</p>
                        )}
                      </div>

                      {/* Priority */}
                      <div>
                        <Label htmlFor="feature-priority">How important is this?</Label>
                        <Select
                          value={selectedPriority}
                          onValueChange={(value) => {
                            setSelectedPriority(value);
                            featureForm.setValue('priority', value);
                          }}
                        >
                          <SelectTrigger className="mt-2" data-testid="select-feature-priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nice to have">Nice to have</SelectItem>
                            <SelectItem value="Would use regularly">Would use regularly</SelectItem>
                            <SelectItem value="Critical for my workflow">Critical for my workflow</SelectItem>
                          </SelectContent>
                        </Select>
                        <input type="hidden" {...featureForm.register('priority')} />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="feature-description" className="text-base font-semibold">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="feature-description"
                        {...featureForm.register('description', { required: 'Please describe the feature' })}
                        placeholder="Describe your feature idea in detail. What problem does it solve?"
                        rows={4}
                        className="mt-2"
                        data-testid="textarea-feature-description"
                      />
                      {featureForm.formState.errors.description && (
                        <p className="text-sm text-red-600 mt-1">{featureForm.formState.errors.description.message}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="feature-name">Your Name (Optional)</Label>
                        <Input
                          id="feature-name"
                          {...featureForm.register('name')}
                          placeholder="Your name"
                          className="mt-2"
                          data-testid="input-feature-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="feature-email">Email (Optional)</Label>
                        <Input
                          id="feature-email"
                          type="email"
                          {...featureForm.register('email')}
                          placeholder="you@example.com"
                          className="mt-2"
                          data-testid="input-feature-email"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                      <Checkbox
                        id="feature-contact-consent"
                        {...featureForm.register('contactConsent')}
                        data-testid="checkbox-feature-contact"
                      />
                      <Label htmlFor="feature-contact-consent" className="text-sm font-normal cursor-pointer">
                        I agree to be contacted about this feature request
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={isFeatureSubmitting}
                      data-testid="button-submit-feature-request"
                    >
                      {isFeatureSubmitting ? 'Submitting...' : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit Feature Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-gray-500 mt-8">
          Thank you for being an early adopter and helping us build NomadSuite!
        </p>
      </div>
    </section>
  );
}
