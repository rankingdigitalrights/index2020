import c from "clsx";
import React, {useRef, useMemo, useEffect} from "react";
import {useInView} from "react-intersection-observer";
import scrollama from "scrollama";

import {setupSpotlight} from "../spotlights-two";
import ScrollySteps from "./spotlight-steps";

const ScrollyFeature = ({
  id,
  story,
  children,
  stepEnter = () => {},
  stepExit = () => {},
}) => {
  const scrollyEl = useRef(undefined);
  const scroller = useMemo(() => scrollama(), []);

  const [ioHook, inView] = useInView({
    threshold: [0.5],
    triggerOnce: true,
  });

  useEffect(() => {
    const unmount = setupSpotlight(
      scrollyEl,
      scroller,
      `#${id} .step`,
      stepEnter,
      stepExit,
    );

    return () => {
      unmount();
    };
  }, [scroller, scrollyEl]);

  // equivalent to `scrolly-canvas ${inView ? "fade-in" : "fade-out"}`
  const className = c("scrolly-canvas", {
    "fade-in": inView,
    "fade-out": !inView,
    // "my-tansition": progress >= 30 && progress <= 40,
  });

  return (
    <section id={id} ref={scrollyEl} className="scrolly">
      <h2>{`Scrolly 1 ${inView}`}</h2>

      <div ref={ioHook} id={`scrolly-canvas-${id}`} className={className}>
        {children}
      </div>

      <ScrollySteps story={story} />
    </section>
  );
};

export default ScrollyFeature;
