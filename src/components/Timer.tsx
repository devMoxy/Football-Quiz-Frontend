import type { ReactNode } from 'react'
import './Timer.css'

interface TimerProps {
  value: number
  warningThreshold?: number
  unit?: string
  children?: ReactNode
}

function Timer({ value, warningThreshold = 5, unit = 's', children }: TimerProps) {
  return (
    <div className={`timer${value <= warningThreshold ? ' timer--warning' : ''}`}>
      <span className="timer__value">{value}</span>
      <span className="timer__unit">{unit}</span>
      {children}
    </div>
  )
}

export default Timer
