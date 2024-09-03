import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useEffect, useMemo, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { trpc } from '@/state/trpc';
import { env } from '@/state/env';
import { supabase } from '@/state/supabase';
import { Session } from '@supabase/supabase-js';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  console.log(session);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
}
