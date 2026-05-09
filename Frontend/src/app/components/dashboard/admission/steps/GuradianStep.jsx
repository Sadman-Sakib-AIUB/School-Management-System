import { useFormContext } from "react-hook-form";

export default function GuardianStep() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">অভিভাবকের তথ্য</h3>

      <input {...register("guardian.fullNameBangla")} placeholder="নাম (বাংলা)" className="input" />
      <input {...register("guardian.fullNameEnglish", { required: true })} placeholder="Name (English)" className="input" />

      <input {...register("guardian.phone", { required: true })} placeholder="মোবাইল নম্বর" className="input" />
      <input {...register("guardian.email")} placeholder="Email" className="input" />
      <input {...register("guardian.nid")} placeholder="NID নম্বর" className="input" />

      <input {...register("guardian.occupation")} placeholder="পেশা" className="input" />
      <input {...register("guardian.monthlyIncome")} type="number" placeholder="মাসিক আয়" className="input" />
    </div>
  );
}
