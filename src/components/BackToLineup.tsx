interface BackToLineupProps {
  onClick: () => void
}

function BackToLineup({ onClick }: BackToLineupProps) {
  return (
    <button type="button" className="back-to-lineup" onClick={onClick}>
      ← Back to lineup
    </button>
  )
}

export default BackToLineup
