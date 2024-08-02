import { useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserContext } from "../context/User";
import api from "./api";

type Inputs = {
  username: string;
  password: string;
};

export function LoginForm() {
  const { login } = useContext(UserContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    api.post('/auth/login', {
      username: data.username,
      password: data.password
    }).then((res) => {
      console.log(res)
      login(res.data)
    }).catch((err) => {
      alert("Wrong credentials")
      console.log(err)
    })
  }

  return (
    <div className="flex w-72 flex-col space-y-5 rounded-lg p-5  bg-white shadow-md">
      <form
        className="flex flex-col gap-[40px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className={"text-center text-xl font-bold uppercase"}>Login</p>
        <div className={"flex flex-col"}>
          <input
            className="rounded-md border border-gray-300 px-5 py-2"
            type="text"
            placeholder="username"
            {...register("username", { required: true })}
          />
          {errors.username && <small className=" text-red-500">
            {errors.username ? "This field is required" : ""}
          </small>}
        </div>
        <input
          className="rounded-md border border-gray-300 px-5 py-2"
          placeholder="Password"
          type="password"
          {...register("password", { required: true })}
        />
        <input
          className="text rounded-full bg-primary-light p-2 text-white"
          type="submit"
          value="Sign In"
        />
      </form>
    </div>
  );
}
