import initButtons from "./buttons";

const gameState = {
  current: "INIT",
  handleUserAction(icon) {
    //icon: fish, poop, weather
    if (this.current === "INIT") {
      console.log(icon);
    }
  },
};
export default gameState;
