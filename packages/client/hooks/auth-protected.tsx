import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useUser } from './user';

type UseAuthProtectedOptions = {
  condition: (user: Session['user'] | null) => boolean;
  action: () => void;
};
export const useAuthProtected = (
  options = {
    condition: (user) => !!user,
    action: () => router.replace('/auth'),
  } as UseAuthProtectedOptions
) => {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (options.condition(user)) return;

    options.action();
  }, [isLoading, options, user]);
};
