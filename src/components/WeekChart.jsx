export default function WeekChart({ week }) {
  const max = Math.max(...week.map((d) => Math.max(d.consumed, d.burned)), 1)

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Last 7 days</h3>

      {week.map((d) => (
        <div key={d.label} className="my-3 flex items-center gap-2 text-xs sm:text-sm">
          <span className="w-14 shrink-0 text-slate-500">{d.label}</span>
          <div className="flex-1 space-y-1">
            <div className="h-3 rounded-full bg-brand-blue" style={{ width: `${(d.consumed / max) * 100}%` }} />
            <div className="h-3 rounded-full bg-brand-pink" style={{ width: `${(d.burned / max) * 100}%` }} />
          </div>
        </div>
      ))}

      <div className="mt-3 flex gap-4 text-xs text-slate-500">
        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-brand-blue" />Consumed</span>
        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-brand-pink" />Burned</span>
      </div>
    </div>
  )
}