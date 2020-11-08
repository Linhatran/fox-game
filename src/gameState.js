import { modFox, modScene, writeModal, togglePoopBag } from "./UI";
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  getDieTime,
  getNextHungryTime,
  getNextPoopTime,
} from "./constants";

const gameState = {
  current: "INIT",
  clock: -1,
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
    console.log(`clock ${this.clock} ${this.current}`);
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
    modFox("egg");
    modScene("day");
    writeModal();
    this.wakeTime = this.clock + 3;
    var h1 = document.querySelector("h1");
    h1.innerHTML = "0";
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.hungryTime = getNextHungryTime(this.clock);
    modFox("idling");
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.foxDirection();
    this.sleepTime = this.clock + DAY_LENGTH;
  },
  getHungry() {
    this.current = "HUNGRY";
    this.hungryTime = -1;
    this.dieTime = getDieTime(this.clock);
    modFox("hungry");
  },
  sleep() {
    this.current = "SLEEPING";
    this.clearTime();
    this.wakeTime = this.clock + NIGHT_LENGTH;
    modFox("sleep");
    modScene("night");
    this.increaseDay(this.days);
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
    this.current = "FEEDING";
    this.timeToStartCelebrating = this.clock + 2;
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox("eating");
  },
  poop() {
    this.current = "POOPING";
    modFox("pooping");
    this.poopTime = -1;
    this.dieTime = getDieTime(this.clock);
  },
  cleanPoop() {
    if (this.current === "POOPING") {
      this.dieTime = -1;
      togglePoopBag(true);
      this.startCelebrating();
      this.hungryTime = getNextHungryTime(this.clock);
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
    writeModal(
      "Fox has died :( <br/>Click the middle button or press 'Enter' to restart!"
    );
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
  increaseDay() {
    let h1 = document.querySelector("h1");
    let day = parseInt(h1.innerText);
    day++;
    h1.innerHTML = day;
    h1.classList.add("animated");
    h1.addEventListener("animationend", function () {
      h1.classList.remove("animated");
    });
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
