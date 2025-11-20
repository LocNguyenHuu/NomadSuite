import { db } from './db';
import { clients, invoices, trips } from '@shared/schema';

async function seedTestData() {
  console.log('Seeding test data for dashboard...');
  
  // Get the first user (admin) to assign test data to
  const users = await db.query.users.findMany({ limit: 1 });
  if (users.length === 0) {
    console.log('No users found. Please create a user first.');
    return;
  }
  
  const userId = users[0].id;
  const workspaceId = users[0].workspaceId!;
  console.log(`Using user ID: ${userId}, workspace ID: ${workspaceId}`);
  
  // Seed diverse clients from different countries
  const testClients = [
    {
      userId,
      name: 'TechStart GmbH',
      email: 'contact@techstart.de',
      country: 'DE',
      status: 'active',
      nextActionDate: new Date('2025-12-01'),
      nextActionNote: 'Quarterly review meeting'
    },
    {
      userId,
      name: 'Innovation Labs SARL',
      email: 'hello@innovationlabs.fr',
      country: 'FR',
      status: 'active',
      nextActionDate: new Date('2025-11-28'),
      nextActionNote: 'Project proposal discussion'
    },
    {
      userId,
      name: 'Digital Solutions Ltd',
      email: 'info@digitalsolutions.co.uk',
      country: 'GB',
      status: 'lead',
      nextActionDate: new Date('2025-11-25'),
      nextActionNote: 'Follow up on initial inquiry'
    },
    {
      userId,
      name: 'Maple Tech Inc',
      email: 'team@mapletech.ca',
      country: 'CA',
      status: 'proposal',
      nextActionDate: new Date('2025-11-30'),
      nextActionNote: 'Send updated proposal'
    },
    {
      userId,
      name: 'Pacific Ventures LLC',
      email: 'contact@pacificventures.com',
      country: 'US',
      status: 'active',
      nextActionDate: new Date('2025-12-05'),
      nextActionNote: 'Monthly sync call'
    },
    {
      userId,
      name: 'Nordic Design Studio',
      email: 'hello@nordicdesign.no',
      country: 'NO',
      status: 'active',
      nextActionDate: new Date('2025-12-10'),
      nextActionNote: 'Review design deliverables'
    },
    {
      userId,
      name: 'Mediterranean Exports',
      email: 'sales@medexports.es',
      country: 'ES',
      status: 'lead',
      nextActionDate: new Date('2025-11-27'),
      nextActionNote: 'Initial discovery call'
    },
    {
      userId,
      name: 'Singapore Digital',
      email: 'business@sgdigital.sg',
      country: 'SG',
      status: 'completed',
      nextActionDate: null,
      nextActionNote: null
    }
  ];
  
  console.log('Creating clients...');
  const createdClients = [];
  for (const client of testClients) {
    const [created] = await db.insert(clients).values(client).returning();
    createdClients.push(created);
    console.log(`✓ Created client: ${created.name}`);
  }
  
  // Seed diverse invoices with different statuses and amounts
  console.log('Creating invoices...');
  const testInvoices = [
    {
      userId,
      clientId: createdClients[0].id,
      invoiceNumber: 'INV-2025-001',
      amount: 5950,
      dueDate: new Date('2025-10-31'),
      status: 'paid',
      items: [
        { description: 'Web Development - October', amount: 5950 }
      ],
      currency: 'EUR',
      country: 'DE',
      language: 'de',
      exchangeRate: '1.0',
      complianceChecked: true
    },
    {
      userId,
      clientId: createdClients[1].id,
      invoiceNumber: 'INV-2025-002',
      amount: 7200,
      dueDate: new Date('2025-11-15'),
      status: 'paid',
      items: [
        { description: 'Consulting Services (40 hours @ €150/hr)', amount: 7200 }
      ],
      currency: 'EUR',
      country: 'FR',
      language: 'fr',
      exchangeRate: '1.0',
      reverseCharge: true,
      complianceChecked: true
    },
    {
      userId,
      clientId: createdClients[2].id,
      invoiceNumber: 'INV-2025-003',
      amount: 5400,
      dueDate: new Date('2025-11-30'),
      status: 'sent',
      items: [
        { description: 'UI/UX Design Services', amount: 5400 }
      ],
      currency: 'GBP',
      country: 'GB',
      language: 'en',
      exchangeRate: '1.27',
      complianceChecked: true
    },
    {
      userId,
      clientId: createdClients[3].id,
      invoiceNumber: 'INV-2025-004',
      amount: 8400,
      dueDate: new Date('2025-11-20'),
      status: 'overdue',
      items: [
        { description: 'Mobile App Development', amount: 8400 }
      ],
      currency: 'CAD',
      country: 'CA',
      language: 'en',
      exchangeRate: '0.73',
      complianceChecked: true
    },
    {
      userId,
      clientId: createdClients[4].id,
      invoiceNumber: 'INV-2025-005',
      amount: 7200,
      dueDate: new Date('2025-12-15'),
      status: 'draft',
      items: [
        { description: 'API Integration (60 hours @ $120/hr)', amount: 7200 }
      ],
      currency: 'USD',
      country: 'US',
      language: 'en',
      exchangeRate: '1.0',
      complianceChecked: true
    },
    {
      userId,
      clientId: createdClients[0].id,
      invoiceNumber: 'INV-2025-006',
      amount: 4760,
      dueDate: new Date('2025-12-18'),
      status: 'sent',
      items: [
        { description: 'Monthly Retainer - November', amount: 4760 }
      ],
      currency: 'EUR',
      country: 'DE',
      language: 'de',
      exchangeRate: '1.0',
      complianceChecked: true
    },
    {
      userId,
      clientId: createdClients[5].id,
      invoiceNumber: 'INV-2025-007',
      amount: 4375,
      dueDate: new Date('2025-09-30'),
      status: 'paid',
      items: [
        { description: 'Brand Identity Design', amount: 4375 }
      ],
      currency: 'EUR',
      country: 'NO',
      language: 'en',
      exchangeRate: '0.09',
      complianceChecked: false
    },
    {
      userId,
      clientId: createdClients[4].id,
      invoiceNumber: 'INV-2025-008',
      amount: 12000,
      dueDate: new Date('2025-09-15'),
      status: 'paid',
      items: [
        { description: 'E-commerce Platform Development', amount: 12000 }
      ],
      currency: 'USD',
      country: 'US',
      language: 'en',
      exchangeRate: '1.0',
      complianceChecked: true
    }
  ];
  
  for (const invoice of testInvoices) {
    await db.insert(invoices).values(invoice);
    console.log(`✓ Created invoice: ${invoice.invoiceNumber} - ${invoice.status}`);
  }
  
  // Seed trips for travel tracking
  console.log('Creating trips...');
  const testTrips = [
    {
      userId,
      country: 'DE',
      entryDate: new Date('2025-01-15'),
      exitDate: new Date('2025-03-20'),
      purpose: 'Client meetings and coworking'
    },
    {
      userId,
      country: 'FR',
      entryDate: new Date('2025-03-21'),
      exitDate: new Date('2025-05-10'),
      purpose: 'Working remotely from Paris'
    },
    {
      userId,
      country: 'ES',
      entryDate: new Date('2025-05-11'),
      exitDate: new Date('2025-07-01'),
      purpose: 'Summer work in Barcelona'
    },
    {
      userId,
      country: 'PT',
      entryDate: new Date('2025-07-02'),
      exitDate: new Date('2025-09-15'),
      purpose: 'Digital nomad base in Lisbon'
    },
    {
      userId,
      country: 'GB',
      entryDate: new Date('2025-09-16'),
      exitDate: new Date('2025-10-31'),
      purpose: 'Client project in London'
    },
    {
      userId,
      country: 'DE',
      entryDate: new Date('2025-11-01'),
      exitDate: null,
      purpose: 'Current location - Berlin hub'
    }
  ];
  
  for (const trip of testTrips) {
    await db.insert(trips).values(trip);
    console.log(`✓ Created trip: ${trip.country} (${trip.entryDate.toISOString().split('T')[0]} - ${trip.exitDate?.toISOString().split('T')[0] || 'ongoing'})`);
  }
  
  console.log('\n✓ Test data seeding complete!');
  console.log(`Created ${createdClients.length} clients, ${testInvoices.length} invoices, and ${testTrips.length} trips`);
}

seedTestData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding test data:', error);
    process.exit(1);
  });
