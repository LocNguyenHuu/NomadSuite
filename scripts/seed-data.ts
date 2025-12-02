/**
 * Seed Script for NomadSuite - Generates realistic fake data
 * Run with: npx tsx scripts/seed-data.ts
 * 
 * This script populates the database with fake companies and data
 * while preserving existing user accounts.
 */

import { db } from '../server/db';
import { 
  clients, 
  invoices, 
  projects, 
  tasks, 
  trips, 
  expenses, 
  documents,
  clientNotes,
  users
} from '../shared/schema';
import { eq, sql } from 'drizzle-orm';

// Fake company data
const FAKE_CLIENTS = [
  // German companies
  { name: 'TechVenture GmbH', email: 'hello@techventure.de', country: 'DE', status: 'Active' as const },
  { name: 'BerlinSoft AG', email: 'info@berlinsoft.de', country: 'DE', status: 'Active' as const },
  { name: 'Munich Digital Solutions', email: 'contact@munichdigital.de', country: 'DE', status: 'Lead' as const },
  { name: 'Hamburg Innovations', email: 'team@hamburginnov.de', country: 'DE', status: 'Proposal' as const },
  // French companies
  { name: 'ParisWeb SARL', email: 'bonjour@parisweb.fr', country: 'FR', status: 'Active' as const },
  { name: 'Lyon Tech Studio', email: 'contact@lyontech.fr', country: 'FR', status: 'Active' as const },
  { name: 'Nice Digital Agency', email: 'hello@nicedigital.fr', country: 'FR', status: 'Lead' as const },
  // UK companies
  { name: 'London Creative Labs', email: 'info@londoncreative.co.uk', country: 'GB', status: 'Active' as const },
  { name: 'Manchester Tech Co', email: 'hello@manchestertech.co.uk', country: 'GB', status: 'Proposal' as const },
  { name: 'Edinburgh Software Ltd', email: 'team@edinburghsoft.co.uk', country: 'GB', status: 'Lead' as const },
  // US companies
  { name: 'Silicon Valley Startups Inc', email: 'contact@svstartups.com', country: 'US', status: 'Active' as const },
  { name: 'NYC Digital Agency', email: 'hello@nycdigital.com', country: 'US', status: 'Active' as const },
  { name: 'Austin Tech Hub', email: 'info@austintechhub.com', country: 'US', status: 'Proposal' as const },
  { name: 'Seattle Cloud Services', email: 'team@seattlecloud.com', country: 'US', status: 'Lead' as const },
  // Other European companies
  { name: 'Amsterdam Fintech BV', email: 'info@amsterdamfintech.nl', country: 'NL', status: 'Active' as const },
  { name: 'Barcelona Design Studio', email: 'hola@barcelonadesign.es', country: 'ES', status: 'Active' as const },
  { name: 'Vienna AI Labs', email: 'kontakt@viennaai.at', country: 'AT', status: 'Lead' as const },
  { name: 'Zurich Banking Tech', email: 'info@zurichbanking.ch', country: 'CH', status: 'Proposal' as const },
  // Asian companies
  { name: 'Tokyo Innovation Co', email: 'info@tokyoinnovation.jp', country: 'JP', status: 'Active' as const },
  { name: 'Singapore Tech Ventures', email: 'hello@sgventures.sg', country: 'SG', status: 'Lead' as const },
];

const PROJECT_NAMES = [
  'Website Redesign',
  'Mobile App Development',
  'Brand Identity',
  'E-commerce Platform',
  'API Integration',
  'Marketing Dashboard',
  'Customer Portal',
  'Data Analytics System',
  'CRM Implementation',
  'Cloud Migration',
];

const TASK_TEMPLATES = [
  { name: 'Requirements Analysis', priority: 'High' as const },
  { name: 'Design Mockups', priority: 'Medium' as const },
  { name: 'Frontend Development', priority: 'High' as const },
  { name: 'Backend Development', priority: 'High' as const },
  { name: 'Database Setup', priority: 'Medium' as const },
  { name: 'API Development', priority: 'High' as const },
  { name: 'Testing & QA', priority: 'Medium' as const },
  { name: 'Documentation', priority: 'Low' as const },
  { name: 'Client Review', priority: 'Medium' as const },
  { name: 'Deployment', priority: 'High' as const },
];

const EXPENSE_DATA = [
  { category: 'Travel' as const, description: 'Flight ticket', amount: 35000, place: 'Berlin Airport, Germany' },
  { category: 'Travel' as const, description: 'Train ticket', amount: 8500, place: 'Paris Gare du Nord, France' },
  { category: 'Accommodation' as const, description: 'Airbnb rental', amount: 120000, place: 'Lisbon, Portugal' },
  { category: 'Accommodation' as const, description: 'Hotel stay', amount: 18000, place: 'Barcelona, Spain' },
  { category: 'Other' as const, description: 'Monthly coworking pass', amount: 25000, place: 'WeWork Berlin, Germany' },
  { category: 'Other' as const, description: 'Coworking day pass', amount: 3500, place: 'Spaces Amsterdam, Netherlands' },
  { category: 'Software' as const, description: 'Figma subscription', amount: 1500, place: 'Online' },
  { category: 'Software' as const, description: 'Adobe Creative Cloud', amount: 5500, place: 'Online' },
  { category: 'Equipment' as const, description: 'Laptop charger', amount: 8000, place: 'Munich, Germany' },
  { category: 'Equipment' as const, description: 'Noise-canceling headphones', amount: 35000, place: 'Tokyo, Japan' },
  { category: 'Food & Dining' as const, description: 'Client dinner', amount: 12000, place: 'London, UK' },
  { category: 'Food & Dining' as const, description: 'Business lunch', amount: 4500, place: 'Paris, France' },
  { category: 'Communication' as const, description: 'Mobile data plan', amount: 3000, place: 'Thailand' },
  { category: 'Insurance' as const, description: 'Travel insurance', amount: 15000, place: 'Online' },
  { category: 'Office Supplies' as const, description: 'Notebook and pens', amount: 2500, place: 'Vienna, Austria' },
  { category: 'Marketing' as const, description: 'LinkedIn ads', amount: 20000, place: 'Online' },
  { category: 'Professional Services' as const, description: 'Accountant fee', amount: 30000, place: 'Online' },
  { category: 'Banking Fees' as const, description: 'Visa processing fee', amount: 8000, place: 'Thai Embassy, Berlin' },
  { category: 'Transportation' as const, description: 'Uber rides', amount: 4500, place: 'San Francisco, USA' },
  { category: 'Taxes' as const, description: 'Quarterly tax payment', amount: 45000, place: 'Online' },
  { category: 'Entertainment' as const, description: 'Conference ticket', amount: 35000, place: 'Amsterdam, Netherlands' },
];

const TRIP_DATA = [
  { country: 'DE', entryDate: new Date('2024-01-15'), exitDate: new Date('2024-03-10'), notes: 'Remote work from Berlin' },
  { country: 'PT', entryDate: new Date('2024-03-11'), exitDate: new Date('2024-04-20'), notes: 'Lisbon digital nomad hub' },
  { country: 'ES', entryDate: new Date('2024-04-21'), exitDate: new Date('2024-05-15'), notes: 'Barcelona coworking' },
  { country: 'FR', entryDate: new Date('2024-05-16'), exitDate: new Date('2024-06-30'), notes: 'Paris client meetings' },
  { country: 'NL', entryDate: new Date('2024-07-01'), exitDate: new Date('2024-08-15'), notes: 'Amsterdam summer' },
  { country: 'AT', entryDate: new Date('2024-08-16'), exitDate: new Date('2024-09-30'), notes: 'Vienna autumn' },
  { country: 'JP', entryDate: new Date('2024-10-01'), exitDate: new Date('2024-11-15'), notes: 'Tokyo conference' },
  { country: 'TH', entryDate: new Date('2024-11-16'), exitDate: null, notes: 'Currently in Thailand' },
];

const INVOICE_ITEMS = [
  { description: 'UX/UI Design Services', quantity: 40, unitPrice: 12500 },
  { description: 'Frontend Development', quantity: 60, unitPrice: 15000 },
  { description: 'Backend Development', quantity: 80, unitPrice: 17500 },
  { description: 'Project Management', quantity: 20, unitPrice: 10000 },
  { description: 'Consulting Services', quantity: 10, unitPrice: 20000 },
  { description: 'Code Review', quantity: 8, unitPrice: 15000 },
  { description: 'Technical Documentation', quantity: 15, unitPrice: 8000 },
  { description: 'Training Session', quantity: 4, unitPrice: 25000 },
  { description: 'Maintenance & Support', quantity: 10, unitPrice: 12000 },
  { description: 'API Integration', quantity: 30, unitPrice: 14000 },
];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateInvoiceNumber(year: number, counter: number): string {
  return `NS-${year}-${String(counter).padStart(4, '0')}`;
}

async function seedData() {
  console.log('🌱 Starting database seed...');
  
  // Get all users to assign data to
  const allUsers = await db.select().from(users);
  
  if (allUsers.length === 0) {
    console.log('❌ No users found. Please create users first.');
    return;
  }
  
  console.log(`Found ${allUsers.length} users`);
  
  // Clear existing data (except users, workspaces, sessions)
  console.log('🧹 Clearing existing data...');
  await db.delete(clientNotes);
  await db.delete(tasks);
  await db.delete(expenses);
  await db.delete(invoices);
  await db.delete(projects);
  await db.delete(documents);
  await db.delete(trips);
  await db.delete(clients);
  console.log('✅ Cleared existing data');
  
  // Create clients for each user
  console.log('👥 Creating clients...');
  const createdClients: { id: number; userId: number; name: string }[] = [];
  
  for (const user of allUsers) {
    // Each user gets 4-6 random clients
    const numClients = 4 + Math.floor(Math.random() * 3);
    const shuffledClients = [...FAKE_CLIENTS].sort(() => Math.random() - 0.5).slice(0, numClients);
    
    for (const clientData of shuffledClients) {
      const [client] = await db.insert(clients).values({
        userId: user.id,
        name: clientData.name,
        email: clientData.email,
        country: clientData.country,
        status: clientData.status,
        notes: `${clientData.status} client from ${clientData.country}`,
        lastInteractionDate: randomDate(new Date('2024-06-01'), new Date()),
        nextActionDate: clientData.status === 'Lead' || clientData.status === 'Proposal' 
          ? randomDate(new Date(), new Date('2025-02-28'))
          : null,
        nextActionDescription: clientData.status === 'Lead' 
          ? 'Follow up on proposal'
          : clientData.status === 'Proposal' 
            ? 'Send revised quote'
            : null,
      }).returning();
      
      createdClients.push({ id: client.id, userId: user.id, name: client.name });
    }
  }
  console.log(`✅ Created ${createdClients.length} clients`);
  
  // Create projects and tasks
  console.log('📁 Creating projects and tasks...');
  const createdProjects: { id: number; userId: number; clientId: number | null }[] = [];
  
  for (const user of allUsers) {
    const userClients = createdClients.filter(c => c.userId === user.id);
    
    // Create 3-5 projects per user
    const numProjects = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numProjects; i++) {
      const projectName = PROJECT_NAMES[i % PROJECT_NAMES.length];
      const client = userClients[i % userClients.length];
      const statuses = ['Planning', 'In Progress', 'In Progress', 'On Hold', 'Completed'] as const;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const startDate = randomDate(new Date('2024-01-01'), new Date('2024-10-01'));
      const endDate = new Date(startDate.getTime() + (30 + Math.random() * 90) * 24 * 60 * 60 * 1000);
      
      const [project] = await db.insert(projects).values({
        userId: user.id,
        clientId: client?.id || null,
        name: `${client?.name.split(' ')[0] || 'Internal'} - ${projectName}`,
        description: `${projectName} project for ${client?.name || 'internal use'}`,
        status,
        budget: (5000 + Math.floor(Math.random() * 50000)) * 100,
        currency: ['USD', 'EUR', 'GBP'][Math.floor(Math.random() * 3)],
        startDate,
        endDate: status === 'Completed' || status === 'In Progress' ? endDate : null,
      }).returning();
      
      createdProjects.push({ id: project.id, userId: user.id, clientId: client?.id || null });
      
      // Create 4-8 tasks per project
      const numTasks = 4 + Math.floor(Math.random() * 5);
      const shuffledTasks = [...TASK_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, numTasks);
      
      for (let j = 0; j < shuffledTasks.length; j++) {
        const taskTemplate = shuffledTasks[j];
        const taskStatuses = ['To Do', 'In Progress', 'Done'] as const;
        let taskStatus: typeof taskStatuses[number];
        
        if (status === 'Completed') {
          taskStatus = 'Done';
        } else if (status === 'Planning') {
          taskStatus = 'To Do';
        } else {
          taskStatus = taskStatuses[Math.floor(Math.random() * taskStatuses.length)];
        }
        
        const dueDate = new Date(startDate.getTime() + (j + 1) * 7 * 24 * 60 * 60 * 1000);
        
        await db.insert(tasks).values({
          projectId: project.id,
          userId: user.id,
          name: taskTemplate.name,
          description: `${taskTemplate.name} for ${projectName}`,
          status: taskStatus,
          priority: taskTemplate.priority,
          dueDate,
          completedAt: taskStatus === 'Done' ? randomDate(startDate, new Date()) : null,
        });
      }
    }
  }
  console.log(`✅ Created ${createdProjects.length} projects with tasks`);
  
  // Create invoices
  console.log('💰 Creating invoices...');
  let totalInvoices = 0;
  
  for (const user of allUsers) {
    const userClients = createdClients.filter(c => c.userId === user.id);
    const userProjects = createdProjects.filter(p => p.userId === user.id);
    let invoiceCounter = 1;
    
    // Create 8-15 invoices per user
    const numInvoices = 8 + Math.floor(Math.random() * 8);
    
    for (let i = 0; i < numInvoices; i++) {
      const client = userClients[i % userClients.length];
      const project = userProjects.find(p => p.clientId === client?.id);
      const statuses = ['Draft', 'Sent', 'Sent', 'Paid', 'Paid', 'Paid', 'Overdue'] as const;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Generate 1-3 line items
      const numItems = 1 + Math.floor(Math.random() * 3);
      const items = [];
      let totalAmount = 0;
      
      for (let j = 0; j < numItems; j++) {
        const item = randomItem(INVOICE_ITEMS);
        const quantity = Math.ceil(item.quantity * (0.5 + Math.random()));
        const subtotal = quantity * item.unitPrice;
        totalAmount += subtotal;
        items.push({
          description: item.description,
          quantity,
          unitPrice: item.unitPrice,
          subtotal,
        });
      }
      
      const issuedDate = randomDate(new Date('2024-01-01'), new Date());
      const dueDate = new Date(issuedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const year = issuedDate.getFullYear();
      
      await db.insert(invoices).values({
        userId: user.id,
        clientId: client.id,
        projectId: project?.id || null,
        invoiceNumber: generateInvoiceNumber(year, invoiceCounter++),
        amount: totalAmount,
        currency: ['USD', 'EUR', 'GBP'][Math.floor(Math.random() * 3)],
        status,
        dueDate,
        issuedAt: issuedDate,
        items,
        tax: Math.round(totalAmount * 0.19),
        country: client?.id ? createdClients.find(c => c.id === client.id)?.name.includes('GmbH') ? 'DE' : 'US' : 'US',
        language: 'en',
      });
      
      totalInvoices++;
    }
  }
  console.log(`✅ Created ${totalInvoices} invoices`);
  
  // Create trips
  console.log('✈️ Creating trips...');
  for (const user of allUsers) {
    for (const tripData of TRIP_DATA) {
      await db.insert(trips).values({
        userId: user.id,
        country: tripData.country,
        entryDate: tripData.entryDate,
        exitDate: tripData.exitDate,
        notes: tripData.notes,
      });
    }
  }
  console.log(`✅ Created ${allUsers.length * TRIP_DATA.length} trips`);
  
  // Create expenses
  console.log('💳 Creating expenses...');
  let totalExpenses = 0;
  
  for (const user of allUsers) {
    const userClients = createdClients.filter(c => c.userId === user.id);
    const userProjects = createdProjects.filter(p => p.userId === user.id);
    
    // Create 15-25 expenses per user
    const numExpenses = 15 + Math.floor(Math.random() * 11);
    
    for (let i = 0; i < numExpenses; i++) {
      const expenseData = EXPENSE_DATA[i % EXPENSE_DATA.length];
      const date = randomDate(new Date('2024-01-01'), new Date());
      
      // Randomly associate with client/project
      const linkedClient = Math.random() > 0.6 ? randomItem(userClients) : null;
      const linkedProject = linkedClient && Math.random() > 0.5 
        ? userProjects.find(p => p.clientId === linkedClient.id) 
        : null;
      
      await db.insert(expenses).values({
        userId: user.id,
        clientId: linkedClient?.id || null,
        projectId: linkedProject?.id || null,
        date,
        amount: expenseData.amount + Math.floor(Math.random() * 5000),
        currency: ['USD', 'EUR', 'GBP'][Math.floor(Math.random() * 3)],
        category: expenseData.category,
        description: expenseData.description,
        geoPlace: expenseData.place,
      });
      
      totalExpenses++;
    }
  }
  console.log(`✅ Created ${totalExpenses} expenses`);
  
  // Create documents
  console.log('📄 Creating documents...');
  const documentTypes = [
    { type: 'Passport', name: 'Passport - USA' },
    { type: 'Visa', name: 'Schengen Visa' },
    { type: 'Visa', name: 'Japan Tourist Visa' },
    { type: 'Contract', name: 'Client Agreement - TechVenture' },
    { type: 'Contract', name: 'NDA - London Creative Labs' },
    { type: 'Tax Document', name: 'Tax Return 2023' },
    { type: 'Insurance', name: 'Travel Insurance Policy' },
    { type: 'Other', name: 'Work Permit Application' },
  ];
  
  for (const user of allUsers) {
    for (const doc of documentTypes) {
      const expiryDate = doc.type === 'Passport' || doc.type === 'Visa' || doc.type === 'Insurance'
        ? randomDate(new Date('2025-01-01'), new Date('2027-12-31'))
        : null;
      
      await db.insert(documents).values({
        userId: user.id,
        name: doc.name,
        type: doc.type,
        expiryDate,
        fileUrl: `https://storage.example.com/docs/${user.id}/${doc.type.toLowerCase().replace(' ', '-')}.pdf`,
      });
    }
  }
  console.log(`✅ Created ${allUsers.length * documentTypes.length} documents`);
  
  // Create client notes
  console.log('📝 Creating client notes...');
  const noteTypes = ['Call', 'Email', 'Meeting', 'Note'] as const;
  const noteTemplates = [
    'Discussed project requirements and timeline',
    'Sent proposal for review',
    'Follow-up call scheduled for next week',
    'Client approved the design mockups',
    'Invoice payment confirmed',
    'Requested revisions to the initial draft',
    'Kickoff meeting went well',
    'Provided project status update',
  ];
  
  for (const client of createdClients) {
    // 2-4 notes per client
    const numNotes = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numNotes; i++) {
      await db.insert(clientNotes).values({
        clientId: client.id,
        userId: client.userId,
        content: randomItem(noteTemplates),
        type: randomItem(noteTypes),
        date: randomDate(new Date('2024-01-01'), new Date()),
      });
    }
  }
  console.log(`✅ Created client notes`);
  
  console.log('\n🎉 Database seeding complete!');
  console.log('Summary:');
  console.log(`  - Users: ${allUsers.length} (preserved)`);
  console.log(`  - Clients: ${createdClients.length}`);
  console.log(`  - Projects: ${createdProjects.length}`);
  console.log(`  - Invoices: ${totalInvoices}`);
  console.log(`  - Expenses: ${totalExpenses}`);
  console.log(`  - Trips: ${allUsers.length * TRIP_DATA.length}`);
  console.log(`  - Documents: ${allUsers.length * documentTypes.length}`);
}

// Run the seed
seedData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
