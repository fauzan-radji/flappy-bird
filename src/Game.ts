import type Kanvas from "kanvasgl";
import Bird from "./Bird";

export default class Game {
  #canvas: Kanvas;
  #bird: Bird;
  #isOver: boolean = false;

  constructor(canvas: Kanvas) {
    this.#canvas = canvas;
    this.#bird = new Bird(canvas.center.copy({ x: 30 }));

    window.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "ArrowUp") this.#bird.jump();
    });
    window.addEventListener("click", () => this.#bird.jump());
  }

  reset() {
    this.#bird.reset();
    this.#isOver = false;
  }

  update() {
    this.#bird.update();
    if (
      this.#bird.position.y > this.#canvas.height ||
      this.#bird.position.y < 0
    )
      this.#isOver = true;
  }

  render() {
    // Draw the bird
    this.#canvas
      .beginPath()
      .circle(this.bird.position, this.bird.size)
      .closePath()
      .fill("black");
  }

  get bird() {
    return this.#bird;
  }

  get isOver() {
    return this.#isOver;
  }
}
