/* eslint no-param-reassign: off */
import {promises as fsP} from "fs";
import path from "path";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useInView} from "react-intersection-observer";
import scrollama from "scrollama";

import story1 from "../../../data/spotlights/spotlight-1.json";
import story2 from "../../../data/spotlights/spotlight-2.json";
import Layout from "../../components/layout-spotlights";
import ScrollyFeature from "../../components/scrolly-feature";
import SpotlightChart from "../../components/spotlight-chart";
import MyImage from "../../images/spotlights/datawrapper-map-dummy.png";
import {setupSpotlight, toggleSVGclass} from "../../spotlights-one";
import FigureSvg from "../../components/figure-svg";

// TODO: refactor into spotlight-components

const toggleFade = (inView) => {
  return inView ? "fade-in" : "fade-out";
};

// const updateSVGattr = ({objId, query, attr, value}) => {
//   const Obj = document.querySelector(`#${objId}`).contentDocument;
//   [...Obj.querySelectorAll(query)].map((item) =>
//     item.setAttribute(attr, value),
//   );
// };

// const toggleSVGclass = ({objId, query, toggleClassName}) => {
//   const Obj = document.querySelector(`#${objId}`).contentDocument;
//   [...Obj.querySelectorAll(query)].map((item) =>
//     item.classList.toggle(toggleClassName),
//   );
// };

const FigureImg = ({img, id, alt, caption}) => {
  const [ioHook, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  return (
    <figure
      id={id}
      ref={ioHook}
      className={`spot-figure ${toggleFade(inView)}`}
    >
      <img src={img} alt={alt} />
      {/* <MyImage /> */}
      <figcaption>[FigureImg] {caption}</figcaption>
    </figure>
  );
};

const para1 = (
  <section className="max-w-6xl">
    <h2 className="sticky-h">Intro</h2>
    <p>
      The COVID-19 pandemic has brought about a multitude of crises that stretch
      far beyond the realm of public health. In conflict areas like{" "}
      <a href="https://www.hrw.org/news/2020/10/14/war-and-covid-19-yemen">
        Yemen
      </a>
      , the disease compounded already dire circumstances for civilians seeking
      protection from ongoing violence. For students around the world, it laid
      bare the meaning of the{" "}
      <a href="https://www.weforum.org/agenda/2020/04/coronavirus-education-global-covid19-online-digital-learning/">
        digital divide
      </a>
      : those with reliable internet access have been able to keep up with
      schooling, and those without have fallen behind. In the tech sector, while
      profits have soared, the spread of algorithmically-driven{" "}
      <a href="https://secure.avaaz.org/campaign/en/facebook_threat_health/">
        disinformation about the virus
      </a>{" "}
      has brought fatal consequences to people around the world.
    </p>
    <p>
      The companies we rank were caught off guard by COVID-19, yet they all have
      weathered crises before. Telcos have raced to repair infrastructure in the
      wake of natural disasters. Digital platforms have grappled with government
      censorship orders in the face of political upheaval.
    </p>
    <blockquote>
      The way a company responds to a crisis does not just affect its bottom
      line. It can have profound implications for the fundamental rights of
      millions, if not billions, of people, whether or not they are
      &ldquo;users&rdquo; of a product or service that the company provides.
    </blockquote>
    <p>
      The year 2020 could not have given us a better set of case studies in just
      how dangerous it is for these companies to be so unprepared for crisis.
      Our perpetual state of emergency has exposed the holes in corporate
      policies and practices that can amplify conspiracies, deprive silenced
      voices of remedy, and further exclude the marginalized. And yet tech
      juggernauts are expanding their monopolies as custodians of user data and
      gatekeepers of access to content with no more accountability than before.
    </p>
    <p>
      In moments of crisis, companies can enable human rights violations, or
      they can try to mitigate them by following cornerstone business and human
      rights practices, like providing remedy to the affected and finding real
      ways to prevent further abuse.
    </p>
    <p>
      How can companies shape their policies and practices so that they are
      prepared&mdash;rather than blindsided&mdash;when the next crisis strikes?
      We looked at a few key examples from the past year to help answer this
      question.
    </p>
  </section>
);

const para2 = (
  <section className="max-w-6xl">
    <h2 className="sticky-h">
      No network,
      <br />
      no peace
    </h2>
    <p>
      From{" "}
      <a href="https://globalvoices.org/2020/09/29/azerbaijani-authorities-disrupt-internet-nationwide-amid-nagorno-karabakh-clashes/">
        Azerbaijan
      </a>{" "}
      to{" "}
      <a href="https://www.hrw.org/news/2020/06/19/myanmar-end-worlds-longest-internet-shutdown">
        Myanmar
      </a>{" "}
      to{" "}
      <a href="https://netblocks.org/reports/zimbabwe-internet-disruption-limits-coverage-of-protests-7yNV70yq">
        Zimbabwe
      </a>{" "}
      , network shutdowns have become a knee-jerk government response to
      conflict and political upheaval. In 2019 alone, governments around the
      world{" "}
      <a href="https://www.accessnow.org/cms/assets/uploads/2020/02/KeepItOn-2019-report-1.pdf">
        ordered
      </a>{" "}
      approximately 213 network shutdowns, many of them designed to be
      indefinite.
    </p>
    <p>
      In a network shutdown, the mass violation of freedom of expression is
      typically only the first in a cascade of human rights harms that follow.
      People are rendered unable to communicate with loved ones, obtain vital{" "}
      <a href="https://globalvoices.org/2018/09/07/south-asian-governments-keep-ordering-mobile-shutdowns-and-leaving-users-in-the-dark/">
        news and health information
      </a>{" "}
      , or call for help in emergencies, putting their right to life in danger.
      Shutdowns can also{" "}
      <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3330413">
        foment violence
      </a>{" "}
      , hide evidence of{" "}
      <a href="https://iran-shutdown.amnesty.org/">killings</a> , or even send
      the disconnected{" "}
      <a href="https://www.premiumtimesng.com/news/145640-borno-residents-want-phone-network-restored-boko-haram-gets-deadlier.html">
        directly into the line of fire
      </a>{" "}
      .
    </p>
    ​
    [IMAGE]https://drive.google.com/file/d/1CLt-Q123N8xjTwhEICAnv2Fa0I2qE2Dn/view?usp=sharing
    ​
    <p>
      The 12 telecommunications companies in the RDR Index operate in 125
      countries. In 2020,{" "}
      <a href="https://www.top10vpn.com/cost-of-internet-shutdowns">seven</a> of
      these companies were known to have executed government-ordered network
      shutdowns, either directly or through their subsidiaries. Two cases stand
      out: Telenor, a dominant provider in Myanmar, cut off internet access for
      more than a{" "}
      <a href="https://www.hrw.org/news/2020/06/19/myanmar-end-worlds-longest-internet-shutdown">
        million people
      </a>{" "}
      in Myanmar&rsquo;s Rakhine and Chin states, and kept it off at the
      government&rsquo;s behest. In India,{" "}
      <a href="https://news.un.org/en/story/2019/08/1044741">
        millions of residents of Kashmir
      </a>{" "}
      have lived under digital siege since mid-2019, thanks in part to a
      shutdown executed by Bharti Airtel and its peers at the order of the Modi
      government.
    </p>
    <p>
      Marginalized people in both conflict zones have suffered doubly from
      COVID-19 and communication disruptions. But the companies carried these
      orders out in starkly different ways that had measurable impacts for
      customers.
    </p>
    <p>
      In Myanmar, while Telenor complied with government orders, the company
      publicly{" "}
      <a href="https://www.telenor.com/network-restrictions-in-myanmar-1-august-2020/">
        opposed the blackout
      </a>{" "}
      and published{" "}
      <a href="https://www.telenor.com/internet-services-restricted-in-five-townships-in-myanmar-03-february-2020/">
        detailed information
      </a>{" "}
      about the shutdown, identifying the order&rsquo;s legal basis and
      responsible authorities. As the government repeatedly extended the
      blackout, the company continued to release updates. Telenor also injected
      more transparency on shutdowns into its{" "}
      <a href="https://www.telenor.com/wp-content/uploads/2020/08/Telenor-Disclosure-report-2019_08.pdf">
        annual report
      </a>{" "}
      on authority requests and mitigated the risk to lives and livelihoods by
      reducing international call rates, enabling people to more easily make
      calls in the absence of VoIP apps like WhatsApp.
    </p>
    [IMAGE]https://twitter.com/lwin051965/status/1274727052785008642/photo/2
    <p>
      The 12 telecommunications companies in the RDR Index operate in 125
      countries. In 2020,{" "}
      <a href="https://www.top10vpn.com/cost-of-internet-shutdowns">seven</a> of
      these companies were known to have executed government-ordered network
      shutdowns, either directly or through their subsidiaries. Two cases stand
      out: Telenor, a dominant provider in Myanmar, cut off internet access for
      more than a{" "}
      <a href="https://www.hrw.org/news/2020/06/19/myanmar-end-worlds-longest-internet-shutdown">
        million people
      </a>{" "}
      in Myanmar&rsquo;s Rakhine and Chin states, and kept it off at the
      government&rsquo;s behest. In India,{" "}
      <a href="https://news.un.org/en/story/2019/08/1044741">
        millions of residents of Kashmir
      </a>{" "}
      have lived under digital siege since mid-2019, thanks in part to a
      shutdown executed by Bharti Airtel and its peers at the order of the Modi
      government.
    </p>
    <p>
      Marginalized people in both conflict zones have suffered doubly from
      COVID-19 and communication disruptions. But the companies carried these
      orders out in starkly different ways that had measurable impacts for
      customers.
    </p>
    <p>
      In Myanmar, while Telenor complied with government orders, the company
      publicly{" "}
      <a href="https://www.telenor.com/network-restrictions-in-myanmar-1-august-2020/">
        opposed the blackout
      </a>{" "}
      and published{" "}
      <a href="https://www.telenor.com/internet-services-restricted-in-five-townships-in-myanmar-03-february-2020/">
        detailed information
      </a>{" "}
      about the shutdown, identifying the order&rsquo;s legal basis and
      responsible authorities. As the government repeatedly extended the
      blackout, the company continued to release updates. Telenor also injected
      more transparency on shutdowns into its{" "}
      <a href="https://www.telenor.com/wp-content/uploads/2020/08/Telenor-Disclosure-report-2019_08.pdf">
        annual report
      </a>{" "}
      on authority requests and mitigated the risk to lives and livelihoods by
      reducing international call rates, enabling people to more easily make
      calls in the absence of VoIP apps like WhatsApp.
    </p>
    [IMAGE]
    https://docs.google.com/presentation/d/1SsuNLn4pYUk49HxDBd_jzFjjS2fLUkLRHof5QF63uiE/edit#slide=id.gb790016b99_0_35
    <p>
      By contrast, India&rsquo;s Bharti Airtel has exercised an apparent policy
      of silence, reporting no information about the order, or data on
      shutdowns. In India, the world&rsquo;s{" "}
      <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3330413">
        most frequent purveyor
      </a>{" "}
      of this extreme form of digital repression, such corporate inertia can{" "}
      <a href="http://thebachchaoproject.org/wp-content/uploads/Of_Sieges_and_Shutdowns_The_Bachchao_Project_2018_12_22.pdf">
        trigger hopelessness
      </a>{" "}
      among those who are perpetually disconnected.
    </p>
    <p>
      Telenor&rsquo;s response shows how transparency can form a breakwater
      against network shutdowns. When they receive a shutdown order, we urge
      companies to make this information public. But they must also take a stand
      and create friction. Every excessive order should be met with pushback,
      and companies should alert users about impending blackouts instead of
      abruptly thrusting them into digital darkness.
    </p>
  </section>
);

const lorem = (
  <section className="max-w-6xl">
    <h2 className="sticky-h">Lorem Ipsum 1</h2>
    <p>
      Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast
      yardarm. Pinnace holystone mizzenmast quarter crows nest nipperkin grog
      yardarm hempen halter furl. Swab barque interloper chantey doubloon
      starboard grog black jack gangway rutters.
    </p>

    <p>
      Deadlights jack lad schooner scallywag dance the hempen jig carouser
      broadside cable strike colors. Bring a spring upon her cable holystone
      blow the man down spanker Shiver me timbers to go on account lookout
      wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm
      spyglass sheet transom heave to.
    </p>

    <p>
      Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case
      shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee
      snow crows nest rutters. Fluke jib scourge of the seven seas boatswain
      schooner gaff booty Jack Tar transom spirits.
    </p>
  </section>
);

const InnerCounter = (
  <div>
    <p id="scene-counter">Off</p>
    <p id="index-counter">Off</p>
  </div>
);

const chartData = [
  {id: "twitter", name: "Twitter", value: 37},
  {id: "ooredo", name: "Ooredo", value: 54},
  {id: "apple", name: "Apple", value: 10},
  {id: "amazon", name: "Amazon", value: 67},
];

export const getStaticProps = async () => {
  const svg1 = (
    await fsP.readFile(path.join(process.cwd(), "public/svg/asia.svg"))
  ).toString();

  const svg2 = (
    await fsP.readFile(
      path.join(process.cwd(), "public/svg/soe-fb-youtube-2.svg"),
    )
  ).toString();

  return {
    props: {
      svg1,
      svg2,
    },
  };
};

const SpotlightOne = ({svg1, svg2}) => {
  const [currentStep, setCurrentStep] = useState();
  const [ioHook2, inView2] = useInView({
    threshold: [0.5],
    triggerOnce: false,
  });

  return (
    <Layout>
      <main className="container mx-auto spotlight">
        {/* // TODO */}
        {para1}

        <ScrollyFeature
          id="scrolly-map"
          ref={ioHook2}
          story={story1}
          stepEnter={({element}) => {
            if (element.dataset.queries) {
              toggleSVGclass({
                objId: "map-asia-1",
                query: element.dataset.queries,
                toggleClassName: element.dataset.toggle,
              });
            }
          }}
          stepExit={({index, direction}) => {
            console.log(`Local Exit 1: ${index} - ${direction}`);
          }}
        >
          <figure className="scrolly-figure bg-gray-200">
            <FigureSvg
              className="scrolly-figure bg-gray-200"
              svg={svg1}
              caption="Caption As Props 1"
              alt="TODO: Alternative description"
              id="map-asia-1"
            />
            {InnerCounter}
          </figure>
        </ScrollyFeature>

        {para2}

        <ScrollyFeature
          id="scrolly-graph"
          story={story2}
          stepEnter={({index, element}) => {
            console.log(index, element.dataset);
            if (element.dataset.queries) {
              toggleSVGclass({
                objId: "chart-q1",
                query: element.dataset.queries,
                toggleClassName: element.dataset.toggle,
              });
            }
          }}
          stepExit={({index, direction}) => {
            console.log(`Local Exit 1: ${index} - ${direction}`);
          }}
        >
          <figure className="scrolly-figure bg-gray-200">
            <FigureSvg
              className="scrolly-figure bg-gray-200"
              svg={svg2}
              caption="Caption As Props 2"
              alt="TODO: Alternative description"
              id="chart-q1"
            />
            <div>
              <p id="scene-counter">Off</p>
              <p id="index-counter">Off</p>
            </div>
          </figure>
        </ScrollyFeature>

        {lorem}

        <section id="analysis-3" className="max-w-6xl">
          <h2 className="sticky-h">Analysis 3</h2>

          <p>
            Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast
            yardarm. Pinnace holystone mizzenmast quarter crows nest nipperkin
            grog yardarm hempen halter furl. Swab barque interloper chantey
            doubloon starboard grog black jack gangway rutters.
          </p>

          {/* <figure ref={ioHook} className={inView ? "fade-in" : "fade-out"}>
            <img src={MyImage} alt="Some other data stuff" />
            <figcaption>{`Caption: Example PNG Image`}</figcaption>
          </figure> */}

          <FigureImg
            img={MyImage}
            caption="Caption: Example PNG Image"
            alt="TODO - Caption: Example PNG Image"
            id="map-dw-1"
          />

          <p>
            Deadlights jack lad schooner scallywag dance the hempen jig carouser
            broadside cable strike colors. Bring a spring upon her cable
            holystone blow the man down spanker Shiver me timbers to go on
            account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul
            squiffy black spot yardarm spyglass sheet transom heave to.
          </p>

          <p>
            Trysail Sail ho Corsair red ensign hulk smartly boom jib rum
            gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup
            ballast Blimey lee snow crows nest rutters. Fluke jib scourge of the
            seven seas boatswain schooner gaff booty Jack Tar transom spirits.
          </p>
        </section>

        <section id="outro" className="max-w-6xl">
          <h2 className="sticky-h">Outro</h2>

          <p>
            Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast
            yardarm. Pinnace holystone mizzenmast quarter crows nest nipperkin
            grog yardarm hempen halter furl. Swab barque interloper chantey
            doubloon starboard grog black jack gangway rutters.
          </p>

          <p>
            Deadlights jack lad schooner scallywag dance the hempen jig carouser
            broadside cable strike colors. Bring a spring upon her cable
            holystone blow the man down spanker Shiver me timbers to go on
            account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul
            squiffy black spot yardarm spyglass sheet transom heave to.
          </p>

          <p>
            Trysail Sail ho Corsair red ensign hulk smartly boom jib rum
            gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup
            ballast Blimey lee snow crows nest rutters. Fluke jib scourge of the
            seven seas boatswain schooner gaff booty Jack Tar transom spirits.
          </p>
        </section>
      </main>
    </Layout>
  );
};

export default SpotlightOne;
