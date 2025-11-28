import { useState } from 'react';
import { Check, Star, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { pricingTiers } from '@/data/pricing';
import { useLandingI18n } from '@/contexts/LandingI18nContext';

export default function PricingSection() {
  const { t } = useLandingI18n();
  const [isAnnual, setIsAnnual] = useState(false);

  const handleCtaClick = (tierName: string, isWaitlist: boolean = false) => {
    if (isWaitlist) {
      const waitlistSection = document.getElementById('waitlist');
      if (waitlistSection) {
        waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          waitlistSection.classList.add('pulse-animation');
          setTimeout(() => {
            waitlistSection.classList.remove('pulse-animation');
          }, 2000);
        }, 800);
      }
    } else {
      window.location.href = '/register';
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Start free, upgrade when you need more
          </p>
          <p className="text-base text-gray-500 max-w-xl mx-auto mb-8">
            {t('pricing.waitlistHint')}
          </p>
          
          {/* Billing Toggle - only affects Pro tier */}
          <div className="flex items-center justify-center gap-3">
            <Label htmlFor="billing-toggle" className={!isAnnual ? 'font-semibold' : ''}>
              {t('pricing.monthly')}
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              data-testid="toggle-billing"
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? 'font-semibold' : ''}>
              {t('pricing.annually')}
            </Label>
            {isAnnual && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                {t('pricing.save')}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => {
            const isLifetime = tier.oneTimePrice !== undefined;
            const isYearly = tier.annualPrice > 0 && tier.monthlyPrice === 0 && !tier.oneTimePrice;
            const price = isLifetime 
              ? tier.oneTimePrice 
              : (isYearly ? tier.annualPrice : (isAnnual ? Math.round(tier.annualPrice / 12) : tier.monthlyPrice));
            
            return (
              <Card
                key={tier.name}
                className={`relative flex flex-col ${
                  tier.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : ''
                } ${
                  tier.featured ? 'border-2 border-amber-500 shadow-xl bg-gradient-to-b from-amber-50 to-white' : ''
                }`}
                data-testid={`pricing-card-${tier.name.toLowerCase().replace(' ', '-')}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
                      <Zap className="mr-1 h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-sm font-semibold text-white">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Best Value
                    </span>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold tracking-tight">
                        ${price}
                      </span>
                      {isLifetime ? (
                        <span className="text-gray-600">one-time</span>
                      ) : isYearly ? (
                        <span className="text-gray-600">/year</span>
                      ) : price === 0 ? (
                        <span className="text-gray-600">forever</span>
                      ) : (
                        <span className="text-gray-600">/month</span>
                      )}
                    </div>
                    {tier.savingsPercentage && (
                      <p className="text-sm font-semibold mt-2 flex items-center gap-1">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                          Save {tier.savingsPercentage}%
                        </span>
                      </p>
                    )}
                    {!isLifetime && !isYearly && isAnnual && tier.annualPrice > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Billed ${tier.annualPrice} annually
                      </p>
                    )}
                    {tier.limitedOffer && (
                      <p className="text-sm text-amber-600 font-semibold mt-2 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {tier.limitedOffer}
                      </p>
                    )}
                  </div>
                  
                  <ul className="space-y-3" data-testid={`features-${tier.name.toLowerCase().replace(' ', '-')}`}>
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className={`h-5 w-5 shrink-0 mt-0.5 ${
                          tier.featured ? 'text-amber-500' : 'text-green-500'
                        }`} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="flex-col gap-3">
                  <Button
                    className={`w-full ${tier.featured ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : ''}`}
                    variant={tier.popular || tier.featured ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handleCtaClick(tier.name, false)}
                    data-testid={`button-${tier.name.toLowerCase().replace(' ', '-')}-cta`}
                  >
                    {tier.cta}
                  </Button>
                  <Button
                    className="w-full"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCtaClick(tier.name, true)}
                    data-testid={`button-${tier.name.toLowerCase().replace(' ', '-')}-waitlist`}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {t('pricing.ctaWaitlist')}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 mt-12 text-sm">
          No hidden fees. Start free with no credit card required. Upgrade anytime.
        </p>
      </div>
    </section>
  );
}
