'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus } from 'lucide-react';
import PackageForm from './PackageForm';

interface Package {
  _id: string;
  name: string;
  price: number;
  duration_mins: number;
  data_limit_gb: number;
  is_unlimited: boolean;
  is_active: boolean;
  description?: string;
  created_at: string;
}

export default function PackageList() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const result = await response.json();
      if (result.success) {
        setPackages(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreatePackage = async (data: any) => {
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setIsFormOpen(false);
        fetchPackages();
      }
    } catch (error) {
      console.error('Failed to create package:', error);
    }
  };

  const handleUpdatePackage = async (data: any) => {
    if (!editingPackage) return;
    
    try {
      const response = await fetch(`/api/packages/${editingPackage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setEditingPackage(null);
        setIsFormOpen(false);
        fetchPackages();
      }
    } catch (error) {
      console.error('Failed to update package:', error);
    }
  };

  const handleDeletePackage = async (id: string) => {
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchPackages();
      }
    } catch (error) {
      console.error('Failed to delete package:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading packages...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Package Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPackage(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </DialogTitle>
            </DialogHeader>
            <PackageForm
              package={editingPackage}
              onSubmit={editingPackage ? handleUpdatePackage : handleCreatePackage}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {packages.map((pkg) => (
          <Card key={pkg._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {pkg.name}
                    <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {pkg.is_unlimited && (
                      <Badge variant="outline">Unlimited</Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    KES {pkg.price} • {pkg.duration_mins} minutes • 
                    {pkg.is_unlimited ? ' Unlimited data' : ` ${pkg.data_limit_gb} GB`}
                  </p>
                  {pkg.description && (
                    <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPackage(pkg);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Package</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{pkg.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePackage(pkg._id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
        
        {packages.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No packages found. Create your first package to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
