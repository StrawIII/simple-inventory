import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  example: string;
  exampleRequired: string;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

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
          {...register("exampleRequired", { required: true })}
        />
        {errors.exampleRequired && (
          <span className="px-2 text-red-500">This field is required</span>
        )}
        <input
          className="rounded-full border-2 px-5 py-1 shadow-2xl"
          placeholder="Password"
          type="password"
          {...register("example", { required: true })}
        />
        <input
          className="bg-primary-light text rounded-full p-2 text-white"
          type="submit"
          value="Sign In"
        />
      </form>
      <div className="h-px bg-black bg-opacity-25" />
      <button className="bg-primary-light white rounded-full p-2 text-white">
        Sign Up
      </button>
    </div>
  );
}
