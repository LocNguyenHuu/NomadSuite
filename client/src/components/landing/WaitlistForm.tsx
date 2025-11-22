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
import { Star } from 'lucide-react';
import { useLandingI18n } from '@/contexts/LandingI18nContext';

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
  const { t } = useLandingI18n();
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
        throw new Error(t('waitlist.toast.errorDefault'));
      }

      setIsSuccess(true);
      reset();
      toast({
        title: t('waitlist.toast.successTitle'),
        description: t('waitlist.toast.successDesc'),
      });
    } catch (error: any) {
      toast({
        title: t('waitlist.toast.errorTitle'),
        description: error.message || t('waitlist.toast.errorDefault'),
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
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              {t('waitlist.badge')}
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              {t('waitlist.intro')}
            </p>
          </div>
          <Card className="border-2 border-purple-200">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('waitlist.successTitle')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('waitlist.successText')}
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline">
                {t('waitlist.successButton')}
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
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="h-4 w-4" />
            {t('waitlist.badge')}
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            {t('waitlist.intro')}
          </p>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{t('waitlist.title')}</CardTitle>
            <CardDescription className="text-lg mt-2">
              {t('waitlist.subtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">{t('waitlist.name')} {t('waitlist.required')}</Label>
                <Input
                  id="name"
                  {...register('name', { required: t('waitlist.validation.nameRequired') })}
                  placeholder={t('waitlist.placeholders.name')}
                  className="mt-1"
                  data-testid="input-waitlist-name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">{t('waitlist.email')} {t('waitlist.required')}</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: t('waitlist.validation.emailRequired'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('waitlist.validation.emailInvalid'),
                    },
                  })}
                  placeholder={t('waitlist.placeholders.email')}
                  className="mt-1"
                  data-testid="input-waitlist-email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <Label htmlFor="country">{t('waitlist.country')}</Label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder={t('waitlist.placeholders.country')}
                  className="mt-1"
                  data-testid="input-waitlist-country"
                />
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role">{t('waitlist.role')} {t('waitlist.required')}</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => {
                    setSelectedRole(value);
                    setValue('role', value);
                  }}
                >
                  <SelectTrigger className="mt-1" data-testid="select-waitlist-role">
                    <SelectValue placeholder={t('waitlist.placeholders.role')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digital Nomad">Digital Nomad</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                    <SelectItem value="Agency/Team">Agency/Team</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('role', { required: t('waitlist.validation.roleRequired') })} />
                {errors.role && (
                  <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
                )}
              </div>

              {/* Use Case */}
              <div>
                <Label htmlFor="useCase">{t('waitlist.useCase')}</Label>
                <Textarea
                  id="useCase"
                  {...register('useCase')}
                  placeholder={t('waitlist.placeholders.useCase')}
                  rows={4}
                  className="mt-1"
                  data-testid="textarea-waitlist-usecase"
                />
              </div>

              {/* Referral Code */}
              <div>
                <Label htmlFor="referralCode">{t('waitlist.referral')}</Label>
                <Input
                  id="referralCode"
                  {...register('referralCode')}
                  placeholder={t('waitlist.placeholders.referral')}
                  className="mt-1"
                  data-testid="input-waitlist-referral"
                />
              </div>

              {/* Email Consent */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="emailConsent"
                  {...register('emailConsent', {
                    required: t('waitlist.validation.emailConsentRequired'),
                  })}
                  defaultChecked={true}
                  data-testid="checkbox-email-consent"
                />
                <div className="flex-1">
                  <Label htmlFor="emailConsent" className="text-sm font-normal cursor-pointer">
                    {t('waitlist.emailConsent')} {t('waitlist.required')}
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
                {isSubmitting ? t('waitlist.submitting') : t('waitlist.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
