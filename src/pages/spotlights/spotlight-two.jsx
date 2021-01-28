/* eslint no-param-reassign: off */
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useInView} from "react-intersection-observer";
import scrollama from "scrollama";

import story from "../../../data/spotlights/spotlight-2.json";
import Layout from "../../components/layout-spotlights";
import ScrollySteps from "../../components/spotlight-steps";
import MyImage from "../../images/spotlights/datawrapper-map-dummy.png";
import {setupSpotlight} from "../../spotlights-two";

// TODO: refactor into spotlight-components

const toggleFade = (inView) => {
  return inView ? "fade-in" : "fade-out";
};

const FigureSvg = ({id, alt, src, caption}) => {
  const [svg, setSvg] = useState(undefined);
  const [ioHook, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then(setSvg)
      .catch(() => undefined);
  }, []);

  return (
    <figure
      id={id}
      aria-label={alt}
      ref={ioHook}
      className={`figure-svg spot-figure ${toggleFade(inView)}`}
      dangerouslySetInnerHTML={{
        __html: [`${svg}<figcaption>${caption}</figcaption>`],
      }}
    />
  );
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
      <img src={img.type} alt={alt} type="image/svg+xml" />
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

const SpotlightTwo = () => {
  const [ioHook, inView] = useInView({
    threshold: [0.5],
    triggerOnce: true,
  });

  // "unhook" / make Obj mutable
  const scrolly1El = useRef(undefined);
  // memoize
  const scroller1 = useMemo(() => scrollama(), []);

  useEffect(() => {
    const unmount1 = setupSpotlight(scrolly1El, scroller1, "#scrolly-1 .step");

    return () => {
      unmount1();
    };
  }, [scroller1, scrolly1El]);

  return (
    <Layout>
      <main className="container mx-auto spotlight">
        {/* // TODO */}
        {para2}

        {para2}

        <section id="scrolly-1" ref={scrolly1El} className="scrolly">
          <h2>{`Scrolly 1 ${inView}`}</h2>

          <div
            ref={ioHook}
            id="scrolly-canvas"
            className={`scrolly-canvas ${inView ? "fade-in" : "fade-out"}`}
          >
            <figure className="scrolly-figure bg-gray-200">
              <FigureSvg
                className="scrolly-figure bg-gray-200"
                src="/index2020/svg/asia.svg"
                caption="Caption As Props 2"
                alt="TODO: Alternative description"
                id="map-asia-1"
              />
              {InnerCounter}
            </figure>
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
            img={<MyImage />}
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
