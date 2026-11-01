
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import AuthCard from '../components/AuthCard'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-blue'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      return setError('Email aur password dono daalo')
    }
    try {
      const res = await api.post('/auth/login', form)
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
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
        />
        {error && <p className="text-sm text-brand-pink">{error}</p>}
        <button
          type="submit"
          className="rounded-lg bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink py-2.5 text-sm font-medium text-white"
        >
          Login
        </button>
      </form>

      <p className="mt-4">
        New here?{' '}
        <Link to="/register" className="text-brand-blue hover:underline">
          Create account
        </Link>
      </p>
    </AuthCard>
  )
}