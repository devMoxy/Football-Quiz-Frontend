import { useCallback, useEffect, useRef, useState } from 'react'
import type { AnswerDTO, Difficulty, QuestionDTO, QuizSubmitResponse } from './types/quiz'
import { startQuiz, submitQuiz } from './api/quizApi'
import RulesScreen from './components/RulesScreen'
import CategorySelect from './components/CategorySelect'
import QuestionCard from './components/QuestionCard'
import ResultsSummary from './components/ResultsSummary'

type QuizStage = 'rules' | 'setup' | 'playing' | 'submitting' | 'results'

const QUESTION_TIME_SECONDS = 20

function Mode1App() {
  const [stage, setStage] = useState<QuizStage>('rules')
  const [questions, setQuestions] = useState<QuestionDTO[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerDTO[]>([])
  const [results, setResults] = useState<QuizSubmitResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS)
  const stageRef = useRef<QuizStage>('rules')
  const answersRef = useRef<AnswerDTO[]>([])

  useEffect(() => {
    stageRef.current = stage
  }, [stage])

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  // Fresh 20s on every new question.
  useEffect(() => {
    if (stage !== 'playing') return
    setTimeLeft(QUESTION_TIME_SECONDS)
  }, [currentIndex, stage])

  // Ticks once per second while playing, clamped at 0.
  useEffect(() => {
    if (stage !== 'playing') return
    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(id)
  }, [stage])

  // Shared by both the "last question answered" path (handleAnswer, below)
  // and the "timer hit 0" path (the effect right after this) — one place
  // owns the submit call, error handling, and the results-stage transition,
  // regardless of what triggered the end of round. The stageRef guard stops
  // both paths from ever double-submitting if they were somehow triggered
  // in the same tick.
  const finishRound = useCallback((finalAnswers: AnswerDTO[], byTimeout: boolean) => {
    if (stageRef.current !== 'playing') return
    setStage('submitting')
    setTimedOut(byTimeout)
    submitQuiz({ answers: finalAnswers })
      .then((data) => {
        setResults(data)
        setStage('results')
      })
      .catch((err: Error) => {
        setError(err.message)
        setStage('playing')
      })
  }, [])

  // Hitting 0 with no answer selected ends the whole round right there,
  // submitting only what was already answered up to this point.
  useEffect(() => {
    if (stage === 'playing' && timeLeft <= 0) {
      finishRound(answersRef.current, true)
    }
  }, [timeLeft, stage, finishRound])

  const handleStart = (categoryId: number, difficulty: Difficulty, numberOfQuestions: number) => {
    setError(null)
    setLoading(true)
    startQuiz({ categoryId, difficulty, numberOfQuestions })
      .then((data) => {
        setQuestions(data)
        setCurrentIndex(0)
        setAnswers([])
        setTimedOut(false)
        setTimeLeft(QUESTION_TIME_SECONDS)
        setStage('playing')
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  const handleAnswer = (selectedAnswerIndex: number) => {
    if (stageRef.current !== 'playing') return
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

    finishRound(nextAnswers, false)
  }

  const handleRestart = () => {
    setStage('setup')
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setResults(null)
    setError(null)
    setTimedOut(false)
    setTimeLeft(QUESTION_TIME_SECONDS)
  }

  return (
    <section>
      {stage === 'rules' && (
        <RulesScreen
          kicker="Before Kickoff"
          title="How This Works"
          rules={[
            "Once you answer a question, that's final. There's no going back to change it.",
            "Your score stays hidden until you've answered every question, then it's revealed all at once.",
          ]}
          onAcknowledge={() => setStage('setup')}
        />
      )}

      {stage === 'setup' && (
        <CategorySelect onStart={handleStart} loading={loading} error={error} />
      )}

      {stage === 'playing' && questions.length > 0 && (
        <QuestionCard
          question={questions[currentIndex]}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          timeLeft={timeLeft}
          onAnswer={handleAnswer}
        />
      )}

      {stage === 'submitting' && (
        <div className="quiz-loading">
          <p className="quiz-loading__text">Submitting…</p>
        </div>
      )}

      {stage === 'results' && results && (
        <ResultsSummary
          results={results}
          questions={questions}
          timedOut={timedOut}
          onRestart={handleRestart}
        />
      )}
    </section>
  )
}

export default Mode1App
