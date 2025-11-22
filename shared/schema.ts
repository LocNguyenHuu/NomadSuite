import { pgTable, text, serial, integer, boolean, jsonb, timestamp, date, unique, pgEnum, check } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";

// Workspaces
export const workspaces = pgTable("workspaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  defaultCurrency: text("default_currency").default("USD").notNull(),
  defaultTaxCountry: text("default_tax_country").default("USA"),
  plan: text("plan").default("free").notNull(), // 'free', 'pro', 'premium'
  createdAt: timestamp("created_at").defaultNow(),
});

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  homeCountry: text("home_country").default("USA"),
  currentCountry: text("current_country").default("Japan"),
  role: text("role").default("user").notNull(), // 'admin', 'user'
  // Business/Tax fields for invoicing
  businessName: text("business_name"),
  businessAddress: text("business_address"),
  vatId: text("vat_id"),
  taxRegime: text("tax_regime"), // e.g., 'standard', 'kleinunternehmer'
  // Bank info for invoices
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  iban: text("iban"),
  swift: text("swift"),
  // User Settings/Preferences
  primaryLanguage: text("primary_language").default("en"), // 'en', 'de', 'fr'
  defaultCurrency: text("default_currency").default("USD"),
  defaultInvoiceLanguage: text("default_invoice_language").default("en"),
  timezone: text("timezone").default("UTC"),
  dateFormat: text("date_format").default("MM/DD/YYYY"), // 'MM/DD/YYYY', 'DD/MM/YYYY', 'DD.MM.YYYY'
  invoicePrefix: text("invoice_prefix").default("NS-"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Clients
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  country: text("country").notNull(),
  status: text("status").notNull(), // 'Lead', 'Proposal', 'Active', 'Completed'
  notes: text("notes"),
  lastInteractionDate: timestamp("last_interaction_date"),
  nextActionDate: timestamp("next_action_date"),
  nextActionDescription: text("next_action_description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Client Notes
export const clientNotes = pgTable("client_notes", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  type: text("type").notNull(), // 'Call', 'Email', 'Meeting', 'Note', 'System'
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Invoice Line Item type
export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax?: number;
}

// Invoices
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").notNull().references(() => clients.id),
  invoiceNumber: text("invoice_number").notNull(),
  amount: integer("amount").notNull(), // Total amount in cents
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull(), // 'Draft', 'Sent', 'Paid', 'Overdue'
  dueDate: timestamp("due_date").notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  items: jsonb("items").$type<InvoiceLineItem[]>().notNull(),
  tax: integer("tax").default(0), // Total tax amount in cents
  notesToClient: text("notes_to_client"),
  // Multi-country compliance fields
  country: text("country"),
  language: text("language").default("en"),
  exchangeRate: text("exchange_rate"), // Stored as string for precision
  customerVatId: text("customer_vat_id"),
  reverseCharge: boolean("reverse_charge").default(false),
  reverseChargeNote: text("reverse_charge_note"),
  complianceChecked: boolean("compliance_checked").default(false),
  templateVersion: text("template_version").default("standard"),
});

// Trips (Travel Log)
export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  country: text("country").notNull(),
  entryDate: timestamp("entry_date").notNull(),
  exitDate: timestamp("exit_date"),
  notes: text("notes"),
});

// Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'Passport', 'Visa', 'Contract', 'Other'
  expiryDate: timestamp("expiry_date"),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Invoice Counter for atomic sequential numbering
export const invoiceCounters = pgTable("invoice_counters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  year: integer("year").notNull(),
  counter: integer("counter").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Unique constraint on userId + year combination
  userYearUnique: unique().on(table.userId, table.year)
}));

// Jurisdiction Rules for multi-country invoicing
export const jurisdictionRules = pgTable("jurisdiction_rules", {
  id: serial("id").primaryKey(),
  country: text("country").notNull().unique(), // ISO code e.g., "DE", "FR", "GB", "CA", "US"
  countryName: text("country_name").notNull(),
  supportedLanguages: text("supported_languages").array().notNull(),
  defaultLanguage: text("default_language").notNull(),
  defaultCurrency: text("default_currency").notNull(),
  requiresVatId: boolean("requires_vat_id").default(false),
  requiresCustomerVatId: boolean("requires_customer_vat_id").default(false),
  supportsReverseCharge: boolean("supports_reverse_charge").default(false),
  archivingYears: integer("archiving_years").default(7),
  taxRate: text("tax_rate"), // Stored as string, e.g., "19" for 19%
  languageNote: text("language_note"),
  complianceNotes: text("compliance_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// GDPR-Compliant Document Vault
// Encrypted metadata interface for sensitive document information
export interface EncryptedDocumentMetadata {
  name: string;
  type: string; // 'Passport', 'Visa', 'Contract', 'Tax Document', 'Insurance', 'Other'
  country?: string;
  notes?: string;
}

// Retention policy enum with DB-level enforcement
export const RetentionPolicyEnum = pgEnum("retention_policy_enum", ["on_expiry", "after_upload", "indefinite"]);
export const RetentionPolicy = z.enum(['on_expiry', 'after_upload', 'indefinite']);
export type RetentionPolicyType = z.infer<typeof RetentionPolicy>;

// Storage region enum (EU-only for GDPR)
export const StorageRegionEnum = pgEnum("storage_region_enum", ["EU"]);

// Audit action enum with DB-level enforcement
export const AuditActionEnum = pgEnum("audit_action_enum", ['upload', 'download_link', 'download', 'delete', 'user_delete', 'auto_delete', 'expiry_notice', 'erasure_request']);
export const AuditAction = z.enum(['upload', 'download_link', 'download', 'delete', 'user_delete', 'auto_delete', 'expiry_notice', 'erasure_request']);
export type AuditActionType = z.infer<typeof AuditAction>;

// Job type enum
export const JobTypeEnum = pgEnum("job_type_enum", ['retention_delete', 'expiry_alert_30d', 'expiry_alert_7d']);

// Vault Documents (GDPR-compliant encrypted storage)
export const vaultDocuments = pgTable("vault_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  workspaceId: integer("workspace_id").notNull().references(() => workspaces.id), // For workspace-level encryption keys
  // Encrypted metadata stored as JSONB (ciphertext, iv, authTag)
  encryptedMetadata: jsonb("encrypted_metadata").$type<{
    ciphertext: string;
    iv: string;
    authTag: string;
  }>().notNull(),
  // File storage and integrity
  storageKey: text("storage_key").notNull(), // Object storage path
  fileHash: text("file_hash").notNull(), // SHA-256 for integrity verification
  fileSize: integer("file_size").notNull(), // In bytes
  mimeType: text("mime_type").notNull(),
  storageRegion: StorageRegionEnum("storage_region").notNull().default("EU"), // GDPR compliance - EU only
  // GDPR retention policy with constraints
  retentionPolicy: RetentionPolicyEnum("retention_policy").notNull().default("indefinite"),
  retentionMonths: integer("retention_months"), // Must be positive, max 120 (10 years)
  expiryDate: timestamp("expiry_date"), // For 'on_expiry' policy and document expiration (passport, visa, etc.)
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"), // Soft delete timestamp
  hardDeleteAt: timestamp("hard_delete_at"), // Scheduled hard delete (max 10 years from creation)
}, (table) => ({
  // Constraint: retention_months must be positive and <= 120 (10 years)
  retentionMonthsCheck: check("retention_months_check", 
    sql`${table.retentionMonths} IS NULL OR (${table.retentionMonths} > 0 AND ${table.retentionMonths} <= 120)`
  ),
  // Constraint: hard_delete_at must be within 10 years of creation
  hardDeleteCheck: check("hard_delete_check",
    sql`${table.hardDeleteAt} IS NULL OR ${table.hardDeleteAt} <= ${table.createdAt} + INTERVAL '10 years'`
  ),
}));

// Vault Audit Logs (GDPR-compliant minimal logging)
export const vaultAuditLogs = pgTable("vault_audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  documentId: integer("document_id").references(() => vaultDocuments.id), // Nullable for erasure requests
  action: AuditActionEnum("action").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  // NO content/metadata stored - GDPR privacy requirement
});

// Document Retention Jobs (scheduled auto-deletion)
export const documentRetentionJobs = pgTable("document_retention_jobs", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => vaultDocuments.id),
  dueAt: timestamp("due_at").notNull(), // When to execute deletion
  jobType: JobTypeEnum("job_type").notNull(),
  executed: boolean("executed").default(false),
  executedAt: timestamp("executed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Security Audit Logs (authentication & critical operations)
export const SecurityAuditActionEnum = pgEnum("security_audit_action_enum", [
  'login_success',
  'login_failed',
  'logout',
  'password_change',
  'password_reset_request',
  'password_reset_complete',
  'registration',
  'session_invalidated',
  'rate_limit_exceeded',
  'invoice_created',
  'invoice_updated',
  'invoice_deleted',
  'client_created',
  'client_updated',
  'client_deleted',
]);

export const securityAuditLogs = pgTable("security_audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Nullable for failed logins
  action: SecurityAuditActionEnum("action").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata").$type<Record<string, any>>(), // Additional context (no sensitive data)
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Waitlist (landing page signups)
export const RoleEnum = pgEnum("waitlist_role_enum", ['Digital Nomad', 'Freelancer', 'Agency/Team', 'Other']);

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  country: text("country"),
  role: RoleEnum("role").notNull(),
  useCase: text("use_case"),
  referralCode: text("referral_code"),
  emailConsent: boolean("email_consent").notNull().default(true),
  airtableRecordId: text("airtable_record_id"), // Store Airtable ID for reference
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bug Reports
export const BugModuleEnum = pgEnum("bug_module_enum", ['Pricing', 'Waitlist', 'Form', 'Other']);

export const bugReports = pgTable("bug_reports", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  description: text("description").notNull(),
  affectedModule: BugModuleEnum("affected_module").notNull(),
  screenshotUrl: text("screenshot_url"), // Object storage URL if uploaded
  contactConsent: boolean("contact_consent").notNull().default(false),
  airtableRecordId: text("airtable_record_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const workspacesRelations = relations(workspaces, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  workspace: one(workspaces, { fields: [users.workspaceId], references: [workspaces.id] }),
  clients: many(clients),
  invoices: many(invoices),
  trips: many(trips),
  documents: many(documents),
  clientNotes: many(clientNotes),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  invoices: many(invoices),
  notes: many(clientNotes),
}));

export const clientNotesRelations = relations(clientNotes, ({ one }) => ({
  client: one(clients, { fields: [clientNotes.clientId], references: [clients.id] }),
  user: one(users, { fields: [clientNotes.userId], references: [users.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
}));

export const tripsRelations = relations(trips, ({ one }) => ({
  user: one(users, { fields: [trips.userId], references: [users.id] }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, { fields: [documents.userId], references: [users.id] }),
}));

export const vaultDocumentsRelations = relations(vaultDocuments, ({ one, many }) => ({
  user: one(users, { fields: [vaultDocuments.userId], references: [users.id] }),
  auditLogs: many(vaultAuditLogs),
  retentionJobs: many(documentRetentionJobs),
}));

export const vaultAuditLogsRelations = relations(vaultAuditLogs, ({ one }) => ({
  user: one(users, { fields: [vaultAuditLogs.userId], references: [users.id] }),
  document: one(vaultDocuments, { fields: [vaultAuditLogs.documentId], references: [vaultDocuments.id] }),
}));

export const documentRetentionJobsRelations = relations(documentRetentionJobs, ({ one }) => ({
  document: one(vaultDocuments, { fields: [documentRetentionJobs.documentId], references: [vaultDocuments.id] }),
}));

// Zod Schemas
export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

export const insertClientSchema = createInsertSchema(clients, {
  lastInteractionDate: z.coerce.date().optional(),
  nextActionDate: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true });

export const insertClientNoteSchema = createInsertSchema(clientNotes, {
  date: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true });

// Invoice status enum for validation
export const InvoiceStatus = z.enum(['Draft', 'Sent', 'Paid', 'Overdue']);

export const insertInvoiceSchema = createInsertSchema(invoices, {
  dueDate: z.coerce.date(),
  status: InvoiceStatus,
  reverseCharge: z.boolean().optional(),
  complianceChecked: z.boolean().optional(),
}).omit({ id: true, issuedAt: true });

export const insertJurisdictionRuleSchema = createInsertSchema(jurisdictionRules).omit({ 
  id: true, 
  createdAt: true 
});

export const insertTripSchema = createInsertSchema(trips, {
  entryDate: z.coerce.date(),
  exitDate: z.coerce.date().optional(),
}).omit({ id: true });

export const insertDocumentSchema = createInsertSchema(documents, {
  expiryDate: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true });

// Types
export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type ClientNote = typeof clientNotes.$inferSelect;
export type InsertClientNote = z.infer<typeof insertClientNoteSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Trip = typeof trips.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type JurisdictionRule = typeof jurisdictionRules.$inferSelect;
export type InsertJurisdictionRule = z.infer<typeof insertJurisdictionRuleSchema>;

// Vault schemas and types
export const insertVaultDocumentSchema = createInsertSchema(vaultDocuments, {
  expiryDate: z.coerce.date().optional(),
  retentionMonths: z.number().int().positive().max(120).optional(),
}).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  hardDeleteAt: true
});

export const insertVaultAuditLogSchema = createInsertSchema(vaultAuditLogs).omit({ 
  id: true,
  timestamp: true
});

export const insertDocumentRetentionJobSchema = createInsertSchema(documentRetentionJobs, {
  dueAt: z.coerce.date(),
}).omit({ 
  id: true,
  createdAt: true,
  executed: true,
  executedAt: true
});

export type VaultDocument = typeof vaultDocuments.$inferSelect;
export type InsertVaultDocument = z.infer<typeof insertVaultDocumentSchema>;
export type VaultAuditLog = typeof vaultAuditLogs.$inferSelect;
export type InsertVaultAuditLog = z.infer<typeof insertVaultAuditLogSchema>;
export type SecurityAuditLog = typeof securityAuditLogs.$inferSelect;
export type InsertSecurityAuditLog = typeof securityAuditLogs.$inferInsert;
export type DocumentRetentionJob = typeof documentRetentionJobs.$inferSelect;
export type InsertDocumentRetentionJob = z.infer<typeof insertDocumentRetentionJobSchema>;

// Waitlist schemas
export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  airtableRecordId: true,
  createdAt: true,
});

export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;

// Bug Reports schemas
export const insertBugReportSchema = createInsertSchema(bugReports).omit({
  id: true,
  airtableRecordId: true,
  createdAt: true,
});

export type BugReport = typeof bugReports.$inferSelect;
export type InsertBugReport = z.infer<typeof insertBugReportSchema>;
