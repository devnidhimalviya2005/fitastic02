
import { useEffect, useState } from 'react'
import api, { errorText } from '../api'

const inputClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue'

const badge = {
  breakfast: 'bg-yellow-100 text-yellow-700',
  lunch: 'bg-green-100 text-green-700',
  dinner: 'bg-purple-100 text-purple-700',
  snack: 'bg-pink-100 text-pink-700',
}

export default function Meals() {
  const [foods, setFoods] = useState([])
  const [meals, setMeals] = useState([])
  const [total, setTotal] = useState(0)
  const [target, setTarget] = useState(2000)
  const [foodId, setFoodId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState('breakfast')
  const [message, setMessage] = useState('')

  const loadMeals = async () => {
    try {
      const res = await api.get('/meals')
      setMeals(res.data.meals)
      setTotal(res.data.total)
    } catch (err) {
      setMessage(errorText(err))
    }
  }

  useEffect(() => {
    api.get('/meals/foods').then((res) => setFoods(res.data)).catch((err) => setMessage(errorText(err)))
    api.get('/profile').then((res) => setTarget(res.data.calorieTarget || 2000)).catch(() => {})
    loadMeals()
  }, [])

  const selected = foods.find((f) => f._id === foodId)
  const preview = selected ? Math.round(selected.calories * Number(quantity || 0)) : 0
  const percent = Math.min(100, Math.round((total / target) * 100))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.post('/meals', { foodId, quantity: Number(quantity), category })
      setFoodId('')
      setQuantity(1)
      loadMeals()
    } catch (err) {
      setMessage(errorText(err))
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete('/meals/' + id)
      loadMeals()
    } catch (err) {
      setMessage(errorText(err))
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">Calorie Intake</h2>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={foodId}
            onChange={(e) => setFoodId(e.target.value)}
            required
            className={`${inputClass} sm:flex-1`}
          >
            <option value="">Select food</option>
            {foods.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name} ({f.servingSize}, {f.calories} kcal)
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0.5"
            step="0.5"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={`${inputClass} sm:w-24`}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputClass} capitalize sm:w-36`}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>

          <button
            type="submit"
            className="rounded-full bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink px-6 py-2 text-sm font-medium text-white"
          >
            Add
          </button>
        </div>

        {selected && (
          <p className="mt-3 text-sm text-slate-500">
            {quantity} x {selected.name} = <b className="text-navy">{preview} kcal</b>
          </p>
        )}
        {foods.length === 0 && !message && (
          <p className="mt-3 text-sm text-slate-500">
            Foods ki list khali hai. Server folder me <code>node data/seed.js</code> chalao.
          </p>
        )}
        {message && <p className="mt-3 text-sm text-brand-pink">{message}</p>}
      </form>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Today: {total} kcal</h3>
          <span className="text-sm text-slate-500">Target {target} kcal</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink"
            style={{ width: `${percent}%` }}
          />
        </div>

        {meals.length === 0 ? (
          <p className="py-8 text-center text-slate-500">
            Aaj abhi koi meal add nahi hua. Upar se add karo.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 font-semibold">
                  <th className="p-2">Food</th>
                  <th className="p-2">Meal</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">kcal</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {meals.map((m) => (
                  <tr key={m._id} className="border-b border-slate-100">
                    <td className="p-2">{m.foodName}</td>
                    <td className="p-2">
                      <span className={`rounded-full px-2 py-1 text-xs capitalize ${badge[m.category]}`}>
                        {m.category}
                      </span>
                    </td>
                    <td className="p-2">{m.quantity}</td>
                    <td className="p-2">{m.calories}</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="rounded-full bg-brand-pink px-3 py-1 text-xs text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}