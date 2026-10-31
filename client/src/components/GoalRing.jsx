export default function GoalRing({ consumed, target }) {
  const percent = Math.min(100, Math.round((consumed / target) * 100))

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Daily goal</h3>
      <div
        className="mx-auto my-4 flex h-36 w-36 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(#2a7de1 0 ${percent}%, #e8efff ${percent}% 100%)` }}
      >
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
          <b className="text-2xl">{percent}%</b>
          <span className="text-xs text-slate-500">of {target} kcal</span>
        </div>
      </div>
    </div>
  )
}