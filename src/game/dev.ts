import { CABINETS, CODE, MINES, NONOGRAM, SOKOBAN_LEVEL, SUDOKU_SOLUTION, WORD } from './arcade'

/**
 * Host testing console. Only installed when the URL carries ?dev — players on the plain
 * link get nothing on window and no console output.
 */
export function installDevTools(api: {
  award: (id: string) => void
  finish: () => void
  goto: (view: string) => void
  reset: () => void
  adjust: (minutes: number) => void
}) {
  if (!new URLSearchParams(window.location.search).has('dev')) return

  const S = 'color:#35e8d3;font-weight:bold'
  const D = 'color:#a596c9'

  const answers = () => {
    console.log('%c★ GUS’S GALACTIC ARCADE — ANSWER KEY', S)
    console.table(
      [...CABINETS]
        .sort((a, b) => a.score - b.score)
        .map((c, i) => ({ 'prize slot': i + 1, machine: c.name, game: c.game, score: c.score, token: c.token })),
    )
    console.log('%cPRIZE COUNTER: order tokens by high score, lowest first →', D,
      [...CABINETS].sort((a, b) => a.score - b.score).map((c) => c.token).join(''))
    console.log('%cNEON FLOW%c one full-cover solution (row,col per wire):\n%s', S, D,
      [
        'pink  : 0,0 → 0,1 → 0,2 → 0,3 → 0,4 → 0,5 → 0,6 → 1,6 → 1,5 → 1,4 → 1,3',
        'teal  : 1,2 → 1,1 → 1,0 → 2,0 → 2,1 → 2,2 → 2,3 → 2,4 → 2,5',
        'yellow: 2,6 → 3,6 → 3,5 → 3,4 → 3,3 → 3,2 → 3,1 → 3,0 → 4,0 → 4,1 → 4,2 → 4,3',
        'purple: 4,4 → 4,5 → 4,6 → 5,6 → 5,5 → 5,4 → 5,3 → 5,2',
        'blue  : 5,1 → 5,0 → 6,0 → 6,1 → 6,2 → 6,3 → 6,4 → 6,5 → 6,6',
      ].join('\n'))
    console.log('%cWORD BLASTER%c word (8 letters, 6 guesses): %s', S, D, WORD)
    console.log('%cCODE BREAKER%c four-digit code: %s', S, D, CODE)
    console.log('%cMINE CART%c mines (row,col 1-indexed):', S, D, MINES.map(([r, c]) => `${r + 1},${c + 1}`).join('  '))
    console.log('%cPIXEL PAINTER%c picture:\n%s', S, D,
      NONOGRAM.picture.map((r) => r.replace(/1/g, '#').replace(/0/g, '.').split('').join(' ')).join('\n'))
    console.log('%cNUMBER CRUNCH%c solution:\n%s', S, D,
      Array.from({ length: 6 }, (_, r) => SUDOKU_SOLUTION.slice(r * 6, r * 6 + 6).join(' ')).join('\n'))
    console.log('%cCRATE CRUSHER%c level (# wall, T target, B crate, P robot):\n%s', S, D, SOKOBAN_LEVEL.join('\n'))
    console.log('%cBLACKOUT%c press: r1c2 r2c1 r3c3 r3c4 r4c2 r4c5 r5c5', S, D)
    console.log('%cCIRCUIT CITY%c clicks per tile (rows top→bottom):\n%s', S, D,
      ['2 3 3 0 0 0', '1 2 1 1 2 1', '0 0 2 3 3 1', '3 2 0 2 3 2', '1 1 0 3 2 2', '0 1 2 0 0 3'].join('\n'))
    console.log('%cPARKING JAM%c 20 moves: X→ G↑ E← F↑ B→ F↑ F↑ E→ G↓ H← F↑ H← A↑ I→ I→ G↓ G↓ X→ X→ X→', S, D)
    console.log('%cSTACKER%c Towers of Hanoi, 5 discs, 31 moves minimum', S, D)
    console.log('%cMATCHBOX%c just flip pairs — no secret', S, D)
  }

  const dev = {
    help() {
      console.log('%cgus.help()%c        this list', S, D)
      console.log('%cgus.answers()%c     print every solution', S, D)
      console.log('%cgus.win(id)%c       award one token, e.g. gus.win("pixel")', S, D)
      console.log('%cgus.winAll()%c      award all twelve tokens', S, D)
      console.log('%cgus.open(id)%c      jump to a machine, or gus.open("prize") / gus.open("hub")', S, D)
      console.log('%cgus.escape()%c      finish the game right now', S, D)
      console.log('%cgus.time(mins)%c    add minutes to the clock (negative removes)', S, D)
      console.log('%cgus.reset()%c       wipe the arcade back to team select', S, D)
      console.log('%cgus.ids%c           %s', S, D, CABINETS.map((c) => c.id).join(', '))
    },
    answers,
    ids: CABINETS.map((c) => c.id),
    win: (id: string) => {
      if (!CABINETS.some((c) => c.id === id)) return console.warn('no such machine:', id, dev.ids)
      api.award(id)
      console.log('%ctoken awarded:', S, id)
    },
    winAll: () => {
      CABINETS.forEach((c) => api.award(c.id))
      console.log('%call twelve tokens awarded — the prize counter is open', S)
    },
    open: (view: string) => api.goto(view),
    escape: () => api.finish(),
    time: (mins: number) => {
      api.adjust(mins)
      console.log('%cclock adjusted by', S, mins, 'minutes')
    },
    reset: () => api.reset(),
  }

  ;(window as unknown as { gus: typeof dev }).gus = dev
  console.log('%c🕹 DEV MODE — type gus.help()', 'color:#ffd166;font-size:15px;font-weight:bold')
  answers()
}
