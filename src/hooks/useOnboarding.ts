import { useState, useCallback } from 'react';

const ONBOARDING_KEY = 'helmies-onboarding-completed';

export function useOnboarding() {
  const [completed, setCompleted] = useState(() => localStorage.getItem(ONBOARDING_KEY) === 'true');

  const complete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setCompleted(true);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setCompleted(false);
  }, []);

  return { completed, complete, reset };
}
