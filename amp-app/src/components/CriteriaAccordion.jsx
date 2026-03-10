import { useState } from 'react'
import { CATEGORIES } from '../data'

function ChevronIcon({ open }) {
  return (
    <svg className={`accordion-chevron ${open ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function TogglePill({ value, onChange, disabled }) {
  return (
    <div className="toggle-pill">
      <button
        className={`toggle-pill-btn ${value === true ? 'active-yes' : ''}`}
        onClick={() => !disabled && onChange(value === true ? null : true)}
        aria-label="Oui"
      >
        Oui
      </button>
      <button
        className={`toggle-pill-btn ${value === false ? 'active-no' : ''}`}
        onClick={() => !disabled && onChange(value === false ? null : false)}
        aria-label="Non"
      >
        Non
      </button>
    </div>
  )
}

function AccordionSection({ category, criteria, responses, onToggle, disabled }) {
  const [open, setOpen] = useState(true)
  const cat = CATEGORIES[category]
  const answered = criteria.filter(c => responses[c.id] === true).length
  const hasChecked = answered > 0

  return (
    <div className={`accordion-section ${hasChecked ? 'has-checked' : ''}`}>
      <button className="accordion-header" onClick={() => setOpen(!open)}>
        <div className="accordion-header-left">
          <div
            className="accordion-icon"
            style={{ background: `${cat.color}18`, color: cat.color }}
          >
            {cat.emoji}
          </div>
          <div>
            <div className="accordion-title">{cat.label}</div>
            <div className="accordion-progress">{answered}/{criteria.length} complété{answered > 1 ? 's' : ''}</div>
          </div>
        </div>
        <ChevronIcon open={open} />
      </button>

      <div
        className="accordion-body"
        style={{ maxHeight: open ? `${criteria.length * 100}px` : '0' }}
      >
        <div className="accordion-body-inner">
          {criteria.map(criterion => (
            <div
              key={criterion.id}
              className={`criterion-row ${responses[criterion.id] === true ? 'answered-yes' : ''}`}
            >
              <span className="criterion-label">{criterion.label}</span>
              <TogglePill
                value={responses[criterion.id] ?? null}
                onChange={(val) => onToggle(criterion.id, val)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CriteriaAccordion({ groupedCriteria, responses, onToggle, disabled = false }) {
  return (
    <div>
      {Object.entries(groupedCriteria).map(([category, criteria]) => (
        <AccordionSection
          key={category}
          category={category}
          criteria={criteria}
          responses={responses}
          onToggle={onToggle}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
