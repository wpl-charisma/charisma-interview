// import { createClient } from "npm:@supabase/supabase-js";
import { fetchRequestHandler } from "https://esm.sh/@trpc/server@10.45.2/adapters/fetch";
import { initTRPC } from "https://esm.sh/@trpc/server@10.45.2";
import { z } from "https://deno.land/x/zod/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Expose-Headers": "Content-Length, X-JSON",
  // TODO: tune this.
  "Access-Control-Allow-Headers":
    "apikey,X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization",
};

const handleCORS = (cb: (req: any) => Promise<Response>) => {
  return async (req: any) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const response = await cb(req);
    Object.entries(corsHeaders).forEach(([header, value]) => {
      response.headers.set(header, value);
    });

    return response;
  };
};

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  reverseEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(({ input }) => {
      return { reversed: input.email.split("").reverse().join("") };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const handler = (request: any) =>
  fetchRequestHandler({
    endpoint: "/trpc",
    req: request,
    router: appRouter,
    createContext: () => ({
      // /* ...create context from env variables (API keys for other services, etc.) */
      // const supabaseUrl = Deno.env.get("SUPABASE_URL");
      // const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
      // // To use the client's authorization, just forward the Authorization header from the request,
      // // as described in https://supabase.com/docs/guides/functions/auth
      // const authHeader = req.headers.get("Authorization");
      // if (!authHeader) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Authorization header missing",
      //   });
      // }
      // const supabaseClient = createClient<Database>(
      //   supabaseUrl,
      //   supabaseAnonKey,
      //   {
      //     global: { headers: { Authorization: authHeader } },
      //   }
      // );
      // // WARNING: this context object will not be type-safe and must be manually verified
      // return { supabaseClient, /* other clients/keys */ }
    }),
  });

// deno-lint-ignore ban-ts-comment
// @ts-ignore
Deno.serve(handleCORS(handler));
