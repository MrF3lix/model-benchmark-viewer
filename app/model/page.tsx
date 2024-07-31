import { getAreas } from "@/queries/areas"
import useSupabaseServer from "@/utils/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { cookies } from "next/headers"
import ModelList from "./model-list"
import { getMethodologies } from "@/queries/results"

const Home = async () => {
  const queryClient = new QueryClient()
  const cookieStore = cookies()

  const supabase = useSupabaseServer(cookieStore)

  await prefetchQuery(queryClient, getMethodologies(supabase, 0, '', 'all'))

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ModelList />
      </HydrationBoundary>
    </>
  )
}

export default Home