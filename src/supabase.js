import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wyrxexdpzrzngbyzxjtx.supabase.co";

const supabaseKey =
  "sb_publishable_eku8JGxTi_km676cIUfoMw_H8CRDZ9P";

export const supabase = createClient(supabaseUrl, supabaseKey);
