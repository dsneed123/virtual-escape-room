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
    id: 'flow',
    name: 'NEON FLOW',
    marquee: 'NEON FLOW — JOIN THE DOTS',
    game: 'Flow / connect the pairs',
    token: 'E',
    score: 31600,
    blurb: 'Five pairs of coloured lamps, one board, and wires that refuse to cross each other.',
    howto: 'Click a coloured dot, then click along neighbouring squares to drag a wire to its matching dot. Wires cannot cross, and every single square on the board has to end up covered. Click back along a wire to shorten it.',
    nudges: [
      'Corners first. A dot sitting in a corner has only one way out, so its first square is forced — the same goes for dots against an edge.',
      'The board must be completely full, so if a wire takes an obvious short cut it is almost always wrong. When you are stuck, look for an empty square that only one colour could ever reach.',
    ],
  },
  {
    id: 'word',
    name: 'WORD BLASTER',
    marquee: 'WORD BLASTER — DOUBLE BARREL',
    game: 'Wordle, except two words at once',
    token: 'E',
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
    token: 'F',
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
    token: 'L',
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
    token: 'R',
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
    token: 'Y',
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
    token: 'O',
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
    token: 'E',
    score: 24300,
    blurb: 'Twenty-five bulbs. One badly wired switch panel. Every switch drags its neighbours along with it.',
    howto: 'Clicking a bulb flips it AND the four bulbs directly above, below, left and right of it. Turn every bulb on at once. Order does not matter, and pressing the same bulb twice undoes it.',
    nudges: [
      'Pressing a bulb twice cancels out, so what matters is only WHICH bulbs you press, never the order. Nothing you do here is unrecoverable.',
      'Work top row down. Fix row 1 by pressing bulbs in row 2 underneath any dark bulb, then repeat down the board. Whatever is left in the bottom row tells you what the top row needed all along.',
    ],
  },
  {
    id: 'match',
    name: 'MATCHBOX',
    marquee: 'MATCHBOX — FIND THE PAIRS',
    game: 'Memory / concentration',
    token: 'P',
    score: 36400,
    blurb: 'Sixteen cards face down, eight pairs, and a machine that assumes you were not paying attention.',
    howto: 'Flip two cards. If they match they stay up. If they do not, they flip back and you try again. Clear all eight pairs.',
    nudges: [
      'Give each person a quadrant to remember rather than everyone watching everything. Say positions out loud: "cherry, top right."',
      'When you turn up a new symbol, immediately flip a card you have never seen rather than re-checking one you know. You learn two cards instead of one.',
    ],
  },
  {
    id: 'stack',
    name: 'STACKER',
    marquee: 'STACKER — MOVE THE PILE',
    game: 'Towers of Hanoi',
    token: 'A',
    score: 48900,
    blurb: 'Five discs, three pegs, and one very old rule about what may sit on what.',
    howto: 'Move the whole stack from the left peg to the right peg. Click a peg to lift its top disc, click another peg to drop it. A bigger disc may never sit on a smaller one. It can be done in 31 moves.',
    nudges: [
      'Do not try to plan all 31 moves. To move five discs right, you first have to move the top four out of the way onto the middle peg — solve that smaller problem and repeat.',
      'The smallest disc moves every other turn, always in the same direction round the pegs: left, middle, right, left. Fix that rhythm and the rest is forced.',
    ],
  },
  {
    id: 'crate',
    name: 'CRATE CRUSHER',
    marquee: 'CRATE CRUSHER — PUSH ONLY',
    game: 'Sokoban',
    token: 'M',
    score: 61500,
    blurb: 'Three crates, three marked squares, and a warehouse robot that can push but has never once learned to pull.',
    howto: 'Move with the arrow keys or the on-screen arrows. Walking into a crate pushes it, if there is room behind it. Get all three crates onto the marked squares. UNDO and RESET are right there, so a crate stuck in a corner costs nothing.',
    nudges: [
      'You can only push, never pull, so a crate shoved into a corner is dead. Work out where each crate has to end up before you touch it, and approach from the far side.',
      'Do the crate nearest its target last, not first — parking it early tends to block the route you need for the others. Undo is free; use it the moment a push looks wrong.',
    ],
  },
  {
    id: 'sudoku',
    name: 'NUMBER CRUNCH',
    marquee: 'NUMBER CRUNCH — 6 x 6',
    game: 'Sudoku, small but mean',
    token: 'D',
    score: 74200,
    blurb: 'Six by six, six numbers, and boxes that are two tall and three wide, which catches people out every single time.',
    howto: 'Fill every square so each row, each column and each outlined 2x3 box contains 1 to 6 exactly once. Click a square, then click a number. Squares that clash with another square turn red as you go.',
    nudges: [
      'The boxes are 2 rows by 3 columns, not 3 by 3 — check the outlines before you deduce anything. Start with the row and the box that already have the most numbers in them.',
      'Work one number at a time across the whole grid: find every place a 6 can go, then every place a 5 can go. With only six values that closes out fast.',
    ],
  },
]

// ---------------------------------------------------------------- boards
export const FLOW_SIZE = 7
/** five colour pairs; a full-cover solution is guaranteed by construction */
export const FLOW_ENDPOINTS: number[][][] = [
  [[0, 0], [1, 3]],
  [[1, 2], [2, 5]],
  [[2, 6], [4, 3]],
  [[4, 4], [5, 2]],
  [[5, 1], [6, 6]],
]

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

export const MEMORY_DECK = ['\u2b50','\ud83d\udc8e','\ud83c\udf52','\ud83c\udf52','\ud83d\udd79','\ud83d\udc7e','\ud83d\ude80','\ud83d\udc7e','\ud83c\udfb1','\ud83d\udd79','\ud83d\udd14','\u2b50','\ud83d\udc8e','\ud83d\ude80','\ud83c\udfb1','\ud83d\udd14']

export const HANOI_DISCS = 5

/** verified solvable in 35 pushes/steps; # wall, T target, B crate, P robot */
export const SOKOBAN_LEVEL = [
  '########',
  '#T     #',
  '# ##B# #',
  '#  B   #',
  '# #  # #',
  '#   B  #',
  '# T P T#',
  '########',
]

/** 6x6, boxes are 2 rows x 3 cols, 16 givens, verified unique */
export const SUDOKU_PUZZLE = [0,1,0,0,0,0, 0,4,6,0,1,0, 4,0,0,3,6,2, 0,0,0,5,0,0, 0,3,5,0,0,6, 6,0,4,1,5,0]
export const SUDOKU_SOLUTION = [5,1,2,6,3,4, 3,4,6,2,1,5, 4,5,1,3,6,2, 2,6,3,5,4,1, 1,3,5,4,2,6, 6,2,4,1,5,3]

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
