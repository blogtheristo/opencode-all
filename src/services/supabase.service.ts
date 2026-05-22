import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

let cachedClient: SupabaseClient | null | undefined;
let missingConfigWarned = false;

function loadSupabaseClient(): SupabaseClient | null {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_KEY
    || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (!missingConfigWarned) {
      logger.warn(
        'Supabase service client not configured; dependent features will fail when invoked',
      );
      missingConfigWarned = true;
    }
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(supabaseUrl, supabaseKey);
  return cachedClient;
}

export function getSupabaseClient(): SupabaseClient | null {
  return loadSupabaseClient();
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property, receiver) {
    const client = loadSupabaseClient();
    if (!client) {
      throw new Error(
        'Supabase service client requires SUPABASE_URL and a service-role key (SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY).',
      );
    }

    const value = Reflect.get(client as object, property, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
