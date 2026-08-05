import type { QuestionDTO, QuizSubmitResponse } from '../types/quiz'

interface ResultsSummaryProps {
  results: QuizSubmitResponse
  questions: QuestionDTO[]
  onRestart: () => void
}

function ResultsSummary({ results, questions, onRestart }: ResultsSummaryProps) {
  const optionLabel = (question: QuestionDTO, index: number) => {
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
              <p>{question.text}</p>
              <p>
                Your answer: {optionLabel(question, result.selectedAnswerIndex)}{' '}
                {result.correct ? '✅' : '❌'}
              </p>
              {!result.correct && (
                <p>Correct answer: {optionLabel(question, result.correctAnswerIndex)}</p>
              )}
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

export default ResultsSummary