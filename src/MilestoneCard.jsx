import { useState } from 'react'
import './MilestoneCard.css'

function StatusBadge({ status }) {
  if (status === 'unlocked') return <span className="badge filmed">FILMED</span>
  if (status === 'next') return <span className="badge up-next">UP NEXT</span>
  return <span className="badge locked-badge">LOCKED</span>
}

export default function MilestoneCard({ data, index }) {
  const [hovered, setHovered] = useState(false)
  const isActive = data.status !== 'locked'

  return (
    <div
      className={`card ${data.status}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animationDelay: `${index * 0.08}s`,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div className="budget-circle">
        <span className="amount">{data.budget}</span>
      </div>

      <div className="card-details">
        <div className="card-top">
          <span className="followers">{data.followers} followers</span>
          <StatusBadge status={data.status} />
        </div>

        <div className="item-row">
          <span className="item-emoji">{data.emoji}</span>
          <h3 className="item-name">{data.item}</h3>
        </div>

        <p className="spot-name">{data.spot}</p>
        <p className="vibe">{data.vibe}</p>

        {data.priceNote && (
          <p className={`price-note ${isActive ? 'active' : ''}`}>
            {data.priceNote}
          </p>
        )}

        <a
          className="address"
          href={data.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          📍 {data.address}
        </a>
      </div>
    </div>
  )
}
