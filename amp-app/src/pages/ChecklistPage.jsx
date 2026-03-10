import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ScoreCircle from '../components/ScoreCircle'
import CriteriaAccordion from '../components/CriteriaAccordion'
import {
  loadEntries, saveEntries, loadSettings,
  getTodayString, getEntryByDate, upsertEntry,
  getAllCriteria, computeScore, formatDateLong
} from '../data'

// ─── CONFIRMATION MODAL ───────────────────────────────────────────────────────

function ConfirmModal({ score, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Valider ta journée ? ✨</div>
        <div className="modal-subtitle">
          Ton score AMP du jour est de <strong style={{ color: 'var(--accent-light)' }}>{score}%</strong>.<br />
          Cette entrée sera sauvegardée.
        </div>
        <div className="modal-actions">
          <button className="btn btn-primary btn-full btn-lg" onClick={onConfirm}>
            Confirmer — Sauvegarder 🚀
          </button>
          <button className="btn btn-ghost btn-full" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── CHECKLIST PAGE ───────────────────────────────────────────────────────────

export default function ChecklistPage() {
  const navigate = useNavigate()
  const today = getTodayString()

  const [entries, setEntries] = useState(() => loadEntries())
  const [settings] = useState(() => loadSettings())
  const [responses, setResponses] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const allCriteria = useMemo(() => getAllCriteria(settings), [settings])

  // Group criteria by category
  const groupedCriteria = useMemo(() => {
    return allCriteria.reduce((acc, c) => {
      if (!acc[c.category]) acc[c.category] = []
      acc[c.category].push(c)
      return acc
    }, {})
  }, [allCriteria])

  const score = useMemo(() => computeScore(responses, allCriteria), [responses, allCriteria])

  // Load existing entry for today
  useEffect(() => {
    const existing = getEntryByDate(entries, today)
    if (existing) {
      setResponses(existing.responses || {})
      setIsEditing(true)
    }
  }, [])

  const handleToggle = (criterionId, value) => {
    setResponses(prev => {
      if (value === null) {
        const next = { ...prev }
        delete next[criterionId]
        return next
      }
      return { ...prev, [criterionId]: value }
    })
  }

  const handleValidate = () => setShowModal(true)

  const handleConfirm = () => {
    const entry = {
      id: isEditing ? getEntryByDate(entries, today)?.id : crypto.randomUUID(),
      date: today,
      responses,
      score,
    }
    const updated = upsertEntry(entries, entry)
    saveEntries(updated)
    setEntries(updated)
    setShowModal(false)
    navigate(`/result/${today}`)
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>
              {isEditing ? 'Modifier ma journée' : 'Ma journée'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              {formatDateLong(today)}
            </p>
          </div>
          <div style={{
            background: 'var(--accent-soft)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 12px',
            fontSize: '0.75rem',
            color: 'var(--accent-light)',
            fontWeight: 600,
            border: '1px solid rgba(124, 92, 252, 0.2)',
          }}>
            ⚡ AMP
          </div>
        </div>
      </div>

      {/* Score Circle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
        <ScoreCircle score={score} size={170} />
      </div>

      {/* Criteria */}
      <CriteriaAccordion
        groupedCriteria={groupedCriteria}
        responses={responses}
        onToggle={handleToggle}
      />

      {/* Validate Button */}
      <div style={{ marginTop: 'var(--space-6)' }}>
        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleValidate}
          style={{ fontSize: '1rem' }}
        >
          {isEditing ? '✏️ Modifier ma journée' : '✅ Valider ma journée'}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <ConfirmModal
          score={score}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
