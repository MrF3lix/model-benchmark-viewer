import useSupabaseServer from "@/utils/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { cookies } from "next/headers"
import ModelDetail from "./model-detail"
import { getModelById } from "@/queries/results"

const ModelPage = async ({ params }: { params: { id: string } }) => {
    const queryClient = new QueryClient()
    const cookieStore = cookies()
    const supabase = useSupabaseServer(cookieStore)

    await prefetchQuery(queryClient, getModelById(supabase, params.id))

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ModelDetail id={params.id} />
            </HydrationBoundary>
        </>
    )
}

export default ModelPage