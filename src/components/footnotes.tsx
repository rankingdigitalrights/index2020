import c from "clsx";
import React from "react";

interface FootnotesProps {
  source: React.ReactNode;
  className?: string;
}

const Footnotes = ({source, className}: FootnotesProps) => {
  return (
    <div className={c("border-t-2 border-prissian text-sm", className)}>
      <h2>Footnotes</h2>

      {source}
    </div>
  );
};

export default Footnotes;
