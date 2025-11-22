import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { pricingTiers } from '@/data/pricing';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const handleCtaClick = (tierName: string) => {
    if (tierName === 'Enterprise') {
      window.location.href = 'mailto:sales@nomadsuite.com';
    } else {
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
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the plan that's right for you. No hidden fees. Cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3">
            <Label htmlFor="billing-toggle" className={!isAnnual ? 'font-semibold' : ''}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              data-testid="toggle-billing"
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? 'font-semibold' : ''}>
              Annual
            </Label>
            {isAnnual && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
            const pricePerMonth = isAnnual ? Math.round(tier.annualPrice / 12) : tier.monthlyPrice;
            
            return (
              <Card
                key={tier.name}
                className={`relative flex flex-col ${
                  tier.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : ''
                }`}
                data-testid={`pricing-card-${tier.name.toLowerCase()}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
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
                        ${pricePerMonth}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    {isAnnual && price > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Billed ${price} annually
                      </p>
                    )}
                  </div>
                  
                  <ul className="space-y-3" data-testid={`features-${tier.name.toLowerCase()}`}>
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={tier.popular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handleCtaClick(tier.name)}
                    data-testid={`button-${tier.name.toLowerCase()}-cta`}
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 mt-12 text-sm">
          No hidden fees. Cancel anytime. All plans include 14-day free trial.
        </p>
      </div>
    </section>
  );
}
