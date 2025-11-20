import { db } from './db';
import { workspaces, users, clients, clientNotes, invoices, trips, documents, jurisdictionRules } from '@shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function seedTestData() {
  console.log('🌱 Starting comprehensive test data seeding...\n');
  
  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Clearing existing data...');
  await db.delete(documents);
  await db.delete(trips);
  await db.delete(clientNotes);
  await db.delete(invoices);
  await db.delete(clients);
  await db.delete(users);
  await db.delete(workspaces);
  console.log('✓ Cleared existing data\n');
  
  // Seed Jurisdiction Rules
  console.log('📋 Seeding jurisdiction rules...');
  const jurisdictionData = [
    {
      country: 'DE',
      countryName: 'Germany',
      supportedLanguages: ['de', 'en'],
      defaultLanguage: 'de',
      defaultCurrency: 'EUR',
      requiresVatId: true,
      requiresCustomerVatId: true,
      supportsReverseCharge: true,
      archivingYears: 10,
      taxRate: '19',
      languageNote: 'Invoices must be in German or English',
      complianceNotes: 'German invoices must include VAT ID, archiving for 10 years'
    },
    {
      country: 'FR',
      countryName: 'France',
      supportedLanguages: ['fr', 'en'],
      defaultLanguage: 'fr',
      defaultCurrency: 'EUR',
      requiresVatId: true,
      requiresCustomerVatId: true,
      supportsReverseCharge: true,
      archivingYears: 6,
      taxRate: '20',
      languageNote: 'Invoices should be in French',
      complianceNotes: 'French invoices require VAT ID for B2B transactions'
    },
    {
      country: 'GB',
      countryName: 'United Kingdom',
      supportedLanguages: ['en'],
      defaultLanguage: 'en',
      defaultCurrency: 'GBP',
      requiresVatId: true,
      requiresCustomerVatId: false,
      supportsReverseCharge: false,
      archivingYears: 6,
      taxRate: '20',
      complianceNotes: 'UK invoices must comply with HMRC requirements'
    },
    {
      country: 'US',
      countryName: 'United States',
      supportedLanguages: ['en'],
      defaultLanguage: 'en',
      defaultCurrency: 'USD',
      requiresVatId: false,
      requiresCustomerVatId: false,
      supportsReverseCharge: false,
      archivingYears: 7,
      complianceNotes: 'US invoices follow standard commercial invoice format'
    },
    {
      country: 'CA',
      countryName: 'Canada',
      supportedLanguages: ['en', 'fr'],
      defaultLanguage: 'en',
      defaultCurrency: 'CAD',
      requiresVatId: false,
      requiresCustomerVatId: false,
      supportsReverseCharge: false,
      archivingYears: 7,
      taxRate: '5',
      complianceNotes: 'GST/HST must be specified for Canadian transactions'
    }
  ];
  
  for (const rule of jurisdictionData) {
    await db.insert(jurisdictionRules).values(rule).onConflictDoNothing();
  }
  console.log(`✓ Seeded ${jurisdictionData.length} jurisdiction rules\n`);
  
  // Create Workspaces
  console.log('🏢 Creating workspaces...');
  const [workspace1] = await db.insert(workspaces).values({
    name: 'Freelancer Pro Workspace',
    defaultCurrency: 'EUR',
    defaultTaxCountry: 'DE',
    plan: 'pro'
  }).returning();
  
  const [workspace2] = await db.insert(workspaces).values({
    name: 'Digital Nomad Studio',
    defaultCurrency: 'USD',
    defaultTaxCountry: 'US',
    plan: 'premium'
  }).returning();
  
  const [workspace3] = await db.insert(workspaces).values({
    name: 'Startup Workspace',
    defaultCurrency: 'GBP',
    defaultTaxCountry: 'GB',
    plan: 'free'
  }).returning();
  
  console.log(`✓ Created 3 workspaces\n`);
  
  // Create Users with different roles
  console.log('👥 Creating users...');
  const [admin] = await db.insert(users).values({
    workspaceId: workspace1.id,
    username: 'admin',
    password: await hashPassword('password'),
    name: 'Alex Admin',
    email: 'alex@nomadsuite.com',
    homeCountry: 'DE',
    currentCountry: 'DE',
    role: 'admin',
    businessName: 'Freelance Consulting GmbH',
    businessAddress: 'Friedrichstraße 123, 10117 Berlin, Germany',
    vatId: 'DE123456789',
    taxRegime: 'standard'
  }).returning();
  
  const [user1] = await db.insert(users).values({
    workspaceId: workspace1.id,
    username: 'sarah',
    password: await hashPassword('password'),
    name: 'Sarah Designer',
    email: 'sarah@nomadsuite.com',
    homeCountry: 'US',
    currentCountry: 'PT',
    role: 'user',
    businessName: 'Sarah Smith Design',
    businessAddress: '123 Main St, San Francisco, CA 94105, USA',
    vatId: null,
    taxRegime: 'standard'
  }).returning();
  
  const [user2] = await db.insert(users).values({
    workspaceId: workspace2.id,
    username: 'marco',
    password: await hashPassword('password'),
    name: 'Marco Developer',
    email: 'marco@nomadsuite.com',
    homeCountry: 'IT',
    currentCountry: 'ES',
    role: 'admin',
    businessName: 'Marco Rossi Tech',
    businessAddress: 'Via Roma 45, 00100 Roma, Italy',
    vatId: 'IT98765432101',
    taxRegime: 'standard'
  }).returning();
  
  const [user3] = await db.insert(users).values({
    workspaceId: workspace2.id,
    username: 'emma',
    password: await hashPassword('password'),
    name: 'Emma Consultant',
    email: 'emma@nomadsuite.com',
    homeCountry: 'GB',
    currentCountry: 'TH',
    role: 'user',
    businessName: 'Emma Jones Consulting',
    businessAddress: '10 Downing Street, London SW1A 2AA, UK',
    vatId: 'GB123456789',
    taxRegime: 'standard'
  }).returning();
  
  const [user4] = await db.insert(users).values({
    workspaceId: workspace3.id,
    username: 'lisa',
    password: await hashPassword('password'),
    name: 'Lisa Writer',
    email: 'lisa@nomadsuite.com',
    homeCountry: 'CA',
    currentCountry: 'MX',
    role: 'user',
    businessName: 'Lisa Chen Writing Services',
    businessAddress: '456 Maple Ave, Toronto, ON M5H 2N2, Canada',
    vatId: null,
    taxRegime: 'standard'
  }).returning();
  
  const allUsers = [admin, user1, user2, user3, user4];
  console.log(`✓ Created ${allUsers.length} users (2 admins, 3 regular users)\n`);
  
  // Helper function to create data for each user
  async function seedUserData(user: typeof admin, userIndex: number) {
    console.log(`📦 Seeding data for ${user.name}...`);
    
    // Create Clients
    const clientsData = [
      {
        userId: user.id,
        name: 'TechStart GmbH',
        email: 'contact@techstart.de',
        country: 'DE',
        status: 'active',
        notes: 'Long-term client, monthly retainer',
        lastInteractionDate: new Date('2025-11-15'),
        nextActionDate: new Date('2025-12-01'),
        nextActionDescription: 'Quarterly review meeting'
      },
      {
        userId: user.id,
        name: 'Innovation Labs SARL',
        email: 'hello@innovationlabs.fr',
        country: 'FR',
        status: 'active',
        notes: 'Project-based work',
        lastInteractionDate: new Date('2025-11-10'),
        nextActionDate: new Date('2025-11-28'),
        nextActionDescription: 'Project proposal discussion'
      },
      {
        userId: user.id,
        name: 'Digital Solutions Ltd',
        email: 'info@digitalsolutions.co.uk',
        country: 'GB',
        status: 'lead',
        notes: 'Interested in web development',
        nextActionDate: new Date('2025-11-25'),
        nextActionDescription: 'Follow up on initial inquiry'
      },
      {
        userId: user.id,
        name: 'Pacific Ventures LLC',
        email: 'contact@pacificventures.com',
        country: 'US',
        status: 'proposal',
        notes: 'Sent proposal last week',
        nextActionDate: new Date('2025-11-30'),
        nextActionDescription: 'Follow up on proposal'
      }
    ];
    
    const createdClients = [];
    for (const clientData of clientsData) {
      const [client] = await db.insert(clients).values(clientData).returning();
      createdClients.push(client);
    }
    console.log(`  ✓ Created ${createdClients.length} clients`);
    
    // Create Client Notes
    const notesData = [
      {
        clientId: createdClients[0].id,
        userId: user.id,
        content: 'Initial meeting went very well. They are interested in a 6-month contract.',
        type: 'Meeting',
        date: new Date('2025-10-15')
      },
      {
        clientId: createdClients[0].id,
        userId: user.id,
        content: 'Sent project proposal via email',
        type: 'Email',
        date: new Date('2025-10-20')
      },
      {
        clientId: createdClients[1].id,
        userId: user.id,
        content: 'Phone call to discuss project scope and timeline',
        type: 'Call',
        date: new Date('2025-11-05')
      },
      {
        clientId: createdClients[2].id,
        userId: user.id,
        content: 'First contact - warm lead from referral',
        type: 'Note',
        date: new Date('2025-11-18')
      }
    ];
    
    for (const note of notesData) {
      await db.insert(clientNotes).values(note);
    }
    console.log(`  ✓ Created ${notesData.length} client notes`);
    
    // Create Invoices
    const invoicesData = [
      {
        userId: user.id,
        clientId: createdClients[0].id,
        invoiceNumber: `INV-${userIndex + 1}-2025-001`,
        amount: 5950,
        currency: 'EUR',
        status: 'paid',
        dueDate: new Date('2025-10-31'),
        items: [
          { description: 'Web Development - October', amount: 5950 }
        ],
        country: 'DE',
        language: 'de',
        exchangeRate: '1.0',
        complianceChecked: true
      },
      {
        userId: user.id,
        clientId: createdClients[1].id,
        invoiceNumber: `INV-${userIndex + 1}-2025-002`,
        amount: 7200,
        currency: 'EUR',
        status: 'sent',
        dueDate: new Date('2025-11-30'),
        items: [
          { description: 'Consulting Services (48 hours @ €150/hr)', amount: 7200 }
        ],
        country: 'FR',
        language: 'fr',
        exchangeRate: '1.0',
        reverseCharge: true,
        customerVatId: 'FR12345678901',
        complianceChecked: true
      },
      {
        userId: user.id,
        clientId: createdClients[2].id,
        invoiceNumber: `INV-${userIndex + 1}-2025-003`,
        amount: 4500,
        currency: 'GBP',
        status: 'draft',
        dueDate: new Date('2025-12-15'),
        items: [
          { description: 'UI/UX Design Services', amount: 4500 }
        ],
        country: 'GB',
        language: 'en',
        exchangeRate: '1.27',
        complianceChecked: false
      },
      {
        userId: user.id,
        clientId: createdClients[0].id,
        invoiceNumber: `INV-${userIndex + 1}-2025-004`,
        amount: 3200,
        currency: 'EUR',
        status: 'overdue',
        dueDate: new Date('2025-11-10'),
        items: [
          { description: 'Monthly Retainer - November', amount: 3200 }
        ],
        country: 'DE',
        language: 'de',
        exchangeRate: '1.0',
        complianceChecked: true
      }
    ];
    
    for (const invoice of invoicesData) {
      await db.insert(invoices).values(invoice);
    }
    console.log(`  ✓ Created ${invoicesData.length} invoices`);
    
    // Create Trips
    const tripsData = [
      {
        userId: user.id,
        country: 'DE',
        entryDate: new Date('2025-01-15'),
        exitDate: new Date('2025-03-20'),
        notes: 'Client meetings and coworking in Berlin'
      },
      {
        userId: user.id,
        country: 'FR',
        entryDate: new Date('2025-03-21'),
        exitDate: new Date('2025-05-10'),
        notes: 'Working remotely from Paris'
      },
      {
        userId: user.id,
        country: 'ES',
        entryDate: new Date('2025-05-11'),
        exitDate: new Date('2025-07-01'),
        notes: 'Summer work in Barcelona'
      },
      {
        userId: user.id,
        country: 'PT',
        entryDate: new Date('2025-07-02'),
        exitDate: new Date('2025-09-15'),
        notes: 'Digital nomad base in Lisbon'
      },
      {
        userId: user.id,
        country: user.currentCountry,
        entryDate: new Date('2025-11-01'),
        exitDate: null,
        notes: 'Current location'
      }
    ];
    
    for (const trip of tripsData) {
      await db.insert(trips).values(trip);
    }
    console.log(`  ✓ Created ${tripsData.length} trips`);
    
    // Create Documents
    const documentsData = [
      {
        userId: user.id,
        name: 'Passport',
        type: 'Passport',
        expiryDate: new Date('2030-06-15'),
        fileUrl: 'https://example.com/documents/passport.pdf'
      },
      {
        userId: user.id,
        name: 'Schengen Visa',
        type: 'Visa',
        expiryDate: new Date('2026-12-31'),
        fileUrl: 'https://example.com/documents/schengen-visa.pdf'
      },
      {
        userId: user.id,
        name: 'Client Contract - TechStart',
        type: 'Contract',
        expiryDate: new Date('2026-12-31'),
        fileUrl: 'https://example.com/documents/contract-techstart.pdf'
      },
      {
        userId: user.id,
        name: 'Tax Certificate',
        type: 'Other',
        expiryDate: new Date('2025-12-31'),
        fileUrl: 'https://example.com/documents/tax-certificate.pdf'
      }
    ];
    
    for (const doc of documentsData) {
      await db.insert(documents).values(doc);
    }
    console.log(`  ✓ Created ${documentsData.length} documents\n`);
  }
  
  // Seed data for all users
  for (let i = 0; i < allUsers.length; i++) {
    await seedUserData(allUsers[i], i);
  }
  
  console.log('✅ Test data seeding complete!\n');
  console.log('📊 Summary:');
  console.log(`   • ${allUsers.length} users (2 admins, 3 regular users)`);
  console.log(`   • ${allUsers.length * 4} clients`);
  console.log(`   • ${allUsers.length * 4} client notes`);
  console.log(`   • ${allUsers.length * 4} invoices`);
  console.log(`   • ${allUsers.length * 5} trips`);
  console.log(`   • ${allUsers.length * 4} documents`);
  console.log('\n🔑 Test Credentials:');
  console.log('   • admin / password (Admin - Workspace 1)');
  console.log('   • sarah / password (User - Workspace 1)');
  console.log('   • marco / password (Admin - Workspace 2)');
  console.log('   • emma / password (User - Workspace 2)');
  console.log('   • lisa / password (User - Workspace 3)');
}

seedTestData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding test data:', error);
    process.exit(1);
  });
