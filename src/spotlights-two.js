/* eslint no-param-reassign: off */
const updateBGColor = (figure, color = "bg-gray-200") => {
  figure.classList.remove(
    ...[
      "bg-gray-200",
      "bg-cat-governance",
      "bg-cat-freedom",
      "bg-cat-privacy",
      "bg-gray-400",
    ],
  );
  figure.classList.add(color);
};

const toggleActiveStep = (index, steps) => {
  // Make current step active and de-activate all others..
  console.log(`toggling ${index}`);
  steps.forEach((el, i) =>
    i === index
      ? el.classList.add("is-active")
      : el.classList.remove("is-active"),
  );
};

export const toggleSVGclass = ({objId, query, toggleClassName}) => {
  console.log(toggleClassName); // TODO
  const Obj = document.querySelector(`#${objId} svg`);
  [...Obj.querySelectorAll(query)].forEach((item) => {
    item.classList.toggle("fade-out");
    item.classList.toggle("fade-in");
  });
};

// FIXME: remove!!!
// window.toggleSVGclass = toggleSVGclass;

const resetScene = (figure) => {
  updateBGColor(figure);
  document.querySelector("p#scene-counter").textContent = "Off";
  document.querySelector("p#index-counter").textContent = "Off";
};

const handleStepEnter = (figure, steps, {index, direction, element}) => {
  console.log("Generic handleStepEnter");
  console.log(`Generic enter: ${index} - ${direction}`);
  toggleActiveStep(index, steps);
  figure.querySelector("p#scene-counter").textContent = "On";
  figure.querySelector("p#index-counter").textContent = index;
};

const handleStepExit = (figure, steps, {index, direction}) => {
  if (
    (index === 0 && direction === "up") ||
    (index === figure.maxStep && direction === "down")
  ) {
    setTimeout(() => resetScene(figure), 300);
  }
};

export const setupSpotlight = (
  ref,
  scroller,
  stepSelector,
  localOnStepEnter = () => {},
  localOnStepExit = () => {},
) => {
  const {current: scrolly} = ref;

  const figure = scrolly.querySelector("figure.scrolly-figure");
  // figure can be undefined and therefore we return early. Safeguard.
  if (!figure) return;

  const steps = scrolly.querySelectorAll(".step");
  figure.maxStep = steps.length - 1;

  scroller
    .setup({
      step: stepSelector,
      offset: 0.8,
      debug: true,
    })
    .onStepEnter((...args) => {
      handleStepEnter(figure, steps, ...args);
      localOnStepEnter(...args);
    })
    .onStepExit((...args) => {
      handleStepExit(figure, steps, ...args);
      localOnStepExit(...args);
    });

  return () => {
    scroller.destroy();
  };
};
