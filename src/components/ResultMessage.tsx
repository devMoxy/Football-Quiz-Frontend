import { useState } from 'react'

export const WIN_THRESHOLD = 0.5

const ENTHUSIASTIC = ['GET IN!', 'Absolutely clinical!', 'Unstoppable!']
const POSITIVE = ['Brilliant round!', 'Really solid!', 'Nicely played!']
const SIMPLE_WIN = ["That's a win!", 'Got the job done!']
const SUPPORTIVE = ['Tough one this time.', 'Not quite, you will get it next time.']

function pickTier(percentage: number): string[] {
  if (percentage >= 0.9) return ENTHUSIASTIC
  if (percentage >= 0.7) return POSITIVE
  if (percentage >= WIN_THRESHOLD) return SIMPLE_WIN
  return SUPPORTIVE
}

function pickRandom(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)]
}

interface ResultMessageProps {
  percentage: number
  overrideMessage?: string
}

function ResultMessage({ percentage, overrideMessage }: ResultMessageProps) {
  const isWin = percentage >= WIN_THRESHOLD
  const [randomMessage] = useState(() => pickRandom(pickTier(percentage)))
  const message = overrideMessage ?? randomMessage

  return (
    <p className={`results__message ${isWin ? 'results__message--win' : 'results__message--loss'}`}>
      {message}
    </p>
  )
}

interface SupplementaryMessageProps {
  pool: string[]
}

// Renders alongside ResultMessage, never replacing it, for extra context
// about how the round ended (e.g. a timeout) on top of the win/loss verdict.
export function SupplementaryMessage({ pool }: SupplementaryMessageProps) {
  const [message] = useState(() => pickRandom(pool))

  return <p className="results__message results__message--supplementary">{message}</p>
}

export default ResultMessage
