export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
export const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const DEFAULT_LOCATION = {
  lat: 60.1699,
  lng: 24.9384,
  city: 'Helsinki',
};

export const DELIVERY_FEE = 3.90;
export const MIN_ORDER_AMOUNT = 10.00;
export const POINTS_PER_EURO = 10;

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
] as const;

export const FOOD_CATEGORIES = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'burger', name: 'Burgers', icon: '🍔' },
  { id: 'sushi', name: 'Sushi', icon: '🍣' },
  { id: 'kebab', name: 'Kebab', icon: '🥙' },
  { id: 'asian', name: 'Asian', icon: '🍜' },
  { id: 'healthy', name: 'Healthy', icon: '🥗' },
  { id: 'dessert', name: 'Desserts', icon: '🍰' },
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'indian', name: 'Indian', icon: '🍛' },
  { id: 'mexican', name: 'Mexican', icon: '🌮' },
  { id: 'thai', name: 'Thai', icon: '🥘' },
] as const;
