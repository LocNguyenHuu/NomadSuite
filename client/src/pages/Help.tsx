import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  Plane, 
  FileCheck, 
  Globe, 
  DollarSign, 
  Calendar, 
  Mail,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Video,
  MessageCircle
} from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 font-heading font-bold text-xl sm:text-2xl text-primary cursor-pointer hover:opacity-80 transition-opacity">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">NomadSuite</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" data-testid="button-login">Log In</Button>
            </Link>
            <Link href="/register">
              <Button data-testid="button-signup">Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Learn how to get the most out of NomadSuite
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Quick Start Guide</h2>
              <p className="text-muted-foreground">Get up and running in minutes</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>1. Add Your First Client</CardTitle>
                  </div>
                  <CardDescription>Start managing your client relationships</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Go to <strong>Clients</strong> in the sidebar</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Click <strong>New Client</strong></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Fill in name, email, and country</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Drag clients through the pipeline (Lead → Proposal → Active → Completed)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>2. Create Your First Invoice</CardTitle>
                  </div>
                  <CardDescription>Send professional invoices with compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Navigate to <strong>Invoices</strong></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Click <strong>New Invoice</strong></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Select client, amount, and due date</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Download PDF or send via email directly</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>3. Track Your Travel</CardTitle>
                  </div>
                  <CardDescription>Monitor visa days and tax residency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Open <strong>Travel Log</strong></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Add trip with country and dates</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">View Schengen days and tax residency alerts</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Get notified when approaching limits</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileCheck className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>4. Upload Documents</CardTitle>
                  </div>
                  <CardDescription>Store passports, visas, and contracts securely</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Go to <strong>Documents</strong></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Click <strong>Upload Document</strong></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Choose category (Passport, Visa, Contract, Tax Certificate)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Set expiry dates for automated reminders</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      {/* Feature Guides */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Feature Guides</h2>
              <p className="text-muted-foreground">Detailed walkthroughs for every feature</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="invoices" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Multi-Country Invoicing</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Configuring PDF Export
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      NomadSuite automatically generates compliant invoices based on your client's country. When downloading or emailing an invoice:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Click the download or email icon on any invoice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Choose language (English, German, French, Spanish, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Select currency and exchange rate if different from invoice currency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Add customer VAT ID for EU reverse charge invoices</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Sending via Email
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Email invoices directly to clients with one click. The system automatically:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Generates PDF with your chosen configuration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Attaches it to a professional email template</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Sends to the client's email address on file</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Updates invoice status to "Sent"</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Country-Specific Compliance
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We support compliance requirements for:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Germany:</strong> Reverse charge, German language options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>France:</strong> French language, EUR currency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>UK:</strong> GBP currency, VAT compliance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>US:</strong> USD currency, no VAT requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Canada:</strong> CAD currency, GST/HST support</span>
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="travel" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Plane className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Travel & Visa Tracking</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Understanding the 183-Day Rule</h4>
                    <p className="text-sm text-muted-foreground">
                      Most countries consider you a tax resident if you spend 183+ days there in a calendar year. 
                      NomadSuite automatically counts your days and alerts you when approaching this threshold.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h4 className="font-semibold">Schengen 90/180 Calculator</h4>
                    <p className="text-sm text-muted-foreground">
                      The Schengen Area allows 90 days of stay within any 180-day rolling period. Our calculator:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Automatically identifies trips to Schengen countries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Shows remaining days in real-time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Alerts you when approaching the 90-day limit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Tells you when your counter resets</span>
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="clients" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Client Management & Pipeline</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Pipeline Stages</h4>
                    <p className="text-sm text-muted-foreground">
                      Move clients through your sales pipeline by dragging and dropping:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Lead:</strong> Potential clients you're prospecting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Proposal:</strong> Actively discussing projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Active:</strong> Current paying clients</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Completed:</strong> Past clients for reference</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h4 className="font-semibold">Adding Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      Track all client interactions by adding notes:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Click on any client to view details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>Add notes from meetings, calls, or emails</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>View full interaction history</span>
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="documents" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Document Vault</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Supported Document Types</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Passport:</strong> Store passport scans with expiry tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Visa:</strong> Track work permits and visa expiry dates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Contract:</strong> Client agreements and SOWs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Tax Certificate:</strong> Tax residency certificates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span><strong>Other:</strong> Any other important documents</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h4 className="font-semibold">Security & Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      All documents are encrypted using AES-256 (bank-level) encryption. Only you can access your documents.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Common questions about using NomadSuite</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="faq-1" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-semibold">Can I import my existing client data?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pt-4">
                  Yes! Pro and Premium users can import data via CSV upload. Contact support for help with bulk imports from other CRMs or accounting software.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-semibold">How do I configure my email settings for sending invoices?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pt-4">
                  Email sending requires the RESEND_API_KEY to be configured in your environment. If you're on a paid plan, this is already set up. Free tier users need to add their own Resend API key in Settings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-semibold">Which countries are supported for invoice compliance?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pt-4">
                  We currently support Germany, France, UK, US, and Canada with country-specific templates, languages, and compliance rules. More countries are being added regularly.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-4" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-semibold">Can I customize my invoice template?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pt-4">
                  Pro and Premium users can customize invoice templates, add their logo, and adjust branding. This feature is available in Settings → Invoice Templates.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-5" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-semibold">Is NomadSuite legal or tax advice?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pt-4">
                  No, NomadSuite provides informational tools only. We help you track and organize your data, but we are not tax advisors or legal professionals. Always consult a qualified tax professional or legal advisor for advice specific to your situation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold mb-2">Still Need Help?</h2>
              <p className="text-muted-foreground">We're here to support you</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse our comprehensive guides and tutorials
                  </p>
                  <Button variant="outline" className="w-full">View Docs</Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with our support team in real-time
                  </p>
                  <Button variant="outline" className="w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Email Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send us a message and we'll respond within 24 hours
                  </p>
                  <Button variant="outline" className="w-full">Contact Us</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
              <Globe className="h-6 w-6" />
              <span>NomadSuite</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              The all-in-one platform for digital nomads and freelancers
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/"><span className="hover:text-primary transition-colors cursor-pointer">Home</span></Link>
              <Link href="/login"><span className="hover:text-primary transition-colors cursor-pointer">Login</span></Link>
              <Link href="/register"><span className="hover:text-primary transition-colors cursor-pointer">Sign Up</span></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
