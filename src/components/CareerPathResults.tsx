import type { CareerPathQuestionDTO, CareerPathQuizResultDTO } from '../types/quiz'

interface CareerPathResultsProps {
  results: CareerPathQuizResultDTO
  questions: CareerPathQuestionDTO[]
  onRestart: () => void
}

function CareerPathResults({ results, questions, onRestart }: CareerPathResultsProps) {
  const optionLabel = (question: CareerPathQuestionDTO, index: number) => {
    const options = [question.optionA, question.optionB, question.optionC, question.optionD]
    return options[index]
  }

  return (
    <div>
      <h1>
        Score: {results.score} / {results.totalQuestions}
      </h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.results.map((result) => {
          const question = questions.find((q) => q.id === result.questionId)
          if (!question) return null

          return (
            <li key={result.questionId}>
              <p>
                Your answer: {optionLabel(question, result.selectedAnswerIndex)}{' '}
                {result.correct ? '✅' : '❌'}
              </p>
              {!result.correct && <p>Correct answer: {result.correctPlayerName}</p>}
            </li>
          )
        })}
      </ul>

      <button type="button" onClick={onRestart}>
        Play Again
      </button>
    </div>
  )
}

export default CareerPathResults
