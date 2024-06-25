import Kanvas from "kanvasgl";
import Game from "./Game";

const canvas = new Kanvas("canvas", innerWidth, innerHeight);
canvas.background("skyblue");
const game = new Game(canvas);
loop();

function loop() {
  game.update();

  draw();
  if (game.isOver) game.reset();

  requestAnimationFrame(loop);
}

function draw() {
  canvas.clear();
  game.render();
}

addEventListener("resize", () => {
  canvas.resize(innerWidth, innerHeight);
  game.render();
});
