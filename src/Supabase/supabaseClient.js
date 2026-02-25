import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ctlktdvpjcvuuknhxkts.supabase.co'
const supabaseKey = 'sb_publishable_D1ONE-bPqiu1Ep1Fbdxg1A_T67ssg8O'

export const supabase = createClient(supabaseUrl, supabaseKey)