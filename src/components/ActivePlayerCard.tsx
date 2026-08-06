import type { PlayerDTO } from '../types/quiz'

interface ActivePlayerCardProps {
  player: PlayerDTO
  playersShownCount: number
  totalPlayers: number
}

function ActivePlayerCard({ player, playersShownCount, totalPlayers }: ActivePlayerCardProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p>
        Player {playersShownCount} of {totalPlayers}
      </p>
      <img src={player.imageUrl} alt={player.name} width={96} height={96} />
      <h2>{player.name}</h2>
    </div>
  )
}

export default ActivePlayerCard
