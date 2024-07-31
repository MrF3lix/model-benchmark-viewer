import { ReactElement } from "react"

export enum BadgeType {
    GOOD,
    BAD,
    NEUTRAL,
    DEFAULT
}

interface BadgeProps {
    type: BadgeType,
    children: ReactElement | ReactElement[] | string
}

const getColorFromType = (type: BadgeType): string => {
    switch(type){
        case BadgeType.GOOD:
            return 'bg-green-100 text-green-700 ring-green-500/10'
        case BadgeType.BAD:
            return 'bg-red-100 text-red-800 ring-red-500/10'
        case BadgeType.NEUTRAL:
            return 'bg-blue-100 text-blue-700 ring-blue-500/10'
        default:
            return 'bg-gray-100 text-gray-600 ring-gray-500/10'
    }
}

export const Badge = ({type, children}: BadgeProps) => {
    return (
        <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getColorFromType(type)}`}
        >
            {children}
        </span>

    )
}