import { useEffect, useRef } from 'react'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ScoreCircle({ score, size = 160 }) {
  const progressRef = useRef(null)
  const prevScore = useRef(score)

  const strokeDashoffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE

  // Animate on score change
  useEffect(() => {
    prevScore.current = score
  }, [score])

  const getScoreColor = (s) => {
    if (s >= 90) return '#f59e0b'
    if (s >= 70) return '#7c5cfc'
    if (s >= 50) return '#34d399'
    return '#9494b8'
  }

  const color = getScoreColor(score)
  const svgSize = size
  const cx = svgSize / 2
  const cy = svgSize / 2
  const strokeWidth = 8
  const r = (svgSize / 2) - strokeWidth - 4

  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div className="score-circle-wrapper">
      <div style={{ position: 'relative', width: svgSize, height: svgSize }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="score-circle-svg"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color === '#7c5cfc' ? '#22d3ee' : color} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          <circle
            ref={progressRef}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            filter="url(#glow)"
            style={{
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center text */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: svgSize * 0.22,
            fontWeight: 900,
            color: color,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: `0 0 20px ${color}66`,
            transition: 'color 0.4s ease',
          }}>
            {score}%
          </span>
          <span style={{
            fontSize: svgSize * 0.09,
            color: 'var(--text-muted)',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginTop: 2,
          }}>
            score AMP
          </span>
        </div>
      </div>
    </div>
  )
}
