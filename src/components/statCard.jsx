export default function StatCard({ icon, bg, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-xl ${bg}`}>
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="text-2xl font-semibold">
        {value} <span className="text-sm font-normal text-slate-500">kcal</span>
      </h3>
    </div>
  )
}