import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { DollarSign, Users, Calendar, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Jan', total: 2500 },
  { name: 'Feb', total: 4500 },
  { name: 'Mar', total: 3200 },
  { name: 'Apr', total: 5800 },
  { name: 'May', total: 4100 },
  { name: 'Jun', total: 6200 },
];

export default function Dashboard() {
  const { clients, invoices, user } = useStore();

  const activeClients = clients.filter(c => c.status === 'Active').length;
  const pendingInvoices = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').length;
  const totalRevenue = invoices.reduce((acc, curr) => acc + (curr.status === 'Paid' ? curr.amount : 0), 0);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, {user.name}. Here's your overview.</p>
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
            desc="2 new leads this week"
          />
          <StatCard 
            title="Pending Invoices" 
            value={pendingInvoices.toString()} 
            icon={AlertTriangle} 
            desc="Requires attention"
            alert={pendingInvoices > 0}
          />
          <StatCard 
            title="Days in Country" 
            value="42" 
            icon={Calendar} 
            desc="138 days remaining (Japan)"
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
          
          <Card className="col-span-3 shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  { title: 'Invoice #1023 Paid', time: '2 hours ago', icon: DollarSign, color: 'text-green-500' },
                  { title: 'New Client Proposal', time: 'Yesterday', icon: FileText, color: 'text-blue-500' },
                  { title: 'Visa Expiry Warning', time: '2 days ago', icon: AlertTriangle, color: 'text-orange-500' },
                  { title: 'Trip to Vietnam Added', time: '1 week ago', icon: Calendar, color: 'text-purple-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`mr-4 flex h-9 w-9 items-center justify-center rounded-full border bg-background ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
