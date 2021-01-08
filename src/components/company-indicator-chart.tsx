import c from "clsx";
import React, {useState} from "react";

import ChevronDown from "../../static/chevron-down.svg";
import ChevronUp from "../../static/chevron-up.svg";
import {IndicatorNested} from "../types";
import {mapScore} from "../utils";
import PercentageBar from "./percentage-bar";

interface CompanyIndicatorChartProps {
  indicators: IndicatorNested[];
  onClick: (id: string) => void;
  width?: number;
}

type CollapseableIndicator = Map<string, boolean>;

const CompanyIndicatorChart = ({
  indicators,
  onClick,
  width = 250,
}: CompanyIndicatorChartProps) => {
  const [collapsedIndicators, setCollapsedIndicators] = useState<
    CollapseableIndicator
  >(
    indicators.reduce(
      (memo, {indicator, familyMembers}) =>
        familyMembers.length > 0 ? memo.set(indicator, false) : memo,
      new Map(),
    ),
  );

  const handleCollapse = (indicator: string) => {
    setCollapsedIndicators(
      new Map(
        collapsedIndicators.set(indicator, !collapsedIndicators.get(indicator)),
      ),
    );
  };

  return (
    <div>
      {indicators.map(
        ({indicator, display, label, category, score, familyMembers}, idx) => {
          const hasCollapse = collapsedIndicators.has(indicator);
          const isOpen =
            (hasCollapse && collapsedIndicators.get(indicator)) || false;
          const indicatorPretty = `${display}. ${label}`;

          const className = {
            "text-cat-governance": category === "governance",
            "text-cat-freedom": category === "freedom",
            "text-cat-privacy": category === "privacy",
            "text-cat-negative": category === undefined,
          };

          const classNameBarRow =
            "flex items-center justify-between font-circular m-0.5 text-xs";

          return (
            <div
              key={`company-indicator-chart-${indicator}`}
              className={c("flex flex-col", {"mt-2": idx > 0})}
            >
              <button
                className="flex justify-between items-center cursor-pointer"
                onClick={
                  hasCollapse
                    ? () => handleCollapse(indicator)
                    : () => onClick(display)
                }
              >
                <span className="text-left text-xs font-circular w-11/12">
                  {indicatorPretty}
                </span>

                {hasCollapse && isOpen && <ChevronUp className="ml-2" />}
                {hasCollapse && !isOpen && <ChevronDown className="ml-2" />}
              </button>

              <div className={classNameBarRow}>
                <div className="w-11/12">
                  <svg
                    version="1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height={10}
                    transform="translate(0, 0)"
                  >
                    <PercentageBar
                      value={mapScore(score)}
                      width={width - 40}
                      height={9}
                      className={className}
                    />
                  </svg>
                </div>

                <div className="ml-2">
                  <span>
                    {score}
                    {score === "NA" ? "" : "%"}
                  </span>
                </div>
              </div>

              {isOpen &&
                familyMembers.map((m) => {
                  const mIndicatorPretty = `${m.display}. ${m.label}`;

                  return (
                    <div
                      key={`company-indicator-chart-${m.indicator}`}
                      className="pl-2 flex flex-col mt-2"
                    >
                      <button
                        className="flex justify-between cursor-pointer"
                        onClick={() => onClick(m.display)}
                      >
                        <span className="text-left text-xs font-circular w-11/12">
                          {mIndicatorPretty}
                        </span>
                      </button>

                      <div className={classNameBarRow}>
                        <div className="w-11/12">
                          <svg
                            version="1"
                            xmlns="http://www.w3.org/2000/svg"
                            width={width - 50}
                            height={10}
                            transform="translate(0, 0)"
                          >
                            <PercentageBar
                              value={mapScore(m.score)}
                              width={width - 50}
                              height={9}
                              className={className}
                            />
                          </svg>
                        </div>

                        <div className="ml-2">
                          <span>
                            {m.score}
                            {score === "NA" ? "" : "%"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        },
      )}
    </div>
  );
};

export default CompanyIndicatorChart;
