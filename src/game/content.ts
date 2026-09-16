export interface StageDef {
  n: number
  channel: number | null
  title: string
  subtitle: string
  brief: string[]
  objective: string
  nudges: string[]
  prompt: string
  placeholder: string
  hash: string
  frag: string
}

export const STAGES: StageDef[] = [
  {
    n: 1,
    channel: 21,
    title: 'THE MANIFEST',
    subtitle: 'GATE LOG \u2014 THE NIGHT HE LEFT',
    brief: [
      'Vance\u2019s last night in the building is a matter of record. Five people signed out through five different gates, and one of them went home carrying the only thing anybody wants.',
      'The rule here has never changed and everybody knows it: the last one out carries the archive. Vance would call that a coincidence. Vance would be lying.',
    ],
    objective:
      'Work out which operative was genuinely the last to walk out of the building, and type their codename into the lock.',
    nudges: [
      'Three panels, and you need all three. The notes on the right tell you which gate and which time belongs to each name \u2014 the grid underneath is there to help you keep track. Start with note 4: it rules three people out of two gates immediately.',
      'Solve the grid first and ignore the clock problem entirely. Once every name has a gate and a time, read the TIME STANDARD NOTICE again, slowly. Two of those five gates are not reporting the same kind of time as the other three.',
    ],
    prompt: 'WHO CARRIED THE ARCHIVE OUT',
    placeholder: 'CODENAME',
    hash: 'bwfakrlfy6',
    frag: 'JiAhPTYsLQ==',
  },
  {
    n: 2,
    channel: 30,
    title: 'SIGNAL DRIFT',
    subtitle: 'INTERCEPT LOG \u2014 THE WESTWARD EAR',
    brief: [
      'The carrier\u2019s name opens Vance\u2019s signal vault, which turns out to contain one night of intercepts and a recorder with a personality problem.',
      'It wrote the bursts down in whatever order it dug them back out of its own memory. Its carrier frequency, to its credit, never wandered by so much as a hair all night.',
      'Which makes the places where it did wander rather interesting.',
    ],
    objective:
      'Seven of these twelve bursts are hiding a letter each. Recover the seven letters and type the word they spell.',
    nudges: [
      'The rows are printed in burst-ID order, which is useless to you. Put them in time order first \u2014 earliest at the top \u2014 and look down the frequency column.',
      'In time order the frequency climbs by exactly the same amount every single burst. Work out that step, then note how far above the expected value each odd burst sits. Those small numbers are positions, and the callsign beside them is what you count into.',
    ],
    prompt: 'THE WORD THE DRIFT SPELLS',
    placeholder: 'ONE WORD',
    hash: '1paobtt8y01',
    frag: 'JSQ+Kj0mLw==',
  },
  {
    n: 3,
    channel: 24,
    title: 'PLATE NINE',
    subtitle: 'SUBLEVEL SURVEY, DRAWN BY H. VANCE',
    brief: [
      'Plate nine is Vance\u2019s own survey of the sublevel, with the route he walked on his last night marked in his own hand.',
      'The plate is not wrong. Vance has never drawn a wrong plate in his life and would like that on the record. It is simply not printed the way you are expecting to read it.',
    ],
    objective:
      'Walk the route from the ringed cell, writing down the letter you land on at every MARK. Type the eight letters you collect.',
    nudges: [
      'Before you walk a single step, look hard at the compass rose in the ORIENTATION panel. Compare where its letters actually sit against where you assumed they would sit.',
      'On this plate north points to the bottom of the screen, south to the top, east to the left and west to the right. Every direction in the route is the opposite of your instinct. The log says the walk ends in the SUBVAULT \u2014 use that to check yourself.',
    ],
    prompt: 'THE LETTERS YOU COLLECTED',
    placeholder: 'EIGHT LETTERS',
    hash: 'd2ma4u7c8y',
    frag: 'IichICAgICA=',
  },
  {
    n: 4,
    channel: 18,
    title: 'COLD STORAGE',
    subtitle: 'SUBVAULT \u2014 TWELVE CRATES, THREE LEDGERS',
    brief: [
      'Cold storage: twelve crates, and three machines that each catalogued them in a different order and refused, on principle, to speak to one another.',
      'Clipped to the door is a requisition order Vance filed against himself eleven days before he left. Meticulous planning, or an elaborate joke at your expense. Both, probably.',
    ],
    objective:
      'Exactly one crate satisfies all five lines of the requisition order. Type the word stencilled on it.',
    nudges: [
      'This one is built to be split up. Put one person on each ledger, work the five lines one at a time, and cross crates off out loud. Clicking a crate highlights it in all three ledgers at once.',
      'Line 2 is not about this room \u2014 it means the operative you named at door 1. Line 3 means counting seal colours across the whole manifest before you judge any single crate.',
    ],
    prompt: 'THE CRATE YOU WANT',
    placeholder: 'LABEL ON THE CRATE',
    hash: '29orcm9hpje',
    frag: 'LyQhKCg9',
  },
  {
    n: 5,
    channel: 23,
    title: 'THE VANCE MACHINE',
    subtitle: 'PRIVATE LOGS, DOUBLE KEYED',
    brief: [
      'The machine on the bench will decode anything you like, provided you know what it was keyed to. It is the only thing in this building Vance left switched on, which is a message in itself.',
      'His private logs carry two locks, because of course they do. The note taped to the first one is below, signed with a flourish.',
    ],
    objective:
      'Find the key to segment I, read what it tells you, and use that to key segment II. Type the word segment II names.',
    nudges: [
      'Both keys are things you have already seen tonight. The first is a place; the note says it is somewhere his survey never went. Plate 9 is still open in the ARCHIVE at the top of the screen.',
      'Retrace the door 3 route and list the rooms it passes through. One named room is never entered at all \u2014 that word is the first key. Segment I then tells you, in plain English, what the second key is.',
    ],
    prompt: 'THE WORD SEGMENT II NAMES',
    placeholder: 'ONE WORD',
    hash: '1oy94a5m8ue',
    frag: 'Liw8LSE7',
  },
  {
    n: 6,
    channel: 20,
    title: 'THE REEL',
    subtitle: 'EVIDENCE 44-C \u2014 EIGHT SEGMENTS, SPLICE UNKNOWN',
    brief: [
      'A reel of tape, cut into eight pieces and shuffled by somebody in a considerable hurry.',
      'The lab recovered no audio at all \u2014 only the frame letter burned into each segment, and a page of notes so pedantic they can only have come from one man.',
    ],
    objective:
      'Put all eight segments in the right order using the notes, then lock the splice. The letters read out only when the order is correct.',
    nudges: [
      'Four of the notes are about the same handful of segments. Chain them together before you place anything: notes 2, 3 and 5 give you one long sequence from first to last.',
      'That chain is T-19, then T-07, then T-11, then T-16, then T-09, in that order though not necessarily next to each other. Note 7 pins T-02 immediately before T-16, and note 6 fixes T-11 exactly three places after T-04. Work outwards from there.',
    ],
    prompt: 'THE REBUILT SPLICE',
    placeholder: '',
    hash: '153jxnnp19w',
    frag: 'PjEzOyggLyk=',
  },
  {
    n: 7,
    channel: 12,
    title: 'THE GRILLE',
    subtitle: 'FINAL PLATE \u2014 LATTICE AND MASK',
    brief: [
      'The last plate: thirty-six letters, and a punched brass mask pinned through the middle of them.',
      'Vance liked masks. He liked them considerably more when they turned.',
    ],
    objective:
      'Read the letters showing through the mask, turn it, and keep reading until you have the whole sentence. Type the sentence \u2014 spaces do not matter.',
    nudges: [
      'Six windows, four seatings of the mask, twenty-four letters in total. Read each seating left to right, top to bottom, then turn the mask with the arrows under the plate.',
      'The mask was found part-way round, so the seating you are looking at now is not the start of the sentence. Find the seating that begins THEFIN and read clockwise from there.',
    ],
    prompt: 'THE WHOLE MESSAGE',
    placeholder: 'THE FULL SENTENCE',
    hash: '2bvmjjkqmlr',
    frag: 'LyAzKisn',
  },
  {
    n: 8,
    channel: null,
    title: 'THE MERIDIAN LOCK',
    subtitle: 'THE EIGHTH DOOR',
    brief: [
      'No channel. No plate. A slot at chest height, the machine, and an envelope with your office\u2019s name on it in Vance\u2019s handwriting \u2014 which means he wrote it before he knew who would get here first, and wrote a second one for the other room.',
    ],
    objective:
      'Vance\u2019s note tells you how to build a key out of what you are already carrying. Build it, feed it to the machine, and type what the machine gives back.',
    nudges: [
      'Read the note one line at a time; every line is an instruction, not a flourish. \u201cDepth\u201d is a number you have seen on every single door, sitting in the same corner of the screen all night. The table beside the note has both columns you need.',
      'Take each door\u2019s channel number and count that many letters into that door\u2019s fragment word, going back to the start of the word whenever you run off the end. One letter per door, in door order, gives you a seven-letter name. That name is the key for the terminal block \u2014 not the answer.',
    ],
    prompt: 'WHAT THE MACHINE GIVES BACK',
    placeholder: 'THE DECODED PHRASE',
    hash: 'w51e5alofs',
    frag: 'OS03SSgoLzooNzxJIyYkPU0qJz0=',
  },
]

// ---------------------------------------------------------------- STAGE 1
export const S1_ROSTER = [
  { name: 'KESTREL', seal: '4417' },
  { name: 'VESPER', seal: '2093' },
  { name: 'HARROW', seal: '7741' },
  { name: 'MAGPIE', seal: '3308' },
  { name: 'ONYX', seal: '5162' },
  { name: '[SEALED]', seal: '0000' },
]
export const S1_GATES = ['NORTH', 'EAST', 'SOUTH', 'WEST', 'DOCK']
export const S1_TIMES = ['11:02', '11:09', '11:14', '11:21', '11:27']
export const S1_NOTES = [
  'ONYX is the first departure on the recorder.',
  'MAGPIE is logged exactly five minutes before HARROW.',
  'The NORTH gate logged its departure exactly seven minutes after the WEST gate logged its own.',
  'KESTREL, MAGPIE and ONYX all left through gates that keep station time.',
  'ONYX did not use the EAST gate.',
]

// ---------------------------------------------------------------- STAGE 2
export const S2_ROWS = [
  { id: 'B-07', t: '23:03', call: 'PILGRIM', freq: 1331 },
  { id: 'B-02', t: '23:22', call: 'DRYDOCK', freq: 1442 },
  { id: 'B-11', t: '22:47', call: 'NIGHTHAWK', freq: 1221 },
  { id: 'B-04', t: '23:40', call: 'JUNIPER', freq: 1553 },
  { id: 'B-09', t: '22:41', call: 'SABLE', freq: 1180 },
  { id: 'B-01', t: '23:11', call: 'CASCADE', freq: 1366 },
  { id: 'B-12', t: '23:35', call: 'FOXGLOVE', freq: 1515 },
  { id: 'B-05', t: '22:52', call: 'MERIDIAN', freq: 1261 },
  { id: 'B-10', t: '23:48', call: 'MARLIN', freq: 1587 },
  { id: 'B-03', t: '23:16', call: 'TEAKWOOD', freq: 1402 },
  { id: 'B-08', t: '23:00', call: 'HOLLOW', freq: 1291 },
  { id: 'B-06', t: '23:29', call: 'VERGE', freq: 1476 },
]

// ---------------------------------------------------------------- STAGE 3
export const S3_GRID = [
  'EZIHVCDP',
  'FOSZDGMI',
  'GIOSCGOD',
  'DWOEOBIE',
  'UJTUKIKA',
  'VKAZZAOK',
  'MMSLBNAZ',
  'RRSRISMU',
]
export const S3_ROOMS = [
  { name: 'PLENUM', c1: 1, c2: 3, r1: 1, r2: 2 },
  { name: 'GALLERY', c1: 6, c2: 8, r1: 1, r2: 2 },
  { name: 'ORRERY', c1: 1, c2: 2, r1: 4, r2: 5 },
  { name: 'ARMORY', c1: 7, c2: 8, r1: 4, r2: 5 },
  { name: 'CISTERN', c1: 1, c2: 3, r1: 7, r2: 8 },
  { name: 'SUBVAULT', c1: 6, c2: 8, r1: 7, r2: 8 },
]
export const S3_START = { c: 5, r: 4 }
export const S3_ROUTE = [
  'MARK',
  'N 3',
  'MARK',
  'E 2',
  'MARK',
  'S 6',
  'MARK',
  'W 4',
  'MARK',
  'N 3',
  'MARK',
  'N 3',
  'MARK',
  'E 1',
  'MARK',
]

// ---------------------------------------------------------------- STAGE 4
export interface Crate {
  id: string
  label: string
  mass: number
  seal: string
  temps: number[]
  handler: string
  bays: number[]
}
export const S4_CRATES: Crate[] = [
  { id: 'C-02', label: 'GNEISS', mass: 28, seal: 'SLATE', temps: [-20.2, -17.9, -19.4], handler: 'KESTREL', bays: [1, 2] },
  { id: 'C-05', label: 'PUMICE', mass: 11, seal: 'SLATE', temps: [-22.0, -21.6, -20.9], handler: 'MAGPIE', bays: [1, 2] },
  { id: 'C-07', label: 'BASALT', mass: 27, seal: 'COBALT', temps: [-23.1, -22.4, -21.7], handler: 'KESTREL', bays: [2, 3] },
  { id: 'C-09', label: 'SCHIST', mass: 33, seal: 'COBALT', temps: [-24.0, -23.2, -22.8], handler: 'KESTREL', bays: [3, 4] },
  { id: 'C-11', label: 'QUARTZ', mass: 18, seal: 'COBALT', temps: [-21.5, -20.8, -19.9], handler: 'KESTREL', bays: [2] },
  { id: 'C-14', label: 'JASPER', mass: 29, seal: 'AMBER', temps: [-19.6, -17.4, -18.8], handler: 'HARROW', bays: [2] },
  { id: 'C-16', label: 'GABBRO', mass: 22, seal: 'AMBER', temps: [-25.3, -24.8, -24.1], handler: 'MAGPIE', bays: [3, 4] },
  { id: 'C-18', label: 'FELSITE', mass: 15, seal: 'AMBER', temps: [-21.7, -20.5, -19.3], handler: 'ONYX', bays: [2] },
  { id: 'C-21', label: 'DOLOMITE', mass: 31, seal: 'AMBER', temps: [-26.0, -25.5, -25.1], handler: 'KESTREL', bays: [1, 3] },
  { id: 'C-23', label: 'RHYOLITE', mass: 26, seal: 'SLATE', temps: [-19.8, -19.1, -18.4], handler: 'VESPER', bays: [2, 3] },
  { id: 'C-26', label: 'SYENITE', mass: 13, seal: 'OXIDE', temps: [-22.9, -22.1, -21.5], handler: 'VESPER', bays: [1, 2] },
  { id: 'C-29', label: 'MARBLE', mass: 28, seal: 'OXIDE', temps: [-23.8, -22.0, -17.6], handler: 'HARROW', bays: [3, 4] },
]
export const S4_ORDER = [
  'The crate never registered above −18.0 °C at any thermal checkpoint.',
  'It was signed for by the operative who left the station last on the night of the blackout.',
  'Its seal colour is shared by exactly three crates in this manifest.',
  'Its mass exceeds 25 kilograms.',
  'It was never held in bay 4.',
]

// ---------------------------------------------------------------- STAGE 5
export const S5_SEGMENT_A =
  'HYVWVACEULRJTREWNCFJFRCWHFKLVLODVWKCBTZPCCRFEXYCQIRXVWCLFTVLSU'
export const S5_SEGMENT_B = 'HOGDJHVLASEXOEVTSXGIXTSYSAYMPGUIKCTGEEJ'

// ---------------------------------------------------------------- STAGE 6
export const S6_SEGMENTS = [
  { id: 'T-07', letter: 'R' },
  { id: 'T-16', letter: 'N' },
  { id: 'T-23', letter: 'A' },
  { id: 'T-09', letter: 'G' },
  { id: 'T-04', letter: 'T' },
  { id: 'T-02', letter: 'I' },
  { id: 'T-19', letter: 'S' },
  { id: 'T-11', letter: 'L' },
]
// displayed shuffled — the tray order must not hint the answer
export const S6_TRAY = ['T-07', 'T-16', 'T-23', 'T-09', 'T-04', 'T-02', 'T-19', 'T-11']
export const S6_NOTES = [
  'T-23 and T-02 are the only segments whose frame letter is a vowel, and exactly two segments lie between them.',
  'T-07 is spliced somewhere before T-11, and T-11 somewhere before T-16.',
  'T-09 falls somewhere after T-16.',
  'T-23 sits in the first half of the reel.',
  'T-19 precedes T-07.',
  'Exactly two segments lie between T-04 and T-11, and T-04 is the earlier of the two.',
  'T-16 follows T-02 immediately.',
]

// ---------------------------------------------------------------- STAGE 7
export const S7_GRID = ['TLMHEA', 'BFLCLV', 'EBAIDC', 'FDERUA', 'IOFLNG', 'NTINRS']
export const S7_HOLES: [number, number][] = [
  [0, 0],
  [0, 3],
  [0, 4],
  [1, 1],
  [2, 3],
  [5, 3],
]

// ---------------------------------------------------------------- META
export const META_CIPHER = 'EHREEEGPRAZSVFZUG'
export const META_NOTE = [
  'You are about to try the seven words. Please don’t — I would hate for you to spend the last of the clock on it. The words were never the key. They were the road.',
  'Every door announced its depth before you walked through it. You read the number. You never once listened to it.',
  'So: take the depth. Walk it into the word. The word is a ring — when you run off the end of it, keep walking.',
  'Seven steps. Seven letters. In the order the doors opened.',
  'That is my name for the eighth door. It is a key, not an answer; the machine knows perfectly well what to do with it. Do try to look surprised.',
  '— H.V.',
]

export const INTRO = [
  'Halden Vance spent forty years as archivist of the Meridian Array, and by every account he was impossible: brilliant, smug, and constitutionally incapable of leaving a filing cabinet un-booby-trapped.',
  'Nine days ago he retired. There was no party. He locked the entire archive — forty years of everything the Array ever overheard — behind eight doors of his own design, posted the keys to nobody, and left a note reading: TO WHICHEVER OFFICE WANTS IT MORE.',
  'There is a catch, and it is very Vance. Forty-five minutes after the doors are first touched, the archive files itself somewhere even he claims to have forgotten. He describes this as motivation.',
  'Two offices are playing tonight: STATION SEATTLE and STATION SJC. Same doors, same clock, no talking between rooms. Exactly one of you gets to be insufferable about this afterwards.',
  'Every door gives up one fragment word. Vance never wrote anything down twice, and he never wrote anything down for no reason — keep all of it.',
]

