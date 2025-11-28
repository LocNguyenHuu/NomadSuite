import { 
  users, clients, invoices, trips, documents, clientNotes, workspaces, jurisdictionRules,
  vaultDocuments, vaultAuditLogs, documentRetentionJobs, securityAuditLogs,
  waitlist, bugReports, featureRequests,
  type User, type InsertUser, type Client, type InsertClient,
  type Invoice, type InsertInvoice, type Trip, type InsertTrip,
  type Document, type InsertDocument, type ClientNote, type InsertClientNote,
  type Workspace, type InsertWorkspace, type JurisdictionRule,
  type VaultDocument, type InsertVaultDocument,
  type VaultAuditLog, type InsertVaultAuditLog,
  type DocumentRetentionJob, type InsertDocumentRetentionJob,
  type SecurityAuditLog, type InsertSecurityAuditLog,
  type Waitlist, type InsertWaitlist,
  type BugReport, type InsertBugReport,
  type FeatureRequest, type InsertFeatureRequest
} from "@shared/schema";
import { db } from "./db";
import { eq, count, or, desc, inArray, isNull, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Workspace
  getWorkspace(id: number): Promise<Workspace | undefined>;
  updateWorkspace(id: number, workspace: Partial<InsertWorkspace>): Promise<Workspace>;
  getWorkspaceUsers(workspaceId: number): Promise<User[]>;

  // Clients
  getClient(id: number): Promise<Client | undefined>;
  getClients(userId: number): Promise<Client[]>;
  getWorkspaceClients(workspaceId: number): Promise<(Client & { userName: string })[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  
  // Client Notes
  getClientNotes(clientId: number): Promise<ClientNote[]>;
  createClientNote(note: InsertClientNote): Promise<ClientNote>;
  
  // Invoices
  getInvoices(userId: number): Promise<Invoice[]>;
  getWorkspaceInvoices(workspaceId: number): Promise<(Invoice & { userName: string; clientName: string })[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: number): Promise<void>;
  
  // Trips
  getTrips(userId: number): Promise<Trip[]>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  
  // Documents
  getDocuments(userId: number): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;

  // Jurisdiction Rules
  getJurisdictionRules(): Promise<JurisdictionRule[]>;
  getJurisdictionRule(country: string): Promise<JurisdictionRule | undefined>;

  // Admin
  getAdminStats(workspaceId: number): Promise<{ totalUsers: number; totalClients: number; totalInvoices: number; totalTrips: number }>;
  getAdminRevenueStats(workspaceId: number): Promise<{ totalRevenue: number; paidRevenue: number; pendingRevenue: number; overdueRevenue: number; revenueByMonth: Array<{ month: string; revenue: number }>; revenueByUser: Array<{ userId: number; userName: string; revenue: number }> }>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;

  // Vault Documents (GDPR-compliant encrypted storage)
  getVaultDocuments(userId: number): Promise<VaultDocument[]>;
  getVaultDocument(id: number): Promise<VaultDocument | undefined>;
  createVaultDocument(doc: InsertVaultDocument): Promise<VaultDocument>;
  softDeleteVaultDocument(id: number, userId: number, workspaceId: number): Promise<void>;
  hardDeleteVaultDocument(id: number, userId: number, workspaceId: number): Promise<void>;

  // Vault Audit Logs
  createVaultAuditLog(log: InsertVaultAuditLog): Promise<VaultAuditLog>;
  getVaultAuditLogs(userId: number): Promise<VaultAuditLog[]>;

  // Security Audit Logs
  createSecurityAuditLog(log: InsertSecurityAuditLog): Promise<SecurityAuditLog>;
  getSecurityAuditLogs(userId?: number): Promise<SecurityAuditLog[]>;

  // Waitlist
  createWaitlist(entry: InsertWaitlist): Promise<Waitlist>;
  getWaitlistEntries(): Promise<Waitlist[]>;

  // Bug Reports
  createBugReport(report: InsertBugReport): Promise<BugReport>;
  getBugReports(): Promise<BugReport[]>;

  // Feature Requests
  createFeatureRequest(request: InsertFeatureRequest): Promise<FeatureRequest>;
  getFeatureRequests(): Promise<FeatureRequest[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      or(
        eq(users.username, username),
        eq(users.email, username)
      )
    );
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClients(userId: number): Promise<Client[]> {
    return db.select().from(clients).where(eq(clients.userId, userId));
  }

  async getWorkspaceClients(workspaceId: number): Promise<(Client & { userName: string })[]> {
    const result = await db
      .select({
        id: clients.id,
        userId: clients.userId,
        name: clients.name,
        email: clients.email,
        phone: clients.phone,
        company: clients.company,
        address: clients.address,
        country: clients.country,
        taxId: clients.taxId,
        status: clients.status,
        createdAt: clients.createdAt,
        userName: users.name,
      })
      .from(clients)
      .innerJoin(users, eq(clients.userId, users.id))
      .where(eq(users.workspaceId, workspaceId))
      .orderBy(desc(clients.createdAt));
    
    return result as (Client & { userName: string })[];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: number, clientUpdate: Partial<InsertClient>): Promise<Client> {
    const [updatedClient] = await db
      .update(clients)
      .set(clientUpdate)
      .where(eq(clients.id, id))
      .returning();
    
    if (!updatedClient) {
      throw new Error("Client not found");
    }
    return updatedClient;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  async getClientNotes(clientId: number): Promise<ClientNote[]> {
    return db.select().from(clientNotes).where(eq(clientNotes.clientId, clientId)).orderBy(desc(clientNotes.date));
  }

  async createClientNote(note: InsertClientNote): Promise<ClientNote> {
    const [newNote] = await db.insert(clientNotes).values(note).returning();
    return newNote;
  }

  async getInvoices(userId: number): Promise<Invoice[]> {
    return db.select().from(invoices).where(eq(invoices.userId, userId));
  }

  async getWorkspaceInvoices(workspaceId: number): Promise<(Invoice & { userName: string; clientName: string })[]> {
    const result = await db
      .select({
        id: invoices.id,
        userId: invoices.userId,
        clientId: invoices.clientId,
        invoiceNumber: invoices.invoiceNumber,
        issueDate: invoices.issueDate,
        dueDate: invoices.dueDate,
        status: invoices.status,
        currency: invoices.currency,
        subtotal: invoices.subtotal,
        taxAmount: invoices.taxAmount,
        total: invoices.total,
        items: invoices.items,
        notes: invoices.notes,
        termsAndConditions: invoices.termsAndConditions,
        language: invoices.language,
        complianceData: invoices.complianceData,
        createdAt: invoices.createdAt,
        userName: users.name,
        clientName: clients.name,
      })
      .from(invoices)
      .innerJoin(users, eq(invoices.userId, users.id))
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(eq(users.workspaceId, workspaceId))
      .orderBy(desc(invoices.createdAt));
    
    return result as (Invoice & { userName: string; clientName: string })[];
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    // Normalize status to ensure consistency
    const normalizedInvoice = {
      ...invoice,
      status: invoice.status || 'Draft'
    };
    // Cast to any to avoid complex type mismatch with jsonb array and drizzle inference
    const [newInvoice] = await db.insert(invoices).values(normalizedInvoice as any).returning();
    return newInvoice;
  }

  async updateInvoice(id: number, invoiceUpdate: Partial<InsertInvoice>): Promise<Invoice> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set(invoiceUpdate as any)
      .where(eq(invoices.id, id))
      .returning();
    
    if (!updatedInvoice) {
      throw new Error("Invoice not found");
    }
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  async getTrips(userId: number): Promise<Trip[]> {
    return db.select().from(trips).where(eq(trips.userId, userId));
  }

  async createTrip(trip: InsertTrip): Promise<Trip> {
    const [newTrip] = await db.insert(trips).values(trip).returning();
    return newTrip;
  }

  async getDocuments(userId: number): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.userId, userId));
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [newDoc] = await db.insert(documents).values(doc).returning();
    return newDoc;
  }

  async getAdminStats(workspaceId: number) {
    const [userCount] = await db.select({ count: count() }).from(users).where(eq(users.workspaceId, workspaceId));
    
    const workspaceUserIds = await db.select({ id: users.id }).from(users).where(eq(users.workspaceId, workspaceId));
    const userIds = workspaceUserIds.map(u => u.id);
    
    let clientCount = { count: 0 };
    let invoiceCount = { count: 0 };
    let tripCount = { count: 0 };
    
    if (userIds.length > 0) {
      [clientCount] = await db.select({ count: count() }).from(clients).where(inArray(clients.userId, userIds));
      [invoiceCount] = await db.select({ count: count() }).from(invoices).where(inArray(invoices.userId, userIds));
      [tripCount] = await db.select({ count: count() }).from(trips).where(inArray(trips.userId, userIds));
    }
    
    return {
      totalUsers: Number(userCount.count),
      totalClients: Number(clientCount.count),
      totalInvoices: Number(invoiceCount.count),
      totalTrips: Number(tripCount.count),
    };
  }

  async getAdminRevenueStats(workspaceId: number) {
    const workspaceUserIds = await db.select({ id: users.id, name: users.name }).from(users).where(eq(users.workspaceId, workspaceId));
    const userIds = workspaceUserIds.map(u => u.id);
    
    if (userIds.length === 0) {
      return {
        totalRevenue: 0,
        paidRevenue: 0,
        pendingRevenue: 0,
        overdueRevenue: 0,
        revenueByMonth: [],
        revenueByUser: [],
      };
    }
    
    const workspaceInvoices = await db.select().from(invoices).where(inArray(invoices.userId, userIds));
    
    const totalRevenue = workspaceInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidRevenue = workspaceInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.total, 0);
    const pendingRevenue = workspaceInvoices.filter(inv => inv.status === 'Sent').reduce((sum, inv) => sum + inv.total, 0);
    const overdueRevenue = workspaceInvoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.total, 0);
    
    // Revenue by month (last 6 months)
    const revenueByMonth: Array<{ month: string; revenue: number }> = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthRevenue = workspaceInvoices
        .filter(inv => {
          const invDate = new Date(inv.issueDate);
          const invMonthKey = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`;
          return invMonthKey === monthKey && inv.status === 'Paid';
        })
        .reduce((sum, inv) => sum + inv.total, 0);
      
      revenueByMonth.push({ month: monthKey, revenue: monthRevenue });
    }
    
    // Revenue by user
    const revenueByUser = workspaceUserIds.map(user => {
      const userRevenue = workspaceInvoices
        .filter(inv => inv.userId === user.id && inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.total, 0);
      
      return {
        userId: user.id,
        userName: user.name,
        revenue: userRevenue,
      };
    }).filter(u => u.revenue > 0);
    
    return {
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      overdueRevenue,
      revenueByMonth,
      revenueByUser,
    };
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(users.id);
  }

  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(userUpdate)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getWorkspace(id: number): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace || undefined;
  }

  async updateWorkspace(id: number, workspaceUpdate: Partial<InsertWorkspace>): Promise<Workspace> {
    const [updatedWorkspace] = await db
      .update(workspaces)
      .set(workspaceUpdate)
      .where(eq(workspaces.id, id))
      .returning();
    
    if (!updatedWorkspace) {
      throw new Error("Workspace not found");
    }
    
    return updatedWorkspace;
  }

  async getWorkspaceUsers(workspaceId: number): Promise<User[]> {
    return db.select().from(users).where(eq(users.workspaceId, workspaceId)).orderBy(users.id);
  }

  async getJurisdictionRules(): Promise<JurisdictionRule[]> {
    return db.select().from(jurisdictionRules).orderBy(jurisdictionRules.countryName);
  }

  async getJurisdictionRule(country: string): Promise<JurisdictionRule | undefined> {
    const [rule] = await db.select().from(jurisdictionRules).where(eq(jurisdictionRules.country, country));
    return rule || undefined;
  }

  // Vault Documents (GDPR-compliant with soft delete filtering and ownership checks)
  async getVaultDocuments(userId: number): Promise<VaultDocument[]> {
    return db.select().from(vaultDocuments).where(
      and(
        eq(vaultDocuments.userId, userId),
        isNull(vaultDocuments.deletedAt) // Only return non-deleted documents
      )
    );
  }

  async getVaultDocument(id: number): Promise<VaultDocument | undefined> {
    const [doc] = await db.select().from(vaultDocuments).where(
      and(
        eq(vaultDocuments.id, id),
        isNull(vaultDocuments.deletedAt) // Only return if not soft-deleted
      )
    );
    return doc || undefined;
  }

  async createVaultDocument(doc: InsertVaultDocument): Promise<VaultDocument> {
    const [newDoc] = await db.insert(vaultDocuments).values(doc).returning();
    return newDoc;
  }

  async softDeleteVaultDocument(id: number, userId: number, workspaceId: number): Promise<void> {
    // Verify ownership before soft delete
    await db.update(vaultDocuments)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(vaultDocuments.id, id),
          eq(vaultDocuments.userId, userId),
          eq(vaultDocuments.workspaceId, workspaceId)
        )
      );
  }

  async hardDeleteVaultDocument(id: number, userId: number, workspaceId: number): Promise<void> {
    // Verify ownership before hard delete (GDPR compliance)
    await db.delete(vaultDocuments).where(
      and(
        eq(vaultDocuments.id, id),
        eq(vaultDocuments.userId, userId),
        eq(vaultDocuments.workspaceId, workspaceId)
      )
    );
  }

  // Vault Audit Logs
  async createVaultAuditLog(log: InsertVaultAuditLog): Promise<VaultAuditLog> {
    const [newLog] = await db.insert(vaultAuditLogs).values(log).returning();
    return newLog;
  }

  async getVaultAuditLogs(userId: number): Promise<VaultAuditLog[]> {
    return db.select().from(vaultAuditLogs).where(eq(vaultAuditLogs.userId, userId));
  }

  async createSecurityAuditLog(log: InsertSecurityAuditLog): Promise<SecurityAuditLog> {
    const [newLog] = await db.insert(securityAuditLogs).values(log).returning();
    return newLog;
  }

  async getSecurityAuditLogs(userId?: number): Promise<SecurityAuditLog[]> {
    if (userId) {
      return db.select().from(securityAuditLogs).where(eq(securityAuditLogs.userId, userId)).orderBy(desc(securityAuditLogs.timestamp));
    }
    return db.select().from(securityAuditLogs).orderBy(desc(securityAuditLogs.timestamp));
  }

  async createWaitlist(entry: InsertWaitlist): Promise<Waitlist> {
    const [newEntry] = await db.insert(waitlist).values(entry).returning();
    return newEntry;
  }

  async getWaitlistEntries(): Promise<Waitlist[]> {
    return db.select().from(waitlist).orderBy(desc(waitlist.createdAt));
  }

  async createBugReport(report: InsertBugReport): Promise<BugReport> {
    const [newReport] = await db.insert(bugReports).values(report).returning();
    return newReport;
  }

  async getBugReports(): Promise<BugReport[]> {
    return db.select().from(bugReports).orderBy(desc(bugReports.createdAt));
  }

  async createFeatureRequest(request: InsertFeatureRequest): Promise<FeatureRequest> {
    const [newRequest] = await db.insert(featureRequests).values(request).returning();
    return newRequest;
  }

  async getFeatureRequests(): Promise<FeatureRequest[]> {
    return db.select().from(featureRequests).orderBy(desc(featureRequests.createdAt));
  }
}

export const storage = new DatabaseStorage();
