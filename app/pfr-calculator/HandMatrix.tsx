import { memo } from "react";
import { RANKS, handKey } from "./poker";

type Props = {
  /** Unique id for paint hit-testing (must match parent scope). */
  matrixScope: string;
  selected: ReadonlySet<string>;
  /** sm = 3-bet panels; md = main RFI matrix */
  size?: "sm" | "md";
  onCellPointerDown: (e: React.PointerEvent, key: string) => void;
  onCellPointerEnter: (e: React.PointerEvent, key: string) => void;
};

const HandMatrix = memo(function HandMatrix({
  matrixScope,
  selected,
  size = "md",
  onCellPointerDown,
  onCellPointerEnter,
}: Props) {
  const cell =
    size === "sm"
      ? "w-5 h-5 text-[7px] sm:w-6 sm:h-6 sm:text-[8px]"
      : "w-7 h-7 sm:w-9 sm:h-9 text-[9px] sm:text-[10px]";
  const corner = size === "sm" ? "w-4 sm:w-5" : "w-6 sm:w-8";

  return (
    <div
      data-matrix-scope={matrixScope}
      className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5 touch-none"
    >
      <table className={`border-collapse select-none ${size === "sm" ? "text-[7px] sm:text-[8px]" : "text-[10px] sm:text-xs"}`}>
        <thead>
          <tr>
            <th className={`p-0.5 ${corner}`} />
            {RANKS.map((rank) => (
              <th
                key={rank}
                className={`p-0.5 font-semibold text-gray-500 dark:text-gray-400 ${size === "sm" ? "w-5 sm:w-6" : "w-7 sm:w-9"}`}
              >
                {rank}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RANKS.map((rowRank, r) => (
            <tr key={rowRank}>
              <th className="p-0.5 font-semibold text-gray-500 dark:text-gray-400 text-right pr-0.5">
                {rowRank}
              </th>
              {RANKS.map((_, c) => {
                const key = handKey(r, c);
                const on = selected.has(key);
                return (
                  <td key={`${r}-${c}`} className="p-0.5">
                    <button
                      type="button"
                      data-hand-key={key}
                      title={key}
                      onPointerDown={(e) => onCellPointerDown(e, key)}
                      onPointerEnter={(e) => onCellPointerEnter(e, key)}
                      className={`${cell} rounded font-medium leading-tight flex items-center justify-center border transition-colors ${
                        on
                          ? "bg-emerald-500/90 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-500"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      {r === c ? (
                        rowRank
                      ) : r < c ? (
                        `${rowRank}${RANKS[c]}`
                      ) : (
                        `${RANKS[c]}${rowRank}`
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default HandMatrix;
