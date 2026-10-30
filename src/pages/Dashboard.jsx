
import StatCard from '../components/StatCard'
import GoalRing from '../components/GoalRing'
import WeekChart from '../components/WeekChart'
import { user, today, week } from '../data/dummyData'

export default function Dashboard() {
  const net = today.consumed - today.burned
  const remaining = user.calorieTarget - net
  const date = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  const stats = [
    { icon: '🍽️', bg: 'bg-blue-100', label: 'Consumed', value: today.consumed },
    { icon: '🔥', bg: 'bg-pink-100', label: 'Burned', value: today.burned },
    { icon: '⚖️', bg: 'bg-purple-100', label: 'Net', value: net },
    { icon: '🎯', bg: 'bg-green-100', label: 'Remaining', value: remaining },
  ]

  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <div className="flex flex-col gap-3 rounded-2xl bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">
            Hi {user.name}, stay fit stay fantastic!
          </h1>
          <p className="mt-1 text-sm opacity-90">Aaj ka target {user.calorieTarget} kcal hai.</p>
        </div>
        <span className="w-fit rounded-full bg-white/30 px-4 py-2 text-sm">{date}</span>
      </div>

      {/* 4 cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Ring + chart */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
        <GoalRing consumed={today.consumed} target={user.calorieTarget} />
        <WeekChart week={week} />
      </div>
    </div>
  )
}