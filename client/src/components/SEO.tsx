import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export function SEO({ 
  title = "NomadSuite - CRM, Invoicing & Travel Tracker for Digital Nomads",
  description = "All-in-one platform for digital nomads: manage clients, track invoices, monitor tax residency days, and get visa expiry alerts. Built specifically for freelancers who work globally.",
  keywords = "digital nomad crm, freelance invoicing, tax residency tracker, visa tracker, schengen calculator, nomad business tools, remote work management",
  canonical = "https://nomadsuite.io",
  ogImage = "https://nomadsuite.io/og-image.png"
}: SEOProps) {
  useEffect(() => {
    document.title = title;
    
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: ogImage },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector);
      
      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    });

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical);
  }, [title, description, keywords, canonical, ogImage]);

  return null;
}

export function StructuredData({ data, id }: { data: object; id?: string }) {
  const uniqueId = id || `structured-data-${Math.random().toString(36).substr(2, 9)}`;
  
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = uniqueId;
    
    const existingScript = document.getElementById(uniqueId);
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById(uniqueId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, uniqueId]);

  return null;
}
