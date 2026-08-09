import type { AchievementDTO } from '../types/quiz'
import './AchievementGrid.css'

interface AchievementGridProps {
  achievements: AchievementDTO[]
  gridSize: number
  tickedAchievementIds: Set<number>
  lockedAchievementIds: Set<number>
  onBoxClick?: (achievementId: number) => void
  disabled?: boolean
}

function AchievementGrid({
  achievements,
  gridSize,
  tickedAchievementIds,
  lockedAchievementIds,
  onBoxClick,
  disabled = false,
}: AchievementGridProps) {
  return (
    <div className="achievement-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
      {achievements.map((achievement) => {
        const ticked = tickedAchievementIds.has(achievement.achievementId)
        const locked = lockedAchievementIds.has(achievement.achievementId)
        const resolved = ticked || locked
        const stateClass = ticked
          ? ' achievement-grid__box--ticked'
          : locked
            ? ' achievement-grid__box--locked'
            : ''

        return (
          <button
            key={achievement.achievementId}
            type="button"
            className={`achievement-grid__box${stateClass}`}
            onClick={() => onBoxClick?.(achievement.achievementId)}
            disabled={resolved || disabled || !onBoxClick}
          >
            {ticked && (
              <span
                className="achievement-grid__badge achievement-grid__badge--ticked"
                aria-hidden="true"
              >
                ✓
              </span>
            )}
            {locked && (
              <span
                className="achievement-grid__badge achievement-grid__badge--locked"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4.5" y="11" width="15" height="10" rx="2" />
                  <path d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11" />
                </svg>
              </span>
            )}
            <img
              className="achievement-grid__image"
              src={achievement.imageUrl}
              alt={achievement.description}
            />
            <p className="achievement-grid__description">{achievement.description}</p>
          </button>
        )
      })}
    </div>
  )
}

export default AchievementGrid
