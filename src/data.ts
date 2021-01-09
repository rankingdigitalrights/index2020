import {promises as fsP} from "fs";
import path from "path";

import {emptyCompany} from "./formatter";
import {
  Company,
  CompanyDetails,
  CompanyIndex,
  CompanyKind,
  CompanyRank,
  Element,
  Indicator,
  IndicatorCompanyScore,
  IndicatorIndex,
  Service,
} from "./types";

const loadJson = <T extends unknown>(
  file: string,
): (() => Promise<T>) => async (): Promise<T> => {
  const data = await fsP.readFile(path.join(process.cwd(), file));
  return JSON.parse(data.toString());
};

export const loadJsonDir = <T extends unknown>(
  dir: string,
  kind: string,
): (() => Promise<T[]>) => async (): Promise<T[]> => {
  const subDirs = await fsP.readdir(path.join(process.cwd(), dir));

  return Promise.all(
    subDirs.map(async (subDir) => {
      const data = await fsP.readFile(
        path.join(process.cwd(), dir, subDir, `${kind}.json`),
      );
      return JSON.parse(data.toString());
    }),
  );
};

export const allCompanies = loadJson<Company[]>("data/companies.json");
export const allIndicators = loadJson<Indicator[]>("data/indicators.json");
export const allElements = loadJson<Element[]>("data/elements.json");

export const companyIndices = loadJsonDir<CompanyIndex>(
  "data/companies",
  "scores",
);
export const indicatorIndices = loadJsonDir<IndicatorIndex>(
  "data/indicators",
  "scores",
);
export const companyDetails = loadJsonDir<CompanyDetails>(
  "data/companies",
  "details",
);

/*
 * Load the company details.
 */
export const companyData = async (
  companyId: string,
): Promise<[CompanyIndex, CompanyDetails]> => {
  const companyDir = path.join("data/companies", companyId);

  return Promise.all([
    loadJson<CompanyIndex>(path.join(companyDir, "scores.json"))().catch(() => {
      throw new Error(
        `Couldn't extract company index and details for "${companyId}."`,
      );
    }),
    // Until all editorial content is finished we provide an empty company
    // details page.
    loadJson<CompanyDetails>(
      path.join(companyDir, "details.json"),
    )().catch(() => emptyCompany(companyId)),
  ]);
};

/*
 * Load the company services.
 */
export const companyServices = async (
  companyId: string,
): Promise<Service[]> => {
  const companyDir = path.join("data/companies", companyId);

  return loadJson<Service[]>(path.join(companyDir, "services.json"))().catch(
    () => {
      throw new Error(`Couldn't extract company services for "${companyId}."`);
    },
  );
};

/*
 * Load the indicator details.
 */
export const indicatorData = async (
  indicatorId: string,
): Promise<IndicatorIndex> => {
  const indicatorDir = path.join("data/indicators", indicatorId);

  return loadJson<IndicatorIndex>(
    path.join(indicatorDir, "scores.json"),
  )().catch(() => {
    throw new Error(`Couldn't extract indicator index for "${indicatorId}".`);
  });
};

/*
 * Load the companies for a single indicator.
 */
export const indicatorCompanies = async (
  indicatorId: string,
): Promise<Company[]> => {
  const indicatorDir = path.join(
    "data/indicators",
    indicatorId,
    "companies.json",
  );

  return loadJson<Company[]>(indicatorDir)().catch(() => {
    throw new Error(
      `Couldn't extract indicator companies for "${indicatorId}".`,
    );
  });
};

/*
 * Load the companies for a single indicator.
 */
export const indicatorScores = async (
  indicatorId: string,
): Promise<IndicatorCompanyScore[]> => {
  const indicatorDir = path.join(
    "data/indicators",
    indicatorId,
    "company-scores.json",
  );

  return loadJson<IndicatorCompanyScore[]>(indicatorDir)().catch(() => {
    throw new Error(
      `Couldn't extract indicator company score for "${indicatorId}".`,
    );
  });
};

/*
 * Load the company rankings, sorted descending by the total score.
 */
export const companyRankingData = async (
  companyKind: CompanyKind,
): Promise<CompanyRank[]> => {
  return loadJson<CompanyRank[]>(`data/ranking-${companyKind}.json`)();
};
