export interface StageDef {
  n: number
  channel: number | null
  title: string
  subtitle: string
  brief: string[]
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
    subtitle: 'GATE LOG — NIGHT OF THE BLACKOUT',
    brief: [
      'The gate recorder survived the blackout. The roster did not.',
      'Five operatives left Meridian Station that night, one departure per gate, and one of them walked out with the archive under their coat. Vance kept a single rule and every cell knew it: the last one out carries it.',
      'Establish who left last. Physically last — through the door, into the rain.',
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
    subtitle: "INTERCEPT LOG — ARRAY WESTWARD EAR",
    brief: [
      "The carrier's name opened the signal vault. Inside: one night of intercepts, twelve bursts, written down by a recorder that was already dying.",
      'The recorder wrote the bursts in the order it recovered them, not the order it heard them. Its carrier frequency was rock steady all night.',
      'Vance annotated none of this. He did not have to. His drift is never noise — it is a count.',
    ],
    prompt: 'RECOVERED TRANSMISSION',
    placeholder: 'WORD',
    hash: '1paobtt8y01',
    frag: 'JSQ+Kj0mLw==',
  },
  {
    n: 3,
    channel: 24,
    title: 'PLATE NINE',
    subtitle: 'SUBLEVEL SURVEY — DRAWN BY H. VANCE',
    brief: [
      'Plate nine is a survey of the sublevel in Vance’s own hand, with a route walked on the night he disappeared.',
      'The plate is not wrong. It is simply not printed the way you expect to read it. Read the plate before you walk it.',
      'Start at the marked cell. Follow the route exactly. Record a letter at every MARK, in order.',
    ],
    prompt: 'LETTERS RECORDED AT THE MARKS',
    placeholder: 'WORD',
    hash: 'd2ma4u7c8y',
    frag: 'IichICAgICA=',
  },
  {
    n: 4,
    channel: 18,
    title: 'COLD STORAGE',
    subtitle: 'SUBVAULT — TWELVE CRATES, THREE LEDGERS',
    brief: [
      'Below the sublevel: cold storage, and a requisition order Vance filed against himself eleven days before he vanished.',
      'The crates are indexed three separate ways by three separate machines, none of which agreed to talk to the others.',
      'One crate satisfies every line of the order. Name it.',
    ],
    prompt: 'CRATE LABEL',
    placeholder: 'LABEL',
    hash: '29orcm9hpje',
    frag: 'LyQhKCg9',
  },
  {
    n: 5,
    channel: 23,
    title: 'THE VANCE MACHINE',
    subtitle: 'PRIVATE LOGS — DOUBLE KEYED',
    brief: [
      'The machine on the bench will decode anything, provided you know what it was keyed to. It is the only thing in this station Vance left switched on.',
      'His logs carry two locks. The note clipped to the first reads, in his hand:',
      '“Key one is the chamber my survey never entered. I never wrote the second key down — I only said it out loud, in the first half, to whoever got that far.”',
    ],
    prompt: 'FRAGMENT NAMED IN THE SECOND SEGMENT',
    placeholder: 'WORD',
    hash: '1oy94a5m8ue',
    frag: 'Liw8LSE7',
  },
  {
    n: 6,
    channel: 20,
    title: 'THE REEL',
    subtitle: 'EVIDENCE 44-C — EIGHT SEGMENTS, SPLICE UNKNOWN',
    brief: [
      'A reel of magnetic tape, cut into eight segments and shuffled by someone working fast enough to be frightened.',
      'The lab could not recover the audio, only the frame letter burned into each segment and a page of forensic notes about the splice.',
      'Rebuild the order. The reel spells what it spells.',
    ],
    prompt: 'REBUILT SPLICE',
    placeholder: 'ASSEMBLE THE SEGMENTS BELOW',
    hash: '153jxnnp19w',
    frag: 'PjEzOyggLyk=',
  },
  {
    n: 7,
    channel: 12,
    title: 'THE GRILLE',
    subtitle: 'FINAL PLATE — LATTICE AND MASK',
    brief: [
      'The last plate is a lattice of thirty-six letters and a punched brass mask, pinned at its centre.',
      'Vance liked masks. He liked them a great deal more when they turned.',
      'Read what shows through. All of it.',
    ],
    prompt: 'LAST WORD OF THE MESSAGE',
    placeholder: 'WORD',
    hash: '2bqkjzm8j3o',
    frag: 'LyAzKisn',
  },
  {
    n: 8,
    channel: null,
    title: 'THE MERIDIAN LOCK',
    subtitle: 'THE EIGHTH DOOR',
    brief: [
      'The eighth door has no channel and no lock plate. There is a slot, the machine, and a note in Vance’s hand, unsealed, addressed to whoever reached it first.',
    ],
    prompt: 'CLOSING AUTHORITY',
    placeholder: 'PHRASE',
    hash: '23ckhfds3i1',
    frag: 'Lik9OiE9KSsgICAgICAgIA==',
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
  'Exactly two segments lie between the two segments whose frame letter is a vowel.',
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
export const META_CIPHER = 'NLBLIKUPMRKMUVLN'
export const META_NOTE = [
  'You will want to open this door with the seven words you are carrying. You cannot. The words were never the key. They were the road.',
  'Every door I built announced its depth before you walked into it. You read the number. You did not hear it.',
  'Take the depth. Walk it into the word. The word is a ring — when you reach the end of it, keep walking.',
  'Seven steps. Seven letters. In the order the doors opened.',
  'That is my name for the eighth door. It is a key, not an answer. The machine will know what to do with it.',
  '— H.V.',
]

export const INTRO = [
  'Halden Vance spent eleven years building the Meridian Array’s private archive: every transmission the Array ever swallowed, indexed by a man who did not trust anyone else to read it.',
  'Nine days ago he walked out of Meridian Station at 11:21 and did not come back. Six hours later the archive began to seal itself behind eight doors of his own design.',
  'It begins erasing itself in forty-five minutes.',
  'Two recovery cells are active tonight: STATION SEATTLE and STATION SJC. Same locks. Same fragments. Same clock. You will not hear each other until it is over.',
  'Every door yields a fragment word. Vance never wrote anything down twice — keep everything you find.',
]

