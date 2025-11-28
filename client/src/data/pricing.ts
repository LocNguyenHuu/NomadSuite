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
    annualPrice: 199,
    savingsPercentage: 17,
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
    name: 'Early-Bird Special',
    description: 'Limited-time offer for early adopters',
    monthlyPrice: 0,
    annualPrice: 149,
    savingsPercentage: 57,
    featured: true,
    limitedOffer: 'Limited slots available',
    features: [
      'Everything in Nomad Pro',
      'Early adopter pricing',
      'Annual prepayment (best value)',
      'Founding member benefits',
      'Direct input on future features',
      'Priority support',
    ],
    cta: 'Claim Early-Bird Access',
  },
];
