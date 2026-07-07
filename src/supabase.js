import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wyrxexdpzrzngbyzxjtx.supabase.co";

const supabaseKey =
  "حطي هنا الـ Publishable Key بتاعك";

export const supabase = createClient(supabaseUrl, supabaseKey);
