import { useState } from 'react'

const inputClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue'

function Trend({ items }) {
  if (items.length < 2) return null

  const w = 300
  const h = 100
  const pad = 12
  const values = items.map((i) => i.weight)
  const min = Math.min(...values)
  const range = Math.max(...values) - min || 1

  const points = items.map((it, i) => [
    pad + (i / (items.length - 1)) * (w - 2 * pad),
    h - pad - ((it.weight - min) / range) * (h - 2 * pad),
  ])

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full">
      <polyline
        points={points.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke="#2a7de1"
        strokeWidth="2.5"
      />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#d6396b" />
      ))}
    </svg>
  )
}

export default function WeightLog({ weights, onAdd, onDelete }) {
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = Number(weight)
    if (!(value > 20 && value < 300)) return setError('Sahi weight daalo (kg me)')
    if (!date) return setError('Date chuno')

    onAdd({ id: Date.now(), date, weight: value })
    setWeight('')
    setError('')
  }

  const oldestFirst = [...weights].sort((a, b) => a.date.localeCompare(b.date))
  const newestFirst = [...oldestFirst].reverse()

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Weight log</h3>

      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="number"
          step="0.1"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className={`${inputClass} sm:flex-1`}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
        <button
          type="submit"
          className="rounded-full bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink px-6 py-2 text-sm font-medium text-white"
        >
          Add
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-brand-pink">{error}</p>}

      <Trend items={oldestFirst} />

      {newestFirst.length === 0 ? (
        <p className="py-6 text-center text-slate-500">Abhi koi weight entry nahi hai.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {newestFirst.map((item, i) => {
            const previous = newestFirst[i + 1]
            const change = previous ? item.weight - previous.weight : null

            return (
              <li key={item.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                <span className="w-28 text-slate-500">{item.date}</span>
                <b className="flex-1">{item.weight} kg</b>
                {change !== null && (
                  <span className={change <= 0 ? 'text-green-600' : 'text-brand-pink'}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)} kg
                  </span>
                )}
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded-full bg-brand-pink px-3 py-1 text-xs text-white"
                >
                  Delete
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}