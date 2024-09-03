import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { FC, useEffect, useMemo, useState } from 'react';
import { trpc } from '@/state/trpc';
import { env } from '@/state/env';
import { supabase } from '@/state/supabase';
import { Session } from '@supabase/supabase-js';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LayoutRoot: FC = () => {
  // TODO: Move to hooks.
  const [queryClient] = useState(() => new QueryClient());

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log(_event);
      setSession(session);
    });
  }, []);

  const accessToken =
    session?.access_token ?? env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: env.EXPO_PUBLIC_TRPC_URL,
            headers() {
              return {
                authorization: `Bearer ${accessToken}`,
              };
            },
          }),
        ],
      }),
    [accessToken]
  );

  return (
    <ThemeProvider value={DefaultTheme}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
};

export default LayoutRoot;
