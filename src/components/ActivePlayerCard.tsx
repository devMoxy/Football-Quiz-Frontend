import type { PlayerDTO } from '../types/quiz'
import './ActivePlayerCard.css'

interface ActivePlayerCardProps {
  player: PlayerDTO
  playersShownCount: number
  totalPlayers: number
}

function ActivePlayerCard({ player, playersShownCount, totalPlayers }: ActivePlayerCardProps) {
  return (
    <div className="active-player-card">
      <div className="active-player-card__image-wrap">
        <img className="active-player-card__image" src={player.imageUrl} alt={player.name} />
      </div>
      <div className="active-player-card__info">
        <p className="active-player-card__counter">
          Player {playersShownCount} of {totalPlayers}
        </p>
        <h2 className="active-player-card__name">{player.name}</h2>
      </div>
    </div>
  )
}

export default ActivePlayerCard
