import './CategorySelect.css'

interface RulesScreenProps {
  kicker: string
  title: string
  rules: string[]
  onAcknowledge: () => void
}

function RulesScreen({ kicker, title, rules, onAcknowledge }: RulesScreenProps) {
  return (
    <div className="setup">
      <div className="setup__panel">
        <p className="setup__kicker">{kicker}</p>
        <h1 className="setup__title">{title}</h1>

        <ul className="setup__rules">
          {rules.map((rule, index) => (
            <li key={index} className="setup__rule">
              <span className="setup__rule-marker">{index + 1}</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>

        <button type="button" className="setup__submit" onClick={onAcknowledge}>
          Got it, let's play
        </button>
      </div>
    </div>
  )
}

export default RulesScreen
