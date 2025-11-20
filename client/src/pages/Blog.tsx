import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Calendar, Clock, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SEO } from '@/components/SEO';

const blogPosts = [
  {
    id: 1,
    title: "Understanding the 183-Day Rule: A Digital Nomad's Guide to Tax Residency",
    excerpt: "Learn how the 183-day rule affects your tax obligations as a digital nomad and how to track your days accurately to avoid unexpected tax bills.",
    category: "Tax & Legal",
    date: "2024-12-15",
    readTime: "8 min read",
    slug: "183-day-rule-tax-residency-guide",
    author: "Sarah Chen"
  },
  {
    id: 2,
    title: "Schengen 90/180 Rule Explained: Never Overstay Your Visa Again",
    excerpt: "A comprehensive breakdown of the Schengen Area's 90/180 day rule with practical examples and tips for maximizing your time in Europe legally.",
    category: "Travel & Visas",
    date: "2024-12-10",
    readTime: "10 min read",
    slug: "schengen-90-180-rule-explained",
    author: "Marcus Rodriguez"
  },
  {
    id: 3,
    title: "Best Digital Nomad Visas in 2025: Compare All Options",
    excerpt: "Complete comparison of digital nomad visas from Portugal, Spain, Estonia, Croatia, and more. Find the best visa for your situation.",
    category: "Travel & Visas",
    date: "2024-12-05",
    readTime: "12 min read",
    slug: "best-digital-nomad-visas-2025",
    author: "Emma Thompson"
  },
  {
    id: 4,
    title: "How to Invoice International Clients: Multi-Currency Best Practices",
    excerpt: "Step-by-step guide to invoicing clients across borders, handling currency conversion, and managing international payment methods.",
    category: "Business & Finance",
    date: "2024-11-28",
    readTime: "7 min read",
    slug: "invoice-international-clients-guide",
    author: "David Park"
  },
  {
    id: 5,
    title: "Lightweight CRM for Freelancers: Why Less is More",
    excerpt: "Why traditional CRMs like Salesforce are overkill for solo freelancers and what features actually matter for managing client relationships.",
    category: "Business & Finance",
    date: "2024-11-20",
    readTime: "6 min read",
    slug: "lightweight-crm-freelancers",
    author: "Priya Kumar"
  },
  {
    id: 6,
    title: "Tax Residency Planning for Digital Nomads: 5 Common Mistakes to Avoid",
    excerpt: "The most common tax residency mistakes nomads make and how to structure your travels to minimize tax obligations legally.",
    category: "Tax & Legal",
    date: "2024-11-15",
    readTime: "9 min read",
    slug: "tax-residency-planning-mistakes",
    author: "Sarah Chen"
  },
  {
    id: 7,
    title: "Essential Documents Every Digital Nomad Should Keep (And How to Store Them)",
    excerpt: "What documents you need to keep as a location-independent professional and the best practices for secure digital storage.",
    category: "Organization",
    date: "2024-11-08",
    readTime: "5 min read",
    slug: "essential-documents-digital-nomads",
    author: "Alex Martinez"
  },
  {
    id: 8,
    title: "How to Track Business Expenses While Traveling: A Complete System",
    excerpt: "Build a reliable system for tracking business expenses across multiple countries and currencies for tax time.",
    category: "Business & Finance",
    date: "2024-11-01",
    readTime: "8 min read",
    slug: "track-business-expenses-traveling",
    author: "David Park"
  }
];

const categories = ["All", "Tax & Legal", "Travel & Visas", "Business & Finance", "Organization"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Digital Nomad Blog - Tax, Visa & Business Tips | NomadSuite"
        description="Expert guides on tax residency, visa rules, invoicing, and business management for digital nomads and location-independent professionals."
        keywords="digital nomad blog, tax residency guide, schengen visa rules, freelance invoicing, nomad business tips"
        canonical="https://nomadsuite.io/blog"
      />

      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-1.5 sm:gap-2 font-heading font-bold text-xl sm:text-2xl text-primary cursor-pointer hover:opacity-80 transition-opacity">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">NomadSuite</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/">
              <Button variant="ghost" className="font-medium hover:bg-primary/5 text-sm sm:text-base">Home</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="font-medium hover:bg-primary/5 text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4">Log In</Button>
            </Link>
            <Link href="/register">
              <Button className="font-medium shadow-md hover:shadow-lg transition-all text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6">
            Digital Nomad <span className="text-primary">Resources</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Expert guides on tax residency, visa regulations, invoicing best practices, and business management for location-independent professionals.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="text-sm sm:text-base"
                data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary/10 to-purple-500/10 py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4 sm:mb-6">
            Ready to simplify your nomad life?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Track your clients, invoices, travel days, and visa expiries all in one place.
          </p>
          <Link href="/register">
            <Button size="lg" className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all">
              Start Free Today <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-heading font-bold text-xl mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">NomadSuite</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Designed for freelancers & digital nomads. Work anywhere, worry less.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} NomadSuite Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BlogCard({ post }: { post: typeof blogPosts[0] }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
            {post.category}
          </span>
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold mb-3 font-heading leading-tight">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 flex-1 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4 mt-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Button variant="ghost" className="w-full group" data-testid={`read-${post.slug}`}>
            Read Article 
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
