import React from 'react';
import { Link } from 'wouter';
import { Globe, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import PublicLanguageSwitcher from '@/components/PublicLanguageSwitcher';
import { useLandingI18n } from '@/contexts/LandingI18nContext';
import { legalTranslations, type LandingLanguage } from '@/data/legalTranslations';

export default function PrivacyPolicy() {
  const { language } = useLandingI18n();
  const legal = legalTranslations[language as LandingLanguage];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Privacy Policy | NomadSuite"
        description="Privacy Policy for NomadSuite - How we collect, use, and protect your personal data"
        canonical="https://nomadsuite.io/privacy"
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
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{legal.privacy.title}</h1>
            <p className="text-muted-foreground text-lg">{legal.privacy.lastUpdated}</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                NomadSuite Inc. ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our Service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using NomadSuite, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>2.1 Information You Provide:</strong>
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li><strong>Account Information:</strong> Name, email address, password, and workspace details</li>
                <li><strong>Profile Information:</strong> Optional profile photo, phone number, and business details</li>
                <li><strong>Business Data:</strong> Client information, invoices, travel logs, visa details, and documents you upload</li>
                <li><strong>Payment Information:</strong> Billing address and payment details (processed securely through third-party payment processors)</li>
                <li><strong>Communications:</strong> Support inquiries, feedback, and correspondence with us</li>
              </ul>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>2.2 Automatically Collected Information:</strong>
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Usage Data:</strong> IP address, browser type, device information, operating system, and pages visited</li>
                <li><strong>Cookies and Tracking:</strong> Session cookies, analytics cookies, and preference cookies</li>
                <li><strong>Log Data:</strong> Server logs including access times, error messages, and API usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use your personal information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve the NomadSuite platform</li>
                <li><strong>Account Management:</strong> To create and manage your account, process subscriptions, and handle billing</li>
                <li><strong>Calculations & Alerts:</strong> To track travel days, calculate residency, and send visa expiry notifications</li>
                <li><strong>Communications:</strong> To send service updates, security alerts, and respond to inquiries</li>
                <li><strong>Analytics:</strong> To understand how users interact with our Service and improve features</li>
                <li><strong>Security:</strong> To detect, prevent, and address technical issues, fraud, and abuse</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</li>
                <li><strong>Marketing:</strong> To send promotional emails (you can opt out at any time)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Legal Basis for Processing (GDPR)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For users in the European Union, we process your personal data under the following legal bases:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Contract Performance:</strong> Processing necessary to provide the Service you requested</li>
                <li><strong>Legitimate Interests:</strong> To improve our Service, prevent fraud, and ensure security</li>
                <li><strong>Consent:</strong> For marketing communications and non-essential cookies</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>5.1 Service Providers:</strong> We share data with trusted third-party vendors who assist us in operating the Service:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Cloud hosting providers (for data storage and processing)</li>
                <li>Payment processors (for billing and subscription management)</li>
                <li>Email service providers (for transactional and marketing emails)</li>
                <li>Analytics providers (for usage insights and performance monitoring)</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>5.2 Legal Requirements:</strong> We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>5.3 Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                <strong>5.4 With Your Consent:</strong> We may share your information with third parties when you explicitly consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Encryption:</strong> All data is encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
                <li><strong>Access Controls:</strong> Strict authentication and role-based access controls</li>
                <li><strong>Secure Infrastructure:</strong> Hosting on SOC 2 compliant cloud providers</li>
                <li><strong>Regular Audits:</strong> Third-party security audits and vulnerability assessments</li>
                <li><strong>Employee Training:</strong> All staff undergo security awareness training</li>
                <li><strong>Incident Response:</strong> Procedures in place to detect and respond to security breaches</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                While we strive to protect your data, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We retain your personal information for as long as necessary to provide the Service and comply with legal obligations:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Active Accounts:</strong> Data retained for the duration of your account</li>
                <li><strong>Canceled Accounts:</strong> Data retained for 90 days after cancellation, then permanently deleted</li>
                <li><strong>Legal Requirements:</strong> Some data may be retained longer to comply with tax, accounting, or legal obligations (typically 7 years for financial records)</li>
                <li><strong>Backups:</strong> Data may persist in backups for up to 30 days after deletion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Your Privacy Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>8.1 GDPR Rights (EU Users):</strong>
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Right to Restriction:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>8.2 CCPA Rights (California Users):</strong>
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Right to know what personal information is collected and how it's used</li>
                <li>Right to delete personal information</li>
                <li>Right to opt out of the sale of personal information (we do not sell your data)</li>
                <li>Right to non-discrimination for exercising your privacy rights</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed">
                To exercise your rights, contact us at privacy@nomadsuite.io. We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar tracking technologies to improve your experience:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> Required for authentication and core functionality</li>
                <li><strong>Analytics Cookies:</strong> Track usage patterns to improve the Service</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You can control cookies through your browser settings. Disabling cookies may limit some features of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) approved by the European Commission, to protect your data during international transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of material changes by email or by posting a notice on the Service at least 30 days before the changes take effect. Your continued use of the Service after the effective date constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-muted p-6 rounded-lg">
                <p className="font-medium mb-2">NomadSuite Inc.</p>
                <p className="text-muted-foreground mb-1">Privacy Team</p>
                <p className="text-muted-foreground">Email: privacy@nomadsuite.io</p>
                <p className="text-muted-foreground">Support: support@nomadsuite.io</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                For GDPR-related inquiries or to exercise your rights, you may also contact our Data Protection Officer at dpo@nomadsuite.io.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {legal.privacy.acknowledgment}
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
