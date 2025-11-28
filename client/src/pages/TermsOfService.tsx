import React from 'react';
import { Link } from 'wouter';
import { Globe, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import PublicLanguageSwitcher from '@/components/PublicLanguageSwitcher';
import { useLandingI18n } from '@/contexts/LandingI18nContext';
import { legalTranslations, type LandingLanguage } from '@/data/legalTranslations';

export default function TermsOfService() {
  const { language } = useLandingI18n();
  const legal = legalTranslations[language as LandingLanguage];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Terms of Service | NomadSuite"
        description="Terms of Service and User Agreement for NomadSuite - Digital Nomad Business Management Platform"
        canonical="https://nomadsuite.io/terms"
      />

      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 font-heading font-bold text-xl sm:text-2xl text-primary cursor-pointer hover:opacity-80 transition-opacity">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">NomadSuite</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <PublicLanguageSwitcher />
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4" />
                {legal.common.backToHome}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{legal.terms.title}</h1>
            <p className="text-muted-foreground text-lg">{legal.terms.lastUpdated}</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing or using NomadSuite ("Service", "Platform", "Application"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                NomadSuite is operated by NomadSuite Inc. ("Company", "we", "us", or "our"). These Terms constitute a legally binding agreement between you and NomadSuite Inc.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                NomadSuite is a software-as-a-service (SaaS) platform that provides tools for digital nomads and location-independent professionals, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Customer Relationship Management (CRM)</li>
                <li>Invoice generation and management</li>
                <li>Travel tracking and residency calculations</li>
                <li>Visa and document expiry alerts</li>
                <li>Secure document storage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Accounts and Registration</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>3.1 Account Creation:</strong> To use certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>3.3 Account Termination:</strong> We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Subscription and Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>4.1 Subscription Plans:</strong> NomadSuite offers a Free tier and Nomad Pro paid plan ($20/month or $199/year, with early-bird pricing at $159/year for early adopters). Pricing and features are subject to change with 30 days' notice to existing subscribers.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>4.2 Billing:</strong> Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law or as expressly stated in these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>4.3 Auto-Renewal:</strong> Subscriptions automatically renew unless canceled before the renewal date. You may cancel your subscription at any time from your account settings.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>4.4 Free Trial:</strong> If you sign up for a free trial, you will have access to premium features for the trial period. Unless you cancel before the trial ends, you will be automatically charged for the subscription plan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. User Content and Data</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>5.1 Your Content:</strong> You retain all ownership rights to the content and data you upload to the Service ("User Content"). By uploading User Content, you grant us a limited, worldwide, non-exclusive license to host, store, and process your content solely to provide the Service.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>5.2 Content Responsibility:</strong> You are solely responsible for your User Content. You represent and warrant that you have all necessary rights to upload your User Content and that it does not violate any laws or third-party rights.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>5.3 Data Export:</strong> You may export your data at any time in CSV or PDF format. Upon account termination, we will retain your data for 90 days before permanent deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Upload malicious code, viruses, or harmful software</li>
                <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use the Service for any illegal, fraudulent, or unauthorized purpose</li>
                <li>Scrape, harvest, or collect data from the Service using automated means</li>
                <li>Resell or redistribute the Service without our written permission</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Intellectual Property Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>7.1 Our IP:</strong> The Service, including all software, designs, text, graphics, logos, and other content (excluding User Content), is owned by NomadSuite Inc. and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>7.2 Limited License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use the Service for your personal or internal business purposes. This license does not include the right to modify, distribute, or create derivative works.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>8.1 No Legal or Tax Advice:</strong> NomadSuite provides informational tools only and does not provide legal, tax, or financial advice. You should consult qualified professionals for advice specific to your situation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>8.2 Accuracy:</strong> While we strive for accuracy in our calculations and alerts (residency tracking, visa expiry, etc.), we do not guarantee that the information is error-free or complete. You are responsible for verifying all information and compliance with applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOMADSUITE INC., ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED EUROS (€100), WHICHEVER IS GREATER.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless NomadSuite Inc. and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or related to your use of the Service, your User Content, or your violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Data Privacy and Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We take data security seriously and implement industry-standard measures to protect your information. Please review our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for details on how we collect, use, and protect your data.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>GDPR Compliance:</strong> For users in the European Union, we comply with the General Data Protection Regulation (GDPR). You have the right to access, correct, delete, or export your personal data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Service Availability and Modifications</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>12.1 Uptime:</strong> We strive to maintain 99.9% uptime but do not guarantee uninterrupted access to the Service. We may experience downtime for maintenance, updates, or unforeseen issues.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>12.2 Modifications:</strong> We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with or without notice. We will provide reasonable notice for material changes that negatively affect your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>13.1 By You:</strong> You may terminate your account at any time by canceling your subscription from your account settings.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>13.2 By Us:</strong> We may suspend or terminate your account immediately, without prior notice, if you violate these Terms or engage in fraudulent, abusive, or illegal activity. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Governing Law and Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>14.1 Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>14.2 Arbitration:</strong> Any dispute arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Body]. The arbitration shall take place in [Location], and the decision of the arbitrator shall be final and binding.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>14.3 Class Action Waiver:</strong> You agree to resolve disputes with us on an individual basis and waive any right to participate in class action lawsuits or class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">15. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms from time to time. If we make material changes, we will notify you by email or by posting a notice on the Service at least 30 days before the changes take effect. Your continued use of the Service after the changes take effect constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">16. Miscellaneous</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>16.1 Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>16.2 Entire Agreement:</strong> These Terms, together with our Privacy Policy and any other legal notices published by us, constitute the entire agreement between you and NomadSuite Inc.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>16.3 No Waiver:</strong> Our failure to enforce any provision of these Terms shall not be deemed a waiver of such provision or our right to enforce it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">17. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-muted p-6 rounded-lg">
                <p className="font-medium mb-2">NomadSuite Inc.</p>
                <p className="text-muted-foreground">Email: legal@nomadsuite.io</p>
                <p className="text-muted-foreground">Support: support@nomadsuite.io</p>
              </div>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {legal.terms.acknowledgment}
            </p>
            <Link href="/">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {legal.common.backToHome}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-muted/30 border-t mt-auto">
        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NomadSuite Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
