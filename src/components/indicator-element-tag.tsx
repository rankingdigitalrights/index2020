import c from "clsx";
import React from "react";

import {ElementValue, NA} from "../types";

interface IndicatorElementTagProps {
  score: number | NA;
  value: ElementValue;
  activeTag: "score" | "value";
}

const IndicatorElementTag = ({
  score,
  value,
  activeTag,
}: IndicatorElementTagProps) => {
  const className = c(
    "flex flex-col items-center justify-center w-24 h-16",
    "p-2 font-circular text-white font-black text-xs text-center",
    {
      "bg-prissian": value === "Yes",
      "bg-accent-gold": value === "Partial",
      "bg-accent-red": ["No", "No Disclosure Found"].includes(value),
      "bg-disabled-dark": value === "NA",
    },
  );

  const text: string =
    value === "No Disclosure Found" ? "No Disclosure" : value;

  return (
    <span className={className}>
      <span>{activeTag === "value" ? text : score}</span>
    </span>
  );
};

export default IndicatorElementTag;
