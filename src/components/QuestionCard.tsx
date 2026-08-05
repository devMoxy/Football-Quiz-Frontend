import type { QuestionDTO } from '../types/quiz'

interface QuestionCardProps {
  question: QuestionDTO
  questionNumber: number
  totalQuestions: number
  onAnswer: (selectedAnswerIndex: number) => void
}

function QuestionCard({ question, questionNumber, totalQuestions, onAnswer }: QuestionCardProps) {
  const options = [question.optionA, question.optionB, question.optionC, question.optionD]

  return (
    <div>
      <p>
        Question {questionNumber} of {totalQuestions}
      </p>
      <h2>{question.text}</h2>
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

export default QuestionCard