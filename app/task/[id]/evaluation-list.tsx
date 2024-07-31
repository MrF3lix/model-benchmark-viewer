'use client'

import useSupabaseBrowser from '@/utils/supabase/browser'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { List } from '@/components/list/list'
import { ListItem } from '@/components/list/list-item'
import { getTaskById, mapTask } from '@/queries/tasks'
import Link from 'next/link'
import { Input } from '@/components/form/input'
import { Select } from '@/components/form/select'
import { useMemo, useState } from 'react'
import { getEvaluationByTask } from '@/queries/evaluations'
import { Badge, BadgeType } from '@/components/badge'
import Markdown from 'react-markdown'
import { CustomMarkdownComponents } from '@/utils/markdown'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

dayjs.extend(dayOfYear)

interface EvaluationParams {
    id: string
}

const EvaluationListItem = ({ evaluation }: any) => {
    return (
        <ListItem className="p-0">
            <Link className="w-full p-6 flex justify-between items-center" href={`/evaluation/${evaluation.id}`}>
                <div className="flex flex-col gap-2 min-w-96">
                    <div className="font-semibold truncate">{evaluation.id}</div>
                    {evaluation.description &&
                        <div className="text-sm text-gray-700">
                            <Markdown components={CustomMarkdownComponents()}>
                                {evaluation.description}
                            </Markdown>
                        </div>
                    }
                    <div className="text-sm text-gray-700">
                        <span className="font-semibold">Dataset: </span>
                        <pre className="inline">{evaluation.dataset}</pre>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="truncate text-gray-500 text-xs text-wrap inline-flex flex-col gap-2">
                        {!evaluation.change && evaluation.change != 0 &&
                            <Badge type={BadgeType.DEFAULT}>Outdated Evaluation</Badge>
                        }

                        {evaluation.change > 0 &&
                            <Badge type={BadgeType.GOOD}>Increased: {evaluation.change.toFixed(1)} %</Badge>
                        }

                        {evaluation.change == 0 &&
                            <Badge type={BadgeType.NEUTRAL}>New Evaluation</Badge>
                        }

                        {evaluation.change < 0 && evaluation.change != -100 &&
                            <Badge type={BadgeType.BAD}>Decreased: {evaluation.change.toFixed(1)} %</Badge>
                        }

                        {evaluation.change === -100 &&
                            <Badge type={BadgeType.BAD}>No Evaluations this Year</Badge>
                        }
                        <div className="truncate text-gray-500 text-xs text-wrap">
                            Total Results: {evaluation.total}
                        </div>
                    </div>
                </div>
                <div className="w-10 p-1 rounded-full text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <ArrowRightIcon className="block h-5 w-5" />
                </div>
            </Link>
        </ListItem>
    )
}

const mapEvaluation = (evaluation: any) => {
    let yearly_avg_per_day = {
        '2020': evaluation.year_2020 / 365,
        '2021': evaluation.year_2021 / 365,
        '2022': evaluation.year_2022 / 365,
        '2023': evaluation.year_2023 / 365,
        '2024': evaluation.year_2024 / dayjs().dayOfYear()
    }

    let avg_rating = (evaluation.total / (365 + 365 + 365 + 365 + dayjs().dayOfYear()))
    let change = (yearly_avg_per_day['2024'] - yearly_avg_per_day['2023']) / yearly_avg_per_day['2023'] * 100

    if (change == Infinity) {
        change = 0
    }

    return {
        ...evaluation,
        avg_rating,
        change,
        yearly_avg_per_day
    }
}

export default function EvaluationList({ id }: EvaluationParams) {
    const supabase = useSupabaseBrowser()
    const { data: tasks } = useQuery(getTaskById(supabase, id))
    const { data: evaluations, isLoading } = useQuery(getEvaluationByTask(supabase, id))

    const sortOptions = [
        { name: 'Change since last Year', value: 'change' },
        { name: 'Result Count', value: 'total' },
        { name: 'Average Rate per Year', value: 'avg_rating' },
    ]
    const [sortBy, setSortBy] = useState<string>(sortOptions[0].value)

    const [query, setQuery] = useState<string>('')

    const task = useMemo(() => {
        if (tasks && Array.isArray(tasks)) {
            const mappedTask = mapTask(tasks[0])
            return {
                ...mappedTask,
                areas: tasks.map(t => t.area)
            }
        }
        return tasks
    }, [tasks])

    const evaluationList = useMemo(() => {
        return evaluations?.map(mapEvaluation).sort((a, b) => b[sortBy] - a[sortBy])
    }, [evaluations, sortBy])

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Task Detail</h1>

            <div className="flex flex-col gap-4 w-full bg-white rounded-md">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Id</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{task?.id}</dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <Markdown components={CustomMarkdownComponents()}>
                                {task?.description}
                            </Markdown>
                        </dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Change</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {task.change > 0 &&
                                <Badge type={BadgeType.GOOD}>{task.change.toFixed(1)} %</Badge>
                            }

                            {task.change == 0 &&
                                <Badge type={BadgeType.NEUTRAL}>New</Badge>
                            }

                            {task.change < 0 &&
                                <Badge type={BadgeType.BAD}>{task.change.toFixed(1)} %</Badge>
                            }
                        </dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Results in 2024</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{task.year_2024} <span className="text-xs text-gray-600">(per day {task.yearly_avg_per_day['2024'].toFixed(2)})</span></dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Results in 2023</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{task.year_2023} <span className="text-xs text-gray-600">(per day {task.yearly_avg_per_day['2023'].toFixed(2)})</span></dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Results in 2022</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{task.year_2022} <span className="text-xs text-gray-600">(per day {task.yearly_avg_per_day['2022'].toFixed(2)})</span></dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Results in 2021</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{task.year_2021} <span className="text-xs text-gray-600">(per day {task.yearly_avg_per_day['2021'].toFixed(2)})</span></dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Results in 2020</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{task.year_2020} <span className="text-xs text-gray-600">(per day {task.yearly_avg_per_day['2020'].toFixed(2)})</span></dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Number of total related Results</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{task.total}</dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Areas</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex gap-2">
                            {task?.areas.map((area: string) => (<Badge key={area} type={BadgeType.NEUTRAL}>{area}</Badge>))}
                        </dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">External Link</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {!isLoading &&
                                <Link className="text-sm underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={`https://paperswithcode.com/task/${task?.id}`} target="_blank" rel="noopener noreferrer">View {task?.name} on Papers with Code</Link>
                            }
                        </dd>
                    </div>
                </dl>
            </div>

            <List
                title="Evaluations"
                description="A list of all the evaluations for the selected task. An evaluation is usually distinguished by the dataset used on the task."
            >
                {isLoading &&
                    <ListItem>
                        <div className="text-gray-500 text-xs">Loading...</div>
                    </ListItem>
                }
                <ListItem>
                    <div className="text-gray-500 text-xs flex flex-col gap-4 w-full">
                        <Input
                            label="Search"
                            placeholder="Search by Id"
                            value={query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        />
                        <Select
                            label="Sort By"
                            value={sortBy}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSortBy(e.target.value)}
                            options={sortOptions}
                        />
                    </div>
                </ListItem>
                {evaluationList &&
                    evaluationList
                        .filter(evaluation => query.length > 0 ? evaluation.id?.includes(query) : true)
                        .map(evaluation => <EvaluationListItem key={evaluation.id} evaluation={evaluation} />)
                }
            </List>
        </div>
    )
}