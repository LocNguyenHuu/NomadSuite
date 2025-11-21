import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, requireAuth, requireAdmin, hashPassword, comparePasswords } from "./auth";
import { storage } from "./storage";
import { insertClientSchema, insertInvoiceSchema, insertTripSchema, insertDocumentSchema, insertUserSchema, insertClientNoteSchema, insertWorkspaceSchema } from "@shared/schema";
import { z } from "zod";
import { generateInvoicePDF } from "./pdf-generator";
import { emailService } from "./email-service";
import { 
  validateNoOverlap, 
  calculate183DayRule, 
  calculateSchengen90_180, 
  calculateTravelSummary,
  calculateTripDays
} from "./travel-calculations";
import { generateInvoiceNumber } from "./invoice-numbering";
import { getExchangeRate } from "./fx-rates";

// Profile update schema with strict validation
const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
  email: z.string().email("Invalid email address").optional(),
  homeCountry: z.string().optional(),
  currentCountry: z.string().optional(),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  vatId: z.string().optional(),
  taxRegime: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  iban: z.string().optional(),
  swift: z.string().optional(),
}).strict();

// Password change schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// Settings update schema
const updateSettingsSchema = z.object({
  primaryLanguage: z.enum(["en", "de", "fr"]).optional(),
  defaultCurrency: z.string().optional(),
  defaultInvoiceLanguage: z.enum(["en", "de", "fr"]).optional(),
  timezone: z.string().optional(),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "DD.MM.YYYY"]).optional(),
  invoicePrefix: z.string().min(1, "Invoice prefix cannot be empty").optional(),
}).strict();

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // User Profile (extended)
  app.patch("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const parsed = updateProfileSchema.parse(req.body);
      
      // Filter out undefined fields to avoid overwriting with undefined
      const updates = Object.fromEntries(
        Object.entries(parsed).filter(([_, value]) => value !== undefined)
      );
      
      const user = await storage.updateUser(req.user!.id, updates);
      res.json(user);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      res.status(400).json({ message: error.message || "Failed to update profile" });
    }
  });

  // Change password
  app.post("/api/user/change-password", requireAuth, async (req, res) => {
    try {
      const parsed = changePasswordSchema.parse(req.body);

      // Get current user from database
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isValid = await comparePasswords(parsed.currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Hash new password and update
      const hashedPassword = await hashPassword(parsed.newPassword);
      await storage.updateUser(req.user!.id, { password: hashedPassword });

      res.json({ message: "Password changed successfully" });
    } catch (error: any) {
      console.error("Error changing password:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // User Settings
  app.patch("/api/user/settings", requireAuth, async (req, res) => {
    try {
      const parsed = updateSettingsSchema.parse(req.body);
      
      // Filter out undefined fields
      const updates = Object.fromEntries(
        Object.entries(parsed).filter(([_, value]) => value !== undefined)
      );
      
      const user = await storage.updateUser(req.user!.id, updates);
      res.json(user);
    } catch (error: any) {
      console.error("Error updating settings:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      res.status(400).json({ message: error.message || "Failed to update settings" });
    }
  });

  // Legacy endpoint (backward compatibility) - now uses same validation as /api/user/profile
  app.patch("/api/user", requireAuth, async (req, res) => {
    try {
      // Use same schema validation as profile endpoint for consistency
      const legacySchema = z.object({
        name: z.string().trim().min(1, "Name cannot be empty").optional(),
        homeCountry: z.string().optional(),
        currentCountry: z.string().optional(),
        businessName: z.string().optional(),
        businessAddress: z.string().optional(),
        vatId: z.string().optional(),
        taxRegime: z.string().optional(),
      }).strict();

      const parsed = legacySchema.parse(req.body);
      
      // Filter out undefined fields
      const updates = Object.fromEntries(
        Object.entries(parsed).filter(([_, value]) => value !== undefined)
      );
      
      const user = await storage.updateUser(req.user!.id, updates);
      res.json(user);
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      res.status(400).json({ message: error.message || "Failed to update user" });
    }
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
    
    // Auto-update overdue status for "Sent" invoices only (not Draft or Paid)
    const today = new Date();
    const updatedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        if (invoice.status === 'Sent' && new Date(invoice.dueDate) < today) {
          // Update to overdue only if currently "Sent"
          const updated = await storage.updateInvoice(invoice.id, { status: 'Overdue' });
          return updated;
        }
        return invoice;
      })
    );
    
    res.json(updatedInvoices);
  });

  // Get exchange rate between two currencies
  app.get("/api/fx-rate", requireAuth, async (req, res) => {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).send("Missing 'from' or 'to' currency parameter");
    }
    
    try {
      const rate = await getExchangeRate(from as string, to as string);
      res.json({ from, to, rate });
    } catch (error: any) {
      res.status(500).send(error.message || "Failed to fetch exchange rate");
    }
  });

  app.post("/api/invoices", requireAuth, async (req, res) => {
    // Get user to access settings (invoice prefix)
    const user = await storage.getUser(req.user!.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    // Generate invoice number automatically using user's custom prefix
    const invoiceNumber = await generateInvoiceNumber(req.user!.id, user.invoicePrefix || "NS-");
    
    // Schema for invoice creation - invoiceNumber is generated server-side, not sent by client
    const createInvoiceSchema = insertInvoiceSchema.omit({ invoiceNumber: true, userId: true });
    const parsed = createInvoiceSchema.parse(req.body);
    
    // Verify client belongs to user
    const client = await storage.getClient(parsed.clientId);
    if (!client || client.userId !== req.user!.id) {
      return res.status(403).send("Cannot create invoice for client that doesn't belong to you");
    }
    
    const invoice = await storage.createInvoice({ 
      ...parsed, 
      userId: req.user!.id, 
      invoiceNumber 
    });
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
      clientId: true,
      invoiceNumber: true // Invoice number should not be editable after creation
    });
    const parsed = allowedUpdates.parse(req.body);
    
    // Additional validation: if status is being updated, ensure it's normalized
    if (parsed.status && !['Draft', 'Sent', 'Paid', 'Overdue'].includes(parsed.status)) {
      return res.status(400).json({ error: "Invalid status. Must be one of: Draft, Sent, Paid, Overdue" });
    }

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

  // PDF Download
  app.get("/api/invoices/:id/pdf", requireAuth, async (req, res) => {
    const invoiceId = parseInt(req.params.id);
    const invoice = await storage.getInvoice(invoiceId);
    
    if (!invoice || invoice.userId !== req.user!.id) {
      return res.status(404).send("Invoice not found");
    }

    const client = await storage.getClient(invoice.clientId);
    if (!client || client.userId !== req.user!.id) {
      return res.status(404).send("Client not found");
    }

    const user = req.user!;
    
    // Apply query parameter overrides
    const invoiceWithOverrides = {
      ...invoice,
      language: req.query.language as string || invoice.language,
      currency: req.query.currency as string || invoice.currency,
      customerVatId: req.query.customerVatId as string || invoice.customerVatId,
      reverseCharge: req.query.reverseCharge === 'true' || invoice.reverseCharge,
      exchangeRate: req.query.exchangeRate as string || invoice.exchangeRate,
    };
    
    try {
      const doc = generateInvoicePDF({ invoice: invoiceWithOverrides, client, user });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
      
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).send("Error generating PDF");
    }
  });

  // Email Invoice
  app.post("/api/invoices/:id/email", requireAuth, async (req, res) => {
    const invoiceId = parseInt(req.params.id);
    const invoice = await storage.getInvoice(invoiceId);
    
    if (!invoice || invoice.userId !== req.user!.id) {
      return res.status(404).send("Invoice not found");
    }

    const client = await storage.getClient(invoice.clientId);
    if (!client || client.userId !== req.user!.id) {
      return res.status(404).send("Client not found");
    }

    const user = req.user!;
    
    if (!emailService.isConfigured()) {
      return res.status(503).json({ 
        error: 'Email service not configured. Please add RESEND_API_KEY to your environment.' 
      });
    }

    // Apply request body overrides
    const invoiceWithOverrides = {
      ...invoice,
      language: req.body.language || invoice.language,
      currency: req.body.currency || invoice.currency,
      customerVatId: req.body.customerVatId || invoice.customerVatId,
      reverseCharge: req.body.reverseCharge !== undefined ? req.body.reverseCharge : invoice.reverseCharge,
      exchangeRate: req.body.exchangeRate || invoice.exchangeRate,
    };

    const { recipientEmail } = req.body;
    const result = await emailService.sendInvoiceEmail(invoiceWithOverrides, client, user, recipientEmail);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    // Update invoice status to 'Sent' if it was 'Draft'
    if (invoice.status === 'Draft') {
      await storage.updateInvoice(invoiceId, { status: 'Sent' });
      
      await storage.createClientNote({
        clientId: invoice.clientId,
        userId: req.user!.id,
        content: `Invoice #${invoice.invoiceNumber} sent via email`,
        type: 'System',
        date: new Date()
      });
    }

    res.json({ success: true, message: 'Invoice sent successfully' });
  });

  // Jurisdiction Rules
  app.get("/api/jurisdictions", requireAuth, async (req, res) => {
    const rules = await storage.getJurisdictionRules();
    res.json(rules);
  });

  app.get("/api/jurisdictions/:country", requireAuth, async (req, res) => {
    const rule = await storage.getJurisdictionRule(req.params.country);
    if (!rule) {
      return res.status(404).send("Jurisdiction rule not found");
    }
    res.json(rule);
  });

  // Trips
  app.get("/api/trips", requireAuth, async (req, res) => {
    const trips = await storage.getTrips(req.user!.id);
    res.json(trips);
  });

  app.post("/api/trips", requireAuth, async (req, res) => {
    try {
      const parsed = insertTripSchema.parse({ ...req.body, userId: req.user!.id });
      
      // Validate dates
      if (parsed.exitDate && parsed.exitDate < parsed.entryDate) {
        return res.status(400).json({ error: "Exit date must be after entry date" });
      }
      
      // Check for overlapping trips
      const existingTrips = await storage.getTrips(req.user!.id);
      const validation = validateNoOverlap(
        { entryDate: parsed.entryDate, exitDate: parsed.exitDate || null },
        existingTrips.map(t => ({
          id: t.id,
          country: t.country,
          entryDate: t.entryDate,
          exitDate: t.exitDate
        }))
      );
      
      if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
      }
      
      const trip = await storage.createTrip(parsed);
      res.status(201).json(trip);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Travel calculations
  app.get("/api/trips/calculations/tax-residency", requireAuth, async (req, res) => {
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
    const trips = await storage.getTrips(req.user!.id);
    const calculations = calculate183DayRule(trips, year);
    res.json(calculations);
  });

  app.get("/api/trips/calculations/schengen", requireAuth, async (req, res) => {
    const trips = await storage.getTrips(req.user!.id);
    const status = calculateSchengen90_180(trips);
    res.json(status);
  });

  app.get("/api/trips/calculations/summary", requireAuth, async (req, res) => {
    const trips = await storage.getTrips(req.user!.id);
    const summary = calculateTravelSummary(trips);
    res.json(summary);
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
