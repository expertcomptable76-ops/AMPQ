import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ChecklistPage from './pages/ChecklistPage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import { loadSettings, startReminderCheck } from './data'

// ─── ICONS ───────────────────────────────────────────────────────────────────

function HomeIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function HistoryIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function SettingsIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────

function BottomNav() {
  const location = useLocation()
  const path = location.pathname

  const isHome    = path === '/'
  const isHistory = path === '/history'
  const isSettings = path === '/settings'

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${isHome ? 'active' : ''}`}>
        <HomeIcon filled={isHome} />
        <span>Aujourd'hui</span>
      </Link>
      <Link to="/history" className={`nav-item ${isHistory ? 'active' : ''}`}>
        <HistoryIcon filled={isHistory} />
        <span>Historique</span>
      </Link>
      <Link to="/settings" className={`nav-item ${isSettings ? 'active' : ''}`}>
        <SettingsIcon filled={isSettings} />
        <span>Paramètres</span>
      </Link>
    </nav>
  )
}

// ─── HIDE NAV ON RESULT PAGE ──────────────────────────────────────────────────

function ConditionalNav() {
  const location = useLocation()
  if (location.pathname.startsWith('/result/')) return null
  return <BottomNav />
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    const settings = loadSettings()
    startReminderCheck(settings)
  }, [])

  return (
    <div className="app-layout">
      <Routes>
        <Route path="/"            element={<ChecklistPage />} />
        <Route path="/result/:date" element={<ResultPage />} />
        <Route path="/history"     element={<HistoryPage />} />
        <Route path="/settings"    element={<SettingsPage />} />
      </Routes>
      <ConditionalNav />
    </div>
  )
}
