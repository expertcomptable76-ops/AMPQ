import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMemo } from 'react'
import {
  loadEntries, loadSettings, getAllCriteria,
  getBadge, formatDateLong, CATEGORIES
} from '../data'

export default function ResultPage() {
  const { date } = useParams()
  const navigate = useNavigate()

  const entries = useMemo(() => loadEntries(), [])
  const settings = useMemo(() => loadSettings(), [])
  const allCriteria = useMemo(() => getAllCriteria(settings), [settings])

  const entry = entries.find(e => e.date === date)
  const badge = entry ? getBadge(entry.score) : null

  if (!entry) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h2>Entrée introuvable</h2>
          <p>Aucune entrée trouvée pour cette date.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  // Unanswered or answered No
  const missedCriteria = allCriteria.filter(c => entry.responses[c.id] !== true)
  const successCriteria = allCriteria.filter(c => entry.responses[c.id] === true)

  return (
    <div className="page-content" style={{ paddingBottom: 'var(--space-10)' }}>
      {/* Back button */}
      <button
        className="btn btn-ghost"
        onClick={() => navigate('/')}
        style={{ marginBottom: 'var(--space-4)', paddingLeft: 0 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Retour
      </button>

      {/* Date */}
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
        {formatDateLong(date)}
      </p>

      {/* Score */}
      <div className="result-score-display">
        <div className="result-score-number score-pop">{entry.score}%</div>

        {/* Badge */}
        <div className={`badge ${badge.class}`} style={{ fontSize: '1rem', padding: '8px 20px' }}>
          {badge.emoji} {badge.label}
        </div>

        {/* Motivational message */}
        <p className="result-message" style={{ maxWidth: 320, textAlign: 'center' }}>
          "{badge.message}"
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', lineHeight: 1 }}>{successCriteria.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Réussis ✅</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-secondary)', lineHeight: 1 }}>{missedCriteria.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>À améliorer</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-light)', lineHeight: 1 }}>{allCriteria.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Critères</div>
        </div>
      </div>

      {/* Missed criteria */}
      {missedCriteria.length > 0 && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div className="section-label">Axes d'amélioration 🎯</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {missedCriteria.map(c => {
              const cat = CATEGORIES[c.category]
              return (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'rgba(248, 113, 113, 0.05)',
                    border: '1px solid rgba(248, 113, 113, 0.15)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{cat?.emoji}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{c.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Link to="/history" className="btn btn-primary btn-full btn-lg" style={{ textDecoration: 'none', display: 'flex' }}>
          📈 Voir mon historique
        </Link>
        <button className="btn btn-secondary btn-full" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
