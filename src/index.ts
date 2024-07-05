import Kanvas from "kanvasgl";
import Game from "./Game";

const networkCanvas = new Kanvas("network", 300, 150);
networkCanvas.background("#012");

const gameCanvas = new Kanvas("game", innerWidth, innerHeight);
gameCanvas.background("#012");
const brainString = await fetch("brain.json").then((res) => res.text());
const game = new Game(gameCanvas, brainString);

let lastElapsedTime = 0;
loop(0);
function loop(elapsedTime: number) {
  const deltaTime = (elapsedTime - lastElapsedTime) / 15;
  lastElapsedTime = elapsedTime;
  game.update(deltaTime);

  draw();
  requestAnimationFrame(loop);
}

function draw() {
  gameCanvas.clear();
  game.render();

  networkCanvas.clear();
  game.renderNetwork(networkCanvas);
}

addEventListener("resize", () => {
  gameCanvas.resize(innerWidth, innerHeight);
  game.resize(innerWidth, innerHeight);
  game.render();
});

const startScreen = document.getElementById("start-screen");
const resumeButton = document.getElementById("resume");
const singlePlayerButton = document.getElementById("single-player");
const versusAIButton = document.getElementById("versus-ai");
const trainAIButton = document.getElementById("train-ai");

const actionContainer = document.getElementById("action-container");
const pauseButton = document.getElementById("pause");

singlePlayerButton?.addEventListener("click", () => {
  actionContainer?.classList.remove("hidden");
  startScreen?.classList.add("hidden");
  game.singlePlayer();
  game.reset();
  game.resume();
});

versusAIButton?.addEventListener("click", () => {
  actionContainer?.classList.remove("hidden");
  startScreen?.classList.add("hidden");
  game.versusAI();
  game.reset();
  game.resume();
});

trainAIButton?.addEventListener("click", () => {
  actionContainer?.classList.remove("hidden");
  startScreen?.classList.add("hidden");
  game.trainAI();
  game.reset();
  game.resume();
});

pauseButton?.addEventListener("click", () => {
  game.pause();
  actionContainer?.classList.add("hidden");
  startScreen?.classList.remove("hidden");
  resumeButton?.classList.remove("hidden");
});

resumeButton?.addEventListener("click", () => {
  game.resume();
  actionContainer?.classList.remove("hidden");
  startScreen?.classList.add("hidden");
  resumeButton?.classList.add("hidden");
});
