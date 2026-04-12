'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Copy, Download, Search } from 'lucide-react';
import VoucherForm from './VoucherForm';

interface Voucher {
  _id: string;
  code: string;
  package_id: {
    _id: string;
    name: string;
    price: number;
    duration_mins: number;
    data_limit_gb: number;
    is_unlimited: boolean;
  };
  status: 'unused' | 'active' | 'expired';
  client_mac?: string;
  used_at?: string;
  expires_at: string;
  created_by: string;
  created_at: string;
}

export default function VoucherList() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/vouchers');
      const result = await response.json();
      if (result.success) {
        setVouchers(result.data);
        setFilteredVouchers(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  useEffect(() => {
    const filtered = vouchers.filter(voucher =>
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.package_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVouchers(filtered);
  }, [searchTerm, vouchers]);

  const handleGenerateVouchers = async (data: any) => {
    try {
      const response = await fetch('/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setShowForm(false);
        fetchVouchers();
      }
    } catch (error) {
      console.error('Failed to generate vouchers:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadVouchers = () => {
    const csvContent = [
      ['Code', 'Package', 'Status', 'Created By', 'Created At', 'Used At', 'Client MAC'].join(','),
      ...filteredVouchers.map(v => [
        v.code,
        v.package_id.name,
        v.status,
        v.created_by,
        new Date(v.created_at).toLocaleString(),
        v.used_at ? new Date(v.used_at).toLocaleString() : '',
        v.client_mac || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vouchers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unused': return 'default';
      case 'active': return 'secondary';
      case 'expired': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="p-6">Loading vouchers...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Voucher Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadVouchers} disabled={filteredVouchers.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Generate Vouchers'}
          </Button>
        </div>
      </div>

      {showForm && (
        <VoucherForm onSubmit={handleGenerateVouchers} />
      )}

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by code, package, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredVouchers.map((voucher) => (
          <Card key={voucher._id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg">{voucher.code}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(voucher.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Badge variant={getStatusColor(voucher.status)}>
                      {voucher.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Package:</strong> {voucher.package_id.name}</p>
                    <p><strong>Duration:</strong> {voucher.package_id.duration_mins} minutes</p>
                    <p><strong>Data:</strong> {voucher.package_id.is_unlimited ? 'Unlimited' : `${voucher.package_id.data_limit_gb} GB`}</p>
                    <p><strong>Created:</strong> {new Date(voucher.created_at).toLocaleString()} by {voucher.created_by}</p>
                    {voucher.used_at && (
                      <p><strong>Used:</strong> {new Date(voucher.used_at).toLocaleString()}</p>
                    )}
                    {voucher.client_mac && (
                      <p><strong>Client MAC:</strong> {voucher.client_mac}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredVouchers.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'No vouchers found matching your search.' : 'No vouchers found. Generate your first vouchers to get started.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
