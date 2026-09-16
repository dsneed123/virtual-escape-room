# MERIDIAN PROTOCOL — Seattle vs. SJC

A 45-minute head-to-head virtual escape room for two teams in two rooms, each gathered
around one screen. Eight doors, no backend, no accounts, nothing shared between the two
browsers — each team's session lives entirely in its own localStorage.

The host runs the competition: gives the start signal, answers hint requests on Slack,
collects the two completion times, and calls the winner.

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

Both teams open the URL, pick their station, and wait on the briefing screen. Give the
start signal; each team presses START THE CLOCK. Timers are independent and survive a
refresh. Pause, resume, and a guarded reset are in the top bar.

Each team gets exactly two hints for the whole game, requested from the host on Slack —
there is no hint button in the game. When a team escapes, the screen shows their
completion time to send you.

## Host materials

`HOST_ANSWER_KEY.md` lives only on the host's machine. It is listed in `.gitignore`
along with `host/`, and is never committed or deployed. Keep it that way — the site is
public, and so is anything pushed to this repository.
