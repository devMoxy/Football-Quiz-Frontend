import type { AchievementDTO } from '../types/quiz'

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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: '8px',
      }}
    >
      {achievements.map((achievement) => {
        const ticked = tickedAchievementIds.has(achievement.achievementId)
        const locked = lockedAchievementIds.has(achievement.achievementId)
        const resolved = ticked || locked

        return (
          <button
            key={achievement.achievementId}
            type="button"
            onClick={() => onBoxClick?.(achievement.achievementId)}
            disabled={resolved || disabled || !onBoxClick}
            style={{
              border: '1px solid #444',
              padding: '8px',
              textAlign: 'center',
              backgroundColor: ticked ? '#1f7a3f' : locked ? '#333' : undefined,
              opacity: locked ? 0.5 : 1,
            }}
          >
            <img src={achievement.imageUrl} alt={achievement.description} width={48} height={48} />
            <p>{achievement.description}</p>
          </button>
        )
      })}
    </div>
  )
}

export default AchievementGrid
