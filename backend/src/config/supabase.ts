import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey =
  process.env.SUPABASE_KEY?.trim() ||
  process.env.SUPABASE_ANON_KEY?.trim();

console.log("SUPABASE_URL existe:", !!supabaseUrl);
console.log("SUPABASE_KEY existe:", !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Variáveis do Supabase ausentes. Verifique SUPABASE_URL e SUPABASE_KEY no Render."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: ws as any,
  },
});

export default supabase;