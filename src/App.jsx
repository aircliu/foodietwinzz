import { Routes, Route } from 'react-router-dom'
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
        </Route>
      </Routes>
    </Suspense>
  )
}
