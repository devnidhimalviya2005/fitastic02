import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Meals from "./pages/Meals";
import Workout from "./pages/workout";
import Profile from "./pages/Profile";

function Private({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  return user
    ? children
    : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-page font-sans text-navy">
      {user && <Navbar />}

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />

          <Route path="/" element={<Private><Dashboard /></Private>} />
          <Route path="/meals" element={<Private><Meals /></Private>} />
          <Route path="/workouts" element={<Private><Workout /></Private>} />
          <Route path="/progress" element={<Private><Dashboard /></Private>} />         
          <Route path="/profile" element={<Private><Profile /></Private>} />
          
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}