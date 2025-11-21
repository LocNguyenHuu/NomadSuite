/**
 * Invoice i18n translations for multi-language PDF generation
 * Supports: English (en), German (de), French (fr)
 */

export interface InvoiceTranslations {
  // Header
  invoice: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  currency: string;
  language: string;
  
  // Parties
  from: string;
  billTo: string;
  vatId: string;
  customerVatId: string;
  email: string;
  country: string;
  
  // Table headers
  description: string;
  quantity: string;
  unitPrice: string;
  subtotal: string;
  
  // Totals
  subtotalLabel: string;
  tax: string;
  total: string;
  
  // Compliance
  reverseCharge: string;
  reverseChargeNote: string;
  taxNote: string;
  paymentTerms: string;
  generatedBy: string;
}

export const translations: Record<string, InvoiceTranslations> = {
  en: {
    invoice: 'INVOICE',
    invoiceNumber: 'Invoice #',
    date: 'Date',
    dueDate: 'Due',
    currency: 'Currency',
    language: 'Language',
    from: 'From:',
    billTo: 'Bill To:',
    vatId: 'VAT ID',
    customerVatId: 'Customer VAT ID',
    email: 'Email',
    country: 'Country',
    description: 'Description',
    quantity: 'Qty',
    unitPrice: 'Unit Price',
    subtotal: 'Subtotal',
    subtotalLabel: 'Subtotal',
    tax: 'Tax',
    total: 'TOTAL',
    reverseCharge: 'Reverse Charge',
    reverseChargeNote: 'VAT reverse charge applies. Customer is responsible for VAT payment.',
    taxNote: 'Tax Note',
    paymentTerms: 'Payment Terms: Payment is due by the due date shown above. Please reference the invoice number on your payment.',
    generatedBy: 'Invoice generated on {date} by NomadSuite'
  },
  de: {
    invoice: 'RECHNUNG',
    invoiceNumber: 'Rechnungsnr.',
    date: 'Datum',
    dueDate: 'Fällig am',
    currency: 'Währung',
    language: 'Sprache',
    from: 'Von:',
    billTo: 'Rechnungsempfänger:',
    vatId: 'USt-IdNr.',
    customerVatId: 'Kunden USt-IdNr.',
    email: 'E-Mail',
    country: 'Land',
    description: 'Beschreibung',
    quantity: 'Menge',
    unitPrice: 'Einzelpreis',
    subtotal: 'Zwischensumme',
    subtotalLabel: 'Zwischensumme',
    tax: 'MwSt.',
    total: 'GESAMT',
    reverseCharge: 'Reverse Charge',
    reverseChargeNote: 'Reverse Charge gemäß § 13b UStG. Steuerschuldnerschaft des Leistungsempfängers.',
    taxNote: 'Steuerhinweis',
    paymentTerms: 'Zahlungsbedingungen: Die Zahlung ist bis zum oben genannten Fälligkeitsdatum fällig. Bitte geben Sie die Rechnungsnummer bei der Zahlung an.',
    generatedBy: 'Rechnung erstellt am {date} von NomadSuite'
  },
  fr: {
    invoice: 'FACTURE',
    invoiceNumber: 'Numéro de facture',
    date: 'Date',
    dueDate: 'Date d\'échéance',
    currency: 'Devise',
    language: 'Langue',
    from: 'De:',
    billTo: 'Facturer à:',
    vatId: 'N° TVA',
    customerVatId: 'N° TVA client',
    email: 'E-mail',
    country: 'Pays',
    description: 'Description',
    quantity: 'Qté',
    unitPrice: 'Prix unitaire',
    subtotal: 'Sous-total',
    subtotalLabel: 'Sous-total',
    tax: 'TVA',
    total: 'TOTAL',
    reverseCharge: 'Autoliquidation',
    reverseChargeNote: 'Autoliquidation de la TVA applicable. Le client est responsable du paiement de la TVA.',
    taxNote: 'Note fiscale',
    paymentTerms: 'Conditions de paiement: Le paiement est dû à la date d\'échéance indiquée ci-dessus. Veuillez indiquer le numéro de facture lors du paiement.',
    generatedBy: 'Facture générée le {date} par NomadSuite'
  }
};

export function getTranslations(language: string): InvoiceTranslations {
  const lang = language?.toLowerCase() || 'en';
  return translations[lang] || translations['en'];
}

export function formatDate(date: Date, language: string): string {
  const lang = language?.toLowerCase() || 'en';
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'de': 'de-DE',
    'fr': 'fr-FR'
  };
  
  const locale = localeMap[lang] || 'en-US';
  return date.toLocaleDateString(locale);
}

export function formatCurrency(amount: number, currency: string, language: string): string {
  const lang = language?.toLowerCase() || 'en';
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'de': 'de-DE',
    'fr': 'fr-FR'
  };
  
  const locale = localeMap[lang] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount / 100); // Convert from cents
}
