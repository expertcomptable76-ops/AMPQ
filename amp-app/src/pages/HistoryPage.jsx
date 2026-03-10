import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Dot
} from 'recharts'
import { loadEntries, getBadge, formatDateShort, formatDateChart } from '../data'

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const score = payload[0]?.value
  const badge = score !== undefined ? getBadge(score) : null
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
      boxShadow: 'var(--shadow-md)',
      fontSize: '0.8125rem',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 700, color: 'var(--accent-light)', fontSize: '1.125rem' }}>{score}%</div>
      {badge && <div style={{ marginTop: 2 }}>{badge.emoji} {badge.label}</div>}
    </div>
  )
}

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState(30)

  const allEntries = useMemo(() => {
    const entries = loadEntries()
    return entries.sort((a, b) => b.date.localeCompare(a.date))
  }, [])

  const filteredEntries = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - filter)
    const cutoffStr = cutoff.toISOString().slice(0, 10)
    return allEntries.filter(e => e.date >= cutoffStr)
  }, [allEntries, filter])

  const chartData = useMemo(() => {
    return [...filteredEntries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(e => ({
        date: formatDateChart(e.date),
        score: e.score,
        fullDate: e.date,
      }))
  }, [filteredEntries])

  const avgScore = useMemo(() => {
    if (!filteredEntries.length) return 0
    return Math.round(filteredEntries.reduce((sum, e) => sum + e.score, 0) / filteredEntries.length)
  }, [filteredEntries])

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Historique</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          {filteredEntries.length} journée{filteredEntries.length > 1 ? 's' : ''} enregistrée{filteredEntries.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: 'var(--space-5)' }}>
        <button
          className={`filter-tab ${filter === 7 ? 'active' : ''}`}
          onClick={() => setFilter(7)}
        >
          7 jours
        </button>
        <button
          className={`filter-tab ${filter === 30 ? 'active' : ''}`}
          onClick={() => setFilter(30)}
        >
          30 jours
        </button>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>Aucune donnée</h3>
          <p>Commence à enregistrer tes journées pour voir ton historique ici.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Commencer aujourd'hui
          </button>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <div className="card" style={{ flex: 1, textAlign: 'center', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-light)', lineHeight: 1 }}>{avgScore}%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Score moyen</div>
            </div>
            <div className="card" style={{ flex: 1, textAlign: 'center', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', lineHeight: 1 }}>
                {Math.max(...filteredEntries.map(e => e.score))}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Meilleur score</div>
            </div>
          </div>

          {/* Chart */}
          <div className="card" style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-4) var(--space-2) var(--space-3)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 'var(--space-3)', paddingLeft: 'var(--space-2)' }}>
              Évolution du score AMP
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  interval={Math.floor(chartData.length / 5)}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  tickFormatter={v => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={avgScore}
                  stroke="rgba(124, 92, 252, 0.3)"
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#lineGrad)"
                  strokeWidth={2.5}
                  dot={<Dot r={3} fill="#7c5cfc" stroke="var(--bg-base)" strokeWidth={2} />}
                  activeDot={{ r: 5, fill: '#7c5cfc', stroke: 'var(--bg-base)', strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c5cfc" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Entry list */}
          <div className="section-label">Toutes les entrées</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filteredEntries.map(entry => {
              const { day, month } = formatDateShort(entry.date)
              const badge = getBadge(entry.score)
              return (
                <div
                  key={entry.id || entry.date}
                  className="history-card"
                  onClick={() => navigate(`/result/${entry.date}`)}
                >
                  <div className="history-card-date">
                    <div className="history-card-day">{day}</div>
                    <div className="history-card-month">{month}</div>
                  </div>
                  <div className="history-card-info">
                    <div className="history-card-score">{entry.score}%</div>
                    <div className={`badge ${badge.class}`}>{badge.emoji} {badge.label}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
