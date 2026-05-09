import { useFormContext } from "react-hook-form";

export default function StudentStep() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">শিক্ষার্থীর তথ্য</h3>

      <input {...register("student.fullNameBangla")} placeholder="নাম (বাংলা)" className="input" />
      <input {...register("student.fullNameEnglish", { required: true })} placeholder="Name (English)" className="input" />

      <input {...register("student.dateOfBirth", { required: true })} type="date" className="input" />

      <select {...register("student.gender")} className="input">
        <option value="">লিঙ্গ নির্বাচন করুন</option>
        <option value="MALE">পুরুষ</option>
        <option value="FEMALE">মহিলা</option>
      </select>

      <input {...register("student.phone")} placeholder="মোবাইল নম্বর" className="input" />
      <textarea {...register("student.address")} placeholder="ঠিকানা" className="input" />
    </div>
  );
}
