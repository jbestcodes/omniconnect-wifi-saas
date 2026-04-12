import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import Voucher from '@/models/Voucher';
import { withTenantProtection, addTenantFilter, TenantContext } from '@/lib/tenantMiddleware';

export async function GET(req: Request) {
  return withTenantProtection(async (req: Request, context: TenantContext) => {
    try {
      await dbConnect();
      
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Revenue calculations
      const tenantFilter = addTenantFilter({}, context);
      const dailyRevenue = await Transaction.aggregate([
        {
          $match: {
            ...tenantFilter,
            status: 'success',
            paidAt: { $gte: startOfDay }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      const weeklyRevenue = await Transaction.aggregate([
        {
          $match: {
            ...tenantFilter,
            status: 'success',
            paidAt: { $gte: startOfWeek }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      const monthlyRevenue = await Transaction.aggregate([
        {
          $match: {
            ...tenantFilter,
            status: 'success',
            paidAt: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      // Voucher stats
      const voucherFilter = addTenantFilter({}, context);
      const totalVouchers = await Voucher.countDocuments(voucherFilter);
      const unusedVouchers = await Voucher.countDocuments({ ...voucherFilter, status: 'unused' });
      const activeVouchers = await Voucher.countDocuments({ ...voucherFilter, status: 'active' });
      const expiredVouchers = await Voucher.countDocuments({ ...voucherFilter, status: 'expired' });

      // Today's connections (successful transactions + used vouchers today)
      const todayConnections = await Transaction.countDocuments({
        ...tenantFilter,
        status: 'success',
        paidAt: { $gte: startOfDay }
      }) + await Voucher.countDocuments({
        ...voucherFilter,
        status: 'active',
        used_at: { $gte: startOfDay }
      });

      // Daily revenue for chart (last 7 days)
      const dailyRevenueChart = await Transaction.aggregate([
        {
          $match: {
            ...tenantFilter,
            status: 'success',
            paidAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$paidAt"
              }
            },
            revenue: { $sum: "$amount" },
            transactions: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      return NextResponse.json({
        success: true,
        data: {
          revenue: {
            daily: dailyRevenue[0]?.total || 0,
            weekly: weeklyRevenue[0]?.total || 0,
            monthly: monthlyRevenue[0]?.total || 0,
            chart: dailyRevenueChart
          },
          vouchers: {
            total: totalVouchers,
            unused: unusedVouchers,
            active: activeVouchers,
            expired: expiredVouchers
          },
          connections: {
            today: todayConnections
          }
        }
      });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  })(req as any);
}
