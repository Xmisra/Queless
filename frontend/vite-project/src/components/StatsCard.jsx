const StatsCard = ({ label, value, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    red: "bg-rose-50 text-rose-700 ring-rose-100",
    gray: "bg-slate-50 text-slate-700 ring-slate-100",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${tones[tone]}`}>
        {label}
      </div>
      <p className="text-3xl font-semibold tracking-tight text-slate-950">{value ?? 0}</p>
    </div>
  );
};

export default StatsCard;
