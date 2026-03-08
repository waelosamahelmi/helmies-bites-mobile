import { useState, useCallback } from 'react';

interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  description: string;
}

// Demo promo codes - in production, validate against API
const PROMO_CODES: PromoCode[] = [
  { code: 'HELMIES20', type: 'percentage', value: 20, minOrderAmount: 15, description: '20% off your order' },
  { code: 'WELCOME10', type: 'fixed', value: 10, minOrderAmount: 25, description: '10 EUR off first order' },
  { code: 'FREEDELIVERY', type: 'fixed', value: 3.9, minOrderAmount: 10, description: 'Free delivery' },
  { code: 'SUMMER15', type: 'percentage', value: 15, minOrderAmount: 20, description: '15% summer discount' },
];

export function usePromoCode() {
  const [appliedCode, setAppliedCode] = useState<PromoCode | null>(null);
  const [error, setError] = useState('');

  const applyCode = useCallback((code: string, orderAmount: number) => {
    setError('');
    const promo = PROMO_CODES.find(p => p.code === code.toUpperCase());

    if (!promo) {
      setError('Invalid promo code');
      return false;
    }

    if (orderAmount < promo.minOrderAmount) {
      setError(`Minimum order amount is ${promo.minOrderAmount} EUR`);
      return false;
    }

    setAppliedCode(promo);
    return true;
  }, []);

  const removeCode = useCallback(() => {
    setAppliedCode(null);
    setError('');
  }, []);

  const calculateDiscount = useCallback((subtotal: number) => {
    if (!appliedCode) return 0;
    if (appliedCode.type === 'percentage') {
      return subtotal * (appliedCode.value / 100);
    }
    return Math.min(appliedCode.value, subtotal);
  }, [appliedCode]);

  return { appliedCode, error, applyCode, removeCode, calculateDiscount };
}
