import { useState } from 'react'

interface GridSizeOption {
  label: string
  gridSize: number
}

const GRID_SIZE_OPTIONS: GridSizeOption[] = [
  { label: 'Easy', gridSize: 3 },
  { label: 'Medium', gridSize: 4 },
  { label: 'Hard', gridSize: 5 },
  { label: 'Expert', gridSize: 6 },
  { label: 'Legendary', gridSize: 7 },
]

const DEFAULT_GRID_SIZE = 4

interface GridSizeSelectProps {
  onStart: (gridSize: number) => void
  loading: boolean
  error: string | null
}

function GridSizeSelect({ onStart, loading, error }: GridSizeSelectProps) {
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStart(gridSize)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Player Achievement Matching</h1>
      <p>
        Match each player to the achievement box they belong to. Miss once, and we'll bring you a
        second chance — but only one retry per box.
      </p>

      <label htmlFor="gridSize">Difficulty</label>
      <select
        id="gridSize"
        value={gridSize}
        onChange={(e) => setGridSize(Number(e.target.value))}
      >
        {GRID_SIZE_OPTIONS.map((option) => (
          <option key={option.gridSize} value={option.gridSize}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Starting…' : 'Start Round'}
      </button>
    </form>
  )
}

export default GridSizeSelect
