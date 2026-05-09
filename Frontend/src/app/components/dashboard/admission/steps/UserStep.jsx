import { useFormContext } from "react-hook-form";

export default function UserStep() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">অ্যাকাউন্ট তথ্য</h3>

      <input
        {...register("user.username", { required: true })}
        placeholder="Username"
        className="input"
      />
      <input
        {...register("user.email", { required: true })}
        placeholder="Email"
        className="input"
      />
      <input
        {...register("user.password", { required: true })}
        type="password"
        placeholder="Password"
        className="input"
      />
    </div>
  );
}
