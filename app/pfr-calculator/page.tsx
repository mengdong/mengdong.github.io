import type { Metadata } from "next";
import PfrCalculator from "./PfrCalculator";

export const metadata: Metadata = {
  title: "PFR Calculator",
  description:
    "Estimate preflop raise (PFR) and 3-bet frequencies from RFI and 3-bet ranges (UTG–SB opens, 3-bets through BB).",
};

export default function PfrCalculatorPage() {
  return <PfrCalculator />;
}
