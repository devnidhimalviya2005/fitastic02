
import { useAuth } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo-gradient.png';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/meals', label: 'Meals' },
  { to: '/workouts', label: 'Workouts' },
  { to: '/progress', label: 'Progress' },
  { to: '/profile', label: 'Profile' },
];

const linkClass = ({ isActive }) =>
  `relative flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-[#244A3A] text-[#F8F5EC] shadow-sm'
      : 'text-[#526052] hover:bg-[#E9E8DA] hover:text-[#244A3A]'
  }`;

const logoutClass =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8D1B9] bg-[#F7F3E7] px-5 py-2.5 text-sm font-semibold text-[#244A3A] transition-all duration-200 hover:border-[#A5A77D] hover:bg-[#E9E8D9] active:scale-[0.98]';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav
      ref={menuRef}
      className="sticky top-0 z-50 border-b border-[#D8D1B9] bg-gradient-to-r from-[#F7F4EC] via-[#F4F1E7] to-[#E9EBDD] shadow-[0_4px_20px_rgba(36,74,58,0.06)]"
    >
      {/* Main navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        {/* Brand */}
        <NavLink
          to="/"
          className="group flex shrink-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#D8D1B9] bg-white/70 shadow-sm transition-transform duration-200 group-hover:scale-[1.03]">
            <img
              src={logo}
              alt="Fitastic"
              className="h-full w-full object-contain p-1"
            />
          </div>

          <div className="hidden sm:block">
            <span className="block text-lg font-bold tracking-tight text-[#244A3A]">
              Fitastic
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#858568]">
              Your daily wellness
            </span>
          </div>
        </NavLink>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 rounded-2xl border border-[#D8D1B9]/70 bg-white/50 p-1.5 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop logout */}
        <button
          type="button"
          className={`hidden md:inline-flex ${logoutClass}`}
          onClick={handleLogout}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M10 17l5-5-5-5M15 12H3m9-9h6a3 3 0 013 3v12a3 3 0 01-3 3h-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Logout
        </button>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D8D1B9] bg-white/60 text-[#244A3A] transition-colors hover:bg-[#E9E8DA] md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-[#D8D1B9]/70 bg-[#F5F2E9]/95 px-4 pb-5 pt-3 backdrop-blur-xl md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            <button
              type="button"
              className={`mt-2 w-full ${logoutClass}`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
