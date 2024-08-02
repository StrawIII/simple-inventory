import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef
} from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'
import api from './api'


type Item = {
    id: string | string
    name: string
    owner_id: string
    location: string
}

const columns: ColumnDef<Item>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Id
                </button>
            )
        },
    },
    {
        accessorKey: "external_id",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    External Id
                </button>
            )
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                </button>
            )
        },
    },
    {
        accessorKey: "comment",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Comment
                </button>
            )
        },
    },
    {
        accessorKey: "owner_id",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Owner
                </button>
            )
        },
    },
    {
        accessorKey: "location",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Location
                </button>
            )
        },
    },
    {
        accessorKey: "location_comment",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Location comment
                </button>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                </button>
            )
        },
    },
]

export function Table() {
    const [data, setData] = useState<Item[]>([])
    const [selectedRow, setSelectedRow] = useState<Item | null>(null)
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })
    const [showAddItem, setShowAddItem] = useState<boolean>(false)
    const [name, setName] = useState('')
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)
    const [location, setLocation] = useState('')
    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)
    const [comment, setComment] = useState('')
    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)
    const [locationComment, setLocationComment] = useState('')
    const handleLocationCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocationComment(e.target.value)

    const handleFetchItems = () => {
        api.get('/items')
            .then((response) => {
                setData(response.data)
                console.log(response.data)
            }).catch((e) => {
                console.log(e)
            })
    }

    useEffect(() => {
        handleFetchItems();
    }, []);


    const handleSubmitModal = () => {
        const payload = {
            name,
            comment,
            location,
            location_comment: locationComment
        }

        api.post('/items', payload)
            .then(() => {
                alert("Item created")
            }).catch((e) => {
                console.log(e)
                alert("Error creating item")
            })
    }

    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleFileUpload = (e: File) => {
        const formData = new FormData();
        formData.append("upload_file", e);
        api.post("/items/bulk", formData).then(() => {
            handleFetchItems()
        }).catch((error) => {
            console.log(error)
            alert("Error uploading file")
        })
    }

    const handleUpdateItem = () => {

    }

    const handleDeleteItem = (itemId: string | number) => {
        api.delete(`/items/${itemId}`)
            .then(() => {
                alert("Item deleted")
                handleFetchItems()
            }).catch((e) => {
                console.log(e)
                alert("Error deleting")
            })
    }

    return (
        <>
            <input type="file" className={"hidden"} ref={inputRef} onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0])
                }
            }
            } />
            {showAddItem && (
                <div className={"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"}>
                    <div className={"bg-white shadow-md rounded-md p-4 relative w-[90%] max-w-[500px]"}>
                        <div className={"size-[30px] cursor-pointer flex items-center justify-center rounded-full absolute top-[10px] right-[10px] hover:bg-red-500 text-red-500 hover:text-white font-bold text-[16px]"} onClick={() => setShowAddItem(false)}>x</div>
                        <p className={"font-bold text-xl"} >Create Item</p>
                        <form className={"flex flex-col gap-[20px] mt-[20px]"}>
                            <input type="text" placeholder="Name" value={name} onChange={handleNameChange} />
                            <input type="text" placeholder="Comment" value={comment} onChange={handleCommentChange} />
                            <input type="text" placeholder="Location" value={location} onChange={handleLocationChange} />
                            <input type="text" placeholder="Location Comment" value={locationComment} onChange={handleLocationCommentChange} />

                            <button className={"px-4 py-2 rounded-md bg-green-300"} type="button" onClick={handleSubmitModal}>
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {selectedRow !== null && (
                <div className={"fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)] flex flex-col items-center justify-center"}>
                    <div className={"max-w-[500px] w-[90%] min-w-[300px] px-[24px] py-[12px] bg-white rounded-md relative"}>
                        <div className={"size-[30px] cursor-pointer flex items-center justify-center rounded-full absolute top-[10px] right-[10px] hover:bg-red-500 text-red-500 hover:text-white font-bold text-[16px]"} onClick={() => setSelectedRow(null)}>x</div>
                        <p className={"text-center font-bold text-lg"}>#{selectedRow.id} {selectedRow.name}</p>

                        <div className={"flex flex-col gpa-[10px] py-[20px]"}>
                            <p>Owner: <span className={"font-bold"}>{selectedRow.owner_id}</span></p>
                            <p>Location: <span className={"font-bold"}>{selectedRow.location}</span></p>
                        </div>

                        <div className={"flex w-full justify-end items-center"}>
                            <button className={"bg-primary-light px-4 py-2 m-2 text-center font-medium rounded-md text-white"} onClick={() => handleUpdateItem()}>
                                Edit
                            </button>
                            <button className={"bg-red-500 px-4 py-2 m-2 text-center font-medium rounded-md text-white"} onClick={() => handleDeleteItem(selectedRow.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-[100px] flex flex-col gap-[20px] w-full">
                <p className={'font-bold text-xl'}>Dashboard</p>
                <div className="w-full flex items-center justify-between">
                    <div className='flex gap-[20px]'>
                        <button className="bg-primary-light rounded-md text-md px-5 py-2  text-white" onClick={() => setShowAddItem(true)}>Add Item</button>
                        <button className="bg-primary-light rounded-md text-md px-5 py-2  text-white" onClick={() => inputRef.current?.click()}>Add Bulk</button>
                    </div>
                    <button onClick={handleFetchItems} className='text-white bg-primary-light rounded-md text-md px-5 py-2  '>Refetch</button>
                </div>
                <div className={'bg-white shadow-md rounded-md px-[24px] py-[12px]'}>
                    <table className={"w-full"}>
                        <thead className={''}>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className={'w-[200px] uppercase'}>
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
                        <tbody className={""}>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className={'hover:bg-gray-100 cursor-pointer rounded-md h-[40px] '}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className={'w-[200px] text-center'} onClick={() => setSelectedRow(cell.row.original)}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
