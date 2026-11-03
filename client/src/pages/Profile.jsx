
import { useEffect, useState } from 'react'
import api, { errorText } from '../api'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-blue'

const num = (v) => (v === '' ? undefined : Number(v))

const fields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'height', label: 'Height (cm)', type: 'number' },
  { name: 'weight', label: 'Weight (kg)', type: 'number' },
  { name: 'calorieTarget', label: 'Daily calorie target (kcal)', type: 'number' },
]

function bmiLabel(bmi) {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export default function Profile() {
  const [form, setForm] = useState({ name: '', age: '', height: '', weight: '', calorieTarget: 2000 })
  const [message, setMessage] = useState({ text: '', ok: true })

  useEffect(() => {
    api
      .get('/profile')
      .then((res) => {
        const u = res.data
        setForm({
          name: u.name || '',
          age: u.age ?? '',
          height: u.height ?? '',
          weight: u.weight ?? '',
          calorieTarget: u.calorieTarget ?? 2000,
        })
      })
      .catch((err) => setMessage({ text: errorText(err), ok: false }))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put('/profile', {
        name: form.name,
        age: num(form.age),
        height: num(form.height),
        weight: num(form.weight),
        calorieTarget: num(form.calorieTarget),
      })
      setMessage({ text: 'Profile save ho gaya.', ok: true })
    } catch (err) {
      setMessage({ text: errorText(err), ok: false })
    }
  }

  const bmi = form.weight && form.height ? Number(form.weight) / (Number(form.height) / 100) ** 2 : null

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">Profile</h2>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-brand-purple to-brand-pink text-3xl font-semibold text-white">
            {(form.name || '?').charAt(0).toUpperCase()}
          </div>
          <p className="mt-3 text-lg font-semibold">{form.name || 'Your name'}</p>
          <div className="mt-4 rounded-xl bg-blue-50 p-3">
            <p className="text-xs text-slate-500">BMI</p>
            <p className="text-2xl font-semibold">{bmi ? bmi.toFixed(1) : '-'}</p>
            {bmi && <p className="text-xs text-slate-500">{bmiLabel(bmi)}</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.name} className="text-sm">
              <span className="mb-1 block text-slate-500">{f.label}</span>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                className={inputClass}
              />
            </label>
          ))}

          <div className="flex items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink px-8 py-2 text-sm font-medium text-white"
            >
              Save
            </button>
            {message.text && (
              <span className={`text-sm ${message.ok ? 'text-green-600' : 'text-brand-pink'}`}>{message.text}</span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}