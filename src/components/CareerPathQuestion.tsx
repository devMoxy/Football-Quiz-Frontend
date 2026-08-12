import { Fragment } from 'react'
import type { CareerPathQuestionDTO } from '../types/quiz'
import Timer from './Timer'
import './QuestionCard.css'
import './CareerPathQuestion.css'

interface CareerPathQuestionProps {
  question: CareerPathQuestionDTO
  questionNumber: number
  totalQuestions: number
  timeLeft: number
  onAnswer: (selectedAnswerIndex: number) => void
}

function CareerPathQuestion({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  onAnswer,
}: CareerPathQuestionProps) {
  const options = [question.optionA, question.optionB, question.optionC, question.optionD]
  const orderedStints = [...question.clubStints].sort((a, b) => a.clubOrder - b.clubOrder)
  const progressPercent = (questionNumber / totalQuestions) * 100

  return (
    <div className="question">
      <div className="question__panel">
        <div className="question__progress">
          <div className="question__progress-bar">
            <div className="question__progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="question__counter">
            Q{questionNumber} / {totalQuestions}
          </span>
        </div>

        <div className="question__timer">
          <Timer value={timeLeft} />
        </div>

        <h2 className="question__text">Guess the player from their career path</h2>

        <div className="career-path__stints">
          {orderedStints.map((stint, index) => (
            <Fragment key={stint.clubOrder}>
              <div className="career-path__stint">
                <div className="career-path__crest">
                  <img src={stint.logoUrl} alt={stint.clubName} />
                </div>
                <span className="career-path__club-name">{stint.clubName}</span>
              </div>
              {index < orderedStints.length - 1 && (
                <span className="career-path__connector" aria-hidden="true" />
              )}
            </Fragment>
          ))}
        </div>

        <div className="question__options">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              className="question__option"
              onClick={() => onAnswer(index)}
            >
              <span className="question__option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="question__option-label">{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CareerPathQuestion
