# NomadSuite - Digital Nomad Business Management Platform

## Overview
NomadSuite is a full-stack web application designed for freelancers and digital nomads to manage business operations while ensuring compliance with international travel and tax regulations. It integrates CRM, invoicing, travel tracking, visa management, and document storage into a single platform. The platform aims to help remote professionals manage client relationships, revenue, tax residency, visa deadlines, and critical documents across multiple countries.

## User Preferences
Preferred communication style: Simple, everyday language.

## Internationalization & Language Switching

NomadSuite has **two separate language systems** with different scopes and behaviors:

### Landing Page (Public) - Full Multi-Language UI
- **Scope**: Entire landing page UI (hero, pricing, waitlist, FAQ, security, testimonials, etc.)
- **Languages**: 6 languages supported (EN, DE, FR, VI, JA, ZH)
- **Implementation**: `LandingI18nContext` with `landingTranslations` object
- **Storage**: Client-side localStorage (`nomadsuite_landing_language`)
- **Component**: `PublicLanguageSwitcher` in navigation header
- **Behavior**: Real-time UI updates when language is changed
- **User Experience**: Complete translation of all landing page content
- **FAQ Translations**: 12 FAQ items fully translated in all 6 languages (`client/src/data/faqTranslations.ts`)
- **Animations**: Framer Motion scroll-triggered animations (hero, stats counter, features, how-it-works, testimonials carousel)
- **Security Section**: Dedicated "Bank-Grade Security" section with AES-256 encryption, GDPR compliance, zero-knowledge vault, EU hosting
- **SEO Optimization**: Structured data (Organization + SoftwareApplication schemas), keyword-optimized meta tags, proper H1/H2/H3 hierarchy
- **Testimonials**: 6 locale-appropriate testimonials per language (author names consistent, quotes/roles translated)

### Legal Pages - Partial Multi-Language UI
- **Scope**: Privacy Policy and Terms of Service pages
- **Languages**: 6 languages for UI elements (titles, navigation)
- **Implementation**: `legalTranslations.ts` for page titles and UI elements
- **Content**: Legal body content remains in English (professional legal translation recommended for full localization)
- **Component**: `PublicLanguageSwitcher` in navigation header

### Logged-In App Pages - Full Multi-Language UI
- **Scope**: Dashboard, Clients, Invoices, Travel, Documents, Settings, Profile pages
- **Languages**: 6 languages supported (EN, DE, FR, VI, JA, ZH)
- **Implementation**: `AppI18nContext` with `appTranslations` object, synced with user's `primaryLanguage`
- **Storage**: PostgreSQL `users` table (`primaryLanguage` field), synced to React context
- **Component**: `LanguageSwitcher` in app header
- **Behavior**: Updates user preference in database AND changes UI language in real-time
- **User Experience**: Complete translation of all app page content
- **Translation Categories**:
  - `common.*` - Shared UI elements (buttons, actions, status messages)
  - `nav.*` - Navigation menu items
  - `dashboard.*` - Dashboard metrics and quick actions
  - `clients.*` - Client management and CRM
  - `invoices.*` - Invoice management and statuses
  - `travel.*` - Travel log and residency tracking
  - `documents.*` - Document vault and types
  - `settings.*` - User settings and preferences
  - `profile.*` - Profile and security settings

### Feedback System (Landing Page)
- **Component**: `FeedbackSection` (combines bug reports and feature requests)
- **UI**: Tabbed interface with orange theme for bugs, purple for features
- **Forms**: 
  - Bug Report: description, name, email, screenshot upload, contact consent
  - Feature Request: title, category dropdown, priority dropdown, description, name, email, contact consent
- **API Endpoints**: `/api/bug-report`, `/api/feature-request`
- **Database**: `bug_reports` and `feature_requests` tables with Airtable sync
- **Categories**: Invoicing, Clients/CRM, Travel Tracking, Visa/Tax Alerts, Documents, UI/UX, Integrations, Other
- **Priorities**: Nice to have, Would use regularly, Critical for my workflow

## System Architecture

### Frontend
**Framework**: React with TypeScript (Vite).
**UI**: Shadcn UI (Radix UI, Tailwind CSS) with custom theming.
**Routing**: Wouter for client-side routing, including protected and role-based access.
**State Management**: TanStack Query for server state; React Context for authentication.
**Form Handling**: React Hook Form with Zod for validation.
**Key Design Patterns**: Custom hooks for data fetching, protected/admin route wrappers, shared `AppLayout`.

### Backend
**Framework**: Express.js (Node.js, TypeScript).
**Authentication**: Passport.js with Local Strategy; `express-session` using PostgreSQL for session storage. Scrypt for password hashing.
**API Design**: RESTful API with custom authentication (`requireAuth`) and authorization (`requireAdmin`) middleware.
**Key Design Decisions**: Session-based authentication, trust proxy enabled, abstract storage layer for database operations.

### Data
**ORM**: Drizzle ORM.
**Database**: PostgreSQL (Neon serverless driver).
**Schema Design**: Multi-tenant workspace model, role-based access control, relational model with foreign keys.
**Core Entities**: Workspaces, Users, Clients, Invoices, Jurisdiction Rules, Trips, Documents, Client Notes.
**Validation**: Drizzle-Zod for runtime insert validation.

### Authentication & Authorization
**Flow**: User credentials -> Passport verification -> Scrypt password validation -> Server-side session creation -> Session cookie.
**Levels**: Public, Authenticated (`/app/*`), Admin Only.
**Security**: Hashed passwords, timing-safe comparisons, environment variable session secrets, trust proxy, CSRF protection, authentication rate limiting.

### API Structure
**Resource Endpoints**: `/api/user`, `/api/users`, `/api/workspace`, `/api/clients`, `/api/invoices`, `/api/jurisdictions`, `/api/trips`, `/api/documents`, `/api/admin/*`, `/api/vault/*`, `/api/waitlist`, `/api/bug-report`.
**Authentication Endpoints**: `/api/register`, `/api/login`, `/api/logout`.
**Error Handling**: Consistent HTTP status codes and messages.

### Frontend Routing Strategy
**Public Routes**: Landing, login, register.
**Protected Routes**: All app routes requiring authentication.
**Admin Routes**: Protected routes requiring admin role.
**Layout**: `AppLayout` for consistent UI.

### Key Features
- **Travel & Residency Tracking**: Comprehensive travel log with automatic tax residency calculations (183-day rule, Schengen 90/180), visual calendar.
- **Multi-Country Invoice Compliance**: Supports country-specific invoice requirements with dynamic validation and multi-currency support.
- **Multi-Language Invoice PDFs**: Full i18n support for invoice PDFs in 6 languages (EN, DE, FR, VI, JA, ZH) with locale-specific formatting.
- **Automatic Invoice Numbering**: Invoices auto-numbered in `NS-{year}-{incremental}` format.
- **Real-Time FX Rates**: Currency exchange rates fetched from exchangerate.host API with 1-hour caching.
- **Automatic Overdue Detection**: Invoices automatically marked as "Overdue".
- **Invoice PDF Export and Email**: Server-side PDF generation using PDFKit, email functionality via Resend.
- **GDPR-Compliant Document Vault**: Encrypted document storage (AES-256-GCM), server-side file type validation, 5-minute signed download URLs, retention policies.
- **User Settings Module**: User preferences for primary language, default currency, default invoice language, timezone, date format, and custom invoice prefix.
- **Airtable CRM Integration**: For Waitlist and Bug Reports with automatic background sync.

### Notable Design Decisions
- No dedicated file storage service (placeholder URLs for documents).
- Resend for email integration.
- PostgreSQL for session storage, Neon for database.
- Invoice amounts stored as integers for multi-currency flexibility.
- Server-side PDF generation for layout and compliance control.

## External Dependencies

### Core Frameworks
- **Vite**: Build tool.
- **React**: UI library.
- **Express**: Backend framework.
- **TypeScript**: Language.

### Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver.
- **drizzle-orm**, **drizzle-kit**: ORM and CLI tools.

### Authentication
- **passport**, **passport-local**: Authentication middleware.
- **express-session**, **connect-pg-simple**: Session management and PostgreSQL store.

### UI Component Libraries
- **@radix-ui/react-***: Headless UI.
- **@shadcn/ui**: Pre-styled components.
- **lucide-react**: Icons.
- **tailwindcss**: CSS framework.

### Form & Validation
- **react-hook-form**: Form state.
- **@hookform/resolvers**: Validation integration.
- **zod**, **drizzle-zod**: Schema validation.

### Data Fetching & State
- **@tanstack/react-query**: Server state management.
- **wouter**: Routing.

### Date & Time
- **date-fns**: Date utility library.

### Other Utilities
- **nanoid**: Unique ID generation.
- **sonner**: Toast notifications.
- **PDFKit**: PDF generation.
- **Resend**: Email service.
- **exchangerate.host**: FX rate API.
- **Airtable**: CRM integration.
- **helmet**: Security headers.
- **express-rate-limit**: Rate limiting.
- **csurf**: CSRF protection.