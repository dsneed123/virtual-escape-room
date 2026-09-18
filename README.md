# GUS'S GALACTIC ARCADE — Seattle vs. SJC

A 45-minute head-to-head arcade lock-in for two teams in two rooms, each crowded round one
screen. Twelve playable machines — double Wordle, Minesweeper, Picross, Mastermind, Rush Hour,
Sokoban, Sudoku, Towers of Hanoi, Flow, pipe-rotation, memory pairs and Lights Out — then a
prize counter that lets you out.

Machines can be played in any order, so a stuck team just walks to a different cabinet.
No backend, no accounts, nothing shared between the two browsers: each arcade lives
entirely in its own localStorage, and every board is fixed so both teams play identical
machines.

## Install

```
npm install
```

## Development

```
npm run dev
```

## Production build

```
npm run build
npm run preview
```

## GitHub Pages

The build uses a relative base path, so it works from any repository subpath
(`https://USERNAME.github.io/REPOSITORY/`) with no configuration.

1. Push this repository to GitHub.
2. Settings → Pages → **Source: GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds and deploys automatically.
4. Send both teams the same URL.

## Running the event

Both teams open the URL, pick their arcade, and wait on the briefing screen. Give the start
signal; each team presses INSERT COIN. Timers are independent and survive a refresh — as do
tokens, half-finished boards and nudges. Pause, resume and a guarded reset are in the top
bar.

Every machine explains itself and carries two free nudges from BUZZ. On top of that each
team gets two real hints for the night, requested from the host on Slack. When a team gets
out, the screen shows the completion time to send you.

## Testing it yourself

Add `?dev` to the URL and open the browser console: every answer is printed, and `window.gus`
gives you `winAll()`, `win(id)`, `open(id)`, `escape()`, `time(mins)` and `reset()`. Without
`?dev` nothing is exposed, so hand the teams the plain link.

## Host materials

`HOST_ANSWER_KEY.md` lives only on the host's machine — solutions for all twelve machines
plus the prize-counter meta. It is listed in `.gitignore` along with `host/`, and is never
committed or deployed. Keep it that way: the site is public, and so is anything pushed
here.
