// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rdokubaqufkcuufiljcf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkb2t1YmFxdWZrY3V1ZmlsamNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTYyMDgsImV4cCI6MjA2MjczMjIwOH0.SZrhXAV6tT-MR0UUwEyCKZX-rSCJtb20_GE4zsyC-CY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);