
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Meals from './pages/Meals'
import ComingSoon from './pages/ComingSoon'

function Private({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-page font-sans text-navy">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-6">
        
        <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Private wrapper hata kar direct components pass kar dein */}
  <Route path="/" element={<Dashboard />} />
  <Route path="/meals" element={<Meals />} />
  <Route path="/workouts" element={<ComingSoon title="Workouts" />} />
  <Route path="/progress" element={<ComingSoon title="Progress" />} />
  <Route path="/suggestions" element={<ComingSoon title="Suggestions" />} />
  <Route path="/profile" element={<ComingSoon title="Profile" />} />
</Routes>
        
      </main>
    </div>
  )
}