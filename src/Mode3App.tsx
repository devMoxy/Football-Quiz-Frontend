import { useEffect, useRef, useState } from 'react'
import type { AchievementMatchStartResponse, PlayerDTO } from './types/quiz'
import { guessAchievementMatch, lifelineAchievementMatch, startAchievementMatch } from './api/quizApi'
import GridSizeSelect from './components/GridSizeSelect'
import AchievementGrid from './components/AchievementGrid'
import ActivePlayerCard from './components/ActivePlayerCard'

type RoundStage = 'setup' | 'playing' | 'complete'

const STARTING_TIME_SECONDS = 20
const WRONG_GUESS_PENALTY_SECONDS = 2
const TIME_FLOOR_SECONDS = 6

function Mode3App() {
  const [stage, setStage] = useState<RoundStage>('setup')
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
  const stageRef = useRef<RoundStage>('setup')

  // The countdown allowance carried into each new player's turn. Degrades on
  // wrong guesses (floored at TIME_FLOOR_SECONDS) and persists across correct
  // guesses — it only resets on a fresh round.
  const [baseTime, setBaseTime] = useState(STARTING_TIME_SECONDS)
  const baseTimeRef = useRef(STARTING_TIME_SECONDS)

  const [penaltyFlash, setPenaltyFlash] = useState<number | null>(null)
  const penaltyFlashTimeoutRef = useRef<number | undefined>(undefined)

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
        window.clearTimeout(penaltyFlashTimeoutRef.current)
        setPenaltyFlash(null)
        setLifelineUsed(false)
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

  const handlePrimaryTurnResult = (achievementId: number, correct: boolean) => {
    if (correct) {
      setTickedAchievementIds((prev) => new Set(prev).add(achievementId))
      advanceToNextPrimary()
      return
    }

    const backup = round?.backupPools[String(achievementId)]

    if (backup) {
      setActivePlayer(backup)
      setTriggeringAchievementId(achievementId)
      setPlayersShownCount((count) => count + 1)
    } else {
      setLockedAchievementIds((prev) => new Set(prev).add(achievementId))
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
    advanceToNextPrimary()
  }

  // Wrong guesses degrade the shared baseTime (floored) and flash a cosmetic
  // penalty indicator — they no longer end the round by themselves.
  const applyWrongGuessPenalty = () => {
    const next = Math.max(baseTimeRef.current - WRONG_GUESS_PENALTY_SECONDS, TIME_FLOOR_SECONDS)
    setBaseTime(next)

    window.clearTimeout(penaltyFlashTimeoutRef.current)
    const flashId = Date.now()
    setPenaltyFlash(flashId)
    penaltyFlashTimeoutRef.current = window.setTimeout(() => setPenaltyFlash(null), 700)
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
      setLockedAchievementIds((prev) => new Set(prev).add(triggeringAchievementId))
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
    setStage('setup')
    setRound(null)
    setError(null)
    setActivePlayer(null)
  }

  return (
    <section>
      {stage === 'setup' && (
        <GridSizeSelect onStart={handleStart} loading={loading} error={error} />
      )}

      {stage === 'playing' && round && activePlayer && (
        <>
          <p className="timer-row">
            Time left: {timeLeft}s
            {penaltyFlash !== null && (
              <span key={penaltyFlash} className="penalty-flash" aria-live="polite">
                -2s!
              </span>
            )}
          </p>
          <ActivePlayerCard
            player={activePlayer}
            playersShownCount={playersShownCount}
            totalPlayers={round.totalPlayers}
          />
          <button type="button" onClick={handleSkip} disabled={guessPending}>
            Skip
          </button>
          <button type="button" onClick={handleLifeline} disabled={guessPending || lifelineUsed}>
            Lifeline
          </button>
          {error && <p role="alert">{error}</p>}
          <AchievementGrid
            achievements={round.achievements}
            gridSize={round.gridSize}
            tickedAchievementIds={tickedAchievementIds}
            lockedAchievementIds={lockedAchievementIds}
            onBoxClick={handleBoxClick}
            disabled={guessPending}
          />
        </>
      )}

      {stage === 'complete' && round && (
        <div>
          <h1>
            Round complete — Score: {tickedAchievementIds.size} / {round.gridSize * round.gridSize}
          </h1>
          <button type="button" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      )}
    </section>
  )
}

export default Mode3App
