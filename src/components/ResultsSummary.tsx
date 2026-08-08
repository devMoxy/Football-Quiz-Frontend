import type { QuestionDTO, QuizSubmitResponse } from '../types/quiz'
import './ResultsSummary.css'

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
    <div className="results">
      <div className="results__panel">
        <p className="results__kicker">Full Time</p>
        <p className="results__score">
          {results.score} / {results.totalQuestions}
        </p>

        <ul className="results__list">
          {results.results.map((result) => {
            const question = questions.find((q) => q.id === result.questionId)
            if (!question) return null

            return (
              <li
                key={result.questionId}
                className={`results__item ${
                  result.correct ? 'results__item--correct' : 'results__item--incorrect'
                }`}
              >
                <span className="results__item-icon" aria-hidden="true">
                  {result.correct ? '✓' : '✕'}
                </span>
                <div className="results__item-body">
                  <p className="results__item-question">{question.text}</p>
                  <p className="results__item-answer">
                    Your answer:{' '}
                    <span
                      className={`results__item-value ${
                        result.correct ? 'results__item-value--correct' : 'results__item-value--incorrect'
                      }`}
                    >
                      {optionLabel(question, result.selectedAnswerIndex)}
                    </span>
                  </p>
                  {!result.correct && (
                    <p className="results__item-answer">
                      Correct answer:{' '}
                      <span className="results__item-value results__item-value--correct">
                        {optionLabel(question, result.correctAnswerIndex)}
                      </span>
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        <button type="button" className="results__restart" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default ResultsSummary
