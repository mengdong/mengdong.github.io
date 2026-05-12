/** Ranks high → low (Texas hold'em). */
export const RANKS = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
] as const;

export type Rank = (typeof RANKS)[number];

/**
 * First-in seats through the small blind. BB is omitted: when everyone folds to the
 * big blind, the BB wins the pot without putting in a raise, so that outcome is not
 * part of first-in PFR. Preflop order among these: UTG first, SB last.
 */
export const POSITIONS = [
  "UTG",
  "UTG+1",
  "MP",
  "LJ",
  "HJ",
  "CO",
  "BTN",
  "SB",
] as const;

export type Position = (typeof POSITIONS)[number];

/** UTG through BB in preflop action order (for 3-bet facing an open). */
export type PreflopSeat = Position | "BB";

export const PREFLOP_ORDER: readonly PreflopSeat[] = [
  ...POSITIONS,
  "BB",
];

export function respondersAfterOpener(opener: Position): PreflopSeat[] {
  const i = PREFLOP_ORDER.indexOf(opener);
  return PREFLOP_ORDER.slice(i + 1);
}

export const TOTAL_COMBOS = 1326;

/** Matrix cell (row r, col c): diagonal pairs; r<c suited; r>c offsuit. */
export function handKey(r: number, c: number): string {
  if (r === c) return `${RANKS[r]}${RANKS[c]}`;
  if (r < c) return `${RANKS[r]}${RANKS[c]}s`;
  return `${RANKS[c]}${RANKS[r]}o`;
}

export function comboWeight(key: string): number {
  if (key.length === 3 && key.endsWith("s")) return 4;
  if (key.length === 3 && key.endsWith("o")) return 12;
  return 6;
}

export function combosInRange(selected: ReadonlySet<string>): number {
  let n = 0;
  for (const k of selected) n += comboWeight(k);
  return n;
}

export function openFrequency(selected: ReadonlySet<string>): number {
  return combosInRange(selected) / TOTAL_COMBOS;
}

export type PfrBreakdown = {
  /** P(no one opens before this seat) — product of (1 − f_j) for earlier seats. */
  foldThrough: number[];
  /** f_i = openFrequency for seat i */
  openFreq: number[];
  /** foldThrough[i] * openFreq[i] */
  contribution: number[];
  /** (1/n) Σ_i contribution[i] — ring-average first-in open rate, n = |POSITIONS| */
  ringAverageFirstInOpen: number;
};

/**
 * First-in open model: each seat opens with marginal probability f_i = combos_i/1326,
 * otherwise folds; no limps. Then P(you open first from seat i) = Q_i * f_i with
 * Q_i = Π_{j<i}(1 − f_j). Ring-average = (1/n) Σ_i Q_i f_i for n seats.
 */
export function computePfr(ranges: readonly ReadonlySet<string>[]): PfrBreakdown {
  const openFreq = ranges.map((s) => openFrequency(s));
  const foldThrough: number[] = [];
  const contribution: number[] = [];
  let prod = 1;
  for (let i = 0; i < ranges.length; i++) {
    foldThrough.push(prod);
    const c = prod * openFreq[i];
    contribution.push(c);
    prod *= 1 - openFreq[i];
  }
  const ringAverageFirstInOpen =
    contribution.reduce((a, b) => a + b, 0) / POSITIONS.length;
  return { foldThrough, openFreq, contribution, ringAverageFirstInOpen };
}

/** 3-bet ranges: opener (UTG–SB) → responder (seats after opener through BB) → hands */
export type ThreeBetRanges = Record<
  Position,
  Partial<Record<PreflopSeat, ReadonlySet<string>>>
>;

function threeBetT(
  threeBet: Readonly<ThreeBetRanges>,
  opener: Position,
  responder: PreflopSeat,
): number {
  const set = threeBet[opener]?.[responder];
  return set ? openFrequency(set) : 0;
}

export type CombinedPfrResult = {
  rfi: PfrBreakdown;
  /** P(raise) for each seat in PREFLOP_ORDER (RFI + 3-bet), fold/open/3bet-only toy model */
  perSeatRaiseProb: number[];
  /** (1/9) Σ_h perSeatRaiseProb[h] — uniform random seat UTG…BB */
  ringAveragePfrNineSeats: number;
};

/**
 * RFI: first raiser among UTG–SB only (BB walk excluded). 3-bet: after first open,
 * each later seat either 3-bets (with marginal combo rate) or folds; no calls.
 * P(you 3-bet | opener o) = P(first open o) × Π_{r between o and you}(1−t_{o,r}) × t_{o,you}.
 * Total P(you raise) = P(RFI from you) + Σ_o P(3-bet vs o). Ring PFR = mean over 9 seats.
 */
export function computeCombinedPfr(
  rfiRanges: readonly ReadonlySet<string>[],
  threeBet: Readonly<ThreeBetRanges>,
): CombinedPfrResult {
  const rfi = computePfr(rfiRanges);
  const { foldThrough: Q, openFreq: f } = rfi;
  const nOpen = POSITIONS.length;

  const P_firstOpen: number[] = POSITIONS.map((_, o) => Q[o] * f[o]);

  const perSeatRaiseProb = PREFLOP_ORDER.map((_, h) => {
    let p = 0;
    if (h < nOpen) {
      p += Q[h] * f[h];
    }
    for (let o = 0; o < nOpen; o++) {
      if (h <= o) continue;
      const pOcc = P_firstOpen[o];
      if (pOcc === 0) continue;
      let prod = 1;
      for (let r = o + 1; r < h; r++) {
        const resp = PREFLOP_ORDER[r];
        prod *= 1 - threeBetT(threeBet, POSITIONS[o], resp);
      }
      const hero = PREFLOP_ORDER[h];
      const tHero = threeBetT(threeBet, POSITIONS[o], hero);
      p += pOcc * prod * tHero;
    }
    return p;
  });

  const ringAveragePfrNineSeats =
    perSeatRaiseProb.reduce((a, b) => a + b, 0) / PREFLOP_ORDER.length;

  return { rfi, perSeatRaiseProb, ringAveragePfrNineSeats };
}
