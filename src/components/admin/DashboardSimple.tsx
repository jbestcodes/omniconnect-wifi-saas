'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Package, Wifi, TrendingUp, HardDrive, Building } from 'lucide-react';
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

export default function DashboardSimple() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        revenue: {
          daily: 1250.50,
          weekly: 8750.25,
          monthly: 35000.75,
          chart: [
            { _id: '2024-04-06', revenue: 850, transactions: 17 },
            { _id: '2024-04-07', revenue: 1200, transactions: 24 },
            { _id: '2024-04-08', revenue: 950, transactions: 19 },
            { _id: '2024-04-09', revenue: 1450, transactions: 29 },
            { _id: '2024-04-10', revenue: 1100, transactions: 22 },
            { _id: '2024-04-11', revenue: 1300, transactions: 26 },
            { _id: '2024-04-12', revenue: 1250, transactions: 25 },
          ]
        },
        vouchers: {
          total: 150,
          unused: 45,
          active: 28,
          expired: 77
        },
        connections: {
          today: 52
        }
      });
      setLoading(false);
    }, 1500);
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
          <h1 className="text-3xl font-bold">Dashboard (Test Mode)</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Live</Badge>
          <Badge variant="secondary">
            <Building className="w-3 h-3 mr-1" />
            Business Owner
          </Badge>
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
            <div className="text-2xl font-bold">28</div>
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
            <div className="text-2xl font-bold">125.75 GB</div>
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
              {stats?.vouchers.unused || 0} unused · {stats?.vouchers.active || 0} active
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Badge variant="outline" className="text-xs">
          Test Mode - Using Mock Data
        </Badge>
      </div>
    </div>
  );
}
