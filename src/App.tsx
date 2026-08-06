import { useState } from 'react'
import Mode1App from './Mode1App'
import Mode2App from './Mode2App'
import Mode3App from './Mode3App'

type Mode = 'mode1' | 'mode2' | 'mode3'

function App() {
  const [mode, setMode] = useState<Mode>('mode1')

  return (
    <>
      <nav>
        <button type="button" onClick={() => setMode('mode1')} disabled={mode === 'mode1'}>
          Mode 1: Trivia
        </button>
        <button type="button" onClick={() => setMode('mode2')} disabled={mode === 'mode2'}>
          Mode 2: Career Path
        </button>
        <button type="button" onClick={() => setMode('mode3')} disabled={mode === 'mode3'}>
          Mode 3: Achievement Matching
        </button>
      </nav>

      {mode === 'mode1' && <Mode1App />}
      {mode === 'mode2' && <Mode2App />}
      {mode === 'mode3' && <Mode3App />}
    </>
  )
}

export default App
