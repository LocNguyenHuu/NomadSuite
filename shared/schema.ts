import { pgTable, text, serial, integer, boolean, jsonb, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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

export const insertInvoiceSchema = createInsertSchema(invoices, {
  dueDate: z.coerce.date(),
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
