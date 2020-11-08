export const TICK_RATE = 2000;
export const ICONS = ["fish", "poop", "weather"];
export const RAIN_CHANCE = 0.3;
export const SCENES = ["day", "rain"];
export const DAY_LENGTH = 30;
export const NIGHT_LENGTH = 3;

export const getNextHungryTime = (clock) =>
  Math.floor(Math.random() * 3) + 4 + clock;
export const getNextPoopTime = (clock) =>
  Math.floor(Math.random() * 3) + 4 + clock;
export const getDieTime = (clock) => Math.floor(Math.random() * 3) + 6 + clock;
