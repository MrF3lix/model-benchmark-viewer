import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { ReactElement, useReducer, useState } from "react"

interface TableProps {
    columns: any[]
    data: any[]
}

type ColumnSort = {
    id: string
    desc: boolean
}

type SortingState = ColumnSort[]

export const Table = ({ data, columns }: TableProps) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    })

    return (
        <table className="min-w-full w-full divide-y divide-gray-200 bg-white rounded-b-md">
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                className="text-left p-4 text-nowrap cursor-pointer"
                                key={header.id}
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                {{
                                    asc: ' 🔼',
                                    desc: ' 🔽',
                                }[header.column.getIsSorted() as string] ?? null}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td className="text-left p-4" key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

// export const Table = ({ columnNames, children }: TableProps) => {


//     return (
//         <table className="min-w-full w-full divide-y divide-gray-300 bg-red-500">
//             <thead>
//                 <tr>
//                     {columnNames.map(name => (
//                         <th className="text-left p-4">{name}</th>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//                 {children}
//             </tbody>
//         </table>
//     )
// }