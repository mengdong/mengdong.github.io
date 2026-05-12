import type { Metadata } from "next";
import PfrCalculator from "./PfrCalculator";

export const metadata: Metadata = {
  title: "PFR Calculator",
  description:
    "Estimate preflop raise (PFR) from RFI and 3-bet ranges: UTG–SB first-in opens plus 3-bets through BB (BB walk excluded from RFI).",
};

export default function PfrCalculatorPage() {
  return <PfrCalculator />;
}
