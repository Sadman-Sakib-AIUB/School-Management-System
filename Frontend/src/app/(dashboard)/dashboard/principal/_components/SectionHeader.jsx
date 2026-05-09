import { ChevronRight } from "lucide-react";

const SectionHeader = ({ title, sub, icon: Icon, iconBg, iconColor, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={16} className={iconColor} />
      </div>
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
    {action && (
      <button className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:underline">
        সব দেখুন <ChevronRight size={13} />
      </button>
    )}
  </div>
);

export default SectionHeader;