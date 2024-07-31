'use client'

import { List } from '@/components/list/list'
import { ListItem } from '@/components/list/list-item'
import { getAreas } from '@/queries/areas'
import useSupabaseBrowser from '@/utils/supabase/browser'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import Link from 'next/link'



const AreaListItem = ({ area }: any) => {
    return (
        <ListItem className="p-0">
            <Link className="w-full p-6 flex justify-between items-center" href={`/area/${area.id}`}>
                <div className="flex flex-col">
                    <div className="font-semibold">{area.name}</div>
                    <div className="text-sm text-gray-700">{area.task[0].count} Tasks</div>
                </div>
                <div className="w-10 p-1 rounded-full text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <ArrowRightIcon className="block h-5 w-5" />
                </div>
            </Link>
        </ListItem>
    )
}


export default function AreaList() {
    const supabase = useSupabaseBrowser()
    const { data: areas, isLoading } = useQuery(getAreas(supabase))

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Overview</h1>
            <List
                title="Areas"
                description="Select an area to see the tasks related to the area"
            >
                {isLoading &&
                    <ListItem>
                        <div className="text-gray-500 text-xs">Loading...</div>
                    </ListItem>
                }
                {areas && areas.map(area => <AreaListItem key={area.id} area={area} />)}
            </List>
        </div>
    )
}