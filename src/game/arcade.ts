// Every board is fixed, never random: both arcades must play the identical machine.
// Boards were generated and verified offline (solvability, move counts, clue uniqueness).

export interface Cabinet {
  id: string
  name: string
  marquee: string
  game: string
  token: string
  score: number
  blurb: string
  howto: string
  nudges: string[]
}

/** Play order is free. The prize counter wants the tokens ordered by HIGH SCORE. */
export const CABINETS: Cabinet[] = [
  {
    id: 'echo',
    name: 'ECHO',
    marquee: 'ECHO — REPEAT AFTER ME',
    game: 'Simon, but it goes to eight',
    token: 'E',
    score: 31600,
    blurb: 'Four pads, one growing sequence, and a machine that has never once felt sorry for anybody.',
    howto: 'Watch the pads flash, then press them back in the same order. Every round adds one more. Get to eight in a row and the token is yours. Miss one and you only replay that round, not the whole thing.',
    nudges: [
      'Split the sequence up. Two people take the first four flashes, two take the rest, and one person does the clicking. Say the colours out loud as they flash.',
      'You can press REPLAY before you start entering — it costs nothing but seconds, and it shows the sequence again from the top.',
    ],
  },
  {
    id: 'word',
    name: 'WORD BLASTER',
    marquee: 'WORD BLASTER — DOUBLE BARREL',
    game: 'Wordle, except two words at once',
    token: 'R',
    score: 88800,
    blurb: 'Two five-letter words. One set of guesses. Every guess you make is spent on both boards at the same time.',
    howto: 'Type a five-letter word and hit ENTER. Green means right letter, right spot. Yellow means right letter, wrong spot. You get eight guesses total for BOTH words — spend the early ones on lots of different letters.',
    nudges: [
      'Do not chase one board. Burn your first two guesses on words packed with common letters and read both boards before you commit to anything.',
      'Both answers are things you are looking at right now: one is what these machines eat, and one is what you get at the counter when you win.',
    ],
  },
  {
    id: 'mine',
    name: 'MINE CART',
    marquee: 'MINE CART — WATCH YOUR STEP',
    game: 'Minesweeper, forgiving edition',
    token: 'G',
    score: 11200,
    blurb: 'Nine by nine, twelve sticks of dynamite, one cart. Hitting one does not end your run — it just costs you ten very long seconds.',
    howto: 'Click a tile to dig it. The number tells you how many of the eight tiles around it are dynamite. Flip to FLAG mode to mark the ones you are sure about. Clear every safe tile to win.',
    nudges: [
      'Start in the middle and let the empty region open up. Then work the edges of what you opened: a 1 touching exactly one unknown tile means that tile is dynamite.',
      'If a number already touches the right amount of flags, every other tile around it is safe — click them all. That single rule solves most of this board.',
    ],
  },
  {
    id: 'pixel',
    name: 'PIXEL PAINTER',
    marquee: 'PIXEL PAINTER — 10 x 10',
    game: 'Picross / nonogram',
    token: 'O',
    score: 44050,
    blurb: 'Fill the right squares and something old and pixellated crawls out of the grid.',
    howto: 'Numbers beside each row and column say how many squares in a row get filled, in that order, with at least one gap between groups. Click to fill, click again to mark a definite blank. The picture completes itself when every row and column matches.',
    nudges: [
      'Row 5 is a 10 — the whole row is filled, no thinking required. Start there and at the columns with big numbers, then work outwards from what that forces.',
      'Marking blanks is as useful as filling squares. Any column whose numbers are already satisfied can have every remaining square marked blank immediately.',
    ],
  },
  {
    id: 'code',
    name: 'CODE BREAKER 3000',
    marquee: 'CODE BREAKER 3000',
    game: 'Mastermind',
    token: 'A',
    score: 18750,
    blurb: 'Four slots, six colours, repeats allowed, and a machine that answers only in dots.',
    howto: 'Build a four-colour guess and submit it. A FILLED dot means one colour is right and in the right slot. A HOLLOW dot means a colour is right but in the wrong slot. The dots never tell you which slot they refer to. Ten guesses.',
    nudges: [
      'Spend your first two guesses on flat blocks of one colour — four reds, then four blues. The number of dots tells you exactly how many of that colour are in the code, which narrows things fast.',
      'Once you know the colour counts, stop guessing new colours and start moving the ones you know between slots. A guess that changes only two positions tells you far more than a guess that changes everything.',
    ],
  },
  {
    id: 'jam',
    name: 'PARKING JAM',
    marquee: 'PARKING JAM — GET OUT',
    game: 'Rush Hour',
    token: 'V',
    score: 52900,
    blurb: 'Your cart is stuck in the worst car park ever built. Twenty moves will do it. Most people take sixty.',
    howto: 'Click a vehicle to select it, then use the arrows to slide it. Cars only move along their own length — no turning, no lifting. Get the striped cart out of the gap on the right.',
    nudges: [
      'Do not start by shoving the cart. Look at what is directly blocking it, then at what is blocking THAT, and clear from the back of the chain forwards.',
      'The vertical three-length vehicle is the whole puzzle. Work out where it has to end up for the lane to be clear, then make room for it before you touch anything else.',
    ],
  },
  {
    id: 'circuit',
    name: 'CIRCUIT CITY',
    marquee: 'CIRCUIT CITY — LIGHT IT UP',
    game: 'Pipe / wire rotation',
    token: 'E',
    score: 67400,
    blurb: 'Some idiot rotated every junction box in the building. The power is on. It simply has nowhere to go.',
    howto: 'Click any tile to rotate it a quarter turn. Power flows from the plug in the top-left corner along connected wires. Light every single bulb at the same time to win.',
    nudges: [
      'Work outwards from the plug in the top-left, one tile at a time, and leave the lit tiles alone once they are right. Lit wires glow — if a tile stops glowing, you broke something upstream.',
      'Corner and edge tiles have fewer legal rotations than middle ones, because wires cannot point off the board. Lock those down first and the middle mostly solves itself.',
    ],
  },
  {
    id: 'blackout',
    name: 'BLACKOUT',
    marquee: 'BLACKOUT — ALL LIGHTS ON',
    game: 'Lights Out',
    token: 'M',
    score: 24300,
    blurb: 'Twenty-five bulbs. One badly wired switch panel. Every switch drags its neighbours along with it.',
    howto: 'Clicking a bulb flips it AND the four bulbs directly above, below, left and right of it. Turn every bulb on at once. Order does not matter, and pressing the same bulb twice undoes it.',
    nudges: [
      'Pressing a bulb twice cancels out, so what matters is only WHICH bulbs you press, never the order. Nothing you do here is unrecoverable.',
      'Work top row down. Fix row 1 by pressing bulbs in row 2 underneath any dark bulb, then repeat down the board. Whatever is left in the bottom row tells you what the top row needed all along.',
    ],
  },
]

// ---------------------------------------------------------------- boards
export const SIMON_SEQUENCE = [2, 0, 3, 1, 1, 2, 0, 3, 2, 1, 3, 0]

export const WORDS = ['TOKEN', 'PRIZE']
export const WORD_GUESSES = 8

export const MINES: [number, number][] = [
  [0, 4], [1, 1], [1, 7], [2, 3], [3, 0], [3, 6],
  [4, 8], [5, 2], [6, 5], [7, 1], [7, 7], [8, 4],
]

export const NONOGRAM = {
  picture: [
    '0011000011',
    '0001111000',
    '0011111100',
    '0110110110',
    '1111111111',
    '1011111101',
    '1010000101',
    '0001100100',
    '0011001100',
    '0110000110',
  ],
  rows: [[2, 2], [4], [6], [2, 2, 2], [10], [1, 6, 1], [1, 1, 1, 1], [2, 1], [2, 2], [2, 2]],
  cols: [[3], [2, 1], [1, 5, 2], [3, 2, 2], [5, 1], [5], [2, 2, 1], [8], [1, 2, 1], [1, 3]],
}

export const MASTERMIND_CODE = [3, 0, 5, 3]
export const MASTERMIND_COLOURS = ['#ff4d6d', '#4fd8c4', '#ffd166', '#8b7cf6', '#4cc9f0', '#f6a94b']
export const MASTERMIND_GUESSES = 10

export interface Car {
  id: string
  r: number
  c: number
  len: number
  dir: 'h' | 'v'
}
/** verified: solvable, 20 moves minimum */
export const CARS: Car[] = [
  { id: 'X', r: 2, c: 0, len: 2, dir: 'h' },
  { id: 'A', r: 1, c: 4, len: 2, dir: 'v' },
  { id: 'B', r: 5, c: 3, len: 2, dir: 'h' },
  { id: 'C', r: 5, c: 0, len: 2, dir: 'h' },
  { id: 'D', r: 3, c: 1, len: 2, dir: 'v' },
  { id: 'E', r: 3, c: 4, len: 2, dir: 'h' },
  { id: 'F', r: 4, c: 5, len: 2, dir: 'v' },
  { id: 'G', r: 1, c: 3, len: 3, dir: 'v' },
  { id: 'H', r: 0, c: 4, len: 2, dir: 'h' },
  { id: 'I', r: 4, c: 2, len: 2, dir: 'h' },
]

/** bit 1 = up, 2 = right, 4 = down, 8 = left */
export const PIPE_MASK = [
  [6, 10, 8, 6, 10, 8],
  [7, 8, 4, 5, 4, 4],
  [7, 14, 15, 11, 15, 9],
  [5, 1, 7, 8, 1, 4],
  [1, 2, 15, 14, 10, 13],
  [2, 10, 9, 3, 8, 1],
]
export const PIPE_SCRAMBLE = [
  [2, 1, 1, 0, 0, 0],
  [3, 2, 3, 3, 2, 3],
  [0, 0, 2, 1, 1, 3],
  [1, 2, 0, 2, 1, 2],
  [3, 3, 0, 1, 2, 2],
  [0, 3, 2, 0, 0, 1],
]

export const LIGHTS_START = [
  [1, 0, 0, 1, 1],
  [0, 1, 0, 0, 1],
  [0, 1, 1, 1, 1],
  [0, 0, 1, 1, 1],
  [1, 0, 1, 0, 1],
]

// ---------------------------------------------------------------- BUZZ
export const BUZZ_WIN = [
  'Token earned. I am contractually obliged to say well done.',
  'Fine. That was fine. I have seen faster, but it was fine.',
  'Oh, you got it. I had money on the other office.',
  'Token dispensed. Please do not shake the machine, it hates that.',
  'Look at you. Genuinely, look at you.',
  'That one beats most adults. You may feel smug for nine seconds.',
  'Another one down. The prize counter is starting to sweat.',
  'Right. That is the hard one done. Do not get cocky.',
]
