import initButtons from "./buttons";
import gameState from "./gameState";
import { handleUserAction } from "./gameState";
import { TICK_RATE } from "./constants";

async function init() {
  console.log("Starting game!");
  let timeToTick = Date.now();
  initButtons(handleUserAction);
  function nextAnimationFrame() {
    const now = Date.now();
    if (timeToTick < now) {
      gameState.tick();
      timeToTick = now + TICK_RATE;
    }
    requestAnimationFrame(nextAnimationFrame);
  }
  requestAnimationFrame(nextAnimationFrame);
}
init();
