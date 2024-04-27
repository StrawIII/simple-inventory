import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function DragAndDrop() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    accept: { "text/csv": [".csv"] },
  });

  return (
    <div
      // className={
      //   "flex h-96 w-[90%] max-w-lg flex-col items-center justify-between rounded-3xl border-2 border-dashed border-black p-5 pt-48 " +
      //   (isDragActive ? "bg-slate-600" : "bg-gray-200")
      // }
      className={`flex h-96 w-[90%] max-w-lg flex-col items-center justify-between rounded-3xl border-2 border-dashed border-black p-5 pt-48 ${isDragActive ? "scale-105 bg-gray-300 shadow-2xl" : "bg-gray-200"}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <p className="bg-orange-100">
        {isDragActive ? "Drop it like it's hot!" : "Drop some file here!"}
      </p>
      <button
        onClick={open}
        className="rounded-full bg-primary-light p-2 text-white"
      >
        Select files
      </button>
    </div>
  );
}
