import c from "clsx";
import {promises as fsP} from "fs";
import {useRouter} from "next/router";
import path from "path";
import React, {useEffect, useState} from "react";

import HomeCategorySelector from "../components/home-category-selector";
import Layout from "../components/layout";
import NarrativeContainer from "../components/narrative-container";
import NarrativeTitle from "../components/narrative-title";
import RankChart from "../components/rank-chart";
import Selector from "../components/selector";
import ServiceRankChart from "../components/service-rank-chart";
import ToggleSwitch from "../components/toggle-switch";
import {
  allServices,
  companyRankingData,
  companyServiceRankingData,
} from "../data";
import {
  CompanyKind,
  CompanyRank,
  IndicatorCategoryExt,
  ServiceCompanyRank,
  ServiceKind,
  ServiceOption,
} from "../types";
import {uniqueBy} from "../utils";

type ServiceCompanyRanks = {
  [service in ServiceKind]: {
    [category in IndicatorCategoryExt]: {
      [kind in CompanyKind]: ServiceCompanyRank[];
    };
  };
};

type CompanyRanks = {
  [category in IndicatorCategoryExt]: {
    [kind in CompanyKind]: CompanyRank[];
  };
};

interface ExploreProps {
  serviceOptions: ServiceOption[];
  serviceRankings: ServiceCompanyRanks;
  companyRankings: CompanyRanks;
}

export const getStaticProps = async () => {
  const services = (await allServices()).filter(
    ({kind}) => kind !== "Group" && kind !== "OpCom",
  );
  const serviceOptions = uniqueBy("kind", services).map(({kind, label}) => ({
    kind,
    label,
    value: kind,
  }));

  const companyRankings = await ([
    "telecom",
    "internet",
  ] as CompanyKind[]).reduce(async (memo, kind) => {
    return ([
      "total",
      "governance",
      "freedom",
      "privacy",
    ] as IndicatorCategoryExt[]).reduce(async (agg, category) => {
      const data = await agg;
      const rankings = await companyRankingData(kind, category);

      if (!data[category]) {
        data[category] = {} as {
          [kind in CompanyKind]: CompanyRank[];
        };
      }

      data[category][kind] = rankings;
      return data;
    }, memo);
  }, Promise.resolve({} as CompanyRanks));

  const serviceRankings = await serviceOptions.reduce(
    async (memo, {kind: service}) => {
      const files = await fsP.readdir(
        path.join(process.cwd(), "data/rankings", service),
      );
      return files.reduce(async (agg, file) => {
        const data = await agg;

        const match = file.match(
          /^(internet|telecom)-(total|governance|privacy|freedom).json$/,
        );
        if (!match) return data;

        // I read somewhere Typescript will receive RegEx Types in the future.
        // Until then I coerce the strings to the right type and just assume that
        // it's alright.
        const kind = match[1] as CompanyKind;
        const category = match[2] as IndicatorCategoryExt;

        const rankings = await companyServiceRankingData(
          service,
          kind,
          category,
        );

        if (!data[service]) {
          data[service] = {} as {
            [category in IndicatorCategoryExt]: {
              [kind in CompanyKind]: ServiceCompanyRank[];
            };
          };
        }
        if (!data[service][category]) {
          data[service][category] = {} as {
            [kind in CompanyKind]: ServiceCompanyRank[];
          };
        }
        data[service][category][kind] = rankings;

        return data;
      }, memo);
    },
    Promise.resolve({} as ServiceCompanyRanks),
  );

  return {
    props: {
      serviceOptions,
      serviceRankings,
      companyRankings,
    },
  };
};

const serviceQueryParam = (url: string): ServiceKind | undefined => {
  const re = /[&?]s=(.*)(&|$)/;
  const match = url.match(re);

  if (!match) return undefined;
  return match[1] as ServiceKind;
};

const Explore = ({
  serviceOptions,
  serviceRankings,
  companyRankings,
}: ExploreProps) => {
  const router = useRouter();
  // The router query object isn't yet available on first render. We extract the
  // service query parameter ourselves from the router path to have a preselected
  // service on firts render.
  // See: https://nextjs.org/docs/routing/dynamic-routes#caveats
  const queryService = serviceQueryParam(router.asPath);

  // We are only interested in the preselected query object on first render.
  // After that we don't use routing anymore to preselect services. This is a
  // simple flag that is used below to preselect a service.
  const [firstRender, setFirstRender] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<
    IndicatorCategoryExt
  >("total");
  const [selectedService, setSelectedService] = useState<
    ServiceOption | undefined
  >();
  const [telecomRankings, setTelecomRankings] = useState<
    CompanyRank[] | ServiceCompanyRank[] | undefined
  >();
  const [platformRankings, setPlatformRankings] = useState<
    CompanyRank[] | ServiceCompanyRank[] | undefined
  >();
  const [byRegion, setByRegion] = useState(false);

  useEffect(() => {
    // Ensure that we run this hook only once.
    if (!firstRender) return;

    // If we detected a queryService we preselect the rankings for that service.
    // Otherwise we populate the rankings for all services.
    if (queryService) {
      setTelecomRankings(
        serviceRankings[queryService]?.[selectedCategory]?.telecom,
      );
      setPlatformRankings(
        serviceRankings[queryService]?.[selectedCategory]?.internet,
      );
      setSelectedService(
        serviceOptions.find(({kind}) => kind === queryService),
      );
      // We reset the URL to remove the preselected service once we switch services.
      router.push("/explore-services", undefined, {shallow: true});
    } else {
      setTelecomRankings(companyRankings[selectedCategory]?.telecom);
      setPlatformRankings(companyRankings[selectedCategory]?.internet);
    }

    setFirstRender(false);
  }, [
    router,
    firstRender,
    queryService,
    serviceOptions,
    selectedCategory,
    serviceRankings,
    companyRankings,
  ]);

  const updateRankings = (
    category: IndicatorCategoryExt,
    service?: ServiceKind,
  ): void => {
    if (service) {
      setTelecomRankings(serviceRankings[service]?.[category]?.telecom);
      setPlatformRankings(serviceRankings[service]?.[category]?.internet);
    } else {
      setTelecomRankings(companyRankings[category]?.telecom);
      setPlatformRankings(companyRankings[category]?.internet);
    }
  };

  const handleSelectCategory = (category: IndicatorCategoryExt): void => {
    setSelectedCategory(category);
    updateRankings(category, selectedService?.kind);
  };

  const handleServiceSelect = (service?: ServiceOption) => {
    setSelectedService(service);
    updateRankings(selectedCategory, service?.kind);
  };

  const handleRegionSwitch = (toggle: boolean) => {
    setByRegion(toggle);
  };

  const chartClassName = {
    "sm:justify-center": telecomRankings && platformRankings,
    "sm:justify-around": !telecomRankings || !platformRankings,
  };

  return (
    <Layout>
      <NarrativeContainer transparent>
        {({Container}) => {
          return (
            <div>
              <Container>
                <NarrativeTitle title="Explore the data" />

                <p className="font-circular mt-6">
                  The 2019 Ranking Digital Rights Corporate Accountability Index
                  evaluated 24 internet, mobile, and telecommunications
                  companies on their disclosed commitments and policies
                  affecting freedom of expression and privacy. RDR Index scores
                  are based on company disclosure of policies evaluated
                  according to 35 indicators in three categories.
                </p>

                <div className="flex flex-col mt-12">
                  <HomeCategorySelector
                    selected={selectedCategory}
                    onClick={handleSelectCategory}
                  />

                  <div className="flex flex-col w-full my-6 sm:flex-row">
                    <Selector<ServiceOption>
                      id="service-selector"
                      title="Select service"
                      options={serviceOptions}
                      defaultValue={serviceOptions.find(
                        ({kind}) => kind === queryService,
                      )}
                      isClearable
                      onSelect={handleServiceSelect}
                      className="flex-grow w-full md:w-2/3 lg:w-3/5"
                    />

                    <ToggleSwitch
                      className="flex-none w-full sm:w-max my-3 ml-3 md:mb-1"
                      label="By Regions"
                      onChange={handleRegionSwitch}
                    />
                  </div>
                </div>
              </Container>

              <div className="relative mx-auto md:w-10/12 lg:w-8/12 xl:w-8/12 2xl:w-7/12">
                <div
                  style={{minHeight: "22rem"}}
                  className={c(
                    "flex flex-col mx-auto mt-12 overflow-x-scroll sm:flex-row lg:overflow-x-visible px-3",

                    chartClassName,
                  )}
                >
                  {platformRankings &&
                    (selectedService ? (
                      <ServiceRankChart
                        className="w-full sm:pr-3"
                        ranking={platformRankings as ServiceCompanyRank[]}
                        serviceKind={selectedService.kind}
                        category={selectedCategory}
                        byRegion={byRegion}
                        hasHeader
                      />
                    ) : (
                      <RankChart
                        className="w-full sm:w-1/2 sm:pr-3"
                        ranking={platformRankings}
                        category={selectedCategory}
                        byRegion={byRegion}
                        hasHeader
                      />
                    ))}

                  {telecomRankings &&
                    (selectedService ? (
                      <ServiceRankChart
                        className="w-full mt-6 sm:pl-3 sm:mt-0"
                        ranking={telecomRankings as ServiceCompanyRank[]}
                        serviceKind={selectedService.kind}
                        category={selectedCategory}
                        byRegion={byRegion}
                        hasHeader
                      />
                    ) : (
                      <RankChart
                        className="w-full mt-6 sm:w-1/2 sm:pl-3 sm:mt-0"
                        ranking={telecomRankings}
                        category={selectedCategory}
                        byRegion={byRegion}
                        hasHeader
                      />
                    ))}
                </div>
              </div>
            </div>
          );
        }}
      </NarrativeContainer>
    </Layout>
  );
};

export default Explore;
