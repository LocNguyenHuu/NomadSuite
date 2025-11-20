# NomadSuite - Digital Nomad Business Management Platform

## Overview

NomadSuite is a full-stack web application for freelancers and digital nomads, designed to manage business operations while ensuring compliance with international travel and tax regulations. It integrates CRM, invoicing, travel tracking, visa management, and document storage into a single workspace, targeting remote professionals who need to manage client relationships, revenue, tax residency, visa deadlines, and critical documents across multiple countries.

## User Preferences

Preferred communication style: Simple, everyday language.

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

**Multi-Country Invoice Compliance**: Supports country-specific invoice requirements (e.g., Germany, France, UK, Canada, US) with dynamic form validation, compliance hints, multi-currency, and multi-language support.
**Invoice PDF Export and Email**: Server-side PDF generation using PDFKit with multi-country compliance. Emailing functionality via Resend, including PDF attachments and automatic status updates.

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