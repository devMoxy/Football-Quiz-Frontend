import { useState } from 'react'
import type { Difficulty } from '../types/quiz'
import Dropdown from './Dropdown'
import './CategorySelect.css'

const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']
const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20]

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

  const difficultyOptions = DIFFICULTIES.map((d) => ({ value: d, label: d }))
  const questionCountOptions = QUESTION_COUNT_OPTIONS.map((n) => ({
    value: String(n),
    label: String(n),
  }))

  return (
    <div className="setup">
      <form className="setup__panel" onSubmit={handleSubmit}>
        <p className="setup__kicker">Guess The Journey</p>
        <h1 className="setup__title">Career Path</h1>

        <div className="setup__row">
          <div className="setup__field">
            <label className="setup__label">Difficulty</label>
            <Dropdown
              label="Difficulty"
              options={difficultyOptions}
              value={difficulty}
              onChange={(v) => setDifficulty(v as Difficulty)}
            />
          </div>

          <div className="setup__field">
            <label className="setup__label">Questions</label>
            <Dropdown
              label="Number of questions"
              options={questionCountOptions}
              value={String(numberOfQuestions)}
              onChange={(v) => setNumberOfQuestions(Number(v))}
            />
          </div>
        </div>

        {error && (
          <p className="setup__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="setup__submit" disabled={loading}>
          {loading ? 'Starting…' : 'Start Quiz'}
        </button>
      </form>
    </div>
  )
}

export default CareerPathSelect
