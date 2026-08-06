import type { CareerPathQuestionDTO } from '../types/quiz'

interface CareerPathQuestionProps {
  question: CareerPathQuestionDTO
  questionNumber: number
  totalQuestions: number
  onAnswer: (selectedAnswerIndex: number) => void
}

function CareerPathQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: CareerPathQuestionProps) {
  const options = [question.optionA, question.optionB, question.optionC, question.optionD]
  const orderedStints = [...question.clubStints].sort((a, b) => a.clubOrder - b.clubOrder)

  return (
    <div>
      <p>
        Question {questionNumber} of {totalQuestions}
      </p>
      <h2>Guess the player from their career path</h2>

      <ol>
        {orderedStints.map((stint) => (
          <li key={stint.clubOrder}>
            <img src={stint.logoUrl} alt={stint.clubName} width={32} height={32} />
            <span>{stint.clubName}</span>
          </li>
        ))}
      </ol>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {options.map((option, index) => (
          <li key={index}>
            <button type="button" onClick={() => onAnswer(index)}>
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CareerPathQuestion
