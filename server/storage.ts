import { 
  users, clients, invoices, trips, documents, clientNotes, workspaces, jurisdictionRules,
  vaultDocuments, vaultAuditLogs, documentRetentionJobs, securityAuditLogs,
  waitlist, bugReports, featureRequests, expenses, projects, tasks,
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
  type FeatureRequest, type InsertFeatureRequest,
  type Expense, type InsertExpense, type UpdateExpense,
  type Project, type InsertProject, type UpdateProject,
  type Task, type InsertTask, type UpdateTask,
  type UpsertOAuthUser
} from "@shared/schema";
import { db } from "./db";
import { eq, count, or, desc, inArray, isNull, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { sessionPool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertOAuthUser(oauthUser: UpsertOAuthUser): Promise<User>;

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

  // Expenses
  getExpenses(userId: number): Promise<(Expense & { clientName?: string; projectName?: string })[]>;
  getExpense(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: UpdateExpense): Promise<Expense>;
  deleteExpense(id: number): Promise<void>;
  getExpenseStats(userId: number): Promise<{
    totalExpenses: number;
    totalAmount: number;
    expensesByCategory: Array<{ category: string; total: number; count: number }>;
    expensesByMonth: Array<{ month: string; total: number }>;
    expensesByClient: Array<{ clientId: number | null; clientName: string; total: number }>;
  }>;

  // Projects
  getProjects(userId: number): Promise<(Project & { clientName?: string; taskCount: number; completedTaskCount: number })[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: UpdateProject): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  getProjectFinancialSummary(projectId: number): Promise<{
    budget: number;
    totalInvoiced: number;
    paidInvoices: number;
    pendingInvoices: number;
    totalExpenses: number;
    netProfit: number;
  }>;
  getProjectInvoices(projectId: number): Promise<Invoice[]>;
  getProjectExpenses(projectId: number): Promise<Expense[]>;

  // Tasks
  getTasks(projectId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: UpdateTask): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  getUserTasks(userId: number): Promise<(Task & { projectName: string })[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool: sessionPool,
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async upsertOAuthUser(oauthUser: UpsertOAuthUser): Promise<User> {
    const existingUser = await this.getUserByGoogleId(oauthUser.googleId);
    
    if (existingUser) {
      const [updatedUser] = await db
        .update(users)
        .set({
          name: oauthUser.name,
          profileImageUrl: oauthUser.profileImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning();
      return updatedUser;
    }
    
    if (oauthUser.email) {
      const existingEmailUser = await this.getUserByEmail(oauthUser.email);
      if (existingEmailUser) {
        const [updatedUser] = await db
          .update(users)
          .set({
            googleId: oauthUser.googleId,
            name: oauthUser.name,
            profileImageUrl: oauthUser.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingEmailUser.id))
          .returning();
        return updatedUser;
      }
    }
    
    const [newUser] = await db
      .insert(users)
      .values({
        googleId: oauthUser.googleId,
        email: oauthUser.email || `oauth_${oauthUser.googleId}@placeholder.local`,
        name: oauthUser.name,
        profileImageUrl: oauthUser.profileImageUrl,
      })
      .returning();
    return newUser;
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
        country: clients.country,
        status: clients.status,
        notes: clients.notes,
        lastInteractionDate: clients.lastInteractionDate,
        nextActionDate: clients.nextActionDate,
        nextActionDescription: clients.nextActionDescription,
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
        projectId: invoices.projectId,
        invoiceNumber: invoices.invoiceNumber,
        amount: invoices.amount,
        currency: invoices.currency,
        status: invoices.status,
        dueDate: invoices.dueDate,
        issuedAt: invoices.issuedAt,
        items: invoices.items,
        tax: invoices.tax,
        notesToClient: invoices.notesToClient,
        country: invoices.country,
        language: invoices.language,
        exchangeRate: invoices.exchangeRate,
        customerVatId: invoices.customerVatId,
        reverseCharge: invoices.reverseCharge,
        reverseChargeNote: invoices.reverseChargeNote,
        complianceChecked: invoices.complianceChecked,
        templateVersion: invoices.templateVersion,
        userName: users.name,
        clientName: clients.name,
      })
      .from(invoices)
      .innerJoin(users, eq(invoices.userId, users.id))
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(eq(users.workspaceId, workspaceId))
      .orderBy(desc(invoices.issuedAt));
    
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
    
    const totalRevenue = workspaceInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidRevenue = workspaceInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const pendingRevenue = workspaceInvoices.filter(inv => inv.status === 'Sent').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueRevenue = workspaceInvoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
    
    // Revenue by month (last 6 months)
    const revenueByMonth: Array<{ month: string; revenue: number }> = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthRevenue = workspaceInvoices
        .filter(inv => {
          const invDate = inv.issuedAt ? new Date(inv.issuedAt) : new Date();
          const invMonthKey = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`;
          return invMonthKey === monthKey && inv.status === 'Paid';
        })
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      revenueByMonth.push({ month: monthKey, revenue: monthRevenue });
    }
    
    // Revenue by user
    const revenueByUser = workspaceUserIds.map(user => {
      const userRevenue = workspaceInvoices
        .filter(inv => inv.userId === user.id && inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
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

  // Expenses CRUD
  async getExpenses(userId: number): Promise<(Expense & { clientName?: string; projectName?: string })[]> {
    const result = await db
      .select({
        id: expenses.id,
        userId: expenses.userId,
        clientId: expenses.clientId,
        projectId: expenses.projectId,
        date: expenses.date,
        amount: expenses.amount,
        currency: expenses.currency,
        category: expenses.category,
        description: expenses.description,
        receiptUrl: expenses.receiptUrl,
        geoLatitude: expenses.geoLatitude,
        geoLongitude: expenses.geoLongitude,
        geoPlace: expenses.geoPlace,
        createdAt: expenses.createdAt,
        updatedAt: expenses.updatedAt,
        clientName: clients.name,
        projectName: projects.name,
      })
      .from(expenses)
      .leftJoin(clients, eq(expenses.clientId, clients.id))
      .leftJoin(projects, eq(expenses.projectId, projects.id))
      .where(eq(expenses.userId, userId))
      .orderBy(desc(expenses.date));
    
    return result.map(r => ({
      ...r,
      clientName: r.clientName || undefined,
      projectName: r.projectName || undefined
    }));
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));
    return expense || undefined;
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  async updateExpense(id: number, expense: UpdateExpense): Promise<Expense> {
    const [updated] = await db
      .update(expenses)
      .set({ ...expense, updatedAt: new Date() })
      .where(eq(expenses.id, id))
      .returning();
    return updated;
  }

  async deleteExpense(id: number): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }

  async getExpenseStats(userId: number): Promise<{
    totalExpenses: number;
    totalAmount: number;
    expensesByCategory: Array<{ category: string; total: number; count: number }>;
    expensesByMonth: Array<{ month: string; total: number }>;
    expensesByClient: Array<{ clientId: number | null; clientName: string; total: number }>;
  }> {
    const allExpenses = await this.getExpenses(userId);
    
    const totalExpenses = allExpenses.length;
    const totalAmount = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Group by category
    const categoryMap = new Map<string, { total: number; count: number }>();
    allExpenses.forEach(e => {
      const cat = categoryMap.get(e.category) || { total: 0, count: 0 };
      cat.total += e.amount;
      cat.count += 1;
      categoryMap.set(e.category, cat);
    });
    const expensesByCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count
    }));
    
    // Group by month
    const monthMap = new Map<string, number>();
    allExpenses.forEach(e => {
      const month = new Date(e.date).toISOString().slice(0, 7); // YYYY-MM
      monthMap.set(month, (monthMap.get(month) || 0) + e.amount);
    });
    const expensesByMonth = Array.from(monthMap.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    // Group by client
    const clientMap = new Map<number | null, { clientName: string; total: number }>();
    allExpenses.forEach(e => {
      const clientId = e.clientId;
      const existing = clientMap.get(clientId) || { clientName: e.clientName || 'No Client', total: 0 };
      existing.total += e.amount;
      clientMap.set(clientId, existing);
    });
    const expensesByClient = Array.from(clientMap.entries()).map(([clientId, data]) => ({
      clientId,
      clientName: data.clientName,
      total: data.total
    }));
    
    return {
      totalExpenses,
      totalAmount,
      expensesByCategory,
      expensesByMonth,
      expensesByClient
    };
  }

  // Projects
  async getProjects(userId: number): Promise<(Project & { clientName?: string; taskCount: number; completedTaskCount: number })[]> {
    const allProjects = await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
    const allClients = await db.select().from(clients).where(eq(clients.userId, userId));
    const allTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
    
    const clientMap = new Map(allClients.map(c => [c.id, c.name]));
    
    return allProjects.map((project: Project) => {
      const projectTasks = allTasks.filter(t => t.projectId === project.id);
      return {
        ...project,
        clientName: project.clientId ? clientMap.get(project.clientId) : undefined,
        taskCount: projectTasks.length,
        completedTaskCount: projectTasks.filter(t => t.status === 'Done').length
      };
    });
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, project: UpdateProject): Promise<Project> {
    const [updated] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    // Delete associated tasks first
    await db.delete(tasks).where(eq(tasks.projectId, id));
    // Then delete the project
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getProjectFinancialSummary(projectId: number): Promise<{
    budget: number;
    totalInvoiced: number;
    paidInvoices: number;
    pendingInvoices: number;
    totalExpenses: number;
    netProfit: number;
  }> {
    const project = await this.getProject(projectId);
    const projectInvoices = await this.getProjectInvoices(projectId);
    const projectExpenses = await this.getProjectExpenses(projectId);
    
    const budget = project?.budget || 0;
    const totalInvoiced = projectInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidInvoices = projectInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const pendingInvoices = projectInvoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const totalExpenses = projectExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = paidInvoices - totalExpenses;
    
    return {
      budget,
      totalInvoiced,
      paidInvoices,
      pendingInvoices,
      totalExpenses,
      netProfit
    };
  }

  async getProjectInvoices(projectId: number): Promise<Invoice[]> {
    return db.select().from(invoices).where(eq(invoices.projectId, projectId));
  }

  async getProjectExpenses(projectId: number): Promise<Expense[]> {
    return db.select().from(expenses).where(eq(expenses.projectId, projectId));
  }

  // Tasks
  async getTasks(projectId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.projectId, projectId)).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, task: UpdateTask): Promise<Task> {
    // Build update data with proper typing
    const updateData: Partial<typeof tasks.$inferInsert> = { ...task };
    
    // If marking task as Done, set completedAt
    if (task.status === 'Done') {
      updateData.completedAt = new Date();
    } else if (task.status) {
      // If status is changing to something other than Done, clear completedAt
      updateData.completedAt = null;
    }
    
    const [updated] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async getUserTasks(userId: number): Promise<(Task & { projectName: string })[]> {
    const allTasks = await db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt));
    const allProjects = await db.select().from(projects).where(eq(projects.userId, userId));
    
    const projectMap = new Map(allProjects.map(p => [p.id, p.name]));
    
    return allTasks.map(task => ({
      ...task,
      projectName: projectMap.get(task.projectId) || 'Unknown Project'
    }));
  }
}

export const storage = new DatabaseStorage();
