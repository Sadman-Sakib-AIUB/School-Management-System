import { useFormContext } from "react-hook-form";

export default function ReviewStep() {
  const { getValues } = useFormContext();
  const data = getValues();

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">তথ্য যাচাই</h3>

      <pre className="bg-slate-100 p-4 rounded-xl text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>

      <p className="text-slate-600">
        উপরের তথ্য সঠিক হলে আবেদন জমা দিন।
      </p>
    </div>
  );
}
