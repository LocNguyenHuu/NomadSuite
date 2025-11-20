import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { storage } from "./storage";
import { insertClientSchema, insertInvoiceSchema, insertTripSchema, insertDocumentSchema, insertUserSchema, insertClientNoteSchema, insertWorkspaceSchema } from "@shared/schema";

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

  // User Management (Admin only)
  app.get("/api/users", requireAdmin, async (req, res) => {
    const workspaceId = req.user!.workspaceId;
    if (!workspaceId) {
      return res.status(400).send("User not associated with a workspace");
    }
    const users = await storage.getWorkspaceUsers(workspaceId);
    res.json(users);
  });

  app.patch("/api/users/:id/role", requireAdmin, async (req, res) => {
    const userId = parseInt(req.params.id);
    const { role } = req.body;
    
    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).send("Invalid role. Must be 'admin' or 'user'");
    }

    const targetUser = await storage.getUser(userId);
    if (!targetUser || targetUser.workspaceId !== req.user!.workspaceId) {
      return res.status(404).send("User not found");
    }

    const updatedUser = await storage.updateUser(userId, { role });
    res.json(updatedUser);
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    const userId = parseInt(req.params.id);
    
    if (userId === req.user!.id) {
      return res.status(400).send("Cannot delete your own account");
    }

    const targetUser = await storage.getUser(userId);
    if (!targetUser || targetUser.workspaceId !== req.user!.workspaceId) {
      return res.status(404).send("User not found");
    }

    await storage.deleteUser(userId);
    res.sendStatus(200);
  });

  // Workspace Settings (Admin only)
  app.get("/api/workspace", requireAdmin, async (req, res) => {
    const workspaceId = req.user!.workspaceId;
    if (!workspaceId) {
      return res.status(400).send("User not associated with a workspace");
    }
    const workspace = await storage.getWorkspace(workspaceId);
    res.json(workspace);
  });

  app.patch("/api/workspace", requireAdmin, async (req, res) => {
    const workspaceId = req.user!.workspaceId;
    if (!workspaceId) {
      return res.status(400).send("User not associated with a workspace");
    }

    const updateSchema = insertWorkspaceSchema.partial().pick({
      name: true,
      defaultCurrency: true,
      defaultTaxCountry: true,
    });

    const parsed = updateSchema.parse(req.body);
    const workspace = await storage.updateWorkspace(workspaceId, parsed);
    res.json(workspace);
  });

  // Admin Routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    const workspaceId = req.user!.workspaceId;
    if (!workspaceId) {
      return res.status(400).send("User not associated with a workspace");
    }
    const stats = await storage.getAdminStats(workspaceId);
    res.json(stats);
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

  app.get("/api/clients/:id", requireAuth, async (req, res) => {
    const clientId = parseInt(req.params.id);
    const client = await storage.getClient(clientId);
    
    if (!client || client.userId !== req.user!.id) {
      return res.status(404).send("Client not found");
    }
    res.json(client);
  });

  app.patch("/api/clients/:id", requireAuth, async (req, res) => {
    const clientId = parseInt(req.params.id);
    const existingClient = await storage.getClient(clientId);
    
    if (!existingClient || existingClient.userId !== req.user!.id) {
      return res.status(404).send("Client not found");
    }

    // Prevent updating userId
    const parsed = insertClientSchema.partial().omit({ userId: true }).parse(req.body);
    const client = await storage.updateClient(clientId, parsed);
    res.json(client);
  });

  app.get("/api/clients/:id/notes", requireAuth, async (req, res) => {
    const clientId = parseInt(req.params.id);
    const existingClient = await storage.getClient(clientId);
    
    if (!existingClient || existingClient.userId !== req.user!.id) {
      return res.status(404).send("Client not found");
    }

    const notes = await storage.getClientNotes(clientId);
    res.json(notes);
  });

  app.post("/api/clients/:id/notes", requireAuth, async (req, res) => {
    const clientId = parseInt(req.params.id);
    const existingClient = await storage.getClient(clientId);
    
    if (!existingClient || existingClient.userId !== req.user!.id) {
      return res.status(404).send("Client not found");
    }

    const parsed = insertClientNoteSchema.parse({ 
      ...req.body, 
      clientId, 
      userId: req.user!.id 
    });
    const note = await storage.createClientNote(parsed);
    res.status(201).json(note);
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

  app.patch("/api/invoices/:id", requireAuth, async (req, res) => {
    const invoiceId = parseInt(req.params.id);
    const existingInvoice = await storage.getInvoice(invoiceId);
    
    if (!existingInvoice || existingInvoice.userId !== req.user!.id) {
      return res.status(404).send("Invoice not found");
    }

    // Validate and restrict updatable fields
    const allowedUpdates = insertInvoiceSchema.partial().omit({ 
      userId: true, 
      clientId: true 
    });
    const parsed = allowedUpdates.parse(req.body);

    const oldStatus = existingInvoice.status;
    const updatedInvoice = await storage.updateInvoice(invoiceId, parsed);
    
    // Create system note if status changed
    if (parsed.status && parsed.status !== oldStatus) {
      const statusMessages: Record<string, string> = {
        'Draft': 'drafted',
        'Sent': 'sent to client',
        'Paid': 'marked as paid',
        'Overdue': 'marked as overdue'
      };
      
      const message = statusMessages[parsed.status] || 'status updated';
      
      await storage.createClientNote({
        clientId: existingInvoice.clientId,
        userId: req.user!.id,
        content: `Invoice #${existingInvoice.invoiceNumber} ${message}`,
        type: 'System',
        date: new Date()
      });
    }
    
    res.json(updatedInvoice);
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
