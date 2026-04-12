import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const supabaseServer = () => createServerComponentClient({ cookies })

export default supabaseServer
