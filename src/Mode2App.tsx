import { useState } from 'react'
import type {
  CareerPathAnswerDTO,
  CareerPathQuestionDTO,
  CareerPathQuizResultDTO,
  Difficulty,
} from './types/quiz'
import { startCareerPath, submitCareerPath } from './api/quizApi'
import RulesScreen from './components/RulesScreen'
import CareerPathSelect from './components/CareerPathSelect'
import CareerPathQuestion from './components/CareerPathQuestion'
import CareerPathResults from './components/CareerPathResults'

type QuizStage = 'rules' | 'setup' | 'playing' | 'submitting' | 'results'

function Mode2App() {
  const [stage, setStage] = useState<QuizStage>('rules')
  const [questions, setQuestions] = useState<CareerPathQuestionDTO[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<CareerPathAnswerDTO[]>([])
  const [results, setResults] = useState<CareerPathQuizResultDTO | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleStart = (difficulty: Difficulty, numberOfQuestions: number) => {
    setError(null)
    setLoading(true)
    startCareerPath({ difficulty, numberOfQuestions })
      .then((data) => {
        setQuestions(data)
        setCurrentIndex(0)
        setAnswers([])
        setStage('playing')
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  const handleAnswer = (selectedAnswerIndex: number) => {
    const question = questions[currentIndex]
    const nextAnswers = [
      ...answers.filter((a) => a.questionId !== question.id),
      { questionId: question.id, selectedAnswerIndex },
    ]
    setAnswers(nextAnswers)

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1)
      return
    }

    setStage('submitting')
    submitCareerPath({ answers: nextAnswers })
      .then((data) => {
        setResults(data)
        setStage('results')
      })
      .catch((err: Error) => {
        setError(err.message)
        setStage('playing')
      })
  }

  const handleRestart = () => {
    setStage('setup')
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setResults(null)
    setError(null)
  }

  return (
    <section>
      {stage === 'rules' && (
        <RulesScreen
          kicker="Before Kickoff"
          title="How This Works"
          rules={[
            "Each question reveals a player's career through the clubs they played for, in order.",
            "Once you answer, that's final. There's no going back to change it.",
            "Your score stays hidden until you've answered every question, then it's revealed all at once.",
          ]}
          onAcknowledge={() => setStage('setup')}
        />
      )}

      {stage === 'setup' && (
        <CareerPathSelect onStart={handleStart} loading={loading} error={error} />
      )}

      {stage === 'playing' && questions.length > 0 && (
        <CareerPathQuestion
          question={questions[currentIndex]}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      )}

      {stage === 'submitting' && <p>Submitting…</p>}

      {stage === 'results' && results && (
        <CareerPathResults results={results} questions={questions} onRestart={handleRestart} />
      )}
    </section>
  )
}

export default Mode2App
