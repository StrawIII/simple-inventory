import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch("email")); // watch input value by passing the name of it

  return (
    <div className="flex w-72 flex-col space-y-5 rounded-3xl p-5 shadow-2xl">
      <form
        className="flex flex-col space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="rounded-full border-2 px-5 py-1 shadow-2xl"
          type="email"
          placeholder="E-mail"
          {...register("email", { required: true })}
        />
        <small className="h-4 text-red-500">
          {errors.email ? "This field is required" : ""}
        </small>
        <input
          className="rounded-full border-2 px-5 py-1 shadow-2xl"
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
      <div className="h-px bg-black bg-opacity-25" />
      <button className="white rounded-full bg-primary-light p-2 text-white">
        Sign Up
      </button>
    </div>
  );
}
