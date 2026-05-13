import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY
  || process.env.SUPABASE_SERVICE_ROLE_KEY
  || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase service client requires SUPABASE_URL and a service-role key (SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY).',
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
