import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import ws from "ws";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL não foi configurada.");
}

if (!supabaseKey) {
  throw new Error("SUPABASE_KEY não foi configurada.");
}

const supabase = createClient(
  supabaseUrl.trim(),
  supabaseKey.trim(),
  {
    realtime: {
      transport: ws as any,
    },
  }
);

export default supabase;