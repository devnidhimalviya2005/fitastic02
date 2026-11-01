import { useState, useEffect } from 'react'
import WeekChart from '../components/WeekChart'
import WeightLog from '../components/WeightLog'
import { week, sampleWeights } from '../data/dummyData'

const KEY = 'fitastic_weights'

function loadWeights() {
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? JSON.parse(saved) : sampleWeights
  } catch {
    return sampleWeights
  }
}

export default function Progress() {
  const [weights, setWeights] = useState(loadWeights)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(weights))
  }, [weights])

  const addWeight = (entry) => setWeights([...weights, entry])
  const deleteWeight = (id) => setWeights(weights.filter((w) => w.id !== id))

  // Weekly numbers
  const totalConsumed = week.reduce((s, d) => s + d.consumed, 0)
  const totalBurned = week.reduce((s, d) => s + d.burned, 0)
  const avgConsumed = Math.round(totalConsumed / week.length)

  // Weight change: sabse purani entry se sabse nayi tak
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date))
  const weightChange =
    sorted.length >= 2 ? sorted[sorted.length - 1].weight - sorted[0].weight : 0

  const cards = [
    { label: 'Avg consumed / day', value: `${avgConsumed} kcal` },
    { label: 'Burned this week', value: `${totalBurned} kcal` },
    {
      label: 'Weight change',
      value: `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg`,
    },
  ]

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">Progress</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{c.label}</p>
            <h3 className="mt-1 text-2xl font-semibold">{c.value}</h3>
          </div>
        ))}
      </div>

      {/* Chart + weekly table */}
      <div className="grid gap-4 lg:grid-cols-2">
        <WeekChart week={week} />

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold">Weekly summary</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 font-semibold">
                  <th className="p-2">Day</th>
                  <th className="p-2">Consumed</th>
                  <th className="p-2">Burned</th>
                  <th className="p-2">Net</th>
                </tr>
              </thead>
              <tbody>
                {week.map((d) => (
                  <tr key={d.label} className="border-b border-slate-100">
                    <td className="p-2">{d.label}</td>
                    <td className="p-2">{d.consumed}</td>
                    <td className="p-2">{d.burned}</td>
                    <td className="p-2 font-medium">{d.consumed - d.burned}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="p-2">Total</td>
                  <td className="p-2">{totalConsumed}</td>
                  <td className="p-2">{totalBurned}</td>
                  <td className="p-2">{totalConsumed - totalBurned}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Weight log */}
      <WeightLog weights={weights} onAdd={addWeight} onDelete={deleteWeight} />
    </div>
  )
}