import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { logout } from '../api/services'

const NAV_LINKS = [
  { to: '/', label: '홈', end: true },
  { to: '/menu', label: '메뉴 찾기' },
  { to: '/party', label: '밥친구' },
  { to: '/game', label: '🎲 게임창' },
]

export default function Header() {
  const { user, logout: ctxLogout } = useAuth()
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [q, setQ] = useState('')
  const [writeMenuOpen, setWriteMenuOpen] = useState(false)

  // ✅ 중복 제거된 로그아웃
  const handleLogout = () => {
    logout()
    ctxLogout()
    navigate('/')
    setMobileOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) {
      navigate(`/menu?q=${encodeURIComponent(q)}`)
      setMobileOpen(false)
    }
  }

  const navCls = ({ isActive }) =>
    'nav-link' + (isActive ? ' active' : '')

  return (
    <>
      {/* ── 헤더 ── */}
      <header className="site-header">
        <div className="container">

          {/* ✅ 로고 */}
          <Link to="/" className="site-logo" style={{ textDecoration: 'none' }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: 900,
              color: '#111111',
              letterSpacing: '-0.05em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.15em',
              fontFamily: '"Arial Black", "Impact", "Noto Sans KR", sans-serif',
              margin: 0
            }}>
              오늘 뭐먹지?
            </h2>
          </Link>

          {/* ✅ 검색 */}
          <div className="header-search" style={{ flex: 1, maxWidth: 420 }}>
            <span className="search-icon">🔍</span>
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <input
                type="text"
                placeholder="식당명, 메뉴 검색..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ width: '100%' }}
              />
            </form>
          </div>

          {/* ✅ 우측 메뉴 */}
          <div className="header-actions" style={{ display: 'flex', gap: 24 }}>
            {user ? (
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                🔓 로그아웃
              </button>
            ) : (
              <Link to="/login">
                ↪️ 로그인
              </Link>
            )}

            <Link to="/mypage">🤍 마이페이지</Link>
            <Link to="/cart">👜 장바구니</Link>
          </div>

        </div>
      </header>

      {/* ✅ 네비 */}
      <nav className="site-nav">
        <div className="container">

          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={navCls}>
              {label}
            </NavLink>
          ))}

          {/* ✅ 글쓰기 버튼 */}
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <button onClick={() => setWriteMenuOpen(!writeMenuOpen)}>
              💬 글쓰기 ▼
            </button>

            {writeMenuOpen && (
              <div style={{ position: 'absolute', right: 0, background: '#fff' }}>
                <Link to="/write/online">온라인메뉴</Link>
                <Link to="/write/tikitaka">티키타카</Link>
                <Link to="/write/today">요즘아워홈</Link>
              </div>
            )}
          </div>

          {user && (
            <span style={{ marginLeft: 12 }}>
              🌿 {user.nickname}
            </span>
          )}

        </div>
      </nav>

      {/* ✅ 모바일 */}
      {mobileOpen && (
        <div>
          <div onClick={() => setMobileOpen(false)} />
          <div>
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}