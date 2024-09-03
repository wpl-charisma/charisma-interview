import { z } from 'zod';

export const env = z
  .object({
    EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
    EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    EXPO_PUBLIC_TRPC_URL: z.string().url(),
  })
  .parse({
    // https://docs.expo.dev/guides/environment-variables/#how-to-read-from-environment-variables
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_TRPC_URL: process.env.EXPO_PUBLIC_TRPC_URL,
  });
