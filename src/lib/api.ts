import { API_URL } from './constants';
import { supabase } from './supabase';

async function getAuthHeaders(tenantId?: string): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  if (tenantId) {
    headers['X-Tenant-ID'] = tenantId;
  }

  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}, tenantId?: string): Promise<T> {
  const headers = await getAuthHeaders(tenantId);
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ Tenants / Restaurants ============

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  status: string;
  subscription_tier: string;
  features: Record<string, boolean>;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Branch {
  id: string;
  tenant_id: string;
  name: string;
  name_en?: string;
  address: string;
  city: string;
  postal_code: string;
  phone?: string;
  email?: string;
  latitude: number;
  longitude: number;
  opening_hours?: Record<string, any>;
  is_active: boolean;
  delivery_radius_km?: number;
}

export interface RestaurantConfig {
  id: string;
  tenant_id: string;
  restaurant_name: string;
  restaurant_name_en?: string;
  logo_url?: string;
  cover_image_url?: string;
  cuisine_type?: string;
  description?: string;
  description_en?: string;
  average_preparation_time?: number;
  minimum_order_amount?: number;
  delivery_fee?: number;
  is_active: boolean;
  rating?: number;
  total_reviews?: number;
  metadata?: Record<string, any>;
}

export async function getActiveTenants(): Promise<Tenant[]> {
  const data = await request<{ tenants: Tenant[] }>('/tenants?status=active');
  return data.tenants || [];
}

export async function getTenantBySlug(slug: string): Promise<Tenant> {
  return request<Tenant>(`/tenants/slug/${slug}`);
}

export async function getRestaurantConfig(tenantId: string): Promise<RestaurantConfig> {
  const data = await request<{ config: RestaurantConfig }>(`/restaurant-config`, {}, tenantId);
  return data.config;
}

export async function getBranches(tenantId: string): Promise<Branch[]> {
  const data = await request<{ branches: Branch[] }>(`/branches?tenant_id=${tenantId}`, {}, tenantId);
  return data.branches || [];
}

// ============ Categories ============

export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  name_en?: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
}

export async function getCategories(tenantId: string): Promise<Category[]> {
  const data = await request<{ categories: Category[] }>('/categories', {}, tenantId);
  return data.categories || [];
}

// ============ Menu Items ============

export interface MenuItem {
  id: string;
  tenant_id: string;
  category_id: string;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  price: number;
  currency: string;
  image_url?: string;
  is_available: boolean;
  is_popular: boolean;
  allergens: string[];
  dietary_restrictions: string[];
  preparation_time_minutes?: number;
  ingredients: string[];
  tags: string[];
  sort_order?: number;
  category?: Category;
}

export async function getMenuItems(tenantId: string): Promise<MenuItem[]> {
  const data = await request<{ menuItems: MenuItem[] }>('/menu-items', {}, tenantId);
  return data.menuItems || [];
}

export async function getMenuItemsByCategory(tenantId: string, categoryId: string): Promise<MenuItem[]> {
  const data = await request<{ menuItems: MenuItem[] }>(`/menu-items/categories/${categoryId}/items`, {}, tenantId);
  return data.menuItems || [];
}

// ============ Orders ============

export interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_id: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  delivery_address?: {
    street: string;
    city: string;
    postal_code: string;
  };
  delivery_instructions?: string;
  scheduled_for?: string;
  created_at: string;
  updated_at?: string;
}

export async function createOrder(tenantId: string, orderData: any): Promise<Order> {
  const data = await request<{ order: Order }>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }, tenantId);
  return data.order;
}

export async function getOrders(tenantId: string): Promise<Order[]> {
  const data = await request<{ orders: Order[] }>('/orders', {}, tenantId);
  return data.orders || [];
}

export async function getOrder(orderId: string): Promise<Order> {
  const data = await request<{ order: Order }>(`/orders/${orderId}`);
  return data.order;
}

// ============ Customers ============

export interface Customer {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone?: string;
  auth_user_id?: string;
  loyalty_points: number;
  created_at: string;
}

export async function getOrCreateCustomer(tenantId: string, data: { name: string; email: string; phone?: string; auth_user_id?: string }): Promise<Customer> {
  return request<Customer>('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  }, tenantId);
}

// ============ Loyalty ============

export interface LoyaltyReward {
  id: string;
  tenant_id: string;
  name: string;
  name_en?: string;
  description?: string;
  points_required: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  is_active: boolean;
}

export interface LoyaltyTransaction {
  id: string;
  customer_id: string;
  points: number;
  type: 'earned' | 'redeemed';
  description?: string;
  created_at: string;
}

export async function getLoyaltyRewards(tenantId: string): Promise<LoyaltyReward[]> {
  return request<LoyaltyReward[]>('/loyalty/rewards', {}, tenantId);
}

export async function getLoyaltyPoints(customerId: string): Promise<number> {
  const data = await request<{ points: number }>(`/loyalty/points/${customerId}`);
  return data.points;
}

export async function getLoyaltyTransactions(customerId: string, tenantId: string): Promise<LoyaltyTransaction[]> {
  return request<LoyaltyTransaction[]>(`/loyalty/transactions/${customerId}`, {}, tenantId);
}

export async function redeemReward(customerId: string, rewardId: string): Promise<void> {
  await request('/loyalty/redeem', {
    method: 'POST',
    body: JSON.stringify({ customerId, rewardId }),
  });
}

// ============ Stripe ============

export async function createPaymentIntent(tenantId: string, amount: number, orderId: string): Promise<{ clientSecret: string; paymentIntentId: string }> {
  return request('/stripe/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify({ amount, orderId, tenantId, currency: 'eur' }),
  });
}

export async function confirmPayment(paymentIntentId: string, orderId: string): Promise<void> {
  await request('/stripe/confirm-payment', {
    method: 'POST',
    body: JSON.stringify({ paymentIntentId, orderId }),
  });
}
