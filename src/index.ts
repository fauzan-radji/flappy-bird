import Kanvas from "kanvasgl";
import Game from "./Game";

const networkCanvas = new Kanvas("network", 600, 300);
networkCanvas.background("#012");

const canvas = new Kanvas("canvas", innerWidth, innerHeight);
canvas.background("skyblue");
const game = new Game(canvas);

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
  canvas.clear();
  game.render();

  networkCanvas.clear();
  game.renderNetwork(networkCanvas);
}

addEventListener("resize", () => {
  canvas.resize(innerWidth, innerHeight);
  game.render();
});
