const { CheckCircle2 } = require("lucide-react");

const STEPS = ["অ্যাকাউন্ট", "ব্যক্তিগত", "রিভিউ", "কমপ্লিট"];

const StepIndicator = ({ step }) => (
  <div className="flex items-center mb-6">
    {STEPS.map((label, idx) => {
      const s = idx + 1;
      const done = step > s;
      const active = step === s;
      return (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-all ${done ? "bg-emerald-500 border-emerald-500 text-white" :
                active ? "bg-violet-600 border-violet-600 text-white" :
                  "bg-white border-gray-200 text-gray-400"
              }`}>
              {done ? <CheckCircle2 size={15} /> : s}
            </div>
            <span className={`mt-1 text-xs font-semibold whitespace-nowrap ${active ? "text-violet-700" : done ? "text-emerald-600" : "text-gray-400"
              }`}>
              {label}
            </span>
          </div>
          {s < STEPS.length && (
            <div className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 rounded-full transition-all ${step > s ? "bg-emerald-400" : "bg-gray-200"
              }`} />
          )}
        </div>
      );
    })}
  </div>
);


export default StepIndicator;