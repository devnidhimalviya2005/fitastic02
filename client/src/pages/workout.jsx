
import { useEffect, useState } from 'react'
import api, { errorText } from '../api'

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue'

const icons = {
  Walking: '🚶',
  Running: '🏃',
  Cycling: '🚴',
  Swimming: '🏊',
  Yoga: '🧘',
  Skipping: '⚡',
  'Weight Training': '🏋️',
  Dancing: '💃',
  Badminton: '🏸',
}

export default function Workouts() {
  const [activities, setActivities] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [weight, setWeight] = useState(null)
  const [activity, setActivity] = useState('')
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
  const [message, setMessage] = useState('')

  const loadWorkouts = async () => {
    try {
      const res = await api.get('/workouts')
      setWorkouts(res.data)
    } catch (err) {
      setMessage(errorText(err))
    }
  }

  useEffect(() => {
    api.get('/workouts/activities').then((res) => setActivities(res.data)).catch((err) => setMessage(errorText(err)))
    api.get('/profile').then((res) => setWeight(res.data.weight || null)).catch(() => {})
    loadWorkouts()
  }, [])

  const chosen = activities.find((a) => a.name === activity)
  const estimate =
    chosen && Number(duration) > 0 ? Math.round(chosen.met * (weight || 60) * (Number(duration) / 60)) : 0

  const totalMinutes = workouts.reduce((s, w) => s + (w.duration || 0), 0)
  const totalBurned = workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.post('/workouts', {
        activity,
        duration: Number(duration),
        distance: distance === '' ? undefined : Number(distance),
      })
      setActivity('')
      setDuration('')
      setDistance('')
      loadWorkouts()
    } catch (err) {
      setMessage(errorText(err))
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete('/workouts/' + id)
      loadWorkouts()
    } catch (err) {
      setMessage(errorText(err))
    }
  }

  const stats = [
    { label: 'Workouts', value: workouts.length, unit: '' },
    { label: 'Total time', value: totalMinutes, unit: 'min' },
    { label: 'Calories burned', value: totalBurned, unit: 'kcal' },
  ]

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">Workouts</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-linear-to-br from-brand-purple/10 to-brand-blue/10 p-4">
            <p className="text-sm text-slate-500">{s.label}</p>
            <h3 className="mt-1 text-2xl font-semibold">
              {s.value} <span className="text-sm font-normal text-slate-500">{s.unit}</span>
            </h3>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Log a workout</h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Activity</span>
            <select value={activity} onChange={(e) => setActivity(e.target.value)} required className={inputClass}>
              <option value="">Select activity</option>
              {activities.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Duration (min)</span>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Distance (km, optional)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink px-8 py-2 text-sm font-medium text-white"
          >
            Save workout
          </button>
          {estimate > 0 && (
            <span className="text-sm text-slate-500">
              Estimated burn: <b className="text-navy">{estimate} kcal</b>
              {!weight && ' (Profile me weight save karo, abhi 60 kg maana hai)'}
            </span>
          )}
        </div>
        {message && <p className="mt-3 text-sm text-brand-pink">{message}</p>}
      </form>

      <div>
        <h3 className="mb-3 text-lg font-semibold">History</h3>
        {workouts.length === 0 ? (
          <p className="rounded-2xl bg-white py-8 text-center text-slate-500 shadow-sm">
            Abhi koi workout nahi hai.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.map((w) => (
              <div key={w._id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                    {icons[w.activity] || '💪'}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">{w.activity}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(w._id)}
                    className="rounded-full bg-brand-pink px-3 py-1 text-xs text-white"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-3 flex gap-4 text-sm text-slate-500">
                  <span>{w.duration} min</span>
                  {w.distance ? <span>{w.distance} km</span> : null}
                  <b className="ml-auto text-navy">{w.caloriesBurned} kcal</b>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}