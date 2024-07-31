import useSupabaseServer from "@/utils/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { cookies } from "next/headers"
import ResultList from "./result-list"
import { getEvaluationById } from "@/queries/evaluations"

const TaskPage = async ({ params }: { params: { id: string } }) => {
    const queryClient = new QueryClient()
    const cookieStore = cookies()
    const supabase = useSupabaseServer(cookieStore)

    await prefetchQuery(queryClient, getEvaluationById(supabase, params.id))

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ResultList id={params.id} />
            </HydrationBoundary>
        </>
    )
}

export default TaskPage