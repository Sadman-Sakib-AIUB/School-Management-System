"use client";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import UserStep from "./steps/UserStep";
import StudentStep from "./steps/StudentStep";
import GuardianStep from "./steps/GuradianStep";
import ReviewStep from "./steps/ReviewStep";


const steps = ["Account", "Student", "Guardian", "Review"];

export default function AdmissionForm() {
  const methods = useForm({ mode: "onBlur" });

  


  const [step, setStep] = useState(0);

  const next = async () => {
    const valid = await methods.trigger();
    if (valid) setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  const onSubmit = (data) => {
    console.log("FINAL SUBMISSION DATA 👇", data);
    // later: POST to backend
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-8 bg-white rounded-2xl border space-y-8"
      >
        {/* Progress */}
        <div className="flex justify-between text-sm font-semibold">
          {steps.map((s, i) => (
            <span
              key={i}
              className={i === step ? "text-emerald-600" : "text-slate-400"}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Steps */}
        {step === 0 && <UserStep />}
        {step === 1 && <StudentStep />}
        {step === 2 && <GuardianStep />}
        {step === 3 && <ReviewStep />}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="px-6 py-2 rounded-xl border"
            >
              পেছনে
            </button>
          )}

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="px-6 py-2 rounded-xl bg-emerald-600 text-white"
            >
              পরবর্তী
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-700 text-white"
            >
              আবেদন জমা দিন
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
