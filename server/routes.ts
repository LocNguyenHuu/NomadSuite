import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { storage } from "./storage";
import { insertClientSchema, insertInvoiceSchema, insertTripSchema, insertDocumentSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // User Settings
  app.patch("/api/user", requireAuth, async (req, res) => {
    // Allow updating specific fields, ignore others like role/id/password/email
    const updateSchema = insertUserSchema.partial().pick({
      name: true,
      homeCountry: true,
      currentCountry: true,
    });

    const parsed = updateSchema.parse(req.body);
    const user = await storage.updateUser(req.user!.id, parsed);
    res.json(user);
  });

  // Admin Routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    const stats = await storage.getAdminStats();
    res.json(stats);
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  // Clients
  app.get("/api/clients", requireAuth, async (req, res) => {
    const clients = await storage.getClients(req.user!.id);
    res.json(clients);
  });

  app.post("/api/clients", requireAuth, async (req, res) => {
    const parsed = insertClientSchema.parse({ ...req.body, userId: req.user!.id });
    const client = await storage.createClient(parsed);
    res.status(201).json(client);
  });

  // Invoices
  app.get("/api/invoices", requireAuth, async (req, res) => {
    const invoices = await storage.getInvoices(req.user!.id);
    res.json(invoices);
  });

  app.post("/api/invoices", requireAuth, async (req, res) => {
    const parsed = insertInvoiceSchema.parse({ ...req.body, userId: req.user!.id });
    const invoice = await storage.createInvoice(parsed);
    res.status(201).json(invoice);
  });

  // Trips
  app.get("/api/trips", requireAuth, async (req, res) => {
    const trips = await storage.getTrips(req.user!.id);
    res.json(trips);
  });

  app.post("/api/trips", requireAuth, async (req, res) => {
    const parsed = insertTripSchema.parse({ ...req.body, userId: req.user!.id });
    const trip = await storage.createTrip(parsed);
    res.status(201).json(trip);
  });

  // Documents
  app.get("/api/documents", requireAuth, async (req, res) => {
    const documents = await storage.getDocuments(req.user!.id);
    res.json(documents);
  });

  app.post("/api/documents", requireAuth, async (req, res) => {
    const parsed = insertDocumentSchema.parse({ ...req.body, userId: req.user!.id });
    const document = await storage.createDocument(parsed);
    res.status(201).json(document);
  });

  const httpServer = createServer(app);

  return httpServer;
}
