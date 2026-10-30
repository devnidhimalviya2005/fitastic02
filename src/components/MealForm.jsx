import { useState } from 'react'
import { foods, categories } from '../data/foods'

const inputClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue'

export default function MealForm({ onAdd }) {
  const [foodId, setFoodId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState('breakfast')
  const [error, setError] = useState('')

  const selected = foods.find((f) => f.id === Number(foodId))
  const preview = selected ? Math.round(selected.calories * Number(quantity || 0)) : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selected) return setError('Pehle food select karo')
    if (!(Number(quantity) > 0)) return setError('Quantity 0 se zyada honi chahiye')

    onAdd({
      id: Date.now(),
      foodName: selected.name,
      category,
      quantity: Number(quantity),
      calories: preview,
    })
    setError('')
    setFoodId('')
    setQuantity(1)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={foodId}
          onChange={(e) => setFoodId(e.target.value)}
          className={`${inputClass} sm:flex-1`}
        >
          <option value="">Select food</option>
          {foods.map((f) => (
            <option key={f.id} value={f.id}>
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
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
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
      {error && <p className="mt-3 text-sm text-brand-pink">{error}</p>}
    </form>
  )
}