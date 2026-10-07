function StatCard({ value, label }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-3xl font-bold text-blue-400">{value}</p>

      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

export default StatCard;
