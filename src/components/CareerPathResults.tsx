import { Fragment } from 'react'
import type { CareerPathQuestionDTO, CareerPathQuizResultDTO } from '../types/quiz'
import ResultMessage, { SupplementaryMessage } from './ResultMessage'
import { ROUND_TIMEOUT_MESSAGES } from './messagePools'
import { getWikimediaThumbnailUrl, WIKIMEDIA_IMAGE_WIDTH } from '../utils/wikimediaImage'
import './ResultsSummary.css'
import './CareerPathQuestion.css'

interface CareerPathResultsProps {
  results: CareerPathQuizResultDTO
  questions: CareerPathQuestionDTO[]
  timedOut: boolean
  onRestart: () => void
}

function CareerPathResults({ results, questions, timedOut, onRestart }: CareerPathResultsProps) {
  const optionLabel = (question: CareerPathQuestionDTO, index: number) => {
    const options = [question.optionA, question.optionB, question.optionC, question.optionD]
    return options[index]
  }

  const percentage = results.totalQuestions > 0 ? results.score / results.totalQuestions : 0

  return (
    <div className="results">
      <div className="results__panel">
        <p className="results__kicker">Full Time</p>
        <p className="results__score">
          {results.score} / {results.totalQuestions}
        </p>
        <ResultMessage percentage={percentage} />
        {timedOut && <SupplementaryMessage pool={ROUND_TIMEOUT_MESSAGES} />}

        <ul className="results__list">
          {results.results.map((result) => {
            const question = questions.find((q) => q.id === result.questionId)
            if (!question) return null

            const orderedStints = [...question.clubStints].sort((a, b) => a.clubOrder - b.clubOrder)

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
                  <div className="career-path__stints career-path__stints--compact">
                    {orderedStints.map((stint, index) => (
                      <Fragment key={stint.clubOrder}>
                        <div className="career-path__stint">
                          <div className="career-path__crest">
                            <img
                              src={getWikimediaThumbnailUrl(stint.logoUrl, WIKIMEDIA_IMAGE_WIDTH.CREST_COMPACT)}
                              alt={stint.clubName}
                              width={WIKIMEDIA_IMAGE_WIDTH.CREST_COMPACT}
                              height={WIKIMEDIA_IMAGE_WIDTH.CREST_COMPACT}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <span className="career-path__club-name">{stint.clubName}</span>
                        </div>
                        {index < orderedStints.length - 1 && (
                          <span className="career-path__connector" aria-hidden="true" />
                        )}
                      </Fragment>
                    ))}
                  </div>
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
                        {result.correctPlayerName}
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

export default CareerPathResults
