import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
   throw new Error(
      'SUPABASE_URL environment variable is required for server-side Supabase access.'
   );
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
   throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY environment variable is required for server-side Supabase access.'
   );
}

const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
   auth: {
      persistSession: false,
      autoRefreshToken: false,
   },
});

export function getSupabaseAdmin() {
   return client;
}

export function getGraphqlSupabaseAdmin() {
   return client.schema('graphql_public');
}
