import { TypedSupabaseClient } from "@/utils/supabase/types";

export const getAreas = (client: TypedSupabaseClient) => {
    return client.from('area').select('id, name, task(count)')
}

export const getAreaById = (client: TypedSupabaseClient, id: string) => {
    return client
        .from('area')
        .select()
        .eq('id', id)
        .throwOnError()
        .single()
}