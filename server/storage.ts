import { 
  users, clients, invoices, trips, documents,
  type User, type InsertUser, type Client, type InsertClient,
  type Invoice, type InsertInvoice, type Trip, type InsertTrip,
  type Document, type InsertDocument 
} from "@shared/schema";
import { db } from "./db";
import { eq, count } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Clients
  getClients(userId: number): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  
  // Invoices
  getInvoices(userId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  
  // Trips
  getTrips(userId: number): Promise<Trip[]>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  
  // Documents
  getDocuments(userId: number): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;

  // Admin
  getAdminStats(): Promise<{ totalUsers: number; totalClients: number; totalInvoices: number; totalTrips: number }>;
  getAllUsers(): Promise<User[]>;

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
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getClients(userId: number): Promise<Client[]> {
    return db.select().from(clients).where(eq(clients.userId, userId));
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async getInvoices(userId: number): Promise<Invoice[]> {
    return db.select().from(invoices).where(eq(invoices.userId, userId));
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    // Cast to any to avoid complex type mismatch with jsonb array and drizzle inference
    const [newInvoice] = await db.insert(invoices).values(invoice as any).returning();
    return newInvoice;
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

  async getAdminStats() {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [clientCount] = await db.select({ count: count() }).from(clients);
    const [invoiceCount] = await db.select({ count: count() }).from(invoices);
    const [tripCount] = await db.select({ count: count() }).from(trips);
    
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
}

export const storage = new DatabaseStorage();
