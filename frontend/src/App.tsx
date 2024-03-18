// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import * as React from "react";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FileUpload />
      <Login>hello</Login>
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
      <input
        type="file"
        multiple={false}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          }
        }}
      ></input>
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
  const [username, setUsername] = useState("");

  return (
    <>
      <input
        type="text"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        value={username}
      />
      <button
        onClick={() => {
          console.log(username);
          axios
            .post(
              "http://127.0.0.1:8000/auth/" + username,
              {},
              {
                headers: {
                  Authorization:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBdXRobGliIiwic3ViIjoicm9tYW4ifQ.c_OqRQWOwfSzyCQK0SaLKPh_AI7IJfDgeaZ3aRQCZCQ",
                },
              }
            )
            .then((res) => {
              console.log(res);
            });
        }}
      >
        Login
      </button>
    </>
  );
}
