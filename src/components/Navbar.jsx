import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo-gradient.png'


const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/meals', label: 'Meals' },
  { to: '/workouts', label: 'Workouts' },
  { to: '/progress', label: 'Progress' },
  { to: '/profile', label: 'Profile' },
]

const linkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-blue-100 text-brand-blue' : 'hover:bg-slate-100'
  }`

const logoutClass =
  'rounded-full bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink px-5 py-2 text-sm font-medium text-white'

export default function Navbar() {
  const [open, setOpen] = useState(false)
    const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
        <img src={logo} alt="Fitastic" className="h-12" />

        {/* Mobile menu button */}
        <button className="text-2xl md:hidden" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          
          <button className={`ml-2 ${logoutClass}`} onClick={handleLogout}>Logout</button>

        </div>
      </div>

      {/* Mobile links */}
      {open && (
        <div className="flex flex-col gap-1 border-t px-4 py-3 md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          
      <button className={logoutClass} onClick={handleLogout}>Logout</button>
          
          
          
        </div>
      )}
    </nav>
  )
}