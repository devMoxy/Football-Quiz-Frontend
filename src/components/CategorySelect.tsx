import { useEffect, useState } from 'react'
import type { CategoryDTO, Difficulty } from '../types/quiz'
import { getCategories } from '../api/quizApi'
import Dropdown from './Dropdown'
import './CategorySelect.css'

const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']
const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20]

interface CategorySelectProps {
  onStart: (categoryId: number, difficulty: Difficulty, numberOfQuestions: number) => void
  loading: boolean
  error: string | null
}

function CategorySelect({ onStart, loading, error }: CategorySelectProps) {
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY')
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data)
        if (data.length > 0) setCategoryId(data[0].id)
      })
      .catch((err: Error) => setCategoriesError(err.message))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (categoryId === null) return
    onStart(categoryId, difficulty, numberOfQuestions)
  }

  if (categoriesError) {
    return (
      <div className="setup">
        <p className="setup__error" role="alert">
          Failed to load categories: {categoriesError}
        </p>
      </div>
    )
  }

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }))
  const difficultyOptions = DIFFICULTIES.map((d) => ({ value: d, label: d }))
  const questionCountOptions = QUESTION_COUNT_OPTIONS.map((n) => ({
    value: String(n),
    label: String(n),
  }))

  return (
    <div className="setup">
      <form className="setup__panel" onSubmit={handleSubmit}>
        <p className="setup__kicker">Set Your Match</p>
        <h1 className="setup__title">Football Quiz</h1>

        <div className="setup__field setup__field--primary">
          <label className="setup__label">Category</label>
          <Dropdown
            label="Category"
            options={categoryOptions}
            value={categoryId !== null ? String(categoryId) : ''}
            onChange={(v) => setCategoryId(Number(v))}
            disabled={categories.length === 0}
          />
        </div>

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

        <button type="submit" className="setup__submit" disabled={loading || categoryId === null}>
          {loading ? 'Starting…' : 'Start Quiz'}
        </button>
      </form>
    </div>
  )
}

export default CategorySelect
