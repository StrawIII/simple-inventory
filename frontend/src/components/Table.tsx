import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  FilterFn,
  SortingFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useEffect, useRef, useState, useMemo } from "react";
import api from "./api";
import { useSearchParams } from "react-router-dom";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import { indigo } from "@mui/material/colors";
import { Info } from "@mui/icons-material";

type Item = {
  id: string;
  external_id: string;
  name: string;
  owner_id: string;
  location: string;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// TODO: use Class Variance Authority
const statusElement = (status: any) => {
  if (status === "AVAILABLE") {
    return (
      <span className="rounded-lg bg-green-200 p-2 text-green-600">
        {status}
      </span>
    );
  }
  if (status === "UNAVAILABLE") {
    return (
      <span className="rounded-lg bg-red-200 p-2 text-red-600">{status}</span>
    );
  }
};

export function Table() {
  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "external_id",
        header: "External ID",
      },
      {
        accessorKey: "name",
        header: "Name",
        filterFn: fuzzyFilter,
      },
      {
        accessorKey: "comment",
        header: "Comment",
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <span style={{ color: "#ccc" }}>No comment</span>
          ),
      },
      {
        accessorKey: "owner_id",
        header: "Owner",
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "location_comment",
        header: "Location Comment",
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <span style={{ color: "#ccc" }}>No comment</span>
          ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => statusElement(info.getValue()),
      },
    ],
    [],
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState<Item[]>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    // globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const [selectedRow, setSelectedRow] = useState<Item | null>(null);
  const [showAddItem, setShowAddItem] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [comment, setComment] = useState("");
  const [locationComment, setLocationComment] = useState("");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocation(e.target.value);
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setComment(e.target.value);
  const handleLocationCommentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setLocationComment(e.target.value);

  // TODO: implement filtering using useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFetchItems = () => {
    api
      .get("/items")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    handleFetchItems();
  }, []);

  const handleSubmitModal = () => {
    const payload = {
      name,
      comment,
      location,
      location_comment: locationComment,
    };

    api
      .post("/items", payload)
      .then(() => {
        alert("Item created");
      })
      .catch((e) => {
        console.log(e);
        alert("Error creating item");
      });
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: File) => {
    const formData = new FormData();
    formData.append("upload_file", e);
    api
      .post("/items/bulk", formData)
      .then(() => {
        handleFetchItems();
      })
      .catch((error) => {
        console.log(error);
        alert("Error uploading file");
      });
  };

  const handleUpdateItem = () => {};

  const handleDeleteItem = (itemId: string | number) => {
    api
      .delete(`/items/${itemId}`)
      .then(() => {
        alert("Item deleted");
        handleFetchItems();
      })
      .catch((e) => {
        console.log(e);
        alert("Error deleting");
      });
  };
  const fetchImageUrl = () =>
    "http://localhost:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3NpbXBsZS1pbnZlbnRvcnkvZG9nLmpwZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPVg5M01YQjBSRFlNRUlFTVNYN1NZJTJGMjAyNDA4MTUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwODE1VDIzMTEwNFomWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSllPVE5OV0VJd1VrUlpUVVZKUlUxVFdEZFRXU0lzSW1WNGNDSTZNVGN5TXpjNU9URTNNQ3dpY0dGeVpXNTBJam9pYldsdWFXOGlmUS5PWDZsWFotdnlHRzYzMkZpVEJzbG84dDk0elYzUjcyQ1RuMVZPNmZjdGVldU1zOHl3WXNzRDVTZ21yTnlyOU9ZZFUtMExESkFRdnpESkx1WURaY3VBZyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPWI5NDM5NzQwNmZhNmQyMDY4ZjJjZTdmODhjMDJlNzU2OThkZmI5NDJmMDc3YWUzMDBlNmMxZmVhNzhkY2YxODA";

  // Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)

  // Define a custom fuzzy sort function that will sort by rank if the row has ranking information
  // const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  //   let dir = 0;

  //   // Only sort by rank if the column has ranking information
  //   if (rowA.columnFiltersMeta[columnId]) {
  //     dir = compareItems(
  //       rowA.columnFiltersMeta[columnId]?.itemRank!,
  //       rowB.columnFiltersMeta[columnId]?.itemRank!,
  //     );
  //   }

  //   // Provide an alphanumeric fallback for when the item ranks are equal
  //   return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
  // };

  return (
    <>
      <input
        type="file"
        className={"hidden"}
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />
      {showAddItem && (
        <div
          className={
            "fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
          }
        >
          <div
            className={
              "relative w-[90%] max-w-[500px] rounded-md bg-white p-4 shadow-md"
            }
          >
            <div
              className={
                "absolute right-[10px] top-[10px] flex size-[30px] cursor-pointer items-center justify-center rounded-full text-[16px] font-bold text-red-500 hover:bg-red-500 hover:text-white"
              }
              onClick={() => setShowAddItem(false)}
            >
              x
            </div>
            <p className={"text-xl font-bold"}>Create Item</p>
            <form className={"mt-[20px] flex flex-col gap-[20px]"}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={handleNameChange}
              />
              <input
                type="text"
                placeholder="Comment"
                value={comment}
                onChange={handleCommentChange}
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={handleLocationChange}
              />
              <input
                type="text"
                placeholder="Location Comment"
                value={locationComment}
                onChange={handleLocationCommentChange}
              />

              <button
                className={"rounded-md bg-green-300 px-4 py-2"}
                type="button"
                onClick={handleSubmitModal}
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
      {selectedRow && (
        <div
          className={
            "fixed left-0 top-0 flex h-screen w-full flex-col items-center justify-center bg-[rgba(0,0,0,0.5)]"
          }
        >
          <div
            className={
              "relative w-[90%] min-w-[300px] max-w-[500px] rounded-md bg-white px-[24px] py-[12px]"
            }
          >
            <div
              className={
                "absolute right-[10px] top-[10px] flex size-[30px] cursor-pointer items-center justify-center rounded-full text-[16px] font-bold text-red-500 hover:bg-red-500 hover:text-white"
              }
              onClick={() => setSelectedRow(null)}
            >
              x
            </div>
            <img src={fetchImageUrl()} />
            <p className={"text-center text-lg font-bold"}>
              #{selectedRow.id} {selectedRow.name}
            </p>
            <div className={"gpa-[10px] flex flex-col py-[20px]"}>
              <p>
                Owner:{" "}
                <span className={"font-bold"}>{selectedRow.owner_id}</span>
              </p>
              <p>
                Location:{" "}
                <span className={"font-bold"}>{selectedRow.location}</span>
              </p>
            </div>

            <div className={"flex w-full items-center justify-end"}>
              <button
                className={
                  "m-2 rounded-md bg-primary-light px-4 py-2 text-center font-medium text-white"
                }
                onClick={() => handleUpdateItem()}
              >
                Edit
              </button>
              <button
                className={
                  "m-2 rounded-md bg-red-500 px-4 py-2 text-center font-medium text-white"
                }
                onClick={() => handleDeleteItem(selectedRow.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-[100px] flex w-full flex-col gap-[20px]">
        <p className={"text-xl font-bold"}>Dashboard</p>
        <input
          placeholder="Search..."
          value={searchParams.get("q") ?? ""}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            setSearchParams(e.target.value ? { q: e.target.value } : {});
            console.log(e.target.value);
          }}
        />
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-[20px]">
            <button
              className="text-md rounded-md bg-primary-light px-5 py-2  text-white"
              onClick={() => setShowAddItem(true)}
            >
              Add Item
            </button>
            <button
              className="text-md rounded-md bg-primary-light px-5 py-2  text-white"
              onClick={() => inputRef.current?.click()}
            >
              Add Bulk
            </button>
          </div>
          <button
            onClick={handleFetchItems}
            className="text-md rounded-md bg-primary-light px-5 py-2 text-white  "
          >
            Refetch
          </button>
        </div>
        <div className={"rounded-md bg-white px-[24px] py-[12px] shadow-md"}>
          <table className={"w-full"}>
            <thead className={""}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className={"w-[200px] uppercase"}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className={""}>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={
                    "h-[40px] cursor-pointer rounded-md hover:bg-gray-100 "
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={"w-[200px] text-center"}
                      onClick={() => setSelectedRow(cell.row.original)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
