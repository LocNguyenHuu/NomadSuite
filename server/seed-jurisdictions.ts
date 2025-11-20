import { db } from './db';
import { jurisdictionRules } from '@shared/schema';
import { eq } from 'drizzle-orm';

const jurisdictionData = [
  {
    country: 'DE',
    countryName: 'Germany',
    supportedLanguages: ['de', 'en'],
    defaultLanguage: 'de',
    defaultCurrency: 'EUR',
    requiresVatId: true,
    requiresCustomerVatId: true,
    supportsReverseCharge: true,
    archivingYears: 10,
    taxRate: '19',
    languageNote: 'German invoices are recommended. Tax authorities may request German translation if English is used.',
    complianceNotes: 'Invoices must include: unique sequential number, issue date, supplier & customer full address, VAT IDs for B2B. Kleinunternehmer (small business) regime available - add note: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."'
  },
  {
    country: 'FR',
    countryName: 'France',
    supportedLanguages: ['fr', 'en'],
    defaultLanguage: 'fr',
    defaultCurrency: 'EUR',
    requiresVatId: true,
    requiresCustomerVatId: true,
    supportsReverseCharge: true,
    archivingYears: 10,
    taxRate: '20',
    languageNote: 'French language is strongly recommended for invoices to French clients.',
    complianceNotes: 'Must include: sequential number, date, supplier/customer details, VAT numbers for B2B transactions, mention of reverse charge if applicable.'
  },
  {
    country: 'GB',
    countryName: 'United Kingdom',
    supportedLanguages: ['en'],
    defaultLanguage: 'en',
    defaultCurrency: 'GBP',
    requiresVatId: true,
    requiresCustomerVatId: false,
    supportsReverseCharge: false,
    archivingYears: 6,
    taxRate: '20',
    languageNote: 'English is the standard language for UK invoices.',
    complianceNotes: 'VAT invoices must show: unique number, date, supplier name/address/VAT number, customer details, description of goods/services, VAT rate and amount.'
  },
  {
    country: 'CA',
    countryName: 'Canada',
    supportedLanguages: ['en', 'fr'],
    defaultLanguage: 'en',
    defaultCurrency: 'CAD',
    requiresVatId: false,
    requiresCustomerVatId: false,
    supportsReverseCharge: false,
    archivingYears: 7,
    taxRate: '5',
    languageNote: 'English is standard. French may be required for Quebec clients.',
    complianceNotes: 'GST/HST invoices must include: business number, date, customer name, description, GST/HST amount. Provincial sales tax rules vary by province.'
  },
  {
    country: 'US',
    countryName: 'United States',
    supportedLanguages: ['en'],
    defaultLanguage: 'en',
    defaultCurrency: 'USD',
    requiresVatId: false,
    requiresCustomerVatId: false,
    supportsReverseCharge: false,
    archivingYears: 7,
    taxRate: '0',
    languageNote: 'English is the standard language.',
    complianceNotes: 'Invoice should include: unique number, date, business name/address, customer details, itemized services/products, payment terms. Sales tax varies by state.'
  }
];

async function seedJurisdictions() {
  console.log('Seeding jurisdiction rules...');
  
  for (const jurisdiction of jurisdictionData) {
    try {
      // Check if jurisdiction already exists
      const existing = await db.select().from(jurisdictionRules).where(eq(jurisdictionRules.country, jurisdiction.country));
      
      if (existing.length === 0) {
        await db.insert(jurisdictionRules).values(jurisdiction);
        console.log(`✓ Added jurisdiction: ${jurisdiction.countryName}`);
      } else {
        console.log(`→ Jurisdiction already exists: ${jurisdiction.countryName}`);
      }
    } catch (error) {
      console.error(`✗ Error adding ${jurisdiction.countryName}:`, error);
    }
  }
  
  console.log('Jurisdiction seeding complete!');
}

seedJurisdictions().catch(console.error);
