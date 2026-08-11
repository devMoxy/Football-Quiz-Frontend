import './Home.css'

type Mode = 'mode1' | 'mode2' | 'mode3'

interface ModeCard {
  mode: Mode
  number: string
  name: string
  description: string
  photoUrl: string
  photoAlt: string
}

const MODE_CARDS: ModeCard[] = [
  {
    mode: 'mode1',
    number: '01',
    name: 'Trivia Challenge',
    description: 'Answer football trivia across categories and difficulty levels.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg/500px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg',
    photoAlt: 'Cristiano Ronaldo',
  },
  {
    mode: 'mode2',
    number: '02',
    name: 'Career Path',
    description: 'Guess the player from the twists and turns of their career.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Kylian_Mbappe_France_v_Senegal_16_June_2026-391_%28cropped%29.jpg/500px-Kylian_Mbappe_France_v_Senegal_16_June_2026-391_%28cropped%29.jpg',
    photoAlt: 'Kylian Mbappe',
  },
  {
    mode: 'mode3',
    number: '03',
    name: 'Achievement Match',
    description: 'Race the clock, matching players to their honours on the grid.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bukayo_Saka_England_v_Panama_27_June_26-108_%28cropped%29.jpg/500px-Bukayo_Saka_England_v_Panama_27_June_26-108_%28cropped%29.jpg',
    photoAlt: 'Bukayo Saka',
  },
]

interface HomeProps {
  onSelectMode: (mode: Mode) => void
}

function Home({ onSelectMode }: HomeProps) {
  return (
    <div className="home">
      <PitchMarkings />

      <header className="home__header">
        <p className="home__kicker">Pick Your Lineup</p>
        <h1 className="home__title">Moxy Football Quiz</h1>
        <p className="home__subtitle">Three ways to test your football knowledge.</p>
      </header>

      <div className="home__lineup">
        {MODE_CARDS.map((card) => (
          <button
            key={card.mode}
            type="button"
            className={`player-card player-card--${card.mode}`}
            onClick={() => onSelectMode(card.mode)}
          >
            <span className="player-card__number">{card.number}</span>
            <div className="player-card__photo">
              <img className="player-card__img" src={card.photoUrl} alt={card.photoAlt} loading="lazy" />
            </div>
            <span className="player-card__name">{card.name}</span>
            <span className="player-card__desc">{card.description}</span>
          </button>
        ))}
      </div>

      <footer className="home__footer">
        Built pitchside by a self taught developer named Enoch, better known as devMoxy.
      </footer>
    </div>
  )
}

function PitchMarkings() {
  return (
    <svg className="pitch-lines" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="500" x2="1000" y2="500" />
      <circle cx="500" cy="500" r="140" />
      <circle cx="500" cy="500" r="4" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default Home
