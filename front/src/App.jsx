import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import { fetchMe } from './api/services'
import { TokenStore } from './api/axiosInstance'

import Header    from './components/Header'
import ChatBot   from './components/ChatBot'
import Home      from './pages/Home'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Menu      from './pages/Menu'
import Party     from './pages/Party'
import MyPage    from './pages/MyPage'

// ── Auth Context ──────────────────────────────────────────────────────────────
export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (TokenStore.getAccess()) {
      fetchMe()
        .then(setUser)
        .catch(() => { TokenStore.clear(); setUser(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login  = (userData) => setUser(userData)
  const logout = () => { TokenStore.clear(); setUser(null) }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex justify-center items-center h-screen text-gray-400">로딩 중...</div>
  return user ? children : <Navigate to="/login" replace />
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/"         element={<Home />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu"     element={<Menu />} />
              <Route path="/party"    element={<Party />} />
              <Route path="/mypage"   element={<PrivateRoute><MyPage /></PrivateRoute>} />
            </Routes>
          </main>
          <ChatBot />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

