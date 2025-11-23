import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, requireAuth, requireAdmin, hashPassword, comparePasswords, csrfProtection } from "./auth";
import { storage } from "./storage";
import rateLimit from "express-rate-limit";
import { insertClientSchema, insertInvoiceSchema, insertTripSchema, insertDocumentSchema, insertUserSchema, insertClientNoteSchema, insertWorkspaceSchema, type EncryptedDocumentMetadata, RetentionPolicy } from "@shared/schema";
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
import { encryptMetadata, decryptMetadata, computeFileHash } from "./lib/encryption";
import { VaultStorageService } from "./lib/object-storage-vault";
import { AuditLogger } from "./lib/audit";
import multer from "multer";
import fileType from "file-type";

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
  primaryLanguage: z.enum(["en", "de", "fr", "vi", "ja", "zh"]).optional(),
  defaultCurrency: z.string().optional(),
  defaultInvoiceLanguage: z.enum(["en", "de", "fr", "vi", "ja", "zh"]).optional(),
  timezone: z.string().optional(),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "DD.MM.YYYY"]).optional(),
  invoicePrefix: z.string().min(1, "Invoice prefix cannot be empty").optional(),
}).strict();

// Auth-specific strict rate limiting (prevents brute force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs (allows retries but prevents brute force)
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all attempts (prevents bypass)
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app, authLimiter);

  // User Profile (extended)
  app.patch("/api/user/profile", requireAuth, csrfProtection, async (req, res) => {
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
  app.post("/api/user/change-password", requireAuth, csrfProtection, async (req, res) => {
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
  app.patch("/api/user/settings", requireAuth, csrfProtection, async (req, res) => {
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
  app.patch("/api/user", requireAuth, csrfProtection, async (req, res) => {
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

  app.patch("/api/users/:id/role", requireAdmin, csrfProtection, async (req, res) => {
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

  app.delete("/api/users/:id", requireAdmin, csrfProtection, async (req, res) => {
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

  app.patch("/api/workspace", requireAdmin, csrfProtection, async (req, res) => {
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

  app.get("/api/admin/revenue-stats", requireAdmin, async (req, res) => {
    const workspaceId = req.user!.workspaceId;
    if (!workspaceId) {
      return res.status(400).send("User not associated with a workspace");
    }
    const revenueStats = await storage.getAdminRevenueStats(workspaceId);
    res.json(revenueStats);
  });

  app.get("/api/admin/clients", requireAdmin, async (req, res) => {
    const workspaceId = req.user!.workspaceId;
    if (!workspaceId) {
      return res.status(400).send("User not associated with a workspace");
    }
    const clients = await storage.getWorkspaceClients(workspaceId);
    res.json(clients);
  });

  app.get("/api/admin/invoices", requireAdmin, async (req, res) => {
    const workspaceId = req.user!.workspaceId;
    if (!workspaceId) {
      return res.status(400).send("User not associated with a workspace");
    }
    const invoices = await storage.getWorkspaceInvoices(workspaceId);
    res.json(invoices);
  });

  // Clients
  app.get("/api/clients", requireAuth, async (req, res) => {
    const clients = await storage.getClients(req.user!.id);
    res.json(clients);
  });

  app.post("/api/clients", requireAuth, csrfProtection, async (req, res) => {
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

  app.patch("/api/clients/:id", requireAuth, csrfProtection, async (req, res) => {
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

  app.post("/api/clients/:id/notes", requireAuth, csrfProtection, async (req, res) => {
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

  app.post("/api/invoices", requireAuth, csrfProtection, async (req, res) => {
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

  app.patch("/api/invoices/:id", requireAuth, csrfProtection, async (req, res) => {
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
  app.post("/api/invoices/:id/email", requireAuth, csrfProtection, async (req, res) => {
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

  app.post("/api/trips", requireAuth, csrfProtection, async (req, res) => {
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

  app.post("/api/documents", requireAuth, csrfProtection, async (req, res) => {
    const parsed = insertDocumentSchema.parse({ ...req.body, userId: req.user!.id });
    const document = await storage.createDocument(parsed);
    res.status(201).json(document);
  });

  // ============================================
  // GDPR-Compliant Document Vault API (MVP)
  // ============================================
  
  const vaultStorage = new VaultStorageService();
  const auditLogger = new AuditLogger(storage);
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
  });

  // Vault document upload schema
  const vaultUploadSchema = z.object({
    name: z.string().min(1, "Document name is required"),
    type: z.string().min(1, "Document type is required"),
    country: z.string().optional(),
    notes: z.string().optional(),
    retentionPolicy: RetentionPolicy,
    retentionMonths: z.number().int().positive().max(120).optional(),
    expiryDate: z.string().optional(), // ISO date string
  });

  // Upload document (csrfProtection MUST be before multer to parse token)
  app.post("/api/vault/documents", requireAuth, csrfProtection, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!req.user?.workspaceId) {
        return res.status(400).json({ message: "User workspace not found" });
      }

      // Parse and strictly validate metadata from multipart request
      let parsedMetadata: any;
      try {
        parsedMetadata = JSON.parse(req.body.metadata || '{}');
      } catch (error) {
        return res.status(400).json({ message: "Invalid metadata JSON" });
      }

      // Validate metadata with strict Zod schema (sanitize user input)
      const metadata = vaultUploadSchema.parse(parsedMetadata);

      // CRITICAL: Server-side file type detection using magic bytes (prevent MIME spoofing)
      const detectedType = await fileType.fromBuffer(req.file.buffer);
      
      // Allowed MIME types (whitelist)
      const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      
      // Reject if file type cannot be detected or is not in whitelist
      if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
        return res.status(400).json({ 
          message: "Only PDF, JPG, and PNG files are allowed. Detected type: " + (detectedType?.mime || "unknown")
        });
      }

      // Derive immutable server-side values from actual file content (prevent tampering)
      const serverFileSize = req.file.size;
      const serverMimeType = detectedType.mime; // Use detected MIME, not client-provided
      const serverFileHash = computeFileHash(req.file.buffer);

      // Generate storage key
      const storageKey = vaultStorage.generateStorageKey(req.user.id);

      // Upload file to object storage and verify integrity
      const uploadedHash = await vaultStorage.uploadFile(storageKey, req.file.buffer, serverMimeType);

      // Critical: Verify uploaded hash matches computed hash (integrity check)
      if (uploadedHash !== serverFileHash) {
        // Hash mismatch indicates corruption or tampering
        await vaultStorage.deleteFile(storageKey); // Rollback upload
        return res.status(500).json({ message: "File integrity verification failed" });
      }

      // Encrypt metadata (only user-provided fields)
      const encryptedMetadata = encryptMetadata({
        name: metadata.name,
        type: metadata.type,
        country: metadata.country,
        notes: metadata.notes,
      }, req.user.workspaceId);

      // Create vault document record with server-derived values
      const document = await storage.createVaultDocument({
        userId: req.user.id,
        workspaceId: req.user.workspaceId,
        encryptedMetadata,
        storageKey,
        fileHash: serverFileHash, // Use verified server-side hash
        fileSize: serverFileSize, // Use server-side file size
        mimeType: serverMimeType, // Use server-side mime type
        storageRegion: "EU",
        retentionPolicy: metadata.retentionPolicy,
        retentionMonths: metadata.retentionMonths,
        expiryDate: metadata.expiryDate ? new Date(metadata.expiryDate) : undefined,
      });

      // Audit log
      await auditLogger.logUpload(req.user.id, document.id);

      res.status(201).json({
        id: document.id,
        message: "Document uploaded successfully",
      });
    } catch (error: any) {
      console.error("Vault upload error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      res.status(500).json({ message: error.message || "Upload failed" });
    }
  });

  // List documents (with decrypted metadata)
  app.get("/api/vault/documents", requireAuth, async (req, res) => {
    try {
      if (!req.user?.workspaceId) {
        return res.status(400).json({ message: "User workspace not found" });
      }

      const documents = await storage.getVaultDocuments(req.user.id);

      // Decrypt metadata for each document
      const decryptedDocuments = documents.map(doc => {
        try {
          const metadata = decryptMetadata(doc.encryptedMetadata, req.user!.workspaceId!);
          return {
            id: doc.id,
            ...metadata,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            retentionPolicy: doc.retentionPolicy,
            retentionMonths: doc.retentionMonths,
            expiryDate: doc.expiryDate,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          };
        } catch (error) {
          console.error(`Failed to decrypt document ${doc.id}:`, error);
          return null;
        }
      }).filter(Boolean);

      res.json(decryptedDocuments);
    } catch (error: any) {
      console.error("Vault list error:", error);
      res.status(500).json({ message: error.message || "Failed to fetch documents" });
    }
  });

  // Get download URL (5-minute signed URL)
  app.get("/api/vault/documents/:id/download", requireAuth, async (req, res) => {
    try {
      if (!req.user?.workspaceId) {
        return res.status(400).json({ message: "User workspace not found" });
      }

      const documentId = parseInt(req.params.id);
      const document = await storage.getVaultDocument(documentId);

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Verify ownership
      if (document.userId !== req.user.id || document.workspaceId !== req.user.workspaceId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Generate 5-minute signed URL
      const downloadUrl = await vaultStorage.getSignedDownloadUrl(document.storageKey);

      // Audit log
      await auditLogger.logDownloadLink(req.user.id, documentId);

      // Decrypt metadata for filename
      const metadata = decryptMetadata(document.encryptedMetadata, req.user.workspaceId);

      res.json({
        downloadUrl,
        filename: metadata.name,
        expiresIn: 300, // 5 minutes in seconds
      });
    } catch (error: any) {
      console.error("Vault download error:", error);
      res.status(500).json({ message: error.message || "Failed to generate download URL" });
    }
  });

  // Delete document
  app.delete("/api/vault/documents/:id", requireAuth, csrfProtection, async (req, res) => {
    try {
      if (!req.user?.workspaceId) {
        return res.status(400).json({ message: "User workspace not found" });
      }

      const documentId = parseInt(req.params.id);
      const document = await storage.getVaultDocument(documentId);

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Verify ownership
      if (document.userId !== req.user.id || document.workspaceId !== req.user.workspaceId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Delete file from storage
      await vaultStorage.deleteFile(document.storageKey);

      // Soft delete in database
      await storage.softDeleteVaultDocument(documentId, req.user.id, req.user.workspaceId);

      // Audit log
      await auditLogger.logUserDelete(req.user.id, documentId);

      res.json({ message: "Document deleted successfully" });
    } catch (error: any) {
      console.error("Vault delete error:", error);
      res.status(500).json({ message: error.message || "Failed to delete document" });
    }
  });

  // Waitlist API (public endpoint - no auth required)
  app.post("/api/waitlist", async (req, res) => {
    try {
      const { insertWaitlistSchema } = await import("@shared/schema");
      const parsed = insertWaitlistSchema.parse(req.body);

      // Create in database
      const entry = await storage.createWaitlist(parsed);

      // Sync to Airtable (non-blocking)
      const { airtableService } = await import("./lib/airtable");
      airtableService.createWaitlistRecord({
        name: parsed.name,
        email: parsed.email,
        country: parsed.country || undefined,
        role: parsed.role,
        useCase: parsed.useCase || undefined,
        referralCode: parsed.referralCode || undefined,
        emailConsent: parsed.emailConsent ?? true
      }).then((airtableId) => {
        if (airtableId && entry.id) {
          // Optionally update database with Airtable ID (silent fail)
          console.log(`[Waitlist] Created Airtable record ${airtableId} for entry ${entry.id}`);
        }
      }).catch((error) => {
        console.error("[Waitlist] Airtable sync failed (non-critical):", error);
      });

      res.status(201).json({ message: "Successfully joined waitlist", id: entry.id });
    } catch (error: any) {
      console.error("Waitlist submission error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      res.status(500).json({ message: "Failed to join waitlist" });
    }
  });

  // Bug Report API (public endpoint - no auth required) - Supports file upload
  app.post("/api/bug-report", upload.single('screenshot'), async (req, res) => {
    try {
      let screenshotUrl = '';
      
      // Upload screenshot to object storage if provided
      if (req.file) {
        const { objectStorageClient } = await import("./lib/object-storage-vault");
        const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
        if (bucketId) {
          const fileName = `public/bug-reports/${Date.now()}-${req.file.originalname}`;
          const bucket = objectStorageClient.bucket(bucketId);
          const file = bucket.file(fileName);
          await file.save(req.file.buffer, {
            metadata: { contentType: req.file.mimetype },
          });
          screenshotUrl = `https://storage.googleapis.com/${bucketId}/${fileName}`;
        }
      }

      // Parse and validate request body
      const { insertBugReportSchema } = await import("@shared/schema");
      const bugData: any = {
        name: req.body.name || null,
        email: req.body.email || null,
        description: req.body.description,
        contactConsent: req.body.contactConsent === 'true' || req.body.contactConsent === true
      };
      
      // Only include screenshotUrl if a file was uploaded
      if (screenshotUrl) {
        bugData.screenshotUrl = screenshotUrl;
      }
      
      const parsed = insertBugReportSchema.parse(bugData);

      // Create in database
      const report = await storage.createBugReport(parsed);

      // Sync to Airtable (non-blocking)
      const { airtableService } = await import("./lib/airtable");
      airtableService.createBugReportRecord({
        name: parsed.name || undefined,
        email: parsed.email || undefined,
        description: parsed.description,
        screenshotUrl: parsed.screenshotUrl || undefined,
        contactConsent: parsed.contactConsent ?? false
      }).then((airtableId) => {
        if (airtableId && report.id) {
          console.log(`[Bug Report] Created Airtable record ${airtableId} for report ${report.id}`);
        }
      }).catch((error) => {
        console.error("[Bug Report] Airtable sync failed (non-critical):", error);
      });

      res.status(201).json({ message: "Bug report submitted", id: report.id });
    } catch (error: any) {
      console.error("Bug report submission error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      res.status(500).json({ message: "Failed to submit bug report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
