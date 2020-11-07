import { ICONS } from "./constants";

const toggleHighlighted = (iconIndex, isShown) => {
  return document
    .querySelector(`.${ICONS[iconIndex]}-icon`)
    .classList.toggle("highlighted", isShown);
};

export default function initButtons(handleUserAction) {
  let iconIndex = 0;
  function buttonClick(e) {
    if (
      e.target.classList.value.includes("right-btn") ||
      e.key === "ArrowRight"
    ) {
      toggleHighlighted(iconIndex, false);
      iconIndex = (iconIndex + 1) % ICONS.length;
      document.querySelector(".right-btn").classList.add("btn-key-hover");
      document.querySelector(".left-btn").classList.remove("btn-key-hover");
      document.querySelector(".middle-btn").classList.remove("btn-key-hover");
      toggleHighlighted(iconIndex, true);
    } else if (
      e.target.classList.value.includes("left-btn") ||
      e.key === "ArrowLeft"
    ) {
      toggleHighlighted(iconIndex, false);
      iconIndex = (iconIndex + 2) % ICONS.length;
      document.querySelector(".left-btn").classList.add("btn-key-hover");
      document.querySelector(".right-btn").classList.remove("btn-key-hover");
      document.querySelector(".middle-btn").classList.remove("btn-key-hover");
      toggleHighlighted(iconIndex, true);
    } else if (
      e.target.classList.value.includes("middle-btn") ||
      e.key === "Enter"
    ) {
      //middle btn is clicked
      handleUserAction(ICONS[iconIndex]);
      document.querySelector(".middle-btn").classList.add("btn-key-hover");
      document.querySelector(".right-btn").classList.remove("btn-key-hover");
      document.querySelector(".left-btn").classList.remove("btn-key-hover");
    }
  }
  document.querySelector(".buttons").addEventListener("click", buttonClick);
  document.addEventListener("keyup", buttonClick);
}
