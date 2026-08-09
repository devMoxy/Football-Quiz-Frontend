import { useState } from 'react'
import Dropdown from './Dropdown'
import './CategorySelect.css'

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

  const gridSizeOptions = GRID_SIZE_OPTIONS.map((option) => ({
    value: String(option.gridSize),
    label: `${option.label} (${option.gridSize * option.gridSize} boxes)`,
  }))

  return (
    <div className="setup">
      <form className="setup__panel" onSubmit={handleSubmit}>
        <p className="setup__kicker">Know Your Legends</p>
        <h1 className="setup__title">Achievement Matching</h1>

        <div className="setup__field setup__field--primary">
          <label className="setup__label">Difficulty</label>
          <Dropdown
            label="Difficulty"
            options={gridSizeOptions}
            value={String(gridSize)}
            onChange={(v) => setGridSize(Number(v))}
          />
        </div>

        <p className="setup__hint">
          Match each player to the achievement box they belong to. Miss once, and we'll bring you
          a second chance — but only one retry per box.
        </p>

        {error && (
          <p className="setup__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="setup__submit" disabled={loading}>
          {loading ? 'Starting…' : 'Start Round'}
        </button>
      </form>
    </div>
  )
}

export default GridSizeSelect
