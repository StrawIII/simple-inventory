import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import axios from "axios";
import React from "react";
// import { onChange } from "./types.ts";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FileUpload />
      <Login />
    </QueryClientProvider>
  );
}

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  // useEffect(() => {
  //   console.log(file);
  // }, [file]);

  const fileUploadHandler = () => {
    console.log(file);

    if (file !== null) {
      const formData = new FormData();
      formData.append("upload_file", file);
      axios.post("http://127.0.0.1:8000/file", formData).then((res) => {
        console.log(res);
      });
    } else {
      console.log("No file selected!");
    }
  };

  return (
    <>
      <label className="text-xl font-bold underline">
        Select a file
        <br />
        <input
          type="file"
          multiple={false}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </label>
      <br />
      <button onClick={fileUploadHandler}>Upload</button>
      <p>{JSON.stringify(file)}</p>
    </>
  );
}

// type LoginProps = {
//   children: React.ReactNode;
// };

// function Login({ children }: LoginProps) {
function Login() {
  const [username, setUsername] = useState("unknown");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <>
      <label>
        Username:
        <input type="text" onChange={handleUsernameChange} value={username} />
      </label>
      <br />
      <button
        onClick={() => {
          console.log(username);
          axios
            .post("http://127.0.0.1:8000/auth/", {
              username: username,
              password: "password",
            })
            .then((res) => {
              console.log(res);
              localStorage.setItem("token", res.data?.token);
              console.log(res.data?.token);
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        Get token
      </button>
      <br />
      <button
        onClick={() => {
          console.log(username);
          axios
            .post(
              "http://127.0.0.1:8000/auth/",
              { username: username, password: "password" },
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            )
            .then((res) => {
              console.log(res);
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        Test token
      </button>
    </>
  );
}
