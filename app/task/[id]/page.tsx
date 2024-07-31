import useSupabaseServer from "@/utils/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { cookies } from "next/headers"
import EvaluationList from "./evaluation-list"
import { getTaskById } from "@/queries/tasks"

const TaskPage = async ({ params }: { params: { id: string } }) => {
    const queryClient = new QueryClient()
    const cookieStore = cookies()
    const supabase = useSupabaseServer(cookieStore)

    await prefetchQuery(queryClient, getTaskById(supabase, params.id))

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <EvaluationList id={params.id} />
            </HydrationBoundary>
        </>
    )
}

export default TaskPage