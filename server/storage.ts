import { 
  users, clients, invoices, trips, documents, clientNotes, workspaces,
  type User, type InsertUser, type Client, type InsertClient,
  type Invoice, type InsertInvoice, type Trip, type InsertTrip,
  type Document, type InsertDocument, type ClientNote, type InsertClientNote,
  type Workspace, type InsertWorkspace
} from "@shared/schema";
import { db } from "./db";
import { eq, count, or, desc, inArray } from "drizzle-orm";
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
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  
  // Client Notes
  getClientNotes(clientId: number): Promise<ClientNote[]>;
  createClientNote(note: InsertClientNote): Promise<ClientNote>;
  
  // Invoices
  getInvoices(userId: number): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  
  // Trips
  getTrips(userId: number): Promise<Trip[]>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  
  // Documents
  getDocuments(userId: number): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;

  // Admin
  getAdminStats(workspaceId: number): Promise<{ totalUsers: number; totalClients: number; totalInvoices: number; totalTrips: number }>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;

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

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    // Cast to any to avoid complex type mismatch with jsonb array and drizzle inference
    const [newInvoice] = await db.insert(invoices).values(invoice as any).returning();
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
}

export const storage = new DatabaseStorage();
