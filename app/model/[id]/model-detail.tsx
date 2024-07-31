'use client'

import useSupabaseBrowser from '@/utils/supabase/browser'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import Link from 'next/link'
import { getModelById, getResultsByMethodology } from '@/queries/results'
import { useEffect, useMemo, useState } from 'react'
import { Badge, BadgeType } from '@/components/badge'
import { Table } from '@/components/table/table'
import { createColumnHelper } from '@tanstack/react-table'

interface ModelParams {
    id: string
}

interface Result {
    id: string,
    methodology: string,
    paper: string,
    evaluated_on: string,
    uses_additional_data: boolean,
    metrics: Record<string, string>[]
}

const columnHelper = createColumnHelper<Result>()
const default_columns = [
    columnHelper.accessor('methodology', {
        header: () => 'Methodology',
        cell: info => info.getValue()
    }),
    columnHelper.accessor('evaluated_on', {
        header: () => 'Evaluated On',
        cell: info => info.getValue()
    }),
    columnHelper.accessor('uses_additional_data', {
        header: () => 'Use Additional Data',
        cell: info => info.getValue() ? 'Yes' : 'No'
    })
]

const mapResult = (result: any): Result => {
    return {
        ...result
    }
}

const getColumnFromRow = (row: any | undefined) => {
    if(!row) {
        return default_columns
    }

    const metricColumns = Object.keys(row.metrics).map(metricKey => columnHelper.accessor(`metrics.${metricKey}`, {
        header: () => `${metricKey}`,
        cell: info => info.getValue()
    }))

    return [
        ...default_columns,
        ...metricColumns
    ]
}

export default function ModelDetail({ id }: ModelParams) {
    const [methodology, setMethodology] = useState<string>('')
    const supabase = useSupabaseBrowser()
    const { data: model, isLoading } = useQuery(getModelById(supabase, id))

    useEffect(() => {
        setMethodology(model?.methodology || '')
    }, [model])

    const { data: results } = useQuery(getResultsByMethodology(supabase, methodology))
    const tables = useMemo(() => {
        const resultList = results?.map(mapResult) || []
        const grouped = Object.groupBy(resultList, ({ evaluation }: any) => evaluation);

        return Object.keys(grouped).map(key => {
            if(!grouped[key]) {
                return {
                    id: key,
                    data: [],
                    columns: default_columns
                }
            }

            return {
                id: key,
                data: grouped[key],
                columns: getColumnFromRow(grouped[key][0])
            }
        })
    }, [results])

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Model Detail</h1>
            <div className="flex flex-col gap-4 w-full bg-white rounded-md">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Methodology</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{methodology}</dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Paper</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <Link target="_blank" rel="noopener noreferrer" className="text-sm underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={`https://paperswithcode.com/paper/${model?.paper}`}>
                                {model?.paper}
                            </Link>
                        </dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Areas</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {model?.area && Array.isArray(model.area) &&
                                <div className="flex-1 flex flex-wrap gap-2 justify-start items-start">
                                    {model.area.map((area: string) => (
                                        <Badge key={area} type={BadgeType.NEUTRAL}>{area}</Badge>
                                    ))}
                                </div>
                            }
                        </dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Evaluation Dates</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {model?.evaluation_dates && model.evaluation_dates.length > 0 &&
                                <div className="flex-1 flex flex-wrap gap-2 justify-start items-start">
                                    {model.evaluation_dates.filter((date: string) => date != null).map((date: string) => (
                                        <Badge key={date} type={BadgeType.DEFAULT}>{date}</Badge>
                                    ))}
                                </div>
                            }
                        </dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">External Link</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {!isLoading &&
                                <Link className="text-sm underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={`https://paperswithcode.com/area/${id}`} target="_blank" rel="noopener noreferrer">View on Papers with Code</Link>
                            }
                        </dd>
                    </div>
                </dl>
            </div>
            {tables?.map(t => (
                <div key={t.id} className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold">{t.id}</h2>
                    <Table
                        data={t?.data || []}
                        columns={t?.columns}
                    />
                </div>
            ))}
        </div>
    )
}