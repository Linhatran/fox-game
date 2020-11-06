import { ICONS } from "./constants";
import { handleUserAction } from "./gameState";

const toggleHighlighted = (iconIndex, isShown) => {
  return document
    .querySelector(`.${ICONS[iconIndex]}-icon`)
    .classList.toggle("highlighted", isShown);
};

//write a function to loop over buttons
export default function initButtons() {
  let iconIndex = 0;
  function buttonClick(e) {
    if (e.target.classList.value.includes("right-btn")) {
      toggleHighlighted(iconIndex, false);
      iconIndex = (iconIndex + 1) % ICONS.length;
      toggleHighlighted(iconIndex, true);
    } else if (e.target.classList.value.includes("left-btn")) {
      toggleHighlighted(iconIndex, false);
      iconIndex = (iconIndex + 2) % ICONS.length;
      toggleHighlighted(iconIndex, true);
    } else {
      //middle btn is clicked
      handleUserAction(ICONS[iconIndex]);
    }
  }
  document.querySelector(".buttons").addEventListener("click", buttonClick);
}
