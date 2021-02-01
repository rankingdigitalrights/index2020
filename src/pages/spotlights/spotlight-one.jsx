/* eslint no-param-reassign: off */
import {promises as fsP} from "fs";
import path from "path";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useInView} from "react-intersection-observer";
import scrollama from "scrollama";

import story from "../../../data/spotlights/spotlight-2.json";
import Layout from "../../components/layout-spotlights";
import ScrollySteps from "../../components/spotlight-steps";
import ScrollyFeature from "../../components/scrolly-feature";
import SpotlightChart from "../../components/spotlight-chart";
import MyImage from "../../images/spotlights/datawrapper-map-dummy.png";
import {setupSpotlight, toggleSVGclass} from "../../spotlights-two";
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
      <figcaption>{caption}</figcaption>
    </figure>
  );
};

const para2 = (
  <section className="max-w-6xl">
    <h2>Analysis 1</h2>
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
  const svg2 = await fsP
    .readFile(path.join(process.cwd(), "public/svg/q1-governance-export.svg"))
    .toString();

  return {
    props: {
      svg1,
      svg2,
    },
  };
};

const SpotlightTwo = ({svg1, svg2}) => {
  const [currentStep, setCurrentStep] = useState();
  const [ioHook2, inView2] = useInView({
    threshold: [0.5],
    triggerOnce: true,
  });

  // "unhook" / make Obj mutable
  const scrolly2El = useRef(undefined);

  // memoize
  const scroller2 = useMemo(() => scrollama(), []);

  useEffect(() => {
    // arguments passed as ...args from global Step Handler
    const localOnStepEnter2 = ({element, index, direction}) => {
      // Hook step --> state of viz
      setCurrentStep(element.dataset.step - 1);
      console.log(`Local Enter 2: ${index} - ${direction}`);
    };

    const localOnStepExit2 = ({index, direction}) => {
      console.log(`Local Exit 2: ${index} - ${direction}`);
    };

    const unmount2 = setupSpotlight(
      scrolly2El,
      scroller2,
      "#scrolly-2 .step",
      localOnStepEnter2,
      localOnStepExit2,
    );

    return () => {
      unmount2();
    };
  }, [scroller2, scrolly2El]);

  return (
    <Layout>
      <main className="container mx-auto spotlight">
        {/* // TODO */}
        {para2}

        {para2}

        <ScrollyFeature
          id="scrolly-1"
          story={story}
          svg={svg1}
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
              caption="Caption As Props 2"
              alt="TODO: Alternative description"
              id="map-asia-1"
            />
            <div>
              <p id="scene-counter">Off</p>
              <p id="index-counter">Off</p>
            </div>
          </figure>
        </ScrollyFeature>

        <ScrollyFeature id="scrolly-xxx" story={story} svg={svg1}>
          <figure className="scrolly-figure bg-gray-200">
            <FigureSvg
              className="scrolly-figure bg-gray-200"
              svg={svg2}
              caption="Caption As Props 2"
              alt="TODO: Alternative description"
              id="map-asia-1"
            />
            <div>
              <p id="scene-counter">Off</p>
              <p id="index-counter">Off</p>
            </div>
          </figure>
        </ScrollyFeature>

        <p>xxxx</p>

        <section id="scrolly-2" ref={scrolly2El} className="scrolly">
          <h2>{`Scrolly 2 ${inView2}`}</h2>

          <div
            ref={ioHook2}
            id="scrolly-canvas"
            className={`scrolly-canvas ${inView2 ? "fade-in" : "fade-out"}`}
          >
            <p>Boom!</p>

            <figure className="scrolly-figure bg-gray-200">
              <FigureSvg
                className="scrolly-figure bg-gray-200"
                svg={svg2}
                caption="Caption As Props 2"
                alt="TODO: Alternative description"
                id="map-asia-1"
              />
              {InnerCounter}
            </figure>
            <div className="scrolly-chart">
              <SpotlightChart data={chartData} highlightedBar={currentStep} />
            </div>
          </div>

          <ScrollySteps story={story} />
        </section>

        <section id="analysis-3" className="max-w-6xl">
          <h2>Analysis 3</h2>

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
          <h2>Outro</h2>

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

export default SpotlightTwo;
