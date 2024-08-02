
import React, { useContext, useEffect, useState } from 'react'
import api from '../components/api'
import { UserContext } from '../context/User'
import { useLocation } from 'react-router-dom'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

type Item = {
    id: number
    username: string
    email: string
    is_admin: boolean
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
        }
    },
    {
        accessorKey: "username",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Username
                </button>
            )
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                </button>
            )
        }
    },
    {
        accessorKey: "is_admin",
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Admin
                </button>
            )
        },
    },
]

function UserManagement() {
    const [data, setData] = useState<Item[]>([])
    const { pathname } = useLocation()
    const { user, validateUserAccess } = useContext(UserContext)

    useEffect(() => {
        validateUserAccess(pathname)
    }, [validateUserAccess])

    console.log("user", user);
    const [selectedRow, setSelectedRow] = useState<Item | null>(null)
    const [users, setUsers] = useState<any[]>([])
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })
    const [showCreateUser, setShowCreateUser] = useState<boolean>(false)
    const [editUser, setEditUser] = useState<number | null>(null)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const showEditUser = (user: any) => {
        setIsAdmin(user.isAdmin)
        setUsername(user.username)
        setEmail(user.email)
        setPassword(user.password)

        setShowCreateUser(true)
    }

    const handleFetchUsers = () => {
        api.get('/users')
            .then((response) => {
                setData(response.data)
            }).catch((e) => {
                console.log(e)
            })
    }

    useEffect(() => {
        handleFetchUsers();
    }, []);

    const handleAddUser = () => {
        api.post('/users', { username, password, email, is_admin: isAdmin })
            .then(() => {
                alert("User added")
                handleFetchUsers()
            })
            .catch((e) => console.log(e))
    }
    const handleDeleteUser = (id: number) => {
        api.delete(`/users/${id}`)
            .then(() => {
                alert("User deleted")
                handleFetchUsers()
            })
            .catch((e) => {
                console.log(e)
                alert("Error while deleting user")
            })
    }
    const handleEditUser = (id: number) => {
        api.put(`/users/${id}`, { username, password, email, isAdmin })
            .then(() => {
                alert("User edited")
                handleFetchUsers()
            })
            .catch((e) => console.log(e))
    }



    const handleClose = () => {
        setShowCreateUser(false)
        setEditUser(null)

        setUsername('')
        setEmail('')
        setPassword('')
        setIsAdmin(false)

    }

    const handleSubmitModal = () => {
        if (editUser) {
            handleEditUser(editUser)
        } else {
            handleAddUser()
        }
        setEditUser(null)
        setShowCreateUser(false)
    }

    return (
        <>
            {showCreateUser && (
                <div className={"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"}>
                    <div className={"bg-white shadow-md rounded-md p-4 relative w-[90%] max-w-[500px]"}>
                        <div className={"size-[30px] cursor-pointer flex items-center justify-center rounded-full absolute top-[10px] right-[10px] hover:bg-red-500 text-red-500 hover:text-white font-bold text-[16px]"} onClick={() => handleClose()}>x</div>
                        <p className={"font-bold text-xl"} >Create User</p>
                        <form className={"flex flex-col gap-[20px] mt-[20px]"} onSubmit={handleAddUser}>
                            <input type="text" placeholder="Username" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
                            <input type="email" placeholder="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                            <div className={"flex flex-row items-center gap-[10px]"}>
                                <input type="checkbox" checked={isAdmin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsAdmin(e.target.checked)} />
                                <p onClick={() => setIsAdmin((prev) => !prev)}>Is Admin?</p>
                            </div>
                            <button className={"px-4 py-2 rounded-md bg-primary-light text-white"} type="button" onClick={handleSubmitModal}>
                                Create User
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {selectedRow !== null && (
                <div className={"fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)] flex flex-col items-center justify-center"}>
                    <div className={"max-w-[500px] w-[90%] min-w-[300px] px-[24px] py-[12px] bg-white rounded-md relative"}>
                        <div className={"size-[30px] cursor-pointer flex items-center justify-center rounded-full absolute top-[10px] right-[10px] hover:bg-red-500 text-red-500 hover:text-white font-bold text-[16px]"} onClick={() => setSelectedRow(null)}>x</div>
                        <p className={"text-center font-bold text-lg"}>#{selectedRow.id} {selectedRow.username}</p>

                        <div className={"flex flex-col gpa-[10px] py-[20px]"}>
                            <p>Email: <span className={"font-bold"}>{selectedRow.email}</span></p>
                            <p>Admin: <span className={"font-bold"}>{selectedRow.is_admin}</span></p>
                            <p>Last sign in: </p>
                            <p>Member since: </p>
                        </div>

                        <div className={"flex w-full justify-end items-center"}>
                            <button className={"bg-primary-light px-4 py-2 m-2 text-center font-medium rounded-md text-white"} onClick={() => handleEditUser(selectedRow.id)}>
                                Edit
                            </button>
                            <button className={"bg-red-500 px-4 py-2 m-2 text-center font-medium rounded-md text-white"} onClick={() => handleDeleteUser(selectedRow.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className={"mt-[100px] flex flex-col gap-[20px] w-full"}>
                <p className={'font-bold text-xl'}>User Management</p>
                <div className="w-full flex items-center justify-between">
                    <button className={"px-4 py-2 rounded-md bg-primary-light w-fit text-white"} onClick={() => setShowCreateUser(true)}>
                        Add User
                    </button>
                    <button className={"px-4 py-2 rounded-md bg-primary-light w-fit text-white"} onClick={() => handleFetchUsers()}>
                        Refresh
                    </button>
                </div>
                <div className={'bg-white shadow-md rounded-md px-[24px] py-[12px]'}>
                    <table className={'w-full'}>
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

export default UserManagement
