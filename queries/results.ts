import { TypedSupabaseClient } from "@/utils/supabase/types";

export const getResultsByEvaluation = (client: TypedSupabaseClient, evaluation: string) => {
    return client
        .from('result')
        .select()
        .eq('evaluation', evaluation)
        .order('evaluated_on', { ascending: false })
        .throwOnError()
}

const PAGE_SIZE = 1000

export const getMethodologies = (client: TypedSupabaseClient, page: number, query: string, area: string) => {
    if (area == 'all') {
        return client.from('methodology')
            .select()
            .ilike('methodology', `%${query}%`)
            .neq('paper', '')
            .order('methodology', { ascending: true })
            .range(page * PAGE_SIZE, (page * PAGE_SIZE) + PAGE_SIZE - 1)
            .throwOnError()
    } else {
        console.log(area)

        return client.from('methodology')
            .select()
            .ilike('methodology', `%${query}%`)
            .neq('paper', '')
            .contains('area', [area])
            .order('methodology', { ascending: true })
            .range(page * PAGE_SIZE, (page * PAGE_SIZE) + PAGE_SIZE - 1)
            .throwOnError()
    }
}

export const getMethodologiesCount = (client: TypedSupabaseClient) => {
    return client.from('methodology')
        .select('*', { count: 'exact', head: true })
        .neq('paper', '')
        .throwOnError()
}

export const getModelById = (client: TypedSupabaseClient, id: string) => {
    return client.from('methodology')
        .select()
        .eq('id', id)
        .single()
        .throwOnError()
}

export const getResultsByMethodology = (client: TypedSupabaseClient, methodology: string) => {
    return client.from('result')
        .select()
        .eq('methodology', methodology)
        .throwOnError()
}