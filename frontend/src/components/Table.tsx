import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef
} from '@tanstack/react-table'
import { useState } from 'react'


type Item = {
    itemId: string
    name: string
    owner: string // should be its own type?
    location: string
}


const defaultData: Item[] = [
    { itemId: "1", name: "Raspberry Pi", owner: "Roman", location: "366" },
    { itemId: "2", name: "Monitor", owner: "Cyril", location: "256" }
]

// const columnHelper = createColumnHelper<Item>()

// could be created dynamicly using props?
// const columns = [
//     columnHelper.accessor('itemId', { id: "itemId", header: "ID" }),
//     columnHelper.accessor("name", { header: "Name" }),
//     columnHelper.accessor('owner', { header: "Owner" }),
//     columnHelper.accessor('location', { header: "Location" }),
// ]
const columns: ColumnDef<Item>[] = [
    {
        accessorKey: "itemId",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                </button>
            )
        }
    },
    { accessorKey: "name" },
    { accessorKey: "owner" },
    { accessorKey: "location" },
]

export function Table() {
    const [data, _setData] = useState(() => [...defaultData])

    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

    return (
        <div className="p-20 bg-red-300">
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
