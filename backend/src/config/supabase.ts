import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import ws from "ws";

console.log("URL =", JSON.stringify(process.env.SUPABASE_URL));

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  {
    realtime: {
      transport: ws as any,
    },
  }
);

export default supabase;