declare module '*/shared/config/supabase-config.js' {
  import type { SupabaseClientOptions } from '@supabase/supabase-js';

  export const supabaseConfig: {
    url: string;
    anonKey: string;
    auth: SupabaseClientOptions<'public'>['auth'];
  };
}
