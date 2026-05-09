const StatCard = ({ label, value, sub, icon: Icon, iconBg, iconColor, accent, trend, trendUp }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className={`h-1.5 w-12 rounded-full ${accent}`} />
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-sm font-semibold text-gray-500">{label}</p>
    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    {/* {trend && (
      <p className={`text-xs font-semibold mt-2 ${trendUp === true ? "text-emerald-500" : trendUp === false ? "text-red-400" : "text-amber-500"}`}>
        {trendUp === true ? "↑" : trendUp === false ? "↓" : "→"} {trend}
      </p>
    )} */}
  </div>
);

export default StatCard;