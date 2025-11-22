# NomadSuite - Digital Nomad Business Management Platform

## Overview

NomadSuite is a full-stack web application for freelancers and digital nomads, designed to manage business operations while ensuring compliance with international travel and tax regulations. It integrates CRM, invoicing, travel tracking, visa management, and document storage into a single workspace, targeting remote professionals who need to manage client relationships, revenue, tax residency, visa deadlines, and critical documents across multiple countries.

## User Preferences

Preferred communication style: Simple, everyday language.

## Testing

**Comprehensive Test Data Seeding**: The `server/seed-test-data.ts` script populates the database with realistic test data across all tables:

**Test Users** (all passwords: `123123`):
- `admin` - Alex Admin (Admin, Workspace 1, DE-based freelancer)
- `sarah` - Sarah Designer (User, Workspace 1, US-based designer in PT)
- `marco` - Marco Developer (Admin, Workspace 2, IT-based developer in ES)
- `emma` - Emma Consultant (User, Workspace 2, GB-based consultant in TH)
- `lisa` - Lisa Writer (User, Workspace 3, CA-based writer in MX)

**Data Per User**:
- 4 clients (different countries and statuses: active, lead, proposal, completed)
- 4 client notes (meetings, calls, emails, system notes)
- 4 invoices (various statuses: paid, sent, draft, overdue; multiple currencies)
- 5 trips (travel history plus current location)
- 4 documents (passport, visa, contracts, tax certificates)

**Total Test Data**: 5 users, 20 clients, 20 notes, 20 invoices, 25 trips, 20 documents

**Running Seed Script**: `tsx server/seed-test-data.ts` (clears existing data and creates fresh test data)

## Recent Updates

**November 22, 2025** - Landing Page Enhancements:
- PricingSection component with Monthly/Annual toggle showing "Save 20%" indicator
- WaitlistForm with Airtable integration for early-bird signups
- BugReportForm with screenshot upload support using object storage
- Updated footer with GDPR compliance text and privacy-first messaging
- Database tables: waitlist, bug_reports with Airtable sync integration
- API endpoints: POST /api/waitlist, POST /api/bug-report with CSRF protection and file upload support
- Environment variable guardrails in Airtable service (checks for AIRTABLE_BASE_ID, AIRTABLE_TOKEN)
- Fully integrated into Landing.tsx with professional UI and form validation

**November 21, 2025** - Security Hardening (PRODUCTION-READY):
- CSRF Protection: Session-based CSRF tokens for all state-changing routes (POST, PATCH, DELETE)
- Frontend CSRF Integration: Automatic token fetching and injection in all API requests (JSON + multipart)
- Authentication Rate Limiting: 10 requests per 15 minutes per IP for /api/login and /api/register (prevents brute force)
- Security Audit Logging Schema: Database table for tracking auth events and critical operations (integration pending)
- Comprehensive Security Roadmap: 7-phase implementation plan in SECURITY_ROADMAP.md
- Protected Routes: 20+ endpoints with CSRF protection (auth, users, workspace, clients, invoices, trips, documents, vault)
- Security Headers: Helmet middleware with HSTS, CSP, X-Content-Type-Options, X-Frame-Options
- Global Rate Limiting: 1000 requests per 15 minutes per IP for all routes

**November 21, 2025** - GDPR-Compliant Document Vault (PRODUCTION-READY):
- Full-featured encrypted document storage with AES-256-GCM encryption for metadata
- Server-side file type validation using magic bytes (prevents MIME spoofing attacks)
- EU-region only object storage with 5-minute signed download URLs
- Comprehensive security: strict metadata validation, SHA-256 file integrity verification, server-side immutable values
- GDPR compliance: 10-year retention cap, soft delete with hard delete scheduling, minimal audit logging
- Retention policies: on_expiry, after_upload (1-120 months), indefinite (max 10 years)
- Privacy-preserving audit logs: upload, download_link, user_delete actions tracked
- Workspace-level encryption key isolation (single key MVP, KMS integration planned)
- Complete vault UI: upload form with drag-and-drop, document grid, download, and delete
- All security vulnerabilities fixed: metadata tampering, hash integrity, MIME spoofing
- Database: vault_documents, vault_audit_logs, document_retention_jobs tables
- API endpoints: POST/GET/DELETE /api/vault/documents, GET /api/vault/documents/:id/download
- Libraries: server/lib/encryption.ts, server/lib/object-storage-vault.ts, server/lib/audit.ts

**November 21, 2025** - Settings Module:
- Complete user preferences system with primary language (EN/DE/FR), default currency, default invoice language, timezone, date format, and custom invoice prefix
- Settings page with Language & Regional Settings and Invoice Settings sections
- API endpoint: PATCH /api/user/settings with strict Zod validation (enum constraints for language/date format)
- Invoice creation automatically uses user's default currency, language, and custom invoice prefix
- Invoice numbering function updated to accept custom prefix parameter (generateInvoiceNumber)
- Invoice form simplified: removed manual invoice number input, auto-generation with user prefix

**November 21, 2025** - Authentication + Account Module:
- Extended user schema with bank info fields (bankName, accountNumber, iban, swift) for invoice payment details
- New Profile page with tabs for Personal Info, Business Info, Bank Details, and Security (change password)
- API endpoints: PATCH /api/user/profile, POST /api/user/change-password with Zod validation
- Security: Strict validation prevents empty name/email, filters undefined fields, validates passwords (min 6 chars)
- Added Profile link to sidebar navigation

## System Architecture

### Frontend

**Framework**: React with TypeScript (Vite).
**UI**: Shadcn UI (Radix UI, Tailwind CSS) with custom theming and fonts.
**Routing**: Wouter for client-side routing, including protected and role-based access.
**State Management**: TanStack Query for server state; React Context for authentication.
**Form Handling**: React Hook Form with Zod for validation.
**Key Design Patterns**: Custom hooks for data fetching, protected/admin route wrappers, shared `AppLayout` for consistent navigation.

### Backend

**Framework**: Express.js (Node.js, TypeScript).
**Authentication**: Passport.js with Local Strategy; `express-session` using PostgreSQL for session storage. Scrypt for password hashing.
**API Design**: RESTful API (`/api/`) with custom authentication (`requireAuth`) and authorization (`requireAdmin`) middleware.
**Key Design Decisions**: Session-based authentication over JWT, trust proxy enabled, abstract storage layer for database operations.

### Data

**ORM**: Drizzle ORM.
**Database**: PostgreSQL (Neon serverless driver).
**Schema Design**: Multi-tenant workspace model, role-based access control, relational model with foreign keys, and timestamp tracking.
**Core Entities**: Workspaces, Users, Clients (CRM with pipeline), Invoices (multi-country compliance, JSON items), Jurisdiction Rules (country-specific invoice requirements), Trips (travel log), Documents (metadata), Client Notes.
**Validation**: Drizzle-Zod for runtime insert validation.

### Authentication & Authorization

**Flow**: User credentials -> Passport verification -> Scrypt password validation -> Server-side session creation -> Session cookie for persistence.
**Levels**: Public, Authenticated (`/app/*`), Admin Only (user management, workspace settings).
**Security**: Hashed passwords, timing-safe comparisons, environment variable session secrets, trust proxy.

### API Structure

**Resource Endpoints**: `/api/user`, `/api/users`, `/api/workspace`, `/api/clients`, `/api/clients/:id/notes`, `/api/invoices`, `/api/jurisdictions`, `/api/jurisdictions/:country`, `/api/trips`, `/api/documents`, `/api/admin/*`.
**Authentication Endpoints**: `/api/register`, `/api/login`, `/api/logout`.
**Error Handling**: Consistent HTTP status codes and messages.

### Frontend Routing Strategy

**Public Routes**: Landing, login, register.
**Protected Routes**: All app routes requiring authentication.
**Admin Routes**: Protected routes requiring admin role.
**Layout**: `AppLayout` for consistent UI across application routes.

### Key Features

**Travel & Residency Tracking**: Comprehensive travel log with automatic tax residency calculations (183-day rule per country), Schengen 90/180 rolling window tracker, trip validation (overlap prevention), visual calendar view with country color-coding, and lifetime travel summary statistics. All calculations run automatically on the backend.

**Multi-Country Invoice Compliance**: Supports country-specific invoice requirements (e.g., Germany, France, UK, Canada, US) with dynamic form validation, compliance hints, and multi-currency support.

**Multi-Language Invoice PDFs**: Full i18n support for invoice PDFs in English (EN), German (DE), and French (FR). Language-aware field labels, date formatting (locale-specific), currency formatting, compliance text, and payment terms. Language selection automatically defaults to client's jurisdiction language.

**Automatic Invoice Numbering**: Invoices are auto-numbered in NS-{year}-{incremental} format (e.g., NS-2025-00012), with sequential numbering per user per year.

**Real-Time FX Rates**: Currency exchange rates fetched from exchangerate.host API with 1-hour caching for accurate multi-currency invoicing.

**Automatic Overdue Detection**: Invoices automatically marked as "Overdue" when past due date, with real-time status updates on fetch.

**Invoice PDF Export and Email**: Server-side PDF generation using PDFKit with multi-country compliance, detailed line items (quantity, unit price, subtotal, tax), and email functionality via Resend with PDF attachments.

### Notable Design Decisions

- No dedicated file storage service (placeholder URLs for documents).
- Resend for email integration (requires `RESEND_API_KEY`).
- No payment processing integration yet.
- PostgreSQL for session storage.
- Neon serverless PostgreSQL for database.
- Invoice amounts stored as integers for multi-currency flexibility.
- Server-side PDF generation for control over layout and compliance.

## External Dependencies

### Core Frameworks
- **Vite**: Build tool.
- **React**: UI library.
- **Express**: Backend framework.
- **TypeScript**: Language.

### Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver.
- **drizzle-orm**, **drizzle-kit**: ORM and CLI tools.
- **ws**: WebSocket library.

### Authentication
- **passport**, **passport-local**: Authentication middleware.
- **express-session**, **connect-pg-simple**: Session management and PostgreSQL store.

### UI Component Libraries
- **@radix-ui/react-***: Headless UI.
- **@shadcn/ui**: Pre-styled components.
- **lucide-react**: Icons.
- **tailwindcss**: CSS framework.
- **class-variance-authority**, **clsx**, **tailwind-merge**: Styling utilities.

### Form & Validation
- **react-hook-form**: Form state.
- **@hookform/resolvers**: Validation integration.
- **zod**, **drizzle-zod**: Schema validation.

### Data Fetching & State
- **@tanstack/react-query**: Server state management.
- **wouter**: Routing.

### Date & Time
- **date-fns**: Date utility library.

### Development Tools
- **tsx**: TypeScript execution.
- **esbuild**: JavaScript bundler.
- **@replit/vite-plugin-***: Replit-specific plugins.

### Styling
- **postcss**, **autoprefixer**: CSS processing.
- **@tailwindcss/vite**: Tailwind CSS Vite plugin.

### Charts & Visualization
- **recharts**: Charting library.

### Other Utilities
- **nanoid**: Unique ID generation.
- **sonner**: Toast notifications.