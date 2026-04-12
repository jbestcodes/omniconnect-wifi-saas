'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const voucherSchema = z.object({
  package_id: z.string().min(1, 'Package is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(100, 'Maximum 100 vouchers at once'),
  created_by: z.string().min(1, 'Creator name is required'),
});

type VoucherFormData = z.infer<typeof voucherSchema>;

interface Package {
  _id: string;
  name: string;
  price: number;
  duration_mins: number;
  data_limit_gb: number;
  is_unlimited: boolean;
}

interface VoucherFormProps {
  onSubmit: (data: VoucherFormData) => void;
  isLoading?: boolean;
}

export default function VoucherForm({ onSubmit, isLoading = false }: VoucherFormProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      package_id: '',
      quantity: 1,
      created_by: '',
    },
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        const result = await response.json();
        if (result.success) {
          setPackages(result.data.filter((pkg: Package) => pkg.is_active));
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Vouchers</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="package_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Package</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg._id} value={pkg._id}>
                          {pkg.name} - KES {pkg.price} ({pkg.duration_mins}min)
                          {pkg.is_unlimited ? ' - Unlimited' : ` - ${pkg.data_limit_gb}GB`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="created_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Created By</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name or admin ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading || loadingPackages}>
              {isLoading ? 'Generating...' : `Generate ${form.watch('quantity') || 1} Voucher(s)`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
