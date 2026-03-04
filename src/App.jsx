import { Routes, Route, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'

const HomePage = lazy(() => import('./pages/Home'))
const ChallengePage = lazy(() => import('./pages/Challenge'))
const ShopPage = lazy(() => import('./pages/Shop'))
const CommunityPage = lazy(() => import('./pages/Community'))
const ContactPage = lazy(() => import('./pages/Contact'))

const Loading = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--cream-muted)', letterSpacing: 3 }}>
    LOADING...
  </div>
)

function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 20px' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(80px, 15vw, 140px)', color: 'var(--cream)', margin: '0 0 8px', lineHeight: 1, letterSpacing: 4 }}>404</p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--cream-muted)', margin: '0 0 32px' }}>Page not found.</p>
      <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, letterSpacing: 2, padding: '14px 28px', borderRadius: 8, border: '1px solid var(--orange)', color: 'var(--orange)', textDecoration: 'none', textTransform: 'uppercase', transition: 'all 0.2s ease' }}>BACK TO HOME</Link>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
