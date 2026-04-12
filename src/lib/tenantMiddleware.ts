import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}

export interface TenantContext {
  user: any;
  ownerId: string;
  isSuperAdmin: boolean;
  siteId?: string;
}

export async function getTenantContext(req: NextRequest): Promise<TenantContext | null> {
  try {
    await dbConnect();

    // Get token from Authorization header or cookies
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                 req.cookies.get('auth_token')?.value;

    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as DecodedToken;
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return null;
    }

    return {
      user,
      ownerId: user._id.toString(),
      isSuperAdmin: user.role === UserRole.SUPER_ADMIN,
      siteId: user.siteId,
    };
  } catch (error) {
    console.error('Tenant middleware error:', error);
    return null;
  }
}

export function withTenantProtection(handler: (req: NextRequest, context: TenantContext) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const context = await getTenantContext(req);
    
    if (!context) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    return handler(req, context);
  };
}

export function withSuperAdminProtection(handler: (req: NextRequest, context: TenantContext) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const context = await getTenantContext(req);
    
    if (!context || !context.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      );
    }

    return handler(req, context);
  };
}

// Helper function to filter queries by tenant
export function addTenantFilter(query: any, context: TenantContext) {
  if (context.isSuperAdmin) {
    return query; // Super Admin can see all data
  }
  
  // Business Owner can only see their own data
  return { ...query, ownerId: context.ownerId };
}

// Helper function to validate site access
export function validateSiteAccess(context: TenantContext, siteId?: string): boolean {
  if (context.isSuperAdmin) {
    return true; // Super Admin can access any site
  }
  
  // Business Owner can only access their own site
  return !siteId || siteId === context.siteId;
}
