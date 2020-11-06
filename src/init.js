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
const writeModal = (text = "") => {
  document.querySelector(
    ".modal"
  ).innerHTML = `<div class="modal-inner">${text}</div>`;
};
const getNextHungryTime = (clock) => Math.floor(Math.random() * 3) + 5 + clock;
const getNextPoopTime = (clock) => Math.floor(Math.random() * 2) + 3 + clock;
const getDieTime = (clock) => Math.floor(Math.random() * 3) + 5 + clock;

const gameState = {
  current: "INIT",
  clock: 0,
  wakeTime: -1,
  hungryTime: -1,
  sleepTime: -1,
  poopTime: -1,
  dieTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  scene: 0,
  handleUserAction(icon) {
    if (
      ["FEEDING", "HATCHING", "SLEEPING", "CELEBRATING"].includes(this.current)
    ) {
      return;
    }

    if (this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    }
    switch (icon) {
      case "fish":
        this.feed();
        break;
      case "poop":
        this.cleanPoop();
        break;
      case "weather":
        this.changeWeather();
        break;
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
    } else if (this.clock === this.timeToStartCelebrating) {
      this.startCelebrating();
    } else if (this.clock === this.timeToEndCelebrating) {
      this.endCelebrating();
    } else if (this.clock === this.poopTime) {
      this.poop();
    } else if (this.clock === this.dieTime) {
      this.die();
    }
    return this.clock;
  },
  startGame() {
    this.current = "HATCHING";
    console.log("Fox is hatching");
    modFox("egg");
    modScene("day");
    writeModal();
    this.wakeTime = this.clock + 3;
    console.log("Fox wakes at ", this.wakeTime);
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.hungryTime = getNextHungryTime(this.clock);
    console.log("Fox gets hungry at", this.hungryTime);
    modFox("idling");
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.foxDirection();
    this.sleepTime = this.clock + DAY_LENGTH;
    console.log("Fox sleeps at", this.sleepTime);
  },
  getHungry() {
    this.current = "HUNGRY";
    this.hungryTime = -1;
    this.dieTime = getDieTime(this.clock);
    console.log("Fox dies because of no fish at", this.dieTime);
    modFox("hungry");
  },
  sleep() {
    this.current = "SLEEPING";
    this.clearTime();
    this.wakeTime = this.clock + NIGHT_LENGTH;
    console.log("Fox is sleeping, will wake at", this.wakeTime);
    modFox("sleep");
    modScene("night");
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    modFox("celebrate");
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
  },
  endCelebrating() {
    this.current = "IDLING";
    this.timeToEndCelebrating = -1;
    this.foxDirection();
    togglePoopBag(false); //this will make poop bag appear
  },
  feed() {
    if (this.current !== "HUNGRY") return;
    modFox("eating");
    this.current = "FEEDING";
    console.log("Feeding fox");
    this.hungryTime = -1;
    this.timeToStartCelebrating = this.clock + 2;
    console.log("Fox celebrate at", this.timeToStartCelebrating);
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    console.log("Fox poops at", this.poopTime);
  },
  poop() {
    this.current = "POOPING";
    modFox("pooping");
    console.log(this.current);
    this.poopTime = -1;
    this.dieTime = getDieTime(this.clock);
    console.log("Fox dies because of poop at", this.dieTime);
  },
  cleanPoop() {
    if (this.current === "POOPING") {
      this.dieTime = -1;
      console.log("fox die time is", this.dieTime);
      togglePoopBag(true);
      this.startCelebrating();
      this.hungryTime = getNextHungryTime(this.clock);
      console.log("cleaning poop");
    }
  },
  changeWeather() {
    this.scene = (this.scene + 1) % SCENES.length;
    modScene(SCENES[this.scene]);
    this.foxDirection();
  },
  die() {
    this.current = "DEAD";
    this.clearTime();
    modFox("dead");
    modScene("dead");
    writeModal("Fox has died :( <br/>Click the middle button to restart!");
  },
  clearTime() {
    this.wakeTime = -1;
    this.hungryTime = -1;
    this.sleepTime = -1;
    this.poopTime = -1;
    this.dieTime = -1;
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = -1;
  },
  foxDirection() {
    if (this.current === "IDLING") {
      if (SCENES[this.scene] === "rain") {
        modFox("rain");
      } else {
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
const togglePoopBag = (isShown) =>
  document.querySelector(".poop-bag").classList.toggle("hidden", !isShown);
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
