import type { QuestionDTO } from '../types/quiz'
import Timer from './Timer'
import './QuestionCard.css'

interface QuestionCardProps {
  question: QuestionDTO
  questionNumber: number
  totalQuestions: number
  timeLeft: number
  onAnswer: (selectedAnswerIndex: number) => void
}

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  onAnswer,
}: QuestionCardProps) {
  const options = [question.optionA, question.optionB, question.optionC, question.optionD]
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

        <h2 className="question__text">{question.text}</h2>

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

export default QuestionCard
