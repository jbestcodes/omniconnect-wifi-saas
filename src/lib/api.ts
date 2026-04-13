// API configuration for separate backend deployment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-vps-domain.com';

// API endpoints
export const API_ENDPOINTS = {
  // Public endpoints
  PACKAGES_PUBLIC: `${API_BASE_URL}/api/packages/public`,
  SITE_OWNER: (siteId: string) => `${API_BASE_URL}/api/sites/${siteId}/owner`,
  SITE_PACKAGES: (siteId: string) => `${API_BASE_URL}/api/sites/${siteId}/packages`,
  
  // Protected endpoints (require auth)
  PACKAGES: `${API_BASE_URL}/api/packages`,
  VOUCHERS: `${API_BASE_URL}/api/vouchers`,
  DASHBOARD_STATS: `${API_BASE_URL}/api/dashboard/stats`,
  AUTH_ME: `${API_BASE_URL}/api/auth/me`,
  
  // Admin endpoints
  ADMIN_BUSINESS_OWNERS: `${API_BASE_URL}/api/admin/business-owners`,
  ADMIN_BUSINESS_OWNER: (id: string) => `${API_BASE_URL}/api/admin/business-owners/${id}`,
  
  // Webhooks
  PAYSTACK_WEBHOOK: `${API_BASE_URL}/api/webhook/paystack`,
} as const;

// Helper function for API calls
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
