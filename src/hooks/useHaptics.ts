import { useCallback } from 'react';

type HapticStyle = 'light' | 'medium' | 'heavy';

export function useHaptics() {
  const impact = useCallback(async (style: HapticStyle = 'light') => {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      const styleMap: Record<HapticStyle, any> = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy,
      };
      await Haptics.impact({ style: styleMap[style] });
    } catch {
      // Fallback: vibrate API
      if ('vibrate' in navigator) {
        navigator.vibrate(style === 'heavy' ? 50 : style === 'medium' ? 30 : 10);
      }
    }
  }, []);

  const impactLight = useCallback(async () => {
    await impact('light');
  }, [impact]);

  const impactMedium = useCallback(async () => {
    await impact('medium');
  }, [impact]);

  const impactHeavy = useCallback(async () => {
    await impact('heavy');
  }, [impact]);

  const notification = useCallback(async (type: 'success' | 'warning' | 'error' = 'success') => {
    try {
      const { Haptics, NotificationType } = await import('@capacitor/haptics');
      const typeMap: Record<string, any> = {
        success: NotificationType.Success,
        warning: NotificationType.Warning,
        error: NotificationType.Error,
      };
      await Haptics.notification({ type: typeMap[type] });
    } catch {
      if ('vibrate' in navigator) navigator.vibrate(30);
    }
  }, []);

  const selectionChanged = useCallback(async () => {
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionChanged();
    } catch { /* ignore */ }
  }, []);

  return { impact, impactLight, impactMedium, impactHeavy, notification, selectionChanged };
}
