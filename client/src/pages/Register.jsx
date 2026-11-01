
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import AuthCard from '../components/AuthCard'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-blue'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || form.password.length < 6) {
      return setError('Sab fields bharo, password kam se kam 6 character ka ho')
    }
    try {
      const res = await api.post('/auth/register', form)
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Server se connect nahi ho pa raha')
    }
  }

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 6)"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
        />
        {error && <p className="text-sm text-brand-pink">{error}</p>}
        <button
          type="submit"
          className="rounded-lg bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink py-2.5 text-sm font-medium text-white"
        >
          Create account
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-blue hover:underline">
          Login
        </Link>
      </p>
    </AuthCard>
  )
}