import { useState, useCallback } from 'react';

interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  description: string;
}

interface ValidateResult {
  valid: boolean;
  discount: number;
  message?: string;
}

// Demo promo codes - in production, validate against API
const PROMO_CODES: PromoCode[] = [
  { code: 'HELMIES20', type: 'percentage', value: 20, minOrderAmount: 15, description: '20% off your order' },
  { code: 'WELCOME10', type: 'percentage', value: 10, minOrderAmount: 10, description: '10% off your first order' },
  { code: 'FREEDELIVERY', type: 'fixed', value: 3.9, minOrderAmount: 10, description: 'Free delivery' },
  { code: 'SUMMER15', type: 'percentage', value: 15, minOrderAmount: 20, description: '15% summer discount' },
  { code: 'SAVE25', type: 'percentage', value: 25, minOrderAmount: 30, description: '25% off orders over €30' },
];

export function usePromoCode() {
  const [appliedCode, setAppliedCode] = useState<PromoCode | null>(null);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateCode = useCallback(async (code: string): Promise<ValidateResult> => {
    setIsValidating(true);
    setError('');

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const promo = PROMO_CODES.find((p) => p.code === code.toUpperCase());

    setIsValidating(false);

    if (!promo) {
      return { valid: false, discount: 0, message: 'Invalid promo code' };
    }

    // For percentage type, return the percentage value
    // For fixed type, we'll handle it differently in the cart
    const discount = promo.type === 'percentage' ? promo.value : 0;

    return { valid: true, discount, message: promo.description };
  }, []);

  const applyCode = useCallback((code: string, orderAmount: number): boolean => {
    setError('');
    const promo = PROMO_CODES.find((p) => p.code === code.toUpperCase());

    if (!promo) {
      setError('Invalid promo code');
      return false;
    }

    if (orderAmount < promo.minOrderAmount) {
      setError(`Minimum order amount is €${promo.minOrderAmount}`);
      return false;
    }

    setAppliedCode(promo);
    return true;
  }, []);

  const removeCode = useCallback(() => {
    setAppliedCode(null);
    setError('');
  }, []);

  const calculateDiscount = useCallback(
    (subtotal: number): number => {
      if (!appliedCode) return 0;
      if (appliedCode.type === 'percentage') {
        return subtotal * (appliedCode.value / 100);
      }
      return Math.min(appliedCode.value, subtotal);
    },
    [appliedCode]
  );

  return {
    appliedCode,
    error,
    isValidating,
    validateCode,
    applyCode,
    removeCode,
    calculateDiscount,
  };
}
