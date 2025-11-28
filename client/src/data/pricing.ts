export interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  oneTimePrice?: number;
  savingsPercentage?: number;
  popular?: boolean;
  featured?: boolean;
  limitedOffer?: string;
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
      'Up to 3 clients',
      'Up to 5 invoices/month',
      'Travel days log',
      'Basic document storage',
      'Community support',
    ],
    cta: 'Start Free',
  },
  {
    name: 'Nomad Pro',
    description: 'For serious digital nomads',
    monthlyPrice: 29,
    annualPrice: 278,
    savingsPercentage: 20,
    popular: true,
    features: [
      'Unlimited clients',
      'Unlimited invoices',
      'Travel tracking with per-country breakdown',
      'Visa & tax residency alerts',
      'Export to CSV & PDF',
      'Encrypted document vault',
      'Priority email support',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Yearly',
    description: 'Save with annual billing',
    monthlyPrice: 0,
    annualPrice: 149,
    savingsPercentage: 57,
    features: [
      'Everything in Nomad Pro',
      'Annual prepayment (best value)',
      'Save $199 vs monthly billing',
      'Export to CSV & PDF',
      'Encrypted document vault',
      'Priority email support',
    ],
    cta: 'Get Yearly Plan',
  },
  {
    name: 'Lifetime',
    description: 'Early-bird special offer',
    monthlyPrice: 0,
    annualPrice: 0,
    oneTimePrice: 79,
    featured: true,
    limitedOffer: 'Only 100 spots available',
    features: [
      'Everything in Nomad Pro',
      'One-time payment, forever access',
      'All future updates included',
      'Founding member badge',
      'Priority feature requests',
      'Early access to new features',
    ],
    cta: 'Claim Lifetime Access',
  },
];
