import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useClients } from '@/hooks/use-clients';
import { useInvoices } from '@/hooks/use-invoices';
import { useTrips } from '@/hooks/use-trips';
import { DollarSign, Users, Calendar, AlertTriangle, FileText } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { differenceInDays } from 'date-fns';

const data = [
  { name: 'Jan', total: 2500 },
  { name: 'Feb', total: 4500 },
  { name: 'Mar', total: 3200 },
  { name: 'Apr', total: 5800 },
  { name: 'May', total: 4100 },
  { name: 'Jun', total: 6200 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const { trips } = useTrips();

  const activeClients = clients.filter(c => c.status === 'Active').length;
  const leadClients = clients.filter(c => c.status === 'Lead').length;
  const completedClients = clients.filter(c => c.status === 'Completed').length;
  const pendingInvoices = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').length;
  const totalRevenue = invoices.reduce((acc, curr) => acc + (curr.status === 'Paid' ? curr.amount : 0), 0);
  
  // Clients by Country (Top 5)
  const clientsByCountry = clients.reduce((acc, client) => {
    acc[client.country] = (acc[client.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCountries = Object.entries(clientsByCountry)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Upcoming Actions
  const upcomingActions = clients
    .filter(c => c.nextActionDate)
    .sort((a, b) => new Date(a.nextActionDate!).getTime() - new Date(b.nextActionDate!).getTime())
    .slice(0, 5);

  // Calculate days in current country
  const currentTrip = trips.find(t => !t.exitDate);
  const daysInCountry = currentTrip ? differenceInDays(new Date(), new Date(currentTrip.entryDate)) : 0;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, {user?.name}. Here's your overview.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Revenue" 
            value={`$${totalRevenue.toLocaleString()}`} 
            icon={DollarSign} 
            desc="+20.1% from last month"
          />
          <StatCard 
            title="Active Clients" 
            value={activeClients.toString()} 
            icon={Users} 
            desc={`${leadClients} leads in pipeline`}
          />
          <StatCard 
            title="Completed Jobs" 
            value={completedClients.toString()} 
            icon={FileText} 
            desc="Successful engagements"
          />
          <StatCard 
            title="Days in Country" 
            value={daysInCountry.toString()} 
            icon={Calendar} 
            desc={currentTrip ? `${currentTrip.country}` : "Not traveling"}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4 shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="col-span-3 space-y-4">
            <Card className="shadow-sm border-border/50">
                <CardHeader>
                <CardTitle>Upcoming Actions</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {upcomingActions.map((client) => (
                    <div key={client.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${new Date(client.nextActionDate!) < new Date() ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium leading-none">{client.nextActionDescription || "Follow up"}</p>
                            <p className="text-xs text-muted-foreground">{client.name}</p>
                        </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-xs font-medium ${new Date(client.nextActionDate!) < new Date() ? 'text-red-600' : 'text-muted-foreground'}`}>
                                {new Date(client.nextActionDate!) < new Date() ? 'Overdue' : differenceInDays(new Date(client.nextActionDate!), new Date()) + ' days'}
                            </span>
                        </div>
                    </div>
                    ))}
                    {upcomingActions.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">No upcoming actions.</div>
                    )}
                </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
                <CardHeader>
                <CardTitle>Clients by Country</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {topCountries.map(([country, count], i) => (
                    <div key={country} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                            {i + 1}
                        </div>
                        <span className="font-medium">{country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <span className="font-bold">{count}</span>
                        <span className="text-xs text-muted-foreground">clients</span>
                        </div>
                    </div>
                    ))}
                    {topCountries.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">No clients yet.</div>
                    )}
                </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ title, value, icon: Icon, desc, alert }: { title: string, value: string, icon: any, desc: string, alert?: boolean }) {
  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow border-border/50 ${alert ? 'border-orange-200 bg-orange-50/30 dark:bg-orange-900/10' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${alert ? 'text-orange-500' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold font-heading ${alert ? 'text-orange-600 dark:text-orange-400' : ''}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}
