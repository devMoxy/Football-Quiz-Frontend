# Moxy Football Quiz — Frontend

A football quiz web app with three game modes: trivia questions, guessing a player from their career path, and a grid based achievement matching game with a timer, backup players, skip and lifeline.

This is the frontend half of a two repo project, built in React and TypeScript. The backend (Spring Boot, Java) lives in a separate repo here: https://github.com/devMoxy/Football-Quiz. This repo won't do anything on its own without that API running somewhere it can reach.

Live site: https://football-quiz-frontend-ashen.vercel.app
Live backend it talks to: https://football-quiz-lusl.onrender.com

## What's Actually In Here

Three modes, each its own screen, sharing one design system (a pitch green and chalk white look with amber accents, Oswald for headings, Space Mono for anything that's a number that changes like scores and timers).

**Mode 1, trivia.** Pick a category and difficulty, answer against the clock, get a score at the end.

**Mode 2, career path.** You're shown a player's real club history in order and have to guess who it is from four options, also against the clock.

**Mode 3, achievement matching.** A grid of real achievements, players shown one at a time, you match each one to the achievement they actually hold. Wrong guess brings in a backup player for a second try. Get both wrong and that box locks for the round. There's a skip button and a one time lifeline.

## The Genuinely Hard Part

Mode 3's backup mechanic has a real edge case worth explaining. A player can hold more than one achievement that's on the board at once, so when a backup player is shown to retry a specific box, they can legitimately click a different box they also qualify for instead. If that happens, the original box that actually summoned them would be left permanently unresolved unless something catches it. I ended up tracking which achievement triggered the current backup separately from the normal player queue position, and forcing that specific achievement to resolve (ticked or locked) by the end of that backup's turn no matter which box the guess actually landed on.

The timer in Mode 3 also isn't a simple per player countdown. It's a shared, degrading time budget that only ever goes down on a wrong guess, floors at 6 seconds and stays there, and never resets back up on a correct guess. Getting that to behave correctly with real network latency in play (the backend cold starts on its free tier, sometimes taking close to a minute) meant being careful about stale values inside async callbacks, using refs to mirror state that the interval and the guess handler both needed to read fresh.

## Architecture

<img width="750" height="520" alt="moxy-football-quiz-architecture" src="https://github.com/user-attachments/assets/d36a46e6-a016-4177-a756-24c6b06998b6" />




## Gameplay


https://github.com/user-attachments/assets/50dc6b71-bde9-4585-a928-6f3252fd101b



The full setup, end to end, not just this repo: browser loads the frontend from Vercel, frontend talks to the Spring Boot backend on Render, backend reads and writes to a Postgres database on Neon. Player photos and club logos aren't stored anywhere in this project, they're loaded straight from TheSportsDB and Wikimedia Commons at the URLs saved in the database. Both repos have GitHub Actions running on every push, checking the build passes before Render and Vercel deploy it.

## Running It Locally

Clone this repo:

```bash
git clone https://github.com/devMoxy/Football-Quiz-Frontend.git
cd Football-Quiz-Frontend
npm install
```

You'll need the backend reachable somewhere, either running locally from the [backend repo](https://github.com/devMoxy/Football-Quiz) or pointed at the live one on Render. Set the API base URL in your `.env` file to whichever one you're using, then run:

```bash
npm run dev
```
