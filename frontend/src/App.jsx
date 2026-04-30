import { BrowserRouter, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

function Header() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="border-b border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/products" className="text-xl font-semibold text-slate-900">
            Gorga Shop
          </Link>
          <p className="text-sm text-slate-500">Modern e-commerce demo</p>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-700">Welcome, {user?.name || user?.email}</span>
              <button
                onClick={logout}
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/products"
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
              >
                Products
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-surface text-slate-900">
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">
              <AppRoutes />
            </div>
          </div>
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}

export default App

