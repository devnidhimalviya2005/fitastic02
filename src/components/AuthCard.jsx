import logo from '../assets/logo-gradient.png'

export default function AuthCard({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <img src={logo} alt="Fitastic" className="mx-auto mb-4 w-64" />
        {children}
      </div>
    </div>
  )
}