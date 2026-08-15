import type { PlayerDTO } from '../types/quiz'
import { getWikimediaThumbnailUrl, WIKIMEDIA_IMAGE_WIDTH } from '../utils/wikimediaImage'
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
        <img
          className="active-player-card__image"
          src={getWikimediaThumbnailUrl(player.imageUrl, WIKIMEDIA_IMAGE_WIDTH.AVATAR)}
          alt={player.name}
          width={WIKIMEDIA_IMAGE_WIDTH.AVATAR}
          height={WIKIMEDIA_IMAGE_WIDTH.AVATAR}
          loading="lazy"
          decoding="async"
        />
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
