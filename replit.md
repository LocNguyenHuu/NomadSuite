# NomadSuite - Digital Nomad Business Management Platform

## Overview

NomadSuite is a full-stack web application designed for freelancers and digital nomads who need to manage their business operations while maintaining compliance with international travel and tax regulations. The platform combines CRM functionality, invoicing, travel tracking, visa management, and document storage in a single workspace-based application.

The application targets solo freelancers and small teams who work remotely across multiple countries and need to track client relationships, revenue, travel days for tax residency purposes, visa expiration dates, and important documents.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Framework**: Shadcn UI component library (new-york style) built on Radix UI primitives with Tailwind CSS for styling. The design system uses CSS variables for theming and supports custom fonts (Inter, Outfit, JetBrains Mono).

**Routing**: Wouter for lightweight client-side routing with support for protected routes and role-based access control.

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. Authentication state is managed through a React Context provider.

**Form Handling**: React Hook Form with Zod schema validation for type-safe form submissions.

**Key Design Patterns**:
- Custom hooks pattern for data fetching (useClients, useInvoices, useTrips, useDocuments)
- Protected route wrappers that check authentication status before rendering
- Admin route wrappers that verify admin role before granting access
- Shared layout component (AppLayout) with responsive sidebar navigation

### Backend Architecture

**Framework**: Express.js running on Node.js with TypeScript.

**Authentication**: Passport.js with Local Strategy for username/password authentication. Sessions are managed using express-session with PostgreSQL session storage (connect-pg-simple).

**Password Security**: Scrypt-based password hashing with random salts for secure credential storage.

**API Design**: RESTful API endpoints organized by resource type (clients, invoices, trips, documents, users, workspace). All API routes are prefixed with `/api/`.

**Middleware**: Custom authentication middleware (requireAuth, requireAdmin) applied to protected routes. Request logging middleware for API calls with JSON response capture.

**Key Design Decisions**:
- Session-based authentication chosen over JWT for simpler implementation and better security for web applications
- Trust proxy setting enabled for deployment behind reverse proxies
- Custom storage abstraction layer (IStorage interface) for database operations

### Data Architecture

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Database**: PostgreSQL (via Neon serverless driver with WebSocket support).

**Schema Design**:
- Multi-tenant workspace model where users belong to workspaces
- Role-based access control with 'admin' and 'user' roles
- Relational data model with foreign key constraints
- Timestamp tracking for all entities (createdAt fields)

**Core Entities**:
- **Workspaces**: Top-level tenant isolation with settings (currency, tax country, subscription plan)
- **Users**: Authentication credentials, profile data, workspace membership, role assignment
- **Clients**: CRM contacts with status pipeline (Lead → Proposal → Active → Completed), interaction tracking, and action reminders
- **Invoices**: Billing records with JSON items, status tracking, and client associations
- **Trips**: Travel log entries with country, entry/exit dates for residency calculations
- **Documents**: File metadata storage with type categorization and expiry tracking
- **Client Notes**: Timeline of interactions and notes associated with clients

**Schema Validation**: Drizzle-Zod integration for runtime validation of insert operations.

### Authentication & Authorization

**Authentication Flow**:
1. User submits credentials via login form
2. Passport Local Strategy verifies username and password
3. Scrypt comparison validates password against stored hash
4. Successful authentication creates server-side session
5. Session cookie persists user authentication state

**Authorization Levels**:
- **Public**: Landing page, login, register
- **Authenticated**: All `/app/*` routes require valid session
- **Admin Only**: User management, workspace settings, admin dashboard

**Security Considerations**:
- Passwords never stored in plain text
- Timing-safe comparison prevents timing attacks
- Session secrets configurable via environment variables
- Trust proxy enabled for secure cookie transmission

### API Structure

**Resource Endpoints**:
- `/api/user` - Current user profile management
- `/api/users` - User listing and role management (admin only)
- `/api/workspace` - Workspace settings (admin only)
- `/api/clients` - Client CRM operations
- `/api/clients/:id/notes` - Client interaction notes
- `/api/invoices` - Invoice management
- `/api/trips` - Travel log entries
- `/api/documents` - Document vault operations
- `/api/admin/*` - Admin analytics and statistics

**Authentication Endpoints**:
- `/api/register` - New user registration
- `/api/login` - Session creation
- `/api/logout` - Session termination

**Error Handling**: Consistent error responses with appropriate HTTP status codes. Failed requests throw errors with status code and message.

### Frontend Routing Strategy

**Public Routes**: Landing page (`/`), authentication pages (`/login`, `/register`)

**Protected Routes**: All app routes wrapped in ProtectedRoute component that redirects to login if unauthenticated

**Admin Routes**: Subset of protected routes (AdminRoute component) that verify admin role and redirect to dashboard if unauthorized

**Layout Strategy**: App routes render within AppLayout component providing consistent navigation, sidebar, and user menu

## External Dependencies

### Core Framework Dependencies
- **Vite**: Modern build tool and development server with HMR support
- **React**: UI library with hooks-based component architecture
- **Express**: Web application framework for Node.js backend
- **TypeScript**: Static typing for both frontend and backend code

### Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver with WebSocket support for Neon database
- **drizzle-orm**: TypeScript ORM for type-safe database queries
- **drizzle-kit**: CLI tools for schema migrations and database management
- **ws**: WebSocket library required by Neon serverless driver

### Authentication
- **passport**: Authentication middleware for Node.js
- **passport-local**: Username and password authentication strategy
- **express-session**: Server-side session management
- **connect-pg-simple**: PostgreSQL session store for express-session

### UI Component Libraries
- **@radix-ui/react-***: Headless UI component primitives (accordion, dialog, dropdown, select, tabs, toast, etc.)
- **@shadcn/ui**: Pre-styled components built on Radix UI
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for managing component variants
- **clsx** & **tailwind-merge**: Class name utilities

### Form & Validation
- **react-hook-form**: Performant form state management
- **@hookform/resolvers**: Validation resolver integrations
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Zod schema generation from Drizzle schemas

### Data Fetching & State
- **@tanstack/react-query**: Server state management with caching and synchronization
- **wouter**: Minimal routing library for React

### Date & Time
- **date-fns**: Modern date utility library for calculations and formatting

### Development Tools
- **tsx**: TypeScript execution for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development plugins (error overlay, cartographer, dev banner)

### Styling
- **postcss**: CSS transformation tool
- **autoprefixer**: Automatic vendor prefix addition
- **@tailwindcss/vite**: Tailwind CSS Vite plugin

### Charts & Visualization
- **recharts**: Composable charting library for React (used on dashboard)

### File Handling
- **embla-carousel-react**: Carousel/slider component (if needed for galleries)

### Other Utilities
- **cmdk**: Command menu component
- **nanoid**: Unique ID generation
- **sonner**: Toast notification system

### Notable Design Decisions
- **No dedicated file storage service**: Document fileUrl currently uses placeholder URLs; real implementation would require S3, Cloudflare R2, or similar
- **No email service integration**: User invitations and notifications not yet implemented
- **No payment processing**: Subscription plans defined but billing integration pending
- **Session storage in PostgreSQL**: Chosen for simplicity and data locality; could migrate to Redis for scale
- **Neon serverless PostgreSQL**: Selected for ease of provisioning and serverless architecture compatibility