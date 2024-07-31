'use client'

import useSupabaseBrowser from '@/utils/supabase/browser'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { List } from '@/components/list/list'
import { ListItem } from '@/components/list/list-item'
import Link from 'next/link'
import { Input } from '@/components/form/input'
import { Select } from '@/components/form/select'
import { useMemo, useState } from 'react'
import { getEvaluationById } from '@/queries/evaluations'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import { getResultsByEvaluation } from '@/queries/results'
import { Table } from '@/components/table/table'
import { createColumnHelper } from '@tanstack/react-table'
import { ListHeader } from '@/components/list/list-header'
import Markdown from 'react-markdown'
import { CustomMarkdownComponents } from '@/utils/markdown'

dayjs.extend(dayOfYear)

interface ResultProps {
    id: string
}

const mapResult = (result: any): Result => {
    return {
        ...result
    }
}

interface Result {
    id: string,
    methodology: string,
    paper: string,
    evaluated_on: string,
    metrics: Record<string, string>[]
}

const columnHelper = createColumnHelper<Result>()
const default_columns = [
    columnHelper.accessor('methodology', {
        header: () => 'Methodology',
        cell: info => info.getValue()
    }),
    columnHelper.accessor('paper', {
        header: () => 'Paper',
        cell: info => (
            <Link className="text-sm underline text-blue-600 hover:text-blue-800 visited:text-purple-600" target="_blank" rel="noopener noreferrer" href={`https://paperswithcode.com/paper/${info.getValue()}`}>
                {info.getValue()}
            </Link>
        )
    }),
    columnHelper.accessor('evaluated_on', {
        header: () => 'Evaluated On',
        cell: info => info.getValue()
    })
]

export default function ResultList({ id }: ResultProps) {
    const supabase = useSupabaseBrowser()
    const { data: evaluation } = useQuery(getEvaluationById(supabase, id))
    const { data: results, isLoading } = useQuery(getResultsByEvaluation(supabase, id))

    const resultList = useMemo(() => {
        return results?.map(mapResult) || []
    }, [results])

    const columns = useMemo(() => {

        if (resultList.length == 0) {
            return default_columns
        }

        const first = resultList[0]
        const metricColumns = Object.keys(first.metrics).map(metricKey => columnHelper.accessor(`metrics.${metricKey}`, {
            header: () => `${metricKey}`,
            cell: info => info.getValue()
        }))

        return [
            ...default_columns,
            ...metricColumns,
            columnHelper.accessor('id', {
                header: () => 'Link',
                cell: info => <Link className="text-sm underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={`/model/${info.getValue()}`} >View</Link>
            })
        ]
    }, [resultList])

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Evaluation Detail</h1>
            <div className="flex flex-col gap-4 w-full bg-white rounded-md">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Id</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{evaluation?.id}</dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Dataset</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"><pre>{evaluation?.dataset}</pre></dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <Markdown components={CustomMarkdownComponents()}>
                                {evaluation?.description}
                            </Markdown>
                        </dd>
                    </div>
                </dl>
            </div>

            {!isLoading &&
                <div className="flex flex-col">
                    <ListHeader
                        title="Results"
                        description={`A list of all the results for the ${evaluation?.id} evaluation`}
                    />
                    <Table
                        data={resultList}
                        columns={columns}
                    />
                </div>
            }
        </div>
    )
}