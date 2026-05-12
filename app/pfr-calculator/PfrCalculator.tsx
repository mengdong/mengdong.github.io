"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HandMatrix from "./HandMatrix";
import {
  POSITIONS,
  PREFLOP_ORDER,
  TOTAL_COMBOS,
  combosInRange,
  computeCombinedPfr,
  respondersAfterOpener,
  type Position,
  type PreflopSeat,
  type ThreeBetRanges,
} from "./poker";

function emptyRange(): Set<string> {
  return new Set();
}

function initialRanges(): Record<Position, Set<string>> {
  return {
    UTG: emptyRange(),
    "UTG+1": emptyRange(),
    MP: emptyRange(),
    LJ: emptyRange(),
    HJ: emptyRange(),
    CO: emptyRange(),
    BTN: emptyRange(),
    SB: emptyRange(),
  };
}

function initialEdited(): Record<Position, boolean> {
  return {
    UTG: false,
    "UTG+1": false,
    MP: false,
    LJ: false,
    HJ: false,
    CO: false,
    BTN: false,
    SB: false,
  };
}

function initialThreeBet(): Record<Position, Record<PreflopSeat, Set<string>>> {
  const t = {} as Record<Position, Record<PreflopSeat, Set<string>>>;
  for (const opener of POSITIONS) {
    const row: Partial<Record<PreflopSeat, Set<string>>> = {};
    for (const r of respondersAfterOpener(opener)) {
      row[r] = new Set();
    }
    t[opener] = row as Record<PreflopSeat, Set<string>>;
  }
  return t;
}

type PaintKind = "rfi" | "3bet";

export default function PfrCalculator() {
  const [activePosition, setActivePosition] = useState<Position>("UTG");
  const [ranges, setRanges] = useState<Record<Position, Set<string>>>(initialRanges);
  const [threeBet, setThreeBet] =
    useState<Record<Position, Record<PreflopSeat, Set<string>>>>(initialThreeBet);

  const positionEditedRef = useRef<Record<Position, boolean>>(initialEdited());

  const paintKindRef = useRef<PaintKind>("rfi");
  const threeBetPaintRef = useRef<{ opener: Position; responder: PreflopSeat } | null>(
    null,
  );
  const activeMatrixElRef = useRef<HTMLElement | null>(null);

  const paintModeRef = useRef<"add" | "remove" | null>(null);
  const strokeHandsRef = useRef<Set<string>>(new Set());
  const activePositionRef = useRef(activePosition);
  activePositionRef.current = activePosition;
  const rangesRef = useRef(ranges);
  rangesRef.current = ranges;
  const threeBetRef = useRef(threeBet);
  threeBetRef.current = threeBet;

  const rangeArray = useMemo(
    () => POSITIONS.map((p) => ranges[p]),
    [ranges],
  );

  const threeBetReadonly = useMemo(
    (): ThreeBetRanges => threeBet,
    [threeBet],
  );

  const combined = useMemo(
    () => computeCombinedPfr(rangeArray, threeBetReadonly),
    [rangeArray, threeBetReadonly],
  );

  const activeIndex = POSITIONS.indexOf(activePosition);
  const previousPosition: Position | null =
    activeIndex > 0 ? POSITIONS[activeIndex - 1] : null;

  useEffect(() => {
    const idx = POSITIONS.indexOf(activePosition);
    if (idx <= 0) return;
    const pos = activePosition;
    if (positionEditedRef.current[pos]) return;
    setRanges((prev) => {
      if (positionEditedRef.current[pos]) return prev;
      if (prev[pos].size > 0) return prev;
      const prevPos = POSITIONS[idx - 1];
      const base = prev[prevPos];
      if (base.size === 0) return prev;
      return { ...prev, [pos]: new Set(base) };
    });
  }, [activePosition]);

  const replaceRangeFromPrevious = useCallback(() => {
    if (activeIndex <= 0 || !previousPosition) return;
    const pos = activePosition;
    const prevPos = previousPosition;
    setRanges((prev) => ({
      ...prev,
      [pos]: new Set(prev[prevPos]),
    }));
    positionEditedRef.current[pos] = true;
  }, [activeIndex, activePosition, previousPosition]);

  const applyPaintToKey = useCallback((key: string, mode: "add" | "remove") => {
    if (strokeHandsRef.current.has(key)) return;
    strokeHandsRef.current.add(key);
    const kind = paintKindRef.current;
    if (kind === "rfi") {
      setRanges((prev) => {
        const pos = activePositionRef.current;
        const s = new Set(prev[pos]);
        if (mode === "add") s.add(key);
        else s.delete(key);
        return { ...prev, [pos]: s };
      });
      return;
    }
    const t = threeBetPaintRef.current;
    if (!t) return;
    setThreeBet((prev) => {
      const { opener, responder } = t;
      const s = new Set(prev[opener][responder]);
      if (mode === "add") s.add(key);
      else s.delete(key);
      return {
        ...prev,
        [opener]: { ...prev[opener], [responder]: s },
      };
    });
  }, []);

  const paintFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      const mode = paintModeRef.current;
      if (!mode || !activeMatrixElRef.current) return;
      const el = document.elementFromPoint(clientX, clientY);
      if (!el || !activeMatrixElRef.current.contains(el)) return;
      const target = el.closest("[data-hand-key]");
      if (!target || !activeMatrixElRef.current.contains(target)) return;
      const key = target.getAttribute("data-hand-key");
      if (!key) return;
      applyPaintToKey(key, mode);
    },
    [applyPaintToKey],
  );

  const endPaintStroke = useCallback(() => {
    paintModeRef.current = null;
    strokeHandsRef.current.clear();
    activeMatrixElRef.current = null;
    threeBetPaintRef.current = null;
  }, []);

  useEffect(() => {
    const onWindowPointerMove = (e: PointerEvent) => {
      if (paintModeRef.current === null) return;
      if ((e.buttons & 1) === 0) return;
      paintFromPoint(e.clientX, e.clientY);
    };
    const onWindowPointerUp = () => {
      endPaintStroke();
    };
    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);
    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    };
  }, [endPaintStroke, paintFromPoint]);

  const onRfiCellPointerDown = (e: React.PointerEvent, key: string) => {
    if (e.button !== 0) return;
    positionEditedRef.current[activePositionRef.current] = true;
    paintKindRef.current = "rfi";
    threeBetPaintRef.current = null;
    activeMatrixElRef.current = (e.currentTarget as HTMLElement).closest(
      "[data-matrix-scope]",
    );
    strokeHandsRef.current.clear();
    const pos = activePositionRef.current;
    const currentlySelected = rangesRef.current[pos].has(key);
    const mode: "add" | "remove" = currentlySelected ? "remove" : "add";
    paintModeRef.current = mode;
    applyPaintToKey(key, mode);
  };

  const onRfiCellPointerEnter = (e: React.PointerEvent, key: string) => {
    if (paintKindRef.current !== "rfi") return;
    const mode = paintModeRef.current;
    if (mode === null) return;
    if ((e.buttons & 1) === 0) return;
    applyPaintToKey(key, mode);
  };

  const onThreeBetCellPointerDown = (
    e: React.PointerEvent,
    opener: Position,
    responder: PreflopSeat,
    key: string,
  ) => {
    if (e.button !== 0) return;
    paintKindRef.current = "3bet";
    threeBetPaintRef.current = { opener, responder };
    activeMatrixElRef.current = (e.currentTarget as HTMLElement).closest(
      "[data-matrix-scope]",
    );
    strokeHandsRef.current.clear();
    const currentlySelected = threeBetRef.current[opener][responder].has(key);
    const mode: "add" | "remove" = currentlySelected ? "remove" : "add";
    paintModeRef.current = mode;
    applyPaintToKey(key, mode);
  };

  const onThreeBetCellPointerEnter = (e: React.PointerEvent, key: string) => {
    if (paintKindRef.current !== "3bet") return;
    const mode = paintModeRef.current;
    if (mode === null) return;
    if ((e.buttons & 1) === 0) return;
    applyPaintToKey(key, mode);
  };

  const activeSet = ranges[activePosition];
  const activeCombos = combosInRange(activeSet);
  const activePct = (100 * activeCombos) / TOTAL_COMBOS;

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">PFR calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Enter <strong>RFI</strong> ranges from UTG through the small blind (BB is
          skipped for first-in opens: a walk wins without a raise) and{" "}
          <strong>3-bet</strong> ranges for each opener (UTG–SB). For a given open,
          only seats that act <em>after</em> that opener are shown (e.g. vs an HJ open:
          CO, BTN, SB, BB). The model is fold-or-open before the raise, then
          fold-or-3-bet after (no flats). <strong>PFR</strong> here is the probability
          you put in a preflop raise, averaged uniformly over all nine seats (UTG…
          BB): your first-in open when the pot is unopened, plus 3-bets after someone
          else opened first (sequential fold-or-3-bet). Combo weights are{" "}
          <span className="font-mono text-xs">combos/1326</span> for both RFI and
          3-bet frequencies.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-10">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              RFI (first-in open)
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position (UTG through SB, preflop order)
              </label>
              <div className="flex flex-wrap gap-2">
                {POSITIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setActivePosition(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      activePosition === p
                        ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400/60"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Editing range for <strong>{activePosition}</strong> —{" "}
                {activeCombos} combos ({activePct.toFixed(2)}% of all hole cards).
                {previousPosition ? (
                  <>
                    {" "}
                    Base: hands from <strong>{previousPosition}</strong> until you
                    change this seat.
                  </>
                ) : (
                  <> Starting seat — no inherited range.</>
                )}{" "}
                Sweep with primary button to paint.
              </p>
              {previousPosition ? (
                <button
                  type="button"
                  onClick={replaceRangeFromPrevious}
                  className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Replace with {previousPosition}&apos;s range
                </button>
              ) : null}
            </div>

            <HandMatrix
              matrixScope="rfi"
              selected={activeSet}
              size="md"
              onCellPointerDown={onRfiCellPointerDown}
              onCellPointerEnter={onRfiCellPointerEnter}
            />
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Upper triangle: suited; lower: offsuit; diagonal: pairs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              3-bet (vs open)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              One block per possible first raiser (UTG–SB). Inside each block, pick a
              responding seat and paint that 3-bet range. Matrices are compact; sweep
              still works inside each card.
            </p>

            <div className="space-y-3">
              {POSITIONS.map((opener) => {
                const responders = respondersAfterOpener(opener);
                return (
                  <details
                    key={opener}
                    className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 open:shadow-sm"
                  >
                    <summary className="cursor-pointer list-none px-4 py-3 font-medium text-gray-900 dark:text-gray-100 flex items-center justify-between gap-2">
                      <span>Vs {opener} open</span>
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                        {responders.join(" → ")}
                      </span>
                    </summary>
                    <div className="border-t border-gray-100 dark:border-gray-800 px-3 pb-4 pt-2 space-y-4">
                      {responders.map((responder) => {
                        const scope = `3bet-${opener}-${responder}`;
                        const set = threeBet[opener][responder];
                        const pct = (100 * combosInRange(set)) / TOTAL_COMBOS;
                        return (
                          <div key={scope} className="space-y-1.5">
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {responder} 3-bet — {combosInRange(set)} combos (
                              {pct.toFixed(2)}%)
                            </div>
                            <HandMatrix
                              matrixScope={scope}
                              selected={set}
                              size="sm"
                              onCellPointerDown={(e, key) =>
                                onThreeBetCellPointerDown(e, opener, responder, key)
                              }
                              onCellPointerEnter={onThreeBetCellPointerEnter}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        </div>

        <div className="xl:w-[22rem] shrink-0 space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              PFR
            </h2>
            <p className="text-4xl font-bold tabular-nums text-violet-600 dark:text-violet-400">
              {(100 * combined.ringAveragePfrNineSeats).toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Uniform random seat UTG…BB: first-in open (UTG–SB) plus 3-bet after
              someone else opened first.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-2 font-medium">Seat</th>
                  <th className="text-right p-2 font-medium">P(raise)</th>
                </tr>
              </thead>
              <tbody>
                {PREFLOP_ORDER.map((p, i) => (
                  <tr
                    key={p}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="p-2 font-medium">{p}</td>
                    <td className="p-2 text-right tabular-nums">
                      {(100 * combined.perSeatRaiseProb[i]).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
