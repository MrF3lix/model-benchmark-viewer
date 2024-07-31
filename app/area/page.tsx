import { getAreas } from "@/queries/areas"
import useSupabaseServer from "@/utils/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { cookies } from "next/headers"
import AreaList from "./area-list"

const Home = async () => {
  const queryClient = new QueryClient()
  const cookieStore = cookies()

  const supabase = useSupabaseServer(cookieStore)

  await prefetchQuery(queryClient, getAreas(supabase))

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AreaList />
      </HydrationBoundary>
    </>
  )
}

export default Home