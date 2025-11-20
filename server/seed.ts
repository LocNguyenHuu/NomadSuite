
import { db } from "./db";
import { users, clients, invoices, trips, documents } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(documents);
  await db.delete(trips);
  await db.delete(invoices);
  await db.delete(clients);
  await db.delete(users);

  const hashedPassword = await hashPassword("password123");
  const adminPassword = await hashPassword("admin123");

  // Create Users
  const [admin] = await db.insert(users).values({
    username: "admin",
    password: adminPassword,
    name: "Admin User",
    email: "admin@nomadops.com",
    role: "admin",
    homeCountry: "USA",
    currentCountry: "Portugal",
  }).returning();

  const [user] = await db.insert(users).values({
    username: "nomad",
    password: hashedPassword,
    name: "Jane Doe",
    email: "jane@nomad.com",
    role: "user",
    homeCountry: "Canada",
    currentCountry: "Thailand",
  }).returning();

  console.log(`Created users: ${admin.username} (admin), ${user.username} (user)`);

  // Create Clients for User
  const [client1] = await db.insert(clients).values({
    userId: user.id,
    name: "TechCorp Inc.",
    email: "billing@techcorp.com",
    country: "USA",
    status: "Active",
    notes: "Contract renewal in Dec",
  }).returning();

  const [client2] = await db.insert(clients).values({
    userId: user.id,
    name: "Design Studio Paris",
    email: "hello@dsp.fr",
    country: "France",
    status: "Completed",
    notes: "One-off branding project",
  }).returning();
  
  const [client3] = await db.insert(clients).values({
    userId: user.id,
    name: "Startup Berlin",
    email: "founders@berlin.de",
    country: "Germany",
    status: "Lead",
    notes: "Met at conference",
  }).returning();

  // Create Invoices
  await db.insert(invoices).values([
    {
      userId: user.id,
      clientId: client1.id,
      invoiceNumber: "INV-2024-001",
      amount: 500000, // $5000.00
      currency: "USD",
      status: "Paid",
      dueDate: new Date("2024-10-15"),
      issuedAt: new Date("2024-10-01"),
      items: [{ description: "October Retainer", amount: 500000 }],
    },
    {
      userId: user.id,
      clientId: client1.id,
      invoiceNumber: "INV-2024-002",
      amount: 500000, // $5000.00
      currency: "USD",
      status: "Sent",
      dueDate: new Date("2024-11-15"),
      issuedAt: new Date("2024-11-01"),
      items: [{ description: "November Retainer", amount: 500000 }],
    },
    {
      userId: user.id,
      clientId: client2.id,
      invoiceNumber: "INV-FR-01",
      amount: 250000, // €2500.00 (stored as cents, currency handles symbol)
      currency: "EUR",
      status: "Overdue",
      dueDate: new Date("2024-09-01"),
      issuedAt: new Date("2024-08-15"),
      items: [{ description: "Logo Design", amount: 250000 }],
    }
  ]);

  // Create Trips
  await db.insert(trips).values([
    {
      userId: user.id,
      country: "Thailand",
      entryDate: new Date("2024-01-10"),
      exitDate: new Date("2024-03-10"),
      notes: "Chiang Mai coworking",
    },
    {
      userId: user.id,
      country: "Vietnam",
      entryDate: new Date("2024-03-10"),
      exitDate: new Date("2024-04-10"),
      notes: "Da Nang beach time",
    },
    {
      userId: user.id,
      country: "Japan",
      entryDate: new Date("2024-04-10"),
      exitDate: undefined, // Current trip
      notes: "Tokyo spring season",
    }
  ]);

  // Create Documents
  await db.insert(documents).values([
    {
      userId: user.id,
      name: "Passport.pdf",
      type: "Passport",
      expiryDate: new Date("2030-05-20"),
      fileUrl: "https://example.com/passport.pdf",
    },
    {
      userId: user.id,
      name: "Travel Insurance 2024",
      type: "Other",
      expiryDate: new Date("2024-12-31"),
      fileUrl: "https://example.com/insurance.pdf",
    }
  ]);

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
