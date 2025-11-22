export interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  features: string[];
  cta: string;
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Up to 5 clients',
      'Basic invoicing',
      'Travel tracking',
      '1 GB document storage',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    description: 'For serious digital nomads',
    monthlyPrice: 29,
    annualPrice: 278, // 20% off (29 * 12 * 0.8 = 278.4)
    popular: true,
    features: [
      'Unlimited clients',
      'Multi-currency invoicing',
      'Tax residency calculator',
      'Visa deadline tracking',
      'Encrypted document vault (10 GB)',
      'Priority email support',
      'Invoice templates',
      'Expense tracking',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    description: 'For agencies and teams',
    monthlyPrice: 99,
    annualPrice: 950, // 20% off (99 * 12 * 0.8 = 950.4)
    features: [
      'Everything in Pro',
      'Team collaboration (up to 10 users)',
      'Advanced reporting',
      'Custom invoice branding',
      'API access',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
  },
];
