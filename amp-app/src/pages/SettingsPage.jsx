import { useState, useEffect, useCallback } from 'react'
import {
  loadSettings, saveSettings,
  requestNotificationPermission, startReminderCheck, stopReminderCheck
} from '../data'

// ─── SETTINGS TOGGLE COMPONENT ────────────────────────────────────────────────

function SettingsToggle({ on, onChange }) {
  return (
    <button
      className={`settings-toggle ${on ? 'on' : ''}`}
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
    >
      <div className="settings-toggle-thumb" />
    </button>
  )
}

// ─── CUSTOM CRITERION CARD ────────────────────────────────────────────────────

function CustomCriterionCard({ criterion, index, onChange }) {
  const [label, setLabel] = useState(criterion.label)

  const handleBlur = () => {
    onChange({ ...criterion, label: label.trim(), isActive: label.trim() !== '' && criterion.isActive })
  }

  const handleToggleActive = () => {
    if (!criterion.label.trim() && !label.trim()) return
    onChange({ ...criterion, isActive: !criterion.isActive })
  }

  return (
    <div className={`custom-criterion-card ${criterion.isActive ? 'active' : ''}`}>
      <div className="custom-criterion-header">
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-light)' }}>
          ⭐ Critère {index + 1}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {criterion.isActive ? 'Actif' : 'Inactif'}
          </span>
          <SettingsToggle
            on={criterion.isActive && criterion.label.trim() !== ''}
            onChange={handleToggleActive}
          />
        </div>
      </div>
      <input
        className="input-field"
        type="text"
        placeholder="Ex: J'ai médité 10 minutes..."
        value={label}
        onChange={e => setLabel(e.target.value)}
        onBlur={handleBlur}
        maxLength={80}
      />
    </div>
  )
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState(() => loadSettings())
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )

  const persist = useCallback((newSettings) => {
    setSettings(newSettings)
    saveSettings(newSettings)
    stopReminderCheck()
    startReminderCheck(newSettings)
  }, [])

  const handleCustomCriterionChange = (idx, updatedCriterion) => {
    const updated = [...settings.customCriteria]
    updated[idx] = updatedCriterion
    persist({ ...settings, customCriteria: updated })
  }

  const handleReminderToggle = async (val) => {
    if (val) {
      const granted = await requestNotificationPermission()
      setNotifPermission(Notification.permission)
      if (!granted) return
    }
    persist({ ...settings, reminderEnabled: val })
  }

  const handleReminderTimeChange = (e) => {
    persist({ ...settings, reminderTime: e.target.value })
  }

  const activeCustomCount = settings.customCriteria.filter(c => c.isActive && c.label.trim() !== '').length

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Paramètres</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Personnalise ton expérience AMP
        </p>
      </div>

      {/* Custom criteria section */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Mes critères personnalisés</div>
          <span style={{
            fontSize: '0.75rem',
            color: activeCustomCount > 0 ? 'var(--accent-light)' : 'var(--text-muted)',
            fontWeight: 600,
          }}>
            {activeCustomCount}/3 actifs
          </span>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
          Ajoute jusqu'à 3 critères personnels qui seront inclus dans ton score AMP.
        </p>

        {settings.customCriteria.map((criterion, idx) => (
          <CustomCriterionCard
            key={criterion.id}
            criterion={criterion}
            index={idx}
            onChange={(updated) => handleCustomCriterionChange(idx, updated)}
          />
        ))}
      </div>

      <div className="divider" />

      {/* Reminder section */}
      <div>
        <div className="section-label" style={{ marginBottom: 'var(--space-4)' }}>Rappel quotidien</div>

        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Activer le rappel</div>
            <div className="settings-row-desc">
              {notifPermission === 'denied'
                ? '⚠️ Notifications bloquées dans votre navigateur'
                : 'Reçois une notification chaque jour'}
            </div>
          </div>
          <SettingsToggle
            on={settings.reminderEnabled && notifPermission === 'granted'}
            onChange={handleReminderToggle}
          />
        </div>

        {settings.reminderEnabled && notifPermission === 'granted' && (
          <div className="settings-row" style={{ marginTop: 'var(--space-2)' }}>
            <div className="settings-row-info">
              <div className="settings-row-label">Heure du rappel</div>
              <div className="settings-row-desc">Le rappel sera envoyé à cette heure</div>
            </div>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={handleReminderTimeChange}
              style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9375rem',
                cursor: 'pointer',
              }}
            />
          </div>
        )}
      </div>

      <div className="divider" />

      {/* About section */}
      <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          background: 'var(--accent-soft)',
          border: '1px solid rgba(124, 92, 252, 0.2)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 16px',
          marginBottom: 'var(--space-3)',
        }}>
          <span style={{ fontSize: '1rem' }}>⚡</span>
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--accent-light)' }}>AMP v1.0</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
          Attitude Mentale Positive<br />
          <em>Mesure ta journée. Élève ton mental.</em>
        </p>
      </div>
    </div>
  )
}
