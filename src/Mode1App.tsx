import { useState } from 'react'
import type { AnswerDTO, Difficulty, QuestionDTO, QuizSubmitResponse } from './types/quiz'
import { startQuiz, submitQuiz } from './api/quizApi'
import CategorySelect from './components/CategorySelect'
import QuestionCard from './components/QuestionCard'
import ResultsSummary from './components/ResultsSummary'

type QuizStage = 'setup' | 'playing' | 'submitting' | 'results'

function Mode1App() {
  const [stage, setStage] = useState<QuizStage>('setup')
  const [questions, setQuestions] = useState<QuestionDTO[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerDTO[]>([])
  const [results, setResults] = useState<QuizSubmitResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleStart = (categoryId: number, difficulty: Difficulty, numberOfQuestions: number) => {
    setError(null)
    setLoading(true)
    startQuiz({ categoryId, difficulty, numberOfQuestions })
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
    submitQuiz({ answers: nextAnswers })
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
      {stage === 'setup' && (
        <CategorySelect onStart={handleStart} loading={loading} error={error} />
      )}

      {stage === 'playing' && questions.length > 0 && (
        <QuestionCard
          question={questions[currentIndex]}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      )}

      {stage === 'submitting' && <p>Submitting…</p>}

      {stage === 'results' && results && (
        <ResultsSummary results={results} questions={questions} onRestart={handleRestart} />
      )}
    </section>
  )
}

export default Mode1App
