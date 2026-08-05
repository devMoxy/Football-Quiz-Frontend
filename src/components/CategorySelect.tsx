import { useEffect, useState } from 'react'
import type { CategoryDTO, Difficulty } from '../types/quiz'
import { getCategories } from '../api/quizApi'

const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']

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
    return <p role="alert">Failed to load categories: {categoriesError}</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Football Quiz</h1>

      <label htmlFor="category">Category</label>
      <select
        id="category"
        value={categoryId ?? ''}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        disabled={categories.length === 0}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

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

      <button type="submit" disabled={loading || categoryId === null}>
        {loading ? 'Starting…' : 'Start Quiz'}
      </button>
    </form>
  )
}

export default CategorySelect
