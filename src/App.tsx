import { useState } from 'react'
import Home from './Home'
import Mode1App from './Mode1App'
import Mode2App from './Mode2App'
import Mode3App from './Mode3App'
import BackToLineup from './components/BackToLineup'

type View = 'home' | 'mode1' | 'mode2' | 'mode3'

function App() {
  const [view, setView] = useState<View>('home')

  if (view === 'home') {
    return <Home onSelectMode={setView} />
  }

  return (
    <>
      <BackToLineup onClick={() => setView('home')} />
      {view === 'mode1' && <Mode1App />}
      {view === 'mode2' && <Mode2App />}
      {view === 'mode3' && <Mode3App />}
    </>
  )
}

export default App
