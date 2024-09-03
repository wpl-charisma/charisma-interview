import { supabase } from '@/state/supabase';
import { Session } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';

export const useUser = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .finally(() => {
        setIsLoading(false);
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const user = session?.user ?? null;
  return useMemo(() => ({ user, isLoading }), [user, isLoading]);
};
