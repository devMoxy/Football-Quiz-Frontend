import { useEffect, useRef, useState } from 'react'
import type { AchievementMatchStartResponse, PlayerDTO } from './types/quiz'
import { guessAchievementMatch, lifelineAchievementMatch, startAchievementMatch } from './api/quizApi'
import RulesScreen from './components/RulesScreen'
import GridSizeSelect from './components/GridSizeSelect'
import AchievementGrid from './components/AchievementGrid'
import ActivePlayerCard from './components/ActivePlayerCard'
import ResultMessage, { SupplementaryMessage, WIN_THRESHOLD } from './components/ResultMessage'
import Timer from './components/Timer'
import './Mode3Play.css'
import './components/ResultsSummary.css'

type RoundStage = 'rules' | 'setup' | 'playing' | 'complete'
type EndReason = 'timeout' | 'players-exhausted' | 'board-resolved' | null

const STARTING_TIME_SECONDS = 20
const WRONG_GUESS_PENALTY_SECONDS = 2
const TIME_FLOOR_SECONDS = 6

const EARLY_END_LOSS_MESSAGE =
  'You have missed too many chances and let too many boxes slip away, so there is nothing left on the board you can still win. The round ends here.'

const FLOOR_WARNING_MESSAGE = 'Six seconds left per player now. Every second counts.'
const FLOOR_WARNING_DURATION_MS = 3500

const MODE3_TIMEOUT_MESSAGES = [
  'You ran out of time right at the edge. So close!',
  'The clock beat you to it. Almost there!',
  'So close! The final second slipped away.',
]

function Mode3App() {
  const [stage, setStage] = useState<RoundStage>('rules')
  const [round, setRound] = useState<AchievementMatchStartResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [primaryIndex, setPrimaryIndex] = useState(0)
  const [playersShownCount, setPlayersShownCount] = useState(1)
  const [activePlayer, setActivePlayer] = useState<PlayerDTO | null>(null)
  const [triggeringAchievementId, setTriggeringAchievementId] = useState<number | null>(null)

  const [tickedAchievementIds, setTickedAchievementIds] = useState<Set<number>>(new Set())
  const [lockedAchievementIds, setLockedAchievementIds] = useState<Set<number>>(new Set())
  const [guessPending, setGuessPending] = useState(false)
  const [lifelineUsed, setLifelineUsed] = useState(false)

  const [timeLeft, setTimeLeft] = useState(STARTING_TIME_SECONDS)
  const timeLeftRef = useRef(STARTING_TIME_SECONDS)
  const stageRef = useRef<RoundStage>('rules')

  // The countdown allowance carried into each new player's turn. Degrades on
  // wrong guesses (floored at TIME_FLOOR_SECONDS) and persists across correct
  // guesses — it only resets on a fresh round.
  const [baseTime, setBaseTime] = useState(STARTING_TIME_SECONDS)
  const baseTimeRef = useRef(STARTING_TIME_SECONDS)

  const [penaltyFlash, setPenaltyFlash] = useState<number | null>(null)
  const penaltyFlashTimeoutRef = useRef<number | undefined>(undefined)

  // Fires once per round, the first moment baseTime bottoms out at the floor.
  const [floorWarningVisible, setFloorWarningVisible] = useState(false)
  const floorWarningShownRef = useRef(false)
  const floorWarningTimeoutRef = useRef<number | undefined>(undefined)

  const [endReason, setEndReason] = useState<EndReason>(null)

  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  useEffect(() => {
    stageRef.current = stage
  }, [stage])

  useEffect(() => {
    baseTimeRef.current = baseTime
  }, [baseTime])

  // Reset the countdown every time a new player (primary or backup) is shown,
  // starting them at the current (possibly degraded) baseTime.
  useEffect(() => {
    if (stage !== 'playing') return
    setTimeLeft(baseTime)
  }, [playersShownCount, stage, baseTime])

  // Tick once per second while playing. Functional update keeps this immune
  // to stale closures regardless of how long the effect has been running.
  useEffect(() => {
    if (stage !== 'playing') return
    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(id)
  }, [stage])

  // Natural depletion ends the round — runs all the way to 0, unlike the
  // penalty floor below which only applies to wrong-guess subtraction.
  useEffect(() => {
    if (stage === 'playing' && timeLeft <= 0) {
      setEndReason('timeout')
      setStage('complete')
    }
  }, [timeLeft, stage])

  // Derives activePlayer / round-complete from the settled primaryIndex
  // rather than a value threaded through advanceToNextPrimary's closure —
  // correct even when advanceToNextPrimary is called several times
  // synchronously (e.g. a rapid Skip double-click) before React re-renders.
  useEffect(() => {
    if (stage !== 'playing' || !round) return
    if (primaryIndex >= round.players.length) {
      setEndReason('players-exhausted')
      setStage('complete')
      return
    }
    setActivePlayer(round.players[primaryIndex])
  }, [primaryIndex, round, stage])

  const handleStart = (gridSize: number) => {
    setError(null)
    setLoading(true)
    startAchievementMatch(gridSize)
      .then((data) => {
        setRound(data)
        setPrimaryIndex(0)
        setPlayersShownCount(1)
        setActivePlayer(data.players[0] ?? null)
        setTriggeringAchievementId(null)
        setTickedAchievementIds(new Set())
        setLockedAchievementIds(new Set())
        setBaseTime(STARTING_TIME_SECONDS)
        setTimeLeft(STARTING_TIME_SECONDS)
        window.clearTimeout(penaltyFlashTimeoutRef.current)
        setPenaltyFlash(null)
        window.clearTimeout(floorWarningTimeoutRef.current)
        setFloorWarningVisible(false)
        floorWarningShownRef.current = false
        setLifelineUsed(false)
        setEndReason(null)
        setStage('playing')
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  const advanceToNextPrimary = () => {
    setTriggeringAchievementId(null)
    if (!round) return
    setPrimaryIndex((prev) => prev + 1)
    setPlayersShownCount((count) => count + 1)
  }

  // Once every box is ticked or locked, nothing left on the board can
  // change the outcome — AchievementGrid already disables resolved boxes,
  // so there is no point burning more time or cycling more players.
  const isBoardResolved = (ticked: Set<number>, locked: Set<number>) =>
    !!round && ticked.size + locked.size >= round.achievements.length

  const handlePrimaryTurnResult = (achievementId: number, correct: boolean) => {
    if (correct) {
      const nextTicked = new Set(tickedAchievementIds).add(achievementId)
      setTickedAchievementIds(nextTicked)
      if (isBoardResolved(nextTicked, lockedAchievementIds)) {
        setEndReason('board-resolved')
        setStage('complete')
        return
      }
      advanceToNextPrimary()
      return
    }

    const backup = round?.backupPools[String(achievementId)]

    if (backup) {
      setActivePlayer(backup)
      setTriggeringAchievementId(achievementId)
      setPlayersShownCount((count) => count + 1)
    } else {
      const nextLocked = new Set(lockedAchievementIds).add(achievementId)
      setLockedAchievementIds(nextLocked)
      if (isBoardResolved(tickedAchievementIds, nextLocked)) {
        setEndReason('board-resolved')
        setStage('complete')
        return
      }
      advanceToNextPrimary()
    }
  }

  const handleBackupTurnResult = (achievementId: number, correct: boolean) => {
    const nextTicked = new Set(tickedAchievementIds)
    const nextLocked = new Set(lockedAchievementIds)

    if (correct) {
      nextTicked.add(achievementId)
    } else if (achievementId === triggeringAchievementId) {
      nextLocked.add(achievementId)
    }

    if (
      triggeringAchievementId !== null &&
      !nextTicked.has(triggeringAchievementId) &&
      !nextLocked.has(triggeringAchievementId)
    ) {
      nextLocked.add(triggeringAchievementId)
    }

    setTickedAchievementIds(nextTicked)
    setLockedAchievementIds(nextLocked)

    if (isBoardResolved(nextTicked, nextLocked)) {
      setEndReason('board-resolved')
      setStage('complete')
      return
    }

    advanceToNextPrimary()
  }

  // Wrong guesses degrade the shared baseTime (floored) and flash a cosmetic
  // penalty indicator — they no longer end the round by themselves.
  const applyWrongGuessPenalty = () => {
    const previous = baseTimeRef.current
    const next = Math.max(previous - WRONG_GUESS_PENALTY_SECONDS, TIME_FLOOR_SECONDS)
    setBaseTime(next)

    window.clearTimeout(penaltyFlashTimeoutRef.current)
    const flashId = Date.now()
    setPenaltyFlash(flashId)
    penaltyFlashTimeoutRef.current = window.setTimeout(() => setPenaltyFlash(null), 700)

    if (next === TIME_FLOOR_SECONDS && previous > TIME_FLOOR_SECONDS && !floorWarningShownRef.current) {
      floorWarningShownRef.current = true
      window.clearTimeout(floorWarningTimeoutRef.current)
      setFloorWarningVisible(true)
      floorWarningTimeoutRef.current = window.setTimeout(
        () => setFloorWarningVisible(false),
        FLOOR_WARNING_DURATION_MS,
      )
    }
  }

  const handleBoxClick = (achievementId: number) => {
    if (!activePlayer || guessPending) return
    if (tickedAchievementIds.has(achievementId) || lockedAchievementIds.has(achievementId)) return

    setGuessPending(true)
    guessAchievementMatch(activePlayer.playerId, achievementId)
      .then((res) => {
        if (stageRef.current !== 'playing') return

        if (!res.correct) {
          applyWrongGuessPenalty()
        }

        if (triggeringAchievementId === null) {
          handlePrimaryTurnResult(achievementId, res.correct)
        } else {
          handleBackupTurnResult(achievementId, res.correct)
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setGuessPending(false))
  }

  // Permanently passes on the current player with no penalty and no API call.
  // If a backup turn is skipped, the triggering achievement's one retry is
  // gone for good — force-lock it via the same orphan-fix pattern used in
  // handleBackupTurnResult, so its (now-departed) backup can't be re-shown
  // by a later, unrelated wrong guess against the same box.
  const handleSkip = () => {
    if (guessPending) return
    if (triggeringAchievementId !== null) {
      const nextLocked = new Set(lockedAchievementIds).add(triggeringAchievementId)
      setLockedAchievementIds(nextLocked)
      if (isBoardResolved(tickedAchievementIds, nextLocked)) {
        setEndReason('board-resolved')
        setStage('complete')
        return
      }
    }
    advanceToNextPrimary()
  }

  const handleLifeline = () => {
    if (!activePlayer || guessPending || lifelineUsed) return
    const boardAchievementIds = round?.achievements.map((a) => a.achievementId) ?? []

    setGuessPending(true)
    lifelineAchievementMatch(activePlayer.playerId, boardAchievementIds)
      .then((res) => {
        if (stageRef.current !== 'playing') return
        setLifelineUsed(true)

        const matchedId = res.matchedAchievementIds[0]
        if (matchedId === undefined) {
          advanceToNextPrimary()
          return
        }

        if (triggeringAchievementId === null) {
          handlePrimaryTurnResult(matchedId, true)
        } else {
          handleBackupTurnResult(matchedId, true)
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setGuessPending(false))
  }

  const handleRestart = () => {
    window.clearTimeout(penaltyFlashTimeoutRef.current)
    setPenaltyFlash(null)
    window.clearTimeout(floorWarningTimeoutRef.current)
    setFloorWarningVisible(false)
    setStage('setup')
    setRound(null)
    setError(null)
    setActivePlayer(null)
  }

  return (
    <section>
      {stage === 'rules' && (
        <RulesScreen
          kicker="Before Kickoff"
          title="How This Works"
          rules={[
            'Match each player shown to the achievement box they belong to on the grid.',
            'Get a match wrong, and you get one backup chance for that same achievement. Only one retry per box.',
            'Watch the clock. A wrong guess costs you 2 seconds and mostly just changes who is shown next, but running out of time ends the round immediately.',
          ]}
          onAcknowledge={() => setStage('setup')}
        />
      )}

      {stage === 'setup' && (
        <GridSizeSelect onStart={handleStart} loading={loading} error={error} />
      )}

      {stage === 'playing' && round && activePlayer && (
        <div className="playing">
          {floorWarningVisible && (
            <div className="floor-warning" role="status" aria-live="polite">
              {FLOOR_WARNING_MESSAGE}
            </div>
          )}
          <div className="playing__inner">
            <div className="playing__header">
              <ActivePlayerCard
                player={activePlayer}
                playersShownCount={playersShownCount}
                totalPlayers={round.totalPlayers}
              />
              <div className="playing__header-controls">
                <Timer value={timeLeft} warningThreshold={TIME_FLOOR_SECONDS}>
                  {penaltyFlash !== null && (
                    <span key={penaltyFlash} className="timer__penalty" aria-live="polite">
                      Lost 2s!
                    </span>
                  )}
                </Timer>
                <div className="action-row">
                  <button
                    type="button"
                    className="action-btn action-btn--skip"
                    onClick={handleSkip}
                    disabled={guessPending}
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    className={`action-btn action-btn--lifeline${lifelineUsed ? ' action-btn--spent' : ''}`}
                    onClick={handleLifeline}
                    disabled={guessPending || lifelineUsed}
                  >
                    {lifelineUsed ? 'Lifeline Used' : 'Lifeline'}
                  </button>
                </div>
              </div>
            </div>
            {error && <p role="alert">{error}</p>}
            <div className="playing__board">
              <AchievementGrid
                achievements={round.achievements}
                gridSize={round.gridSize}
                tickedAchievementIds={tickedAchievementIds}
                lockedAchievementIds={lockedAchievementIds}
                onBoxClick={handleBoxClick}
                disabled={guessPending}
              />
            </div>
          </div>
        </div>
      )}

      {stage === 'complete' && round && (() => {
        const percentage = tickedAchievementIds.size / (round.gridSize * round.gridSize)
        const isWin = percentage >= WIN_THRESHOLD
        const overrideMessage =
          endReason === 'board-resolved' && !isWin ? EARLY_END_LOSS_MESSAGE : undefined

        return (
          <div className="results">
            <div className="results__panel">
              <p className="results__kicker">Full Time</p>
              <p className="results__score">
                {tickedAchievementIds.size} / {round.gridSize * round.gridSize}
              </p>
              <ResultMessage percentage={percentage} overrideMessage={overrideMessage} />
              {endReason === 'timeout' && <SupplementaryMessage pool={MODE3_TIMEOUT_MESSAGES} />}
              <p className="results__subtitle">Boxes Matched</p>
              <button type="button" className="results__restart" onClick={handleRestart}>
                Play Again
              </button>
            </div>
          </div>
        )
      })()}
    </section>
  )
}

export default Mode3App
