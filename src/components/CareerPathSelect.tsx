import { useState } from 'react'
import type { Difficulty } from '../types/quiz'

const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']

interface CareerPathSelectProps {
  onStart: (difficulty: Difficulty, numberOfQuestions: number) => void
  loading: boolean
  error: string | null
}

function CareerPathSelect({ onStart, loading, error }: CareerPathSelectProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY')
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStart(difficulty, numberOfQuestions)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Career Path Guessing</h1>

      <label htmlFor="difficulty">Difficulty</label>
      <select
        id="difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
      >
        {DIFFICULTIES.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <label htmlFor="numberOfQuestions">Number of questions</label>
      <input
        id="numberOfQuestions"
        type="number"
        min={1}
        max={20}
        value={numberOfQuestions}
        onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Starting…' : 'Start Quiz'}
      </button>
    </form>
  )
}

export default CareerPathSelect
