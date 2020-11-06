const TICK_RATE = 1000;
const ICONS = ["fish", "poop", "weather"];
const RAIN_CHANCE = 0.6;
const SCENES = ["day", "rain"];
const DAY_LENGTH = 20;
const NIGHT_LENGTH = 3;

const modFox = (state) =>
  (document.querySelector(".fox").className = `fox fox-${state}`);
const modScene = (state) =>
  (document.querySelector(".game").className = `game ${state}`);

const timeToGetHungry = (clock) => Math.floor(Math.random() * 4) + 5 + clock; //5-8s
const timeToPoop = (clock) => Math.floor(Math.random() * 3) + 3 + clock; //3-5s
const timeToDie = (clock) => Math.floor(Math.random() * 5) + 4 + clock; //4-8s

const gameState = {
  current: "INIT",
  clock: 0,
  wakeTime: -1,
  hungryTime: -1,
  sleepTime: -1,
  scene: 0,
  handleUserAction(icon) {
    if (this.current === "INIT") {
      this.startGame();
    }
  },
  tick() {
    this.clock++;
    console.log(`clock ${this.clock}`);
    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.hungryTime) {
      this.getHungry();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    }
    return this.clock;
  },
  startGame() {
    this.current = "HATCHING";
    console.log("Fox is hatching");
    modFox("egg");
    this.wakeTime = this.clock + 3;
    console.log("Fox wakes at ", this.wakeTime);
  },
  wake() {
    this.wakeTime = -1;
    this.current = "IDLING";
    console.log("Fox is idling");
    modFox("idling");
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.foxDirection(SCENES[this.scene]);
    this.hungryTime = timeToGetHungry(this.clock);
    console.log("Fox gets hungry at ", this.hungryTime);
    this.sleepTime = this.clock + DAY_LENGTH;
    console.log("Fox sleeps at", this.sleepTime);
  },
  getHungry() {
    this.hungryTime = -1;
    this.current = "HUNGRY";
    modFox("hungry");
  },
  sleep() {
    this.sleepTime = -1;
    this.current = "SLEEPING";
    this.wakeTime = this.clock + NIGHT_LENGTH;
    console.log("Fox is sleeping");
    console.log("Fox wakes at", this.wakeTime);
    modFox("sleep");
    modScene("night");
  },
  foxDirection(scene) {
    if (this.current === "IDLING") {
      if (scene === "rain") {
        modFox("rain");
      } else if (scene === "day") {
        modFox("idling");
      }
    }
  },
};
const handleUserAction = gameState.handleUserAction.bind(gameState);

const toggleHighlighted = (iconIndex, isShown) => {
  return document
    .querySelector(`.${ICONS[iconIndex]}-icon`)
    .classList.toggle("highlighted", isShown);
};

//write a function to loop over buttons
function initButtons(handleUserAction) {
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
