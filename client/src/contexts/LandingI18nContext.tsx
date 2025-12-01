import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LandingLanguage = 'en' | 'de' | 'fr' | 'vi' | 'ja' | 'zh';

interface LandingI18nContextType {
  language: LandingLanguage;
  setLanguage: (lang: LandingLanguage) => void;
  t: (key: string) => string;
}

const LandingI18nContext = createContext<LandingI18nContextType | undefined>(undefined);

const LANDING_STORAGE_KEY = 'nomadsuite_landing_language';

export function LandingI18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LandingLanguage>(() => {
    const stored = localStorage.getItem(LANDING_STORAGE_KEY);
    if (stored && ['en', 'de', 'fr', 'vi', 'ja', 'zh'].includes(stored)) {
      return stored as LandingLanguage;
    }
    return 'en';
  });

  const setLanguage = (lang: LandingLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(LANDING_STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    const translations = landingTranslations[language];
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LandingI18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LandingI18nContext.Provider>
  );
}

export function useLandingI18n() {
  const context = useContext(LandingI18nContext);
  if (!context) {
    throw new Error('useLandingI18n must be used within LandingI18nProvider');
  }
  return context;
}

const landingTranslations: Record<LandingLanguage, any> = {
  en: {
    nav: {
      login: 'Log In',
      signup: 'Start Free',
      features: 'Features',
      security: 'Security',
      howItWorks: 'How It Works',
      help: 'Help'
    },
    hero: {
      badge: 'Now Available - Start Free Today',
      title1: 'Your Business HQ for',
      title2: 'Location Freedom',
      subtitle: 'Manage clients, send invoices, track travel days, and stay visa-compliant — all from one beautiful dashboard built for digital nomads.',
      ctaPrimary: 'Start Free Now',
      ctaSecondary: 'Explore Features',
      trust1: 'No credit card required',
      trustEncrypted: 'End-to-end encrypted',
      trust3: 'GDPR compliant'
    },
    security: {
      badge: 'Bank-Grade Security',
      title: 'Your Data is',
      titleHighlight: 'Protected',
      subtitle: 'We take security seriously. Your sensitive business data is protected with enterprise-grade encryption and strict privacy controls.',
      aes256: 'AES-256 Encryption',
      aes256Desc: 'Military-grade encryption for all your documents, invoices, and personal data at rest and in transit.',
      gdpr: 'GDPR Compliant',
      gdprDesc: 'Full compliance with European data protection regulations. Your data rights are always protected.',
      zeroKnowledge: 'Zero-Knowledge Vault',
      zeroKnowledgeDesc: 'Your documents are encrypted before upload. Even we cannot access your private files.',
      euHosting: 'EU Data Centers',
      euHostingDesc: 'All data is stored in secure European data centers with 99.99% uptime guarantee.',
      badgeGDPR: 'GDPR Certified',
      badgeEncrypted: 'AES-256 Encrypted',
      badgeEU: 'EU Data Hosting',
      badgeAudit: 'Regular Audits'
    },
    stats: {
      features: '12+ Core Features',
      currencies: '50+ Currencies Supported',
      languages: '6 Languages',
      encryption: 'AES-256 Encryption'
    },
    features: {
      badge: 'Powerful Features',
      title: 'Everything You Need in',
      titleHighlight: 'One Place',
      subtitle: 'Purpose-built for freelancers and digital nomads who need to manage their business while staying compliant across borders.',
      clientCRM: 'Client CRM',
      clientCRMDesc: 'Visual pipeline board to manage leads, active clients, and relationships',
      invoicing: 'Multi-Currency Invoicing',
      invoicingDesc: 'Send professional invoices in 50+ currencies with automatic FX rates',
      taxTracker: 'Tax Residency Tracker',
      taxTrackerDesc: '183-day rule calculator with real-time alerts for each country',
      travelLog: 'Travel Log',
      travelLogDesc: 'Track your trips, entry/exit dates, and days spent in each country',
      visaAlerts: 'Visa Expiry Alerts',
      visaAlertsDesc: 'Get notified 90, 30, and 7 days before any visa or permit expires',
      schengen: 'Schengen Calculator',
      schengenDesc: '90/180 day rolling period tracker for Schengen area compliance',
      documents: 'Document Vault',
      documentsDesc: 'Encrypted storage for passports, visas, contracts, and tax documents',
      expenses: 'Expense Tracking',
      expensesDesc: 'Log expenses with geo-tagging, categories, and receipt uploads',
      projects: 'Project Management',
      projectsDesc: 'Kanban boards, tasks, milestones, and deadline tracking',
      multilang: 'Multi-Language PDFs',
      multilangDesc: 'Generate invoice PDFs in 6 languages for international clients',
      analytics: 'Revenue Analytics',
      analyticsDesc: 'Track income, expenses, profit margins, and financial trends',
      security: 'Bank-Level Security',
      securityDesc: 'AES-256 encryption, GDPR compliant, and regular security audits'
    },
    howItWorks: {
      badge: 'Quick Start',
      title: 'Up and Running in',
      titleHighlight: '5 Minutes',
      subtitle: 'No technical skills required. Just sign up and start organizing.',
      step1Title: 'Create Account',
      step1Desc: 'Quick setup with your email. Set your nationality and currency preferences.',
      step2Title: 'Add Clients',
      step2Desc: 'Import or create clients. Track deals through your visual pipeline.',
      step3Title: 'Log Your Travel',
      step3Desc: 'Record trips and see real-time tax residency and visa calculations.',
      step4Title: 'Send Invoices',
      step4Desc: 'Create professional invoices in any currency and get paid faster.'
    },
    problems: {
      badge: 'The Problem',
      title: "Generic Tools Weren't Built for Your Lifestyle",
      item1: 'Juggling 5+ apps for invoicing, CRM, travel, and documents',
      item2: 'Manually tracking visa deadlines in spreadsheets',
      item3: "No idea when you're approaching tax residency thresholds",
      item4: 'Stressing about Schengen 90/180 calculations',
      item5: 'Disorganized passport scans and contracts everywhere'
    },
    solutions: {
      badge: 'The Solution',
      title: 'One Platform for Your Entire Nomad Business',
      item1: 'All-in-one dashboard for clients, invoices, travel, and docs',
      item2: 'Automatic visa expiry alerts 90, 30, and 7 days ahead',
      item3: 'Real-time 183-day tax residency tracker per country',
      item4: 'Schengen calculator that just works',
      item5: 'Encrypted vault for all your important documents'
    },
    testimonials: {
      title: 'Loved by',
      titleHighlight: 'Nomads Worldwide',
      countries: '30+ countries',
      gdpr: 'GDPR Compliant',
      security: 'Bank-Level Security',
      quote1: "Since using NomadSuite, I never worry about Schengen days again – and I have more time for work & travel.",
      author1: "Alex Rodriguez",
      role1: "Digital Nomad & UX Designer",
      quote2: "Finally one tool for clients + invoices + travel alerts. I used to juggle 4 different apps.",
      author2: "Priya Kumar",
      role2: "Freelance Developer",
      quote3: "The visa expiry alerts saved me from a costly mistake. Got notified 30 days before my work permit expired.",
      author3: "Marcus Chen",
      role3: "Remote Software Engineer",
      quote4: "Clean interface, accurate tracking, and it just works. I recommend it to all my clients.",
      author4: "Sarah Williams",
      role4: "International Tax Consultant",
      quote5: "Love the pipeline board for managing clients. Built specifically for freelancers on the move.",
      author5: "João Silva",
      role5: "Marketing Consultant",
      quote6: "Been using it for 8 months across 12 countries. The multi-currency invoicing alone paid for itself.",
      author6: "Emma Thompson",
      role6: "Content Strategist"
    },
    cta: {
      title: 'Ready to Simplify Your Nomad Life?',
      subtitle: 'Join thousands of freelancers and digital nomads who manage their entire business from one dashboard.',
      button: 'Get Started Free',
      note: 'No credit card required • 5-minute setup • Cancel anytime'
    },
    footer: {
      tagline: 'Built for freelancers & digital nomads. Work anywhere, worry less.',
      product: 'Product',
      resources: 'Resources',
      legal: 'Legal',
      blog: 'Blog',
      helpCenter: 'Help Center',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: 'All rights reserved.',
      gdprNote: 'GDPR Compliant • AES-256 Encryption'
    },
    pricing: {
      title: 'Simple, transparent pricing',
      freeBadge: '🎉 All plans are FREE during MVP testing',
      freeText: 'Full features unlocked',
      waitlistHint: 'Join the waitlist for founding member perks when we launch paid tiers',
      monthly: 'Monthly',
      annually: 'Annually',
      save: 'Save 20%',
      ctaStart: 'Start Free Now',
      ctaWaitlist: 'Join Waitlist for Perks'
    },
    waitlist: {
      badge: 'Optional - Founding Member Perks',
      intro: 'Already using NomadSuite for free? Great! Join our founding member waitlist to lock in special perks, priority support, and exclusive discounts when we launch paid tiers.',
      title: 'Founding Member Waitlist',
      subtitle: 'Get exclusive perks and discounts when we transition from free MVP to paid plans',
      successTitle: "You're on the founding member list!",
      successText: "We'll notify you with exclusive founding member perks when we launch paid tiers. Keep enjoying all features free in the meantime!",
      successButton: 'Join another person',
      name: 'Name',
      email: 'Email Address',
      country: 'Country',
      role: 'I am a...',
      useCase: 'What would you use NomadSuite for? (Optional)',
      referral: 'How did you hear about us? (Optional)',
      emailConsent: 'I want to receive product updates and tips via email',
      contactConsent: 'I agree to be contacted for user research and feedback',
      submit: 'Join Waitlist',
      submitting: 'Submitting...',
      required: '*',
      placeholders: {
        name: 'Your full name',
        email: 'you@example.com',
        country: 'e.g., Portugal, Thailand, etc.',
        role: 'Select your role',
        useCase: 'Tell us about your business and travel needs...',
        referral: 'Enter code if you have one'
      },
      validation: {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email address',
        roleRequired: 'Please select a role',
        emailConsentRequired: 'You must agree to receive updates'
      },
      toast: {
        successTitle: "Thank you! You're on the waitlist 🎉",
        successDesc: "We'll notify you when we launch with exclusive founding member pricing.",
        errorTitle: 'Error',
        errorDefault: 'Something went wrong, please try again.'
      }
    }
  },
  de: {
    nav: {
      login: 'Anmelden',
      signup: 'Kostenlos starten',
      features: 'Funktionen',
      security: 'Sicherheit',
      howItWorks: 'So funktioniert es',
      help: 'Hilfe'
    },
    hero: {
      badge: 'Jetzt verfügbar - Kostenlos starten',
      title1: 'Ihr Business-HQ für',
      title2: 'Ortsunabhängigkeit',
      subtitle: 'Verwalten Sie Kunden, senden Sie Rechnungen, verfolgen Sie Reisetage und bleiben Sie visa-konform — alles in einem Dashboard für digitale Nomaden.',
      ctaPrimary: 'Jetzt kostenlos starten',
      ctaSecondary: 'Funktionen erkunden',
      trust1: 'Keine Kreditkarte erforderlich',
      trustEncrypted: 'Ende-zu-Ende verschlüsselt',
      trust3: 'DSGVO-konform'
    },
    security: {
      badge: 'Banken-Sicherheit',
      title: 'Ihre Daten sind',
      titleHighlight: 'Geschützt',
      subtitle: 'Wir nehmen Sicherheit ernst. Ihre sensiblen Geschäftsdaten sind mit Unternehmens-Verschlüsselung und strengen Datenschutzkontrollen geschützt.',
      aes256: 'AES-256-Verschlüsselung',
      aes256Desc: 'Militärische Verschlüsselung für alle Ihre Dokumente, Rechnungen und persönlichen Daten im Ruhezustand und bei der Übertragung.',
      gdpr: 'DSGVO-Konform',
      gdprDesc: 'Vollständige Einhaltung der europäischen Datenschutzvorschriften. Ihre Datenrechte sind stets geschützt.',
      zeroKnowledge: 'Zero-Knowledge-Tresor',
      zeroKnowledgeDesc: 'Ihre Dokumente werden vor dem Upload verschlüsselt. Selbst wir können nicht auf Ihre privaten Dateien zugreifen.',
      euHosting: 'EU-Rechenzentren',
      euHostingDesc: 'Alle Daten werden in sicheren europäischen Rechenzentren mit 99,99% Verfügbarkeitsgarantie gespeichert.',
      badgeGDPR: 'DSGVO Zertifiziert',
      badgeEncrypted: 'AES-256 Verschlüsselt',
      badgeEU: 'EU-Datenhosting',
      badgeAudit: 'Regelmäßige Audits'
    },
    stats: {
      features: '12+ Kernfunktionen',
      currencies: '50+ Währungen unterstützt',
      languages: '6 Sprachen',
      encryption: 'AES-256-Verschlüsselung'
    },
    features: {
      badge: 'Leistungsstarke Funktionen',
      title: 'Alles was Sie brauchen an',
      titleHighlight: 'einem Ort',
      subtitle: 'Speziell entwickelt für Freiberufler und digitale Nomaden, die ihr Geschäft grenzüberschreitend konform verwalten müssen.',
      clientCRM: 'Kunden-CRM',
      clientCRMDesc: 'Visuelles Pipeline-Board zur Verwaltung von Leads, aktiven Kunden und Beziehungen',
      invoicing: 'Multi-Währungs-Rechnungen',
      invoicingDesc: 'Professionelle Rechnungen in 50+ Währungen mit automatischen Wechselkursen',
      taxTracker: 'Steuerresidenz-Tracker',
      taxTrackerDesc: '183-Tage-Regel-Rechner mit Echtzeit-Warnungen für jedes Land',
      travelLog: 'Reiseprotokoll',
      travelLogDesc: 'Verfolgen Sie Ihre Reisen, Ein-/Ausreisedaten und Aufenthaltstage pro Land',
      visaAlerts: 'Visa-Ablauf-Warnungen',
      visaAlertsDesc: 'Erhalten Sie 90, 30 und 7 Tage vor Ablauf von Visa oder Genehmigungen Benachrichtigungen',
      schengen: 'Schengen-Rechner',
      schengenDesc: '90/180-Tage-Rollperioden-Tracker für Schengen-Konformität',
      documents: 'Dokumenten-Tresor',
      documentsDesc: 'Verschlüsselte Speicherung für Pässe, Visa, Verträge und Steuerdokumente',
      expenses: 'Ausgabenverfolgung',
      expensesDesc: 'Ausgaben mit Geo-Tagging, Kategorien und Belegerfassung protokollieren',
      projects: 'Projektmanagement',
      projectsDesc: 'Kanban-Boards, Aufgaben, Meilensteine und Terminverfolgung',
      multilang: 'Mehrsprachige PDFs',
      multilangDesc: 'Rechnungs-PDFs in 6 Sprachen für internationale Kunden generieren',
      analytics: 'Umsatzanalyse',
      analyticsDesc: 'Verfolgen Sie Einnahmen, Ausgaben, Gewinnmargen und Finanztrends',
      security: 'Bank-Level-Sicherheit',
      securityDesc: 'AES-256-Verschlüsselung, DSGVO-konform und regelmäßige Sicherheitsaudits'
    },
    howItWorks: {
      badge: 'Schnellstart',
      title: 'Startklar in',
      titleHighlight: '5 Minuten',
      subtitle: 'Keine technischen Kenntnisse erforderlich. Einfach registrieren und loslegen.',
      step1Title: 'Konto erstellen',
      step1Desc: 'Schnelle Einrichtung mit Ihrer E-Mail. Nationalität und Währungseinstellungen festlegen.',
      step2Title: 'Kunden hinzufügen',
      step2Desc: 'Kunden importieren oder erstellen. Deals über Ihre visuelle Pipeline verfolgen.',
      step3Title: 'Reisen protokollieren',
      step3Desc: 'Reisen erfassen und Echtzeit-Steuerresidenz- und Visa-Berechnungen sehen.',
      step4Title: 'Rechnungen senden',
      step4Desc: 'Professionelle Rechnungen in jeder Währung erstellen und schneller bezahlt werden.'
    },
    problems: {
      badge: 'Das Problem',
      title: 'Generische Tools wurden nicht für Ihren Lebensstil entwickelt',
      item1: 'Jonglieren mit 5+ Apps für Rechnungen, CRM, Reisen und Dokumente',
      item2: 'Manuelles Verfolgen von Visa-Fristen in Tabellen',
      item3: 'Keine Ahnung, wann Sie sich Steuerresidenz-Schwellen nähern',
      item4: 'Stress bei Schengen 90/180-Berechnungen',
      item5: 'Unorganisierte Passscans und Verträge überall'
    },
    solutions: {
      badge: 'Die Lösung',
      title: 'Eine Plattform für Ihr gesamtes Nomaden-Business',
      item1: 'All-in-One-Dashboard für Kunden, Rechnungen, Reisen und Dokumente',
      item2: 'Automatische Visa-Ablauf-Warnungen 90, 30 und 7 Tage im Voraus',
      item3: 'Echtzeit-183-Tage-Steuerresidenz-Tracker pro Land',
      item4: 'Schengen-Rechner, der einfach funktioniert',
      item5: 'Verschlüsselter Tresor für alle wichtigen Dokumente'
    },
    testimonials: {
      title: 'Geliebt von',
      titleHighlight: 'Nomaden weltweit',
      countries: '30+ Länder',
      gdpr: 'DSGVO-konform',
      security: 'Bank-Level-Sicherheit',
      quote1: "Seit ich NomadSuite nutze, mache ich mir keine Sorgen mehr um Schengen-Tage – und ich habe mehr Zeit für Arbeit & Reisen.",
      author1: "Alex Rodriguez",
      role1: "Digitaler Nomade & UX-Designer",
      quote2: "Endlich ein Tool für Kunden + Rechnungen + Reisewarnungen. Früher habe ich 4 verschiedene Apps jongliert.",
      author2: "Priya Kumar",
      role2: "Freiberufliche Entwicklerin",
      quote3: "Die Visa-Ablauf-Warnungen haben mich vor einem teuren Fehler bewahrt. 30 Tage vor Ablauf meiner Arbeitserlaubnis wurde ich benachrichtigt.",
      author3: "Marcus Chen",
      role3: "Remote Software-Ingenieur",
      quote4: "Saubere Oberfläche, präzise Verfolgung, und es funktioniert einfach. Ich empfehle es allen meinen Kunden.",
      author4: "Sarah Williams",
      role4: "Internationale Steuerberaterin",
      quote5: "Ich liebe das Pipeline-Board für die Kundenverwaltung. Speziell für Freiberufler unterwegs entwickelt.",
      author5: "João Silva",
      role5: "Marketing-Berater",
      quote6: "Nutze es seit 8 Monaten in 12 Ländern. Allein die Multi-Währungs-Rechnungen haben sich selbst bezahlt.",
      author6: "Emma Thompson",
      role6: "Content-Strategin"
    },
    cta: {
      title: 'Bereit, Ihr Nomaden-Leben zu vereinfachen?',
      subtitle: 'Schließen Sie sich Tausenden von Freiberuflern und digitalen Nomaden an, die ihr gesamtes Geschäft von einem Dashboard aus verwalten.',
      button: 'Kostenlos starten',
      note: 'Keine Kreditkarte erforderlich • 5-Minuten-Einrichtung • Jederzeit kündbar'
    },
    footer: {
      tagline: 'Entwickelt für Freiberufler & digitale Nomaden. Von überall arbeiten, weniger Sorgen.',
      product: 'Produkt',
      resources: 'Ressourcen',
      legal: 'Rechtliches',
      blog: 'Blog',
      helpCenter: 'Hilfecenter',
      privacy: 'Datenschutz',
      terms: 'Nutzungsbedingungen',
      copyright: 'Alle Rechte vorbehalten.',
      gdprNote: 'DSGVO-konform • AES-256-Verschlüsselung'
    },
    pricing: {
      title: 'Einfache, transparente Preise',
      freeBadge: '🎉 Alle Pläne sind KOSTENLOS während der MVP-Testphase',
      freeText: 'Alle Funktionen freigeschaltet',
      waitlistHint: 'Treten Sie der Warteliste bei für Gründungsmitglieder-Vorteile bei Start der kostenpflichtigen Tarife',
      monthly: 'Monatlich',
      annually: 'Jährlich',
      save: '20% sparen',
      ctaStart: 'Jetzt kostenlos starten',
      ctaWaitlist: 'Warteliste für Vorteile'
    },
    waitlist: {
      badge: 'Optional - Gründungsmitglieder-Vorteile',
      intro: 'Nutzen Sie NomadSuite bereits kostenlos? Großartig! Treten Sie unserer Gründungsmitglieder-Warteliste bei, um besondere Vorteile, Priority Support und exklusive Rabatte zu sichern, wenn wir kostenpflichtige Tarife einführen.',
      title: 'Gründungsmitglieder-Warteliste',
      subtitle: 'Erhalten Sie exklusive Vorteile und Rabatte beim Übergang von kostenlosem MVP zu kostenpflichtigen Plänen',
      successTitle: 'Sie stehen auf der Gründungsmitglieder-Liste!',
      successText: 'Wir benachrichtigen Sie mit exklusiven Gründungsmitglieder-Vorteilen, wenn wir kostenpflichtige Tarife starten. Genießen Sie in der Zwischenzeit alle Funktionen kostenlos!',
      successButton: 'Weitere Person hinzufügen',
      name: 'Name',
      email: 'E-Mail-Adresse',
      country: 'Land',
      role: 'Ich bin ein...',
      useCase: 'Wofür würden Sie NomadSuite nutzen? (Optional)',
      referral: 'Wie haben Sie von uns erfahren? (Optional)',
      emailConsent: 'Ich möchte Produktupdates und Tipps per E-Mail erhalten',
      contactConsent: 'Ich stimme zu, für Nutzerforschung und Feedback kontaktiert zu werden',
      submit: 'Zur Warteliste',
      submitting: 'Wird übermittelt...',
      required: '*',
      placeholders: {
        name: 'Ihr vollständiger Name',
        email: 'sie@beispiel.de',
        country: 'z.B. Portugal, Thailand, usw.',
        role: 'Wählen Sie Ihre Rolle',
        useCase: 'Erzählen Sie uns von Ihren Geschäfts- und Reisebedürfnissen...',
        referral: 'Code eingeben, falls vorhanden'
      },
      validation: {
        nameRequired: 'Name ist erforderlich',
        emailRequired: 'E-Mail ist erforderlich',
        emailInvalid: 'Ungültige E-Mail-Adresse',
        roleRequired: 'Bitte wählen Sie eine Rolle',
        emailConsentRequired: 'Sie müssen zustimmen, Updates zu erhalten'
      },
      toast: {
        successTitle: 'Vielen Dank! Sie stehen auf der Warteliste 🎉',
        successDesc: 'Wir benachrichtigen Sie beim Start mit exklusiven Gründungsmitglieder-Preisen.',
        errorTitle: 'Fehler',
        errorDefault: 'Etwas ist schiefgelaufen, bitte versuchen Sie es erneut.'
      }
    }
  },
  fr: {
    nav: {
      login: 'Se connecter',
      signup: 'Commencer gratuitement',
      features: 'Fonctionnalités',
      security: 'Sécurité',
      howItWorks: 'Comment ça marche',
      help: 'Aide'
    },
    hero: {
      badge: 'Disponible maintenant - Commencez gratuitement',
      title1: 'Votre QG business pour',
      title2: 'la liberté de localisation',
      subtitle: 'Gérez vos clients, envoyez des factures, suivez vos jours de voyage et restez conforme aux visas — le tout depuis un tableau de bord conçu pour les nomades numériques.',
      ctaPrimary: 'Commencer gratuitement',
      ctaSecondary: 'Explorer les fonctionnalités',
      trust1: 'Pas de carte de crédit requise',
      trustEncrypted: 'Chiffrement de bout en bout',
      trust3: 'Conforme RGPD'
    },
    security: {
      badge: 'Sécurité Bancaire',
      title: 'Vos Données sont',
      titleHighlight: 'Protégées',
      subtitle: 'Nous prenons la sécurité au sérieux. Vos données commerciales sensibles sont protégées par un chiffrement de niveau entreprise et des contrôles de confidentialité stricts.',
      aes256: 'Chiffrement AES-256',
      aes256Desc: 'Chiffrement de niveau militaire pour tous vos documents, factures et données personnelles au repos et en transit.',
      gdpr: 'Conforme RGPD',
      gdprDesc: 'Conformité totale aux réglementations européennes sur la protection des données. Vos droits sur vos données sont toujours protégés.',
      zeroKnowledge: 'Coffre-fort Zero-Knowledge',
      zeroKnowledgeDesc: 'Vos documents sont chiffrés avant le téléchargement. Même nous ne pouvons pas accéder à vos fichiers privés.',
      euHosting: 'Centres de Données UE',
      euHostingDesc: 'Toutes les données sont stockées dans des centres de données européens sécurisés avec une garantie de disponibilité de 99,99%.',
      badgeGDPR: 'Certifié RGPD',
      badgeEncrypted: 'Chiffré AES-256',
      badgeEU: 'Hébergement UE',
      badgeAudit: 'Audits Réguliers'
    },
    stats: {
      features: '12+ Fonctionnalités principales',
      currencies: '50+ Devises supportées',
      languages: '6 Langues',
      encryption: 'Chiffrement AES-256'
    },
    features: {
      badge: 'Fonctionnalités puissantes',
      title: 'Tout ce dont vous avez besoin en',
      titleHighlight: 'un seul endroit',
      subtitle: 'Conçu pour les freelances et nomades numériques qui doivent gérer leur entreprise tout en restant conformes au-delà des frontières.',
      clientCRM: 'CRM Clients',
      clientCRMDesc: 'Tableau pipeline visuel pour gérer prospects, clients actifs et relations',
      invoicing: 'Facturation multi-devises',
      invoicingDesc: 'Envoyez des factures professionnelles en 50+ devises avec taux de change automatiques',
      taxTracker: 'Suivi résidence fiscale',
      taxTrackerDesc: 'Calculateur règle des 183 jours avec alertes en temps réel par pays',
      travelLog: 'Journal de voyage',
      travelLogDesc: 'Suivez vos voyages, dates d\'entrée/sortie et jours passés dans chaque pays',
      visaAlerts: 'Alertes expiration visa',
      visaAlertsDesc: 'Soyez notifié 90, 30 et 7 jours avant l\'expiration de tout visa ou permis',
      schengen: 'Calculateur Schengen',
      schengenDesc: 'Suivi période glissante 90/180 jours pour conformité zone Schengen',
      documents: 'Coffre-fort documents',
      documentsDesc: 'Stockage chiffré pour passeports, visas, contrats et documents fiscaux',
      expenses: 'Suivi des dépenses',
      expensesDesc: 'Enregistrez les dépenses avec géolocalisation, catégories et téléchargement de reçus',
      projects: 'Gestion de projets',
      projectsDesc: 'Tableaux Kanban, tâches, jalons et suivi des échéances',
      multilang: 'PDF multilingues',
      multilangDesc: 'Générez des PDF de factures en 6 langues pour clients internationaux',
      analytics: 'Analyse des revenus',
      analyticsDesc: 'Suivez revenus, dépenses, marges bénéficiaires et tendances financières',
      security: 'Sécurité bancaire',
      securityDesc: 'Chiffrement AES-256, conforme RGPD et audits de sécurité réguliers'
    },
    howItWorks: {
      badge: 'Démarrage rapide',
      title: 'Opérationnel en',
      titleHighlight: '5 minutes',
      subtitle: 'Aucune compétence technique requise. Inscrivez-vous et commencez à organiser.',
      step1Title: 'Créer un compte',
      step1Desc: 'Configuration rapide avec votre email. Définissez votre nationalité et préférences de devise.',
      step2Title: 'Ajouter des clients',
      step2Desc: 'Importez ou créez des clients. Suivez les affaires via votre pipeline visuel.',
      step3Title: 'Enregistrer vos voyages',
      step3Desc: 'Enregistrez les voyages et voyez les calculs de résidence fiscale et visa en temps réel.',
      step4Title: 'Envoyer des factures',
      step4Desc: 'Créez des factures professionnelles dans n\'importe quelle devise et soyez payé plus vite.'
    },
    problems: {
      badge: 'Le problème',
      title: 'Les outils génériques ne sont pas faits pour votre style de vie',
      item1: 'Jongler avec 5+ apps pour facturation, CRM, voyage et documents',
      item2: 'Suivre manuellement les échéances de visa dans des tableurs',
      item3: 'Ignorer quand vous approchez des seuils de résidence fiscale',
      item4: 'Stress des calculs Schengen 90/180',
      item5: 'Scans de passeports et contrats désorganisés partout'
    },
    solutions: {
      badge: 'La solution',
      title: 'Une plateforme pour toute votre activité nomade',
      item1: 'Tableau de bord tout-en-un pour clients, factures, voyages et documents',
      item2: 'Alertes automatiques d\'expiration de visa 90, 30 et 7 jours avant',
      item3: 'Suivi en temps réel de la règle des 183 jours par pays',
      item4: 'Calculateur Schengen qui fonctionne simplement',
      item5: 'Coffre-fort chiffré pour tous vos documents importants'
    },
    testimonials: {
      title: 'Adoré par les',
      titleHighlight: 'nomades du monde entier',
      countries: '30+ pays',
      gdpr: 'Conforme RGPD',
      security: 'Sécurité bancaire',
      quote1: "Depuis que j'utilise NomadSuite, je ne m'inquiète plus des jours Schengen – et j'ai plus de temps pour le travail et les voyages.",
      author1: "Alex Rodriguez",
      role1: "Nomade Numérique & Designer UX",
      quote2: "Enfin un outil pour clients + factures + alertes voyage. Avant, je jonglais avec 4 applications différentes.",
      author2: "Priya Kumar",
      role2: "Développeuse Freelance",
      quote3: "Les alertes d'expiration de visa m'ont évité une erreur coûteuse. J'ai été notifié 30 jours avant l'expiration de mon permis de travail.",
      author3: "Marcus Chen",
      role3: "Ingénieur Logiciel à Distance",
      quote4: "Interface claire, suivi précis, et ça fonctionne tout simplement. Je le recommande à tous mes clients.",
      author4: "Sarah Williams",
      role4: "Consultante Fiscale Internationale",
      quote5: "J'adore le tableau pipeline pour gérer les clients. Conçu spécialement pour les freelances en déplacement.",
      author5: "João Silva",
      role5: "Consultant Marketing",
      quote6: "Je l'utilise depuis 8 mois dans 12 pays. La facturation multi-devises à elle seule a rentabilisé l'investissement.",
      author6: "Emma Thompson",
      role6: "Stratège de Contenu"
    },
    cta: {
      title: 'Prêt à simplifier votre vie de nomade ?',
      subtitle: 'Rejoignez des milliers de freelances et nomades numériques qui gèrent toute leur activité depuis un seul tableau de bord.',
      button: 'Commencer gratuitement',
      note: 'Pas de carte de crédit requise • Configuration en 5 min • Annulez quand vous voulez'
    },
    footer: {
      tagline: 'Conçu pour les freelances & nomades numériques. Travaillez partout, inquiétez-vous moins.',
      product: 'Produit',
      resources: 'Ressources',
      legal: 'Légal',
      blog: 'Blog',
      helpCenter: 'Centre d\'aide',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      copyright: 'Tous droits réservés.',
      gdprNote: 'Conforme RGPD • Chiffrement AES-256'
    },
    pricing: {
      title: 'Prix simples et transparents',
      freeBadge: '🎉 Tous les plans sont GRATUITS pendant les tests MVP',
      freeText: 'Toutes les fonctionnalités débloquées',
      waitlistHint: "Rejoignez la liste d'attente pour des avantages de membre fondateur lors du lancement des tarifs payants",
      monthly: 'Mensuel',
      annually: 'Annuel',
      save: 'Économisez 20%',
      ctaStart: 'Commencer gratuitement',
      ctaWaitlist: "Liste d'attente pour avantages"
    },
    waitlist: {
      badge: 'Optionnel - Avantages de membre fondateur',
      intro: "Vous utilisez déjà NomadSuite gratuitement ? Génial ! Rejoignez notre liste d'attente de membres fondateurs pour bénéficier d'avantages spéciaux, d'un support prioritaire et de réductions exclusives lors du lancement des tarifs payants.",
      title: "Liste d'attente des membres fondateurs",
      subtitle: 'Obtenez des avantages et réductions exclusifs lors de la transition du MVP gratuit aux plans payants',
      successTitle: 'Vous êtes sur la liste des membres fondateurs !',
      successText: "Nous vous informerons des avantages exclusifs de membre fondateur lors du lancement des tarifs payants. Continuez à profiter de toutes les fonctionnalités gratuitement en attendant !",
      successButton: 'Inscrire une autre personne',
      name: 'Nom',
      email: 'Adresse e-mail',
      country: 'Pays',
      role: 'Je suis un...',
      useCase: 'Pour quoi utiliseriez-vous NomadSuite ? (Optionnel)',
      referral: 'Comment avez-vous entendu parler de nous ? (Optionnel)',
      emailConsent: 'Je souhaite recevoir des mises à jour produit et des conseils par e-mail',
      contactConsent: 'J\'accepte d\'être contacté pour des recherches utilisateur et des retours',
      submit: "Rejoindre la liste d'attente",
      submitting: 'Envoi en cours...',
      required: '*',
      placeholders: {
        name: 'Votre nom complet',
        email: 'vous@exemple.fr',
        country: 'par ex. Portugal, Thaïlande, etc.',
        role: 'Sélectionnez votre rôle',
        useCase: 'Parlez-nous de vos besoins professionnels et de voyage...',
        referral: 'Entrez le code si vous en avez un'
      },
      validation: {
        nameRequired: 'Le nom est requis',
        emailRequired: 'L\'email est requis',
        emailInvalid: 'Adresse e-mail invalide',
        roleRequired: 'Veuillez sélectionner un rôle',
        emailConsentRequired: 'Vous devez accepter de recevoir des mises à jour'
      },
      toast: {
        successTitle: "Merci ! Vous êtes sur la liste d'attente 🎉",
        successDesc: 'Nous vous informerons lors du lancement avec des tarifs exclusifs de membre fondateur.',
        errorTitle: 'Erreur',
        errorDefault: 'Une erreur s\'est produite, veuillez réessayer.'
      }
    }
  },
  vi: {
    nav: {
      login: 'Đăng nhập',
      signup: 'Bắt đầu miễn phí',
      features: 'Tính năng',
      security: 'Bảo mật',
      howItWorks: 'Cách hoạt động',
      help: 'Trợ giúp'
    },
    hero: {
      badge: 'Đã có sẵn - Bắt đầu miễn phí ngay',
      title1: 'Tổng hành dinh kinh doanh cho',
      title2: 'Tự do địa điểm',
      subtitle: 'Quản lý khách hàng, gửi hóa đơn, theo dõi ngày du lịch và tuân thủ visa — tất cả từ một bảng điều khiển được thiết kế cho dân du mục số.',
      ctaPrimary: 'Bắt đầu miễn phí ngay',
      ctaSecondary: 'Khám phá tính năng',
      trust1: 'Không cần thẻ tín dụng',
      trustEncrypted: 'Mã hóa đầu cuối',
      trust3: 'Tuân thủ GDPR'
    },
    security: {
      badge: 'Bảo mật cấp ngân hàng',
      title: 'Dữ liệu của bạn được',
      titleHighlight: 'Bảo vệ',
      subtitle: 'Chúng tôi rất coi trọng bảo mật. Dữ liệu kinh doanh nhạy cảm của bạn được bảo vệ bằng mã hóa cấp doanh nghiệp và kiểm soát quyền riêng tư nghiêm ngặt.',
      aes256: 'Mã hóa AES-256',
      aes256Desc: 'Mã hóa cấp quân sự cho tất cả tài liệu, hóa đơn và dữ liệu cá nhân của bạn khi lưu trữ và truyền tải.',
      gdpr: 'Tuân thủ GDPR',
      gdprDesc: 'Tuân thủ đầy đủ các quy định bảo vệ dữ liệu châu Âu. Quyền dữ liệu của bạn luôn được bảo vệ.',
      zeroKnowledge: 'Kho lưu trữ Zero-Knowledge',
      zeroKnowledgeDesc: 'Tài liệu của bạn được mã hóa trước khi tải lên. Ngay cả chúng tôi cũng không thể truy cập các tệp riêng tư của bạn.',
      euHosting: 'Trung tâm dữ liệu EU',
      euHostingDesc: 'Tất cả dữ liệu được lưu trữ tại các trung tâm dữ liệu châu Âu an toàn với cam kết hoạt động 99,99%.',
      badgeGDPR: 'Chứng nhận GDPR',
      badgeEncrypted: 'Mã hóa AES-256',
      badgeEU: 'Lưu trữ tại EU',
      badgeAudit: 'Kiểm tra định kỳ'
    },
    stats: {
      features: '12+ Tính năng cốt lõi',
      currencies: '50+ Loại tiền tệ',
      languages: '6 Ngôn ngữ',
      encryption: 'Mã hóa AES-256'
    },
    features: {
      badge: 'Tính năng mạnh mẽ',
      title: 'Mọi thứ bạn cần trong',
      titleHighlight: 'Một nơi',
      subtitle: 'Được xây dựng riêng cho freelancer và dân du mục số cần quản lý công việc đồng thời tuân thủ quy định xuyên biên giới.',
      clientCRM: 'CRM Khách hàng',
      clientCRMDesc: 'Bảng pipeline trực quan để quản lý leads, khách hàng và mối quan hệ',
      invoicing: 'Hóa đơn đa tiền tệ',
      invoicingDesc: 'Gửi hóa đơn chuyên nghiệp bằng 50+ loại tiền tệ với tỷ giá tự động',
      taxTracker: 'Theo dõi cư trú thuế',
      taxTrackerDesc: 'Công cụ tính quy tắc 183 ngày với cảnh báo thời gian thực cho từng quốc gia',
      travelLog: 'Nhật ký du lịch',
      travelLogDesc: 'Theo dõi chuyến đi, ngày nhập/xuất cảnh và số ngày ở mỗi quốc gia',
      visaAlerts: 'Cảnh báo hết hạn visa',
      visaAlertsDesc: 'Nhận thông báo 90, 30 và 7 ngày trước khi visa hoặc giấy phép hết hạn',
      schengen: 'Công cụ tính Schengen',
      schengenDesc: 'Theo dõi chu kỳ 90/180 ngày để tuân thủ khu vực Schengen',
      documents: 'Kho lưu trữ tài liệu',
      documentsDesc: 'Lưu trữ mã hóa cho hộ chiếu, visa, hợp đồng và tài liệu thuế',
      expenses: 'Theo dõi chi phí',
      expensesDesc: 'Ghi nhận chi phí với định vị địa lý, danh mục và tải lên biên lai',
      projects: 'Quản lý dự án',
      projectsDesc: 'Bảng Kanban, công việc, mốc quan trọng và theo dõi hạn chót',
      multilang: 'PDF đa ngôn ngữ',
      multilangDesc: 'Tạo PDF hóa đơn bằng 6 ngôn ngữ cho khách hàng quốc tế',
      analytics: 'Phân tích doanh thu',
      analyticsDesc: 'Theo dõi thu nhập, chi phí, biên lợi nhuận và xu hướng tài chính',
      security: 'Bảo mật cấp ngân hàng',
      securityDesc: 'Mã hóa AES-256, tuân thủ GDPR và kiểm tra bảo mật định kỳ'
    },
    howItWorks: {
      badge: 'Bắt đầu nhanh',
      title: 'Sẵn sàng hoạt động trong',
      titleHighlight: '5 phút',
      subtitle: 'Không cần kỹ năng kỹ thuật. Chỉ cần đăng ký và bắt đầu tổ chức.',
      step1Title: 'Tạo tài khoản',
      step1Desc: 'Thiết lập nhanh với email. Đặt quốc tịch và tùy chọn tiền tệ.',
      step2Title: 'Thêm khách hàng',
      step2Desc: 'Nhập hoặc tạo khách hàng. Theo dõi giao dịch qua pipeline trực quan.',
      step3Title: 'Ghi nhật ký du lịch',
      step3Desc: 'Ghi lại chuyến đi và xem tính toán cư trú thuế và visa theo thời gian thực.',
      step4Title: 'Gửi hóa đơn',
      step4Desc: 'Tạo hóa đơn chuyên nghiệp bằng bất kỳ loại tiền tệ nào và được thanh toán nhanh hơn.'
    },
    problems: {
      badge: 'Vấn đề',
      title: 'Công cụ chung không được xây dựng cho lối sống của bạn',
      item1: 'Xoay sở với 5+ ứng dụng cho hóa đơn, CRM, du lịch và tài liệu',
      item2: 'Theo dõi thủ công hạn visa trong bảng tính',
      item3: 'Không biết khi nào đang tiếp cận ngưỡng cư trú thuế',
      item4: 'Căng thẳng về tính toán Schengen 90/180',
      item5: 'Bản scan hộ chiếu và hợp đồng lộn xộn khắp nơi'
    },
    solutions: {
      badge: 'Giải pháp',
      title: 'Một nền tảng cho toàn bộ doanh nghiệp du mục của bạn',
      item1: 'Bảng điều khiển tất-cả-trong-một cho khách hàng, hóa đơn, du lịch và tài liệu',
      item2: 'Cảnh báo hết hạn visa tự động 90, 30 và 7 ngày trước',
      item3: 'Theo dõi quy tắc 183 ngày cư trú thuế theo thời gian thực cho từng quốc gia',
      item4: 'Công cụ tính Schengen hoạt động đơn giản',
      item5: 'Kho lưu trữ mã hóa cho tất cả tài liệu quan trọng'
    },
    testimonials: {
      title: 'Được yêu thích bởi',
      titleHighlight: 'Dân du mục toàn cầu',
      countries: '30+ quốc gia',
      gdpr: 'Tuân thủ GDPR',
      security: 'Bảo mật cấp ngân hàng',
      quote1: "Từ khi dùng NomadSuite, tôi không còn lo lắng về số ngày Schengen nữa – và tôi có nhiều thời gian hơn cho công việc & du lịch.",
      author1: "Alex Rodriguez",
      role1: "Dân du mục số & Nhà thiết kế UX",
      quote2: "Cuối cùng cũng có một công cụ cho khách hàng + hóa đơn + cảnh báo du lịch. Trước đây tôi phải xoay sở với 4 ứng dụng khác nhau.",
      author2: "Priya Kumar",
      role2: "Lập trình viên Freelance",
      quote3: "Cảnh báo hết hạn visa đã cứu tôi khỏi một sai lầm tốn kém. Tôi được thông báo 30 ngày trước khi giấy phép lao động hết hạn.",
      author3: "Marcus Chen",
      role3: "Kỹ sư phần mềm từ xa",
      quote4: "Giao diện sạch sẽ, theo dõi chính xác, và nó hoạt động rất tốt. Tôi giới thiệu cho tất cả khách hàng của mình.",
      author4: "Sarah Williams",
      role4: "Tư vấn thuế quốc tế",
      quote5: "Tôi thích bảng pipeline để quản lý khách hàng. Được xây dựng riêng cho freelancer di chuyển nhiều.",
      author5: "João Silva",
      role5: "Tư vấn Marketing",
      quote6: "Đã sử dụng 8 tháng qua 12 quốc gia. Riêng tính năng hóa đơn đa tiền tệ đã hoàn vốn rồi.",
      author6: "Emma Thompson",
      role6: "Chuyên gia chiến lược nội dung"
    },
    cta: {
      title: 'Sẵn sàng đơn giản hóa cuộc sống du mục?',
      subtitle: 'Tham gia cùng hàng ngàn freelancer và dân du mục số quản lý toàn bộ doanh nghiệp từ một bảng điều khiển.',
      button: 'Bắt đầu miễn phí',
      note: 'Không cần thẻ tín dụng • Thiết lập 5 phút • Hủy bất cứ lúc nào'
    },
    footer: {
      tagline: 'Được xây dựng cho freelancer & dân du mục số. Làm việc mọi nơi, lo lắng ít hơn.',
      product: 'Sản phẩm',
      resources: 'Tài nguyên',
      legal: 'Pháp lý',
      blog: 'Blog',
      helpCenter: 'Trung tâm trợ giúp',
      privacy: 'Chính sách bảo mật',
      terms: 'Điều khoản dịch vụ',
      copyright: 'Đã đăng ký bản quyền.',
      gdprNote: 'Tuân thủ GDPR • Mã hóa AES-256'
    },
    pricing: {
      title: 'Giá cả đơn giản, minh bạch',
      freeBadge: '🎉 Tất cả gói MIỄN PHÍ trong thời gian thử nghiệm MVP',
      freeText: 'Tất cả tính năng đã mở khóa',
      waitlistHint: 'Tham gia danh sách chờ để nhận đặc quyền thành viên sáng lập khi chúng tôi ra mắt gói trả phí',
      monthly: 'Hàng tháng',
      annually: 'Hàng năm',
      save: 'Tiết kiệm 20%',
      ctaStart: 'Bắt đầu miễn phí ngay',
      ctaWaitlist: 'Tham gia danh sách chờ để nhận đặc quyền'
    },
    waitlist: {
      badge: 'Tùy chọn - Đặc quyền thành viên sáng lập',
      intro: 'Đã sử dụng NomadSuite miễn phí? Tuyệt vời! Tham gia danh sách chờ thành viên sáng lập để khóa các đặc quyền đặc biệt, hỗ trợ ưu tiên và giảm giá độc quyền khi chúng tôi ra mắt gói trả phí.',
      title: 'Danh sách chờ thành viên sáng lập',
      subtitle: 'Nhận đặc quyền và giảm giá độc quyền khi chuyển từ MVP miễn phí sang gói trả phí',
      successTitle: 'Bạn đã có trong danh sách thành viên sáng lập!',
      successText: 'Chúng tôi sẽ thông báo cho bạn về các đặc quyền thành viên sáng lập độc quyền khi ra mắt gói trả phí. Hãy tiếp tục tận hưởng tất cả tính năng miễn phí trong thời gian chờ đợi!',
      successButton: 'Thêm người khác',
      name: 'Tên',
      email: 'Địa chỉ email',
      country: 'Quốc gia',
      role: 'Tôi là...',
      useCase: 'Bạn sẽ sử dụng NomadSuite để làm gì? (Tùy chọn)',
      referral: 'Bạn biết về chúng tôi qua đâu? (Tùy chọn)',
      emailConsent: 'Tôi muốn nhận cập nhật sản phẩm và mẹo qua email',
      contactConsent: 'Tôi đồng ý được liên hệ để nghiên cứu người dùng và phản hồi',
      submit: 'Tham gia danh sách chờ',
      submitting: 'Đang gửi...',
      required: '*',
      placeholders: {
        name: 'Họ và tên đầy đủ của bạn',
        email: 'ban@vidu.vn',
        country: 'ví dụ: Bồ Đào Nha, Thái Lan, v.v.',
        role: 'Chọn vai trò của bạn',
        useCase: 'Cho chúng tôi biết về nhu cầu kinh doanh và du lịch của bạn...',
        referral: 'Nhập mã nếu bạn có'
      },
      validation: {
        nameRequired: 'Tên là bắt buộc',
        emailRequired: 'Email là bắt buộc',
        emailInvalid: 'Địa chỉ email không hợp lệ',
        roleRequired: 'Vui lòng chọn vai trò',
        emailConsentRequired: 'Bạn phải đồng ý nhận cập nhật'
      },
      toast: {
        successTitle: "Cảm ơn! Bạn đã có trong danh sách chờ 🎉",
        successDesc: 'Chúng tôi sẽ thông báo cho bạn khi ra mắt với giá ưu đãi thành viên sáng lập.',
        errorTitle: 'Lỗi',
        errorDefault: 'Đã xảy ra lỗi, vui lòng thử lại.'
      }
    }
  },
  ja: {
    nav: {
      login: 'ログイン',
      signup: '無料で始める',
      features: '機能',
      security: 'セキュリティ',
      howItWorks: '使い方',
      help: 'ヘルプ'
    },
    hero: {
      badge: '今すぐ利用可能 - 無料で始める',
      title1: 'ロケーションフリーダムのための',
      title2: 'ビジネス本部',
      subtitle: 'クライアント管理、請求書送信、旅行日数の追跡、ビザコンプライアンス — デジタルノマドのために設計された美しいダッシュボードで全て管理。',
      ctaPrimary: '今すぐ無料で始める',
      ctaSecondary: '機能を探索',
      trust1: 'クレジットカード不要',
      trustEncrypted: 'エンドツーエンド暗号化',
      trust3: 'GDPR準拠'
    },
    security: {
      badge: '銀行レベルのセキュリティ',
      title: 'あなたのデータは',
      titleHighlight: '保護されています',
      subtitle: 'セキュリティを真剣に考えています。機密性の高いビジネスデータは、企業レベルの暗号化と厳格なプライバシー管理で保護されています。',
      aes256: 'AES-256暗号化',
      aes256Desc: 'すべてのドキュメント、請求書、個人データを保存時と転送時に軍事レベルの暗号化で保護。',
      gdpr: 'GDPR準拠',
      gdprDesc: '欧州データ保護規制に完全準拠。あなたのデータ権利は常に保護されています。',
      zeroKnowledge: 'ゼロナレッジボールト',
      zeroKnowledgeDesc: 'ドキュメントはアップロード前に暗号化されます。私たちでさえあなたのプライベートファイルにアクセスできません。',
      euHosting: 'EUデータセンター',
      euHostingDesc: 'すべてのデータは99.99%の稼働時間保証付きの安全な欧州データセンターに保存されます。',
      badgeGDPR: 'GDPR認証',
      badgeEncrypted: 'AES-256暗号化',
      badgeEU: 'EUデータホスティング',
      badgeAudit: '定期監査'
    },
    stats: {
      features: '12以上のコア機能',
      currencies: '50以上の通貨対応',
      languages: '6言語',
      encryption: 'AES-256暗号化'
    },
    features: {
      badge: '強力な機能',
      title: '必要なものすべてを',
      titleHighlight: '一箇所に',
      subtitle: '国境を越えてコンプライアンスを維持しながらビジネスを管理する必要があるフリーランサーとデジタルノマドのために特別に構築。',
      clientCRM: 'クライアントCRM',
      clientCRMDesc: 'リード、アクティブクライアント、関係を管理するビジュアルパイプラインボード',
      invoicing: '多通貨請求',
      invoicingDesc: '自動為替レートで50以上の通貨でプロフェッショナルな請求書を送信',
      taxTracker: '税務居住地トラッカー',
      taxTrackerDesc: '各国のリアルタイムアラート付き183日ルール計算機',
      travelLog: '旅行ログ',
      travelLogDesc: '旅行、入出国日、各国での滞在日数を追跡',
      visaAlerts: 'ビザ期限アラート',
      visaAlertsDesc: 'ビザや許可証の期限切れ90日、30日、7日前に通知を受け取る',
      schengen: 'シェンゲン計算機',
      schengenDesc: 'シェンゲンエリアコンプライアンスのための90/180日ローリング期間トラッカー',
      documents: 'ドキュメントボールト',
      documentsDesc: 'パスポート、ビザ、契約書、税務書類の暗号化ストレージ',
      expenses: '経費追跡',
      expensesDesc: 'ジオタグ、カテゴリ、レシートアップロードで経費を記録',
      projects: 'プロジェクト管理',
      projectsDesc: 'カンバンボード、タスク、マイルストーン、締め切り追跡',
      multilang: '多言語PDF',
      multilangDesc: '国際クライアント向けに6言語で請求書PDFを生成',
      analytics: '収益分析',
      analyticsDesc: '収入、経費、利益率、財務トレンドを追跡',
      security: '銀行レベルセキュリティ',
      securityDesc: 'AES-256暗号化、GDPR準拠、定期的なセキュリティ監査'
    },
    howItWorks: {
      badge: 'クイックスタート',
      title: '稼働まで',
      titleHighlight: '5分',
      subtitle: '技術的なスキルは不要。登録して整理を始めるだけ。',
      step1Title: 'アカウント作成',
      step1Desc: 'メールでクイックセットアップ。国籍と通貨の設定。',
      step2Title: 'クライアント追加',
      step2Desc: 'クライアントをインポートまたは作成。ビジュアルパイプラインで取引を追跡。',
      step3Title: '旅行を記録',
      step3Desc: '旅行を記録し、リアルタイムの税務居住地とビザ計算を確認。',
      step4Title: '請求書送信',
      step4Desc: 'どの通貨でもプロフェッショナルな請求書を作成し、より早く支払いを受ける。'
    },
    problems: {
      badge: '問題点',
      title: '汎用ツールはあなたのライフスタイル向けに作られていない',
      item1: '請求、CRM、旅行、ドキュメント用の5以上のアプリを使い分ける',
      item2: 'スプレッドシートでビザの期限を手動追跡',
      item3: '税務居住地の閾値に近づいているかわからない',
      item4: 'シェンゲン90/180計算のストレス',
      item5: 'パスポートスキャンや契約書があちこちに散らばっている'
    },
    solutions: {
      badge: '解決策',
      title: 'ノマドビジネス全体のためのワンプラットフォーム',
      item1: 'クライアント、請求書、旅行、ドキュメントのためのオールインワンダッシュボード',
      item2: '90日、30日、7日前の自動ビザ期限アラート',
      item3: '国ごとのリアルタイム183日税務居住地トラッカー',
      item4: 'シンプルに機能するシェンゲン計算機',
      item5: 'すべての重要なドキュメントのための暗号化ボールト'
    },
    testimonials: {
      title: '世界中の',
      titleHighlight: 'ノマドに愛されている',
      countries: '30以上の国',
      gdpr: 'GDPR準拠',
      security: '銀行レベルセキュリティ',
      quote1: "NomadSuiteを使い始めてから、シェンゲンの日数を心配することがなくなりました。仕事と旅行にもっと時間を使えます。",
      author1: "Alex Rodriguez",
      role1: "デジタルノマド＆UXデザイナー",
      quote2: "ついにクライアント＋請求書＋旅行アラートが一つのツールに。以前は4つの異なるアプリを使い分けていました。",
      author2: "Priya Kumar",
      role2: "フリーランス開発者",
      quote3: "ビザ期限アラートのおかげで高額なミスを避けられました。労働許可証の期限切れ30日前に通知を受けました。",
      author3: "Marcus Chen",
      role3: "リモートソフトウェアエンジニア",
      quote4: "クリーンなインターフェース、正確なトラッキング、そしてちゃんと動く。すべてのクライアントにお勧めしています。",
      author4: "Sarah Williams",
      role4: "国際税務コンサルタント",
      quote5: "クライアント管理のパイプラインボードが気に入っています。移動の多いフリーランサー向けに特別に設計されています。",
      author5: "João Silva",
      role5: "マーケティングコンサルタント",
      quote6: "12カ国で8ヶ月使用しています。多通貨請求だけでも元が取れました。",
      author6: "Emma Thompson",
      role6: "コンテンツストラテジスト"
    },
    cta: {
      title: 'ノマドライフをシンプルにする準備はできていますか？',
      subtitle: 'ワンダッシュボードからビジネス全体を管理する何千人ものフリーランサーやデジタルノマドに参加しましょう。',
      button: '無料で始める',
      note: 'クレジットカード不要 • 5分でセットアップ • いつでもキャンセル可能'
    },
    footer: {
      tagline: 'フリーランサー＆デジタルノマドのために構築。どこでも働き、心配は少なく。',
      product: 'プロダクト',
      resources: 'リソース',
      legal: '法的情報',
      blog: 'ブログ',
      helpCenter: 'ヘルプセンター',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      copyright: '全著作権所有。',
      gdprNote: 'GDPR準拠 • AES-256暗号化'
    },
    pricing: {
      title: 'シンプルで透明な料金体系',
      freeBadge: '🎉 MVPテスト中はすべてのプランが無料',
      freeText: 'すべての機能がアンロック',
      waitlistHint: '有料プランのローンチ時に創設メンバー特典を得るためにウェイトリストに参加',
      monthly: '月額',
      annually: '年額',
      save: '20%節約',
      ctaStart: '今すぐ無料で始める',
      ctaWaitlist: '特典のウェイトリストに参加'
    },
    waitlist: {
      badge: 'オプション - 創設メンバー特典',
      intro: 'すでにNomadSuiteを無料で使用していますか？素晴らしい！有料プランのローンチ時に特別特典、優先サポート、限定割引を確保するために、創設メンバーウェイトリストに参加してください。',
      title: '創設メンバーウェイトリスト',
      subtitle: '無料MVPから有料プランへの移行時に限定特典と割引を取得',
      successTitle: '創設メンバーリストに登録されました！',
      successText: '有料プランのローンチ時に限定創設メンバー特典をお知らせします。その間、すべての機能を無料でお楽しみください！',
      successButton: '別の人を追加',
      name: '名前',
      email: 'メールアドレス',
      country: '国',
      role: '私は...',
      useCase: 'NomadSuiteを何に使用しますか？（任意）',
      referral: 'どこで私たちを知りましたか？（任意）',
      emailConsent: '製品アップデートとヒントをメールで受け取りたい',
      contactConsent: 'ユーザー調査とフィードバックのために連絡されることに同意します',
      submit: 'ウェイトリストに参加',
      submitting: '送信中...',
      required: '*',
      placeholders: {
        name: 'フルネーム',
        email: 'you@example.jp',
        country: '例：ポルトガル、タイなど',
        role: '役割を選択',
        useCase: 'ビジネスと旅行のニーズについてお聞かせください...',
        referral: 'コードがあれば入力してください'
      },
      validation: {
        nameRequired: '名前は必須です',
        emailRequired: 'メールアドレスは必須です',
        emailInvalid: 'メールアドレスが無効です',
        roleRequired: '役割を選択してください',
        emailConsentRequired: '更新情報の受信に同意する必要があります'
      },
      toast: {
        successTitle: "ありがとうございます！ウェイトリストに登録されました 🎉",
        successDesc: '創設メンバー限定価格でローンチ時にお知らせします。',
        errorTitle: 'エラー',
        errorDefault: '問題が発生しました。もう一度お試しください。'
      }
    }
  },
  zh: {
    nav: {
      login: '登录',
      signup: '免费开始',
      features: '功能',
      security: '安全',
      howItWorks: '使用方法',
      help: '帮助'
    },
    hero: {
      badge: '现已可用 - 立即免费开始',
      title1: '为位置自由打造的',
      title2: '商务总部',
      subtitle: '管理客户、发送发票、跟踪旅行天数、保持签证合规 — 一切尽在为数字游民设计的精美仪表板中。',
      ctaPrimary: '立即免费开始',
      ctaSecondary: '探索功能',
      trust1: '无需信用卡',
      trustEncrypted: '端到端加密',
      trust3: 'GDPR合规'
    },
    security: {
      badge: '银行级安全',
      title: '您的数据受到',
      titleHighlight: '保护',
      subtitle: '我们非常重视安全。您的敏感商业数据受到企业级加密和严格隐私控制的保护。',
      aes256: 'AES-256加密',
      aes256Desc: '为您所有的文档、发票和个人数据提供军事级加密，无论是静态存储还是传输中。',
      gdpr: 'GDPR合规',
      gdprDesc: '完全符合欧洲数据保护法规。您的数据权利始终受到保护。',
      zeroKnowledge: '零知识保险库',
      zeroKnowledgeDesc: '您的文档在上传前已加密。即使我们也无法访问您的私人文件。',
      euHosting: '欧盟数据中心',
      euHostingDesc: '所有数据存储在安全的欧洲数据中心，提供99.99%的正常运行时间保证。',
      badgeGDPR: 'GDPR认证',
      badgeEncrypted: 'AES-256加密',
      badgeEU: '欧盟数据托管',
      badgeAudit: '定期审计'
    },
    stats: {
      features: '12+核心功能',
      currencies: '50+种货币支持',
      languages: '6种语言',
      encryption: 'AES-256加密'
    },
    features: {
      badge: '强大功能',
      title: '您需要的一切尽在',
      titleHighlight: '一处',
      subtitle: '专为需要跨境合规管理业务的自由职业者和数字游民打造。',
      clientCRM: '客户CRM',
      clientCRMDesc: '可视化管道看板，管理潜在客户、活跃客户和关系',
      invoicing: '多币种发票',
      invoicingDesc: '以50+种货币发送专业发票，自动汇率',
      taxTracker: '税务居住追踪器',
      taxTrackerDesc: '183天规则计算器，每个国家实时提醒',
      travelLog: '旅行日志',
      travelLogDesc: '跟踪行程、入境/出境日期和每个国家的停留天数',
      visaAlerts: '签证到期提醒',
      visaAlertsDesc: '在签证或许可证到期前90、30和7天收到通知',
      schengen: '申根计算器',
      schengenDesc: '申根区合规的90/180天滚动期跟踪器',
      documents: '文档保险库',
      documentsDesc: '护照、签证、合同和税务文件的加密存储',
      expenses: '费用跟踪',
      expensesDesc: '记录费用，支持地理标记、分类和收据上传',
      projects: '项目管理',
      projectsDesc: '看板、任务、里程碑和截止日期跟踪',
      multilang: '多语言PDF',
      multilangDesc: '为国际客户生成6种语言的发票PDF',
      analytics: '收入分析',
      analyticsDesc: '跟踪收入、支出、利润率和财务趋势',
      security: '银行级安全',
      securityDesc: 'AES-256加密、GDPR合规和定期安全审计'
    },
    howItWorks: {
      badge: '快速开始',
      title: '5分钟内',
      titleHighlight: '启动运行',
      subtitle: '无需技术技能。只需注册并开始整理。',
      step1Title: '创建账户',
      step1Desc: '使用电子邮件快速设置。设置您的国籍和货币偏好。',
      step2Title: '添加客户',
      step2Desc: '导入或创建客户。通过可视化管道跟踪交易。',
      step3Title: '记录旅行',
      step3Desc: '记录行程，查看实时税务居住和签证计算。',
      step4Title: '发送发票',
      step4Desc: '创建任何货币的专业发票，更快收款。'
    },
    problems: {
      badge: '问题',
      title: '通用工具不是为您的生活方式设计的',
      item1: '在5个以上的应用之间切换处理发票、CRM、旅行和文档',
      item2: '在电子表格中手动跟踪签证截止日期',
      item3: '不知道何时接近税务居住阈值',
      item4: '为申根90/180计算感到压力',
      item5: '护照扫描件和合同到处散落'
    },
    solutions: {
      badge: '解决方案',
      title: '一个平台满足您整个游牧业务需求',
      item1: '客户、发票、旅行和文档一站式仪表板',
      item2: '签证到期前90、30和7天自动提醒',
      item3: '每个国家的实时183天税务居住跟踪器',
      item4: '简单好用的申根计算器',
      item5: '所有重要文档的加密保险库'
    },
    testimonials: {
      title: '被全球',
      titleHighlight: '游牧者喜爱',
      countries: '30+国家',
      gdpr: 'GDPR合规',
      security: '银行级安全',
      quote1: "自从使用NomadSuite，我再也不用担心申根天数了——我有更多时间工作和旅行。",
      author1: "Alex Rodriguez",
      role1: "数字游民 & UX设计师",
      quote2: "终于有一个工具可以管理客户+发票+旅行提醒。我以前要在4个不同的应用之间切换。",
      author2: "Priya Kumar",
      role2: "自由职业开发者",
      quote3: "签证到期提醒帮我避免了一个代价高昂的错误。在我的工作许可到期前30天收到了通知。",
      author3: "Marcus Chen",
      role3: "远程软件工程师",
      quote4: "界面简洁，跟踪准确，而且非常好用。我向所有客户推荐。",
      author4: "Sarah Williams",
      role4: "国际税务顾问",
      quote5: "喜欢用管道看板管理客户。专为经常移动的自由职业者设计。",
      author5: "João Silva",
      role5: "营销顾问",
      quote6: "已在12个国家使用8个月。光是多币种发票功能就已经值回票价。",
      author6: "Emma Thompson",
      role6: "内容策略师"
    },
    cta: {
      title: '准备简化您的游牧生活？',
      subtitle: '加入数千名从单一仪表板管理整个业务的自由职业者和数字游民。',
      button: '免费开始',
      note: '无需信用卡 • 5分钟设置 • 随时取消'
    },
    footer: {
      tagline: '为自由职业者和数字游民打造。随处工作，减少担忧。',
      product: '产品',
      resources: '资源',
      legal: '法律',
      blog: '博客',
      helpCenter: '帮助中心',
      privacy: '隐私政策',
      terms: '服务条款',
      copyright: '版权所有。',
      gdprNote: 'GDPR合规 • AES-256加密'
    },
    pricing: {
      title: '简单透明的定价',
      freeBadge: '🎉 MVP测试期间所有计划免费',
      freeText: '所有功能已解锁',
      waitlistHint: '加入候补名单，在我们推出付费套餐时获得创始会员福利',
      monthly: '按月',
      annually: '按年',
      save: '节省20%',
      ctaStart: '立即免费开始',
      ctaWaitlist: '加入候补名单获取福利'
    },
    waitlist: {
      badge: '可选 - 创始会员福利',
      intro: '已经在免费使用NomadSuite了？太好了！加入我们的创始会员候补名单，在我们推出付费套餐时锁定特殊福利、优先支持和专属折扣。',
      title: '创始会员候补名单',
      subtitle: '在从免费MVP过渡到付费计划时获得专属福利和折扣',
      successTitle: '您已加入创始会员名单！',
      successText: '我们将在推出付费套餐时通知您专属创始会员福利。同时请继续免费享受所有功能！',
      successButton: '添加其他人',
      name: '姓名',
      email: '电子邮件地址',
      country: '国家',
      role: '我是...',
      useCase: '您会用NomadSuite做什么？（可选）',
      referral: '您是如何了解我们的？（可选）',
      emailConsent: '我想通过电子邮件接收产品更新和提示',
      contactConsent: '我同意被联系以进行用户研究和反馈',
      submit: '加入候补名单',
      submitting: '提交中...',
      required: '*',
      placeholders: {
        name: '您的全名',
        email: 'you@example.cn',
        country: '例如：葡萄牙、泰国等',
        role: '选择您的角色',
        useCase: '告诉我们您的业务和旅行需求...',
        referral: '如有推荐码请输入'
      },
      validation: {
        nameRequired: '姓名为必填项',
        emailRequired: '电子邮件为必填项',
        emailInvalid: '电子邮件地址无效',
        roleRequired: '请选择角色',
        emailConsentRequired: '您必须同意接收更新'
      },
      toast: {
        successTitle: "谢谢！您已加入候补名单 🎉",
        successDesc: '我们将在推出时通知您专属创始会员定价。',
        errorTitle: '错误',
        errorDefault: '出现问题，请重试。'
      }
    }
  }
};
