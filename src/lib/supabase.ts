import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Whether Supabase is actually configured for this environment.
 * When the env vars are missing we must NOT throw at module load — doing so
 * crashes the entire React tree (white screen) before anything can render.
 * Instead we fall back to a safe no-op client so the UI renders with the
 * local mock-data fallbacks that every data layer already provides.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// ─── Safe no-op stub (used only when Supabase is not configured) ───────────────
// Every query resolves to an empty result instead of firing failed network
// requests, which keeps the console clean (no 404s / ERR_INSUFFICIENT_RESOURCES)
// and lets components gracefully fall back to their local defaults.

const EMPTY_RESULT = { data: null, error: null, count: 0 } as const;

function createQueryStub(): any {
  const chain: any = {
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    upsert: () => chain,
    delete: () => chain,
    eq: () => chain,
    neq: () => chain,
    gt: () => chain,
    gte: () => chain,
    lt: () => chain,
    lte: () => chain,
    like: () => chain,
    ilike: () => chain,
    is: () => chain,
    in: () => chain,
    or: () => chain,
    contains: () => chain,
    order: () => chain,
    range: () => chain,
    limit: () => chain,
    single: () => Promise.resolve(EMPTY_RESULT),
    maybeSingle: () => Promise.resolve(EMPTY_RESULT),
    // Make the builder awaitable so `await supabase.from(...).select()` resolves.
    then: (resolve: (value: typeof EMPTY_RESULT) => unknown) => resolve(EMPTY_RESULT),
  };
  return chain;
}

const authStub = {
  getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  onAuthStateChange: () => ({
    data: { subscription: { unsubscribe: () => {} } },
  }),
  signInWithPassword: () =>
    Promise.resolve({
      data: { session: null, user: null },
      error: { message: 'Supabase is not configured.' },
    }),
  signUp: () =>
    Promise.resolve({
      data: { session: null, user: null },
      error: { message: 'Supabase is not configured.' },
    }),
  signOut: () => Promise.resolve({ error: null }),
  resetPasswordForEmail: () =>
    Promise.resolve({ data: {}, error: { message: 'Supabase is not configured.' } }),
};

const stubClient = {
  from: () => createQueryStub(),
  auth: authStub,
  functions: { invoke: () => Promise.resolve({ data: null, error: null }) },
} as unknown as SupabaseClient;

if (!isSupabaseConfigured) {
  console.warn(
    '[v0] Supabase env vars are missing — running in local fallback mode with mock data.',
  );
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : stubClient;
