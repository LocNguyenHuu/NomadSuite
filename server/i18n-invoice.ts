/**
 * Invoice i18n translations for multi-language PDF generation
 * Supports: English (en), German (de), French (fr), Vietnamese (vi), Japanese (ja), Chinese (zh)
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
  },
  vi: {
    invoice: 'HÓA ĐƠN',
    invoiceNumber: 'Số hóa đơn',
    date: 'Ngày',
    dueDate: 'Ngày đến hạn',
    currency: 'Tiền tệ',
    language: 'Ngôn ngữ',
    from: 'Từ:',
    billTo: 'Gửi đến:',
    vatId: 'Mã số thuế',
    customerVatId: 'Mã số thuế khách hàng',
    email: 'Email',
    country: 'Quốc gia',
    description: 'Mô tả',
    quantity: 'Số lượng',
    unitPrice: 'Đơn giá',
    subtotal: 'Tạm tính',
    subtotalLabel: 'Tạm tính',
    tax: 'Thuế',
    total: 'TỔNG CỘNG',
    reverseCharge: 'Chuyển đổi thuế',
    reverseChargeNote: 'Áp dụng chuyển đổi thuế VAT. Khách hàng chịu trách nhiệm thanh toán thuế VAT.',
    taxNote: 'Ghi chú thuế',
    paymentTerms: 'Điều khoản thanh toán: Thanh toán đến hạn vào ngày đáo hạn được ghi ở trên. Vui lòng ghi số hóa đơn khi thanh toán.',
    generatedBy: 'Hóa đơn được tạo vào {date} bởi NomadSuite'
  },
  ja: {
    invoice: '請求書',
    invoiceNumber: '請求書番号',
    date: '日付',
    dueDate: '支払期限',
    currency: '通貨',
    language: '言語',
    from: '差出人:',
    billTo: '請求先:',
    vatId: '付加価値税ID',
    customerVatId: '顧客付加価値税ID',
    email: 'メール',
    country: '国',
    description: '説明',
    quantity: '数量',
    unitPrice: '単価',
    subtotal: '小計',
    subtotalLabel: '小計',
    tax: '税',
    total: '合計',
    reverseCharge: 'リバースチャージ',
    reverseChargeNote: 'VAT リバースチャージが適用されます。お客様が VAT の支払いに責任を負います。',
    taxNote: '税金に関する注記',
    paymentTerms: '支払条件: 上記の支払期限までに支払いが必要です。支払い時に請求書番号を参照してください。',
    generatedBy: '{date}にNomadSuiteによって生成された請求書'
  },
  zh: {
    invoice: '发票',
    invoiceNumber: '发票编号',
    date: '日期',
    dueDate: '到期日',
    currency: '货币',
    language: '语言',
    from: '来自:',
    billTo: '账单地址:',
    vatId: '增值税号',
    customerVatId: '客户增值税号',
    email: '电子邮件',
    country: '国家',
    description: '描述',
    quantity: '数量',
    unitPrice: '单价',
    subtotal: '小计',
    subtotalLabel: '小计',
    tax: '税',
    total: '总计',
    reverseCharge: '反向征税',
    reverseChargeNote: '适用增值税反向征税。客户负责支付增值税。',
    taxNote: '税务说明',
    paymentTerms: '付款条件：付款应在上述到期日期之前完成。付款时请注明发票编号。',
    generatedBy: '发票由NomadSuite于{date}生成'
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
    'fr': 'fr-FR',
    'vi': 'vi-VN',
    'ja': 'ja-JP',
    'zh': 'zh-CN'
  };
  
  const locale = localeMap[lang] || 'en-US';
  return date.toLocaleDateString(locale);
}

export function formatCurrency(amount: number, currency: string, language: string): string {
  const lang = language?.toLowerCase() || 'en';
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'de': 'de-DE',
    'fr': 'fr-FR',
    'vi': 'vi-VN',
    'ja': 'ja-JP',
    'zh': 'zh-CN'
  };
  
  const locale = localeMap[lang] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount / 100); // Convert from cents
}
