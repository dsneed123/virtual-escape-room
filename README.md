# GUS'S GALACTIC ARCADE — Seattle vs. SJC

A 45-minute head-to-head arcade lock-in for two teams in two rooms, each crowded round one
screen. Eleven playable machines — an eight-letter Wordle, Minesweeper, Picross, crack-the-code,
Rush Hour, Sokoban, Sudoku, Towers of Hanoi, Flow, pipe-rotation and Lights Out — then a
Password Game on the shutter that lets you out.

Each machine shows a time estimate and a ticket value; harder ones pay more. The shutter
opens at 15 tickets out of 33 available, so teams pick a route instead of grinding
everything, and the whole night fits inside 45 minutes.

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

Both teams open the URL, pick their arcade, and work through the four-step setup checklist
on the briefing screen — mute the huddle, vote an operator, share to the TV, agree a route.
START stays disabled until all four are ticked. Give the start signal; each team presses INSERT COIN. After
every machine they beat, the game names the next person to take the mouse, so the whole
room plays rather than one person clicking. Timers are independent and survive a refresh — as do
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
