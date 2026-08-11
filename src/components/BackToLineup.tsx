interface BackToLineupProps {
  onClick: () => void
}

function BackToLineup({ onClick }: BackToLineupProps) {
  return (
    <button type="button" className="back-to-lineup" onClick={onClick}>
      <svg
        className="back-to-lineup__icon"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="M11 18L5 12L11 6" />
      </svg>
      Back to Moxy Football Pitch
    </button>
  )
}

export default BackToLineup
