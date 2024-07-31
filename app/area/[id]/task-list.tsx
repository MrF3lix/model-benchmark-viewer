'use client'

import { getAreaById } from '@/queries/areas'
import useSupabaseBrowser from '@/utils/supabase/browser'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { List } from '@/components/list/list'
import { ListItem } from '@/components/list/list-item'
import { getTaskCountsByArea, mapTask } from '@/queries/tasks'
import Link from 'next/link'
import { Input } from '@/components/form/input'
import { Select } from '@/components/form/select'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Badge, BadgeType } from '@/components/badge'

dayjs.extend(dayOfYear)


interface TaskParams {
    id: string
}

const TaskListItem = ({ task }: any) => {
    return (
        <ListItem className="p-0">
            <Link className="w-full p-4 flex justify-between items-center" href={`/task/${task.id}`}>
                <div className="flex flex-col gap-2 min-w-96">
                    <div className="font-semibold truncate">{task.name}</div>
                    <div className="truncate text-gray-500 text-xs text-wrap">
                        Total Results: {task.total}
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <div className="truncate text-gray-500 text-xs text-wrap">
                        {task.change > 0 &&
                            <Badge type={BadgeType.GOOD}>Increased: {task.change.toFixed(1)} %</Badge>
                        }

                        {task.change == 0 &&
                            <Badge type={BadgeType.NEUTRAL}>New</Badge>
                        }

                        {task.change < 0 &&
                            <Badge type={BadgeType.BAD}>Decreased: {task.change.toFixed(1)} %</Badge>
                        }
                    </div>
                    <div className="truncate text-gray-500 text-xs text-wrap">
                        Average Results per Day: {task.avg_rating.toFixed(2)}
                    </div>
                </div>
                <div className="w-10 p-1 rounded-full text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <ArrowRightIcon className="block h-5 w-5" />
                </div>
            </Link>
        </ListItem>
    )
}

const sortOptions = [
    { name: 'Average Rate per Year', value: 'avg_rating' },
    { name: 'Result Count', value: 'total' },
    { name: 'Change since last Year', value: 'change' }
]

export default function TaskList({ id }: TaskParams) {
    const supabase = useSupabaseBrowser()
    const [query, setQuery] = useState<string>('')
    const [sortBy, setSortBy] = useState<string>(sortOptions[0].value)
    const { data: area } = useQuery(getAreaById(supabase, id))
    const { data: tasks, isLoading } = useQuery(getTaskCountsByArea(supabase, id))

    const taskList = useMemo(() => {
        return tasks?.map(mapTask).sort((a, b) => b[sortBy] - a[sortBy])
    }, [tasks, sortBy])


    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Area Detail</h1>
            <div className="flex flex-col gap-4 w-full bg-white rounded-md">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{area?.name}</dd>
                    </div>
                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">External Link</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {!isLoading &&
                                <Link className="text-sm underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={`https://paperswithcode.com/area/${area?.id}`} target="_blank" rel="noopener noreferrer">View {area?.name} on Papers with Code</Link>
                            }
                        </dd>
                    </div>
                </dl>
            </div>
            <List
                title="Tasks"
                description="A list of all the tasks for the selected area."
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
                            placeholder="Search by Name"
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
                {taskList &&
                    taskList
                        .filter(task => query.length > 0 ? task.name?.includes(query) : true)
                        .map(task => <TaskListItem key={task.id} task={task} />)
                }
            </List>
        </div>
    )
}