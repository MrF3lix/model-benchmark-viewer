'use client'

import { Badge, BadgeType } from '@/components/badge'
import { Input } from '@/components/form/input'
import { Select } from '@/components/form/select'
import { List } from '@/components/list/list'
import { ListItem } from '@/components/list/list-item'
import { getAreas } from '@/queries/areas'
import { getMethodologies, getMethodologiesCount } from '@/queries/results'
import useSupabaseBrowser from '@/utils/supabase/browser'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { keepPreviousData } from '@tanstack/react-query'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const ModelListItem = ({ model }: any) => {
    return (
        <ListItem className="p-0">
            <Link className="w-full p-6 flex justify-between items-center gap-2" href={`/model/${model.id}`}>
                <div className="flex flex-col min-w-96 max-w-96">
                    <div className="font-semibold text-wrap">{model.methodology}</div>
                    <div className="text-xs text-gray-500">{model.paper}</div>
                </div>
                <div className="flex-1 flex flex-wrap gap-2 justify-start items-start">
                    {model.area.map((area: string) => (
                        <Badge key={area} type={BadgeType.NEUTRAL}>{area}</Badge>
                    ))}
                </div>
                {model.evaluation_dates && model.evaluation_dates.length > 0 &&
                    <div className="flex-1 flex flex-wrap gap-2 justify-start items-start">
                        {model.evaluation_dates.filter((date: string) => date != null).map((date: string) => (
                            <Badge key={date} type={BadgeType.DEFAULT}>{date}</Badge>
                        ))}
                    </div>
                }
                <div className="w-10 p-1 rounded-full text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <ArrowRightIcon className="block h-5 w-5" />
                </div>
            </Link>
        </ListItem>
    )
}


export default function ModelList() {
    const supabase = useSupabaseBrowser()
    const [page, setPage] = useState<number>(0)
    const [query, setQuery] = useState<string>('')
    const [area, setArea] = useState<string>('all')

    const { count } = useQuery(getMethodologiesCount(supabase))
    const { data: models, isLoading, isFetching } = useQuery(getMethodologies(supabase, page, query, area), {
        placeholderData: keepPreviousData
    })
    const { data: areas } = useQuery(getAreas(supabase))

    const areaOptions = useMemo(() => {
        if(!areas) {
            return [{value: 'all', name: 'All'}]
        }

        const options = areas?.map(area => ({
            value: area.id,
            name: area.name
        }))

        return [
            {value: 'all', name: 'All'},
            ...options
        ]
    }, [areas])

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Overview</h1>
            <List
                title="Models"
                description={`Shows ${models?.length} out of ${count} Methodologies.`}
            >
                <ListItem>
                    <div className="text-gray-500 text-xs flex flex-col gap-4 w-full">
                        <Input
                            label="Search"
                            placeholder="Search by Name"
                            value={query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        />
                        <Select
                            label="Areas"
                            value={area}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArea(e.target.value)}
                            options={areaOptions}
                        />
                    </div>
                </ListItem>
                {isLoading || isFetching &&
                    <ListItem>
                        <div className="text-gray-500 text-xs">Loading...</div>
                    </ListItem>
                }
                {models && models.map(model => <ModelListItem key={model.id} model={model} />)}
            </List>
        </div>
    )
}