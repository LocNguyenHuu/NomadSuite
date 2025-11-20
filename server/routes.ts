import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertClientSchema, insertInvoiceSchema, insertTripSchema, insertDocumentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Middleware to check if user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }
    next();
  };

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
