import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function DragAndDrop() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
  });

  return (
    <div
      className="flex h-96 w-96 flex-col items-center justify-between rounded-3xl bg-green-300 p-5 pt-48"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <span className="bg-orange-100">Drop it like it's hot!</span>
      ) : (
        <p className="bg-orange-100">Drop some files here!</p>
      )}
      <button className="rounded-full bg-primary-light p-2 text-white">
        Select files
      </button>
    </div>
  );
}
