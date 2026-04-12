'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Package, Wifi, TrendingUp, HardDrive, Building, Settings, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardStats {
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    chart: Array<{
      _id: string;
      revenue: number;
      transactions: number;
    }>;
  };
  vouchers: {
    total: number;
    unused: number;
    active: number;
    expired: number;
  };
  connections: {
    today: number;
  };
}

interface OmadaData {
  activeUsers: number;
  totalDataUsage: number;
  clients: Array<{
    mac: string;
    ip: string;
    name: string;
    status: string;
    connect_time: number;
    traffic: {
      download: number;
      upload: number;
      total: number;
    };
  }>;
  totalConnections: number;
}

interface BusinessOwner {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  siteId: string;
  isActive: boolean;
  whatsappNumber?: string;
  paystackSubaccountCode?: string;
  createdAt: string;
}

interface UserContext {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    siteId?: string;
  };
  isSuperAdmin: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [omadaData, setOmadaData] = useState<OmadaData | null>(null);
  const [businessOwners, setBusinessOwners] = useState<BusinessOwner[]>([]);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user context first
        const userResponse = await fetch('/api/auth/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserContext(userData.data);
        }

        // Fetch dashboard stats (tenant-aware)
        const statsResponse = await fetch('/api/dashboard/stats');
        const statsResult = await statsResponse.json();
        if (statsResult.success) {
          setStats(statsResult.data);
        }

        // Fetch Omada data
        const omadaResponse = await fetch('/api/omada/clients');
        const omadaResult = await omadaResponse.json();
        if (omadaResult.success) {
          setOmadaData(omadaResult.data);
        }

        // Super Admin only: Fetch business owners
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.data.isSuperAdmin) {
            const ownersResponse = await fetch('/api/admin/business-owners');
            if (ownersResponse.ok) {
              const ownersResult = await ownersResponse.json();
              setBusinessOwners(ownersResult.data);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const revenueChartData = stats?.revenue.chart?.map(item => ({
    date: new Date(item._id).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    revenue: item.revenue,
    transactions: item.transactions
  })) || [];

  const voucherChartData = stats?.vouchers ? [
    { name: 'Unused', value: stats.vouchers.unused, color: '#8884d8' },
    { name: 'Active', value: stats.vouchers.active, color: '#82ca9d' },
    { name: 'Expired', value: stats.vouchers.expired, color: '#ffc658' }
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {userContext?.isSuperAdmin ? 'Super Admin Dashboard' : 'Business Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {userContext?.isSuperAdmin 
              ? 'Manage all business owners and platform analytics' 
              : `Welcome back, ${userContext?.user?.name || 'User'}`
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Live</Badge>
          {userContext?.isSuperAdmin && (
            <Badge variant="secondary">
              <Building className="w-3 h-3 mr-1" />
              Super Admin
            </Badge>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats?.revenue.daily?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              Today's earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{omadaData?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Connections Today</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.connections.today || 0}</div>
            <p className="text-xs text-muted-foreground">
              New connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{omadaData?.totalDataUsage?.toFixed(2) || '0.00'} GB</div>
            <p className="text-xs text-muted-foreground">
              Total consumption
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trend (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`KES ${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Voucher Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={voucherChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats?.revenue.weekly?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats?.revenue.monthly?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.vouchers.total || 0}</div>
            <div className="text-sm text-muted-foreground">
              {stats?.vouchers.unused || 0} unused • {stats?.vouchers.active || 0} active
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Super Admin: Business Owners Management */}
      {userContext?.isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Owners ({businessOwners.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Business Name</th>
                    <th className="text-left p-2">Owner</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Site ID</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businessOwners.map((owner) => (
                    <tr key={owner._id} className="border-b">
                      <td className="p-2 font-medium">{owner.businessName || 'N/A'}</td>
                      <td className="p-2">{owner.name}</td>
                      <td className="p-2">{owner.email}</td>
                      <td className="p-2 font-mono text-xs">{owner.siteId}</td>
                      <td className="p-2">
                        <Badge variant={owner.isActive ? 'default' : 'secondary'}>
                          {owner.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-2 text-xs">
                        {new Date(owner.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleOwnerStatus(owner._id, !owner.isActive)}
                          >
                            {owner.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          {owner.whatsappNumber && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`https://wa.me/${owner.whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank')}
                            >
                              <AlertCircle className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {businessOwners.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No business owners registered yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Clients Table */}
      {omadaData?.clients && omadaData.clients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">MAC Address</th>
                    <th className="text-left p-2">IP Address</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Data Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {omadaData.clients.slice(0, 10).map((client, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-mono text-xs">{client.mac}</td>
                      <td className="p-2">{client.ip}</td>
                      <td className="p-2">{client.name}</td>
                      <td className="p-2">
                        <Badge variant={client.status === 'online' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </td>
                      <td className="p-2">{client.traffic.total.toFixed(2)} GB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Helper function to toggle owner status
  async function toggleOwnerStatus(ownerId: string, newStatus: boolean) {
    try {
      const response = await fetch(`/api/admin/business-owners/${ownerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus })
      });
      
      if (response.ok) {
        // Refresh the business owners list
        const ownersResponse = await fetch('/api/admin/business-owners');
        if (ownersResponse.ok) {
          const ownersResult = await ownersResponse.json();
          setBusinessOwners(ownersResult.data);
        }
      }
    } catch (error) {
      console.error('Failed to toggle owner status:', error);
    }
  }
}
