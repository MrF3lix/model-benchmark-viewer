import { TypedSupabaseClient } from "@/utils/supabase/types";
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
dayjs.extend(dayOfYear)


export const getTaskById = (client: TypedSupabaseClient, id: string) => {
    return client
        .from('task_count')
        .select()
        .eq('id', id)
        .throwOnError()
}

export const getTaskByArea = (client: TypedSupabaseClient, area: string) => {
    return client
        .from('task')
        .select()
        .eq('area', area)
        .throwOnError()
}

export const getTaskCountsByArea = (client: TypedSupabaseClient, area: string) => {
    return client
        .from('task_count')
        .select()
        .eq('area', area)
        .order('year_2024', {ascending: false})
        .throwOnError()
}


export const mapTask = (task: any) => {
    let yearly_avg_per_day = {
        '2020': task.year_2020 / 365,
        '2021': task.year_2021 / 365,
        '2022': task.year_2022 / 365,
        '2023': task.year_2023 / 365,
        '2024': task.year_2024 / dayjs().dayOfYear()
    }

    let avg_rating = (task.total / (365 + 365 + 365 + 365 + dayjs().dayOfYear()))
    let change = (yearly_avg_per_day['2024'] - yearly_avg_per_day['2023']) / yearly_avg_per_day['2023'] * 100

    if (change == Infinity) {
        change = 0
    }

    return {
        ...task,
        avg_rating,
        change,
        yearly_avg_per_day
    }
}