import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://ysschyjbqwmifewacrvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzc2NoeWpicXdtaWZld2FjcnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4Mjg4NTksImV4cCI6MjA0NzQwNDg1OX0.I5DGBoIWeSGhbuzX7t_hdOhVRaBhtO1L5Clvm1GS2VQ';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  }
});