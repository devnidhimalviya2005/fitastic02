
import { useState, useEffect } from 'react'
import MealForm from '../components/MealForm'
import MealTable from '../components/MealTable'
import { user, sampleMeals } from '../data/dummyData'

const KEY = 'fitastic_meals'

function loadMeals() {
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? JSON.parse(saved) : sampleMeals
  } catch {
    return sampleMeals
  }
}

export default function Meals() {
  const [meals, setMeals] = useState(loadMeals)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(meals))
  }, [meals])

  const addMeal = (meal) => setMeals([meal, ...meals])
  const deleteMeal = (id) => setMeals(meals.filter((m) => m.id !== id))

  const total = meals.reduce((sum, m) => sum + m.calories, 0)
  const percent = Math.min(100, Math.round((total / user.calorieTarget) * 100))

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">Calorie Intake</h2>

      <MealForm onAdd={addMeal} />

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Today: {total} kcal</h3>
          <span className="text-sm text-slate-500">Target {user.calorieTarget} kcal</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-4">
          <MealTable meals={meals} onDelete={deleteMeal} />
        </div>
      </div>
    </div>
  )
}