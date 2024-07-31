import { TypedSupabaseClient } from "@/utils/supabase/types";

export const getEvaluationById = (client: TypedSupabaseClient, id: string) => {
    return client
        .from('evaluation_count')
        .select()
        .eq('id', id)
        .throwOnError()
        .single()
}

export const getEvaluationByTask = (client: TypedSupabaseClient, task: string) => {
    return client
        .from('evaluation_count')
        .select()
        .eq('task', task)
        .throwOnError()
}
