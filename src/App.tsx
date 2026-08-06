import { useState } from 'react'
import Mode1App from './Mode1App'
import Mode2App from './Mode2App'

type Mode = 'mode1' | 'mode2'

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
      </nav>

      {mode === 'mode1' && <Mode1App />}
      {mode === 'mode2' && <Mode2App />}
    </>
  )
}

export default App
