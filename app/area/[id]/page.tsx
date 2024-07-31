import { getAreaById, getAreas } from "@/queries/areas"
import useSupabaseServer from "@/utils/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { cookies } from "next/headers"
import TaskList from "./task-list"

const AreaPage = async ({ params }: { params: { id: string } }) => {
    const queryClient = new QueryClient()
    const cookieStore = cookies()
    const supabase = useSupabaseServer(cookieStore)

    await prefetchQuery(queryClient, getAreaById(supabase, params.id))

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <TaskList id={params.id} />
            </HydrationBoundary>
        </>
    )
}

export default AreaPage