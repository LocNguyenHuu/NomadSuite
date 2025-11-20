import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Status = 'Active' | 'Lead' | 'Proposal' | 'Completed';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export interface Client {
  id: string;
  name: string;
  email: string;
  country: string;
  status: Status;
  notes: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  issuedAt: string;
  items: { description: string; amount: number }[];
}

export interface Trip {
  id: string;
  country: string;
  entryDate: string;
  exitDate?: string;
  notes: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'Passport' | 'Visa' | 'Contract' | 'Other';
  expiryDate?: string;
  url: string;
}

interface AppState {
  clients: Client[];
  invoices: Invoice[];
  trips: Trip[];
  documents: Document[];
  user: {
    name: string;
    homeCountry: string;
    currentCountry: string;
  };
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'issuedAt'>) => void;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  addDocument: (doc: Omit<Document, 'id'>) => void;
}

// Mock Data
const initialClients: Client[] = [
  { id: '1', name: 'TechFlow Systems', email: 'contact@techflow.com', country: 'USA', status: 'Active', notes: 'Retainer contract', createdAt: '2024-01-15' },
  { id: '2', name: 'DesignStudio Berlin', email: 'hello@ds-berlin.de', country: 'Germany', status: 'Active', notes: 'Website redesign', createdAt: '2024-02-10' },
  { id: '3', name: 'Nomad List Co', email: 'admin@nomad.com', country: 'Singapore', status: 'Proposal', notes: 'Pending approval', createdAt: '2024-03-05' },
  { id: '4', name: 'Green Earth NGO', email: 'info@green.org', country: 'UK', status: 'Completed', notes: 'Annual report', createdAt: '2023-11-20' },
];

const initialInvoices: Invoice[] = [
  { id: 'INV-001', clientId: '1', clientName: 'TechFlow Systems', amount: 2500, currency: 'USD', status: 'Paid', dueDate: '2024-02-01', issuedAt: '2024-01-15', items: [{ description: 'Jan Retainer', amount: 2500 }] },
  { id: 'INV-002', clientId: '1', clientName: 'TechFlow Systems', amount: 2500, currency: 'USD', status: 'Sent', dueDate: '2024-03-01', issuedAt: '2024-02-15', items: [{ description: 'Feb Retainer', amount: 2500 }] },
  { id: 'INV-003', clientId: '2', clientName: 'DesignStudio Berlin', amount: 4500, currency: 'EUR', status: 'Overdue', dueDate: '2024-02-20', issuedAt: '2024-01-20', items: [{ description: 'UI Design', amount: 4500 }] },
];

const initialTrips: Trip[] = [
  { id: '1', country: 'Thailand', entryDate: '2024-01-01', exitDate: '2024-02-15', notes: 'Chiang Mai stay' },
  { id: '2', country: 'Vietnam', entryDate: '2024-02-15', exitDate: '2024-03-15', notes: 'Da Nang' },
  { id: '3', country: 'Japan', entryDate: '2024-03-15', notes: 'Tokyo cherry blossoms' },
];

const initialDocuments: Document[] = [
  { id: '1', name: 'US Passport', type: 'Passport', expiryDate: '2028-05-20', url: '#' },
  { id: '2', name: 'Thai Visa', type: 'Visa', expiryDate: '2024-02-15', url: '#' },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      clients: initialClients,
      invoices: initialInvoices,
      trips: initialTrips,
      documents: initialDocuments,
      user: {
        name: 'Alex Nomad',
        homeCountry: 'USA',
        currentCountry: 'Japan',
      },
      addClient: (client) => set((state) => ({
        clients: [...state.clients, { ...client, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }]
      })),
      addInvoice: (invoice) => set((state) => ({
        invoices: [...state.invoices, { ...invoice, id: `INV-${Math.floor(Math.random() * 1000)}`, issuedAt: new Date().toISOString() }]
      })),
      addTrip: (trip) => set((state) => ({
        trips: [...state.trips, { ...trip, id: Math.random().toString(36).substr(2, 9) }]
      })),
      addDocument: (doc) => set((state) => ({
        documents: [...state.documents, { ...doc, id: Math.random().toString(36).substr(2, 9) }]
      })),
    }),
    {
      name: 'nomadops-storage',
    }
  )
);
