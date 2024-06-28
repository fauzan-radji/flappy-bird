import type Kanvas from "kanvasgl";
import Bird from "./Bird";
import Pipe from "./Pipe";

export default class Game {
  #canvas: Kanvas;
  #bird: Bird;
  #pipes: Pipe[] = [];
  #isOver: boolean = false;

  constructor(canvas: Kanvas) {
    Pipe.TOP_BOUNDARY = 0;
    Pipe.BOTTOM_BOUNDARY = canvas.height;

    this.#canvas = canvas;
    this.#bird = new Bird(canvas.center.copy({ x: 100 }));
    this.#pipes = this.#generatePipes();

    window.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "ArrowUp") this.#bird.jump();
    });
    window.addEventListener("click", () => this.#bird.jump());
  }

  #generatePipes() {
    const pipes = [];
    let lastPipe = new Pipe(this.#canvas.center.x, this.#canvas.center.y);
    pipes.push(lastPipe);
    while (true) {
      const nextPipe = lastPipe.nextIfThereIsSpaceTo(this.#canvas.width);
      if (nextPipe === null) break;
      pipes.push(nextPipe);
      lastPipe = nextPipe;
    }
    return pipes;
  }

  reset() {
    this.#bird.reset();
    this.#isOver = false;
    this.#pipes = this.#generatePipes();
  }

  update() {
    this.#bird.update();
    for (const pipe of this.#pipes) {
      pipe.update();
    }
    if (this.#pipes[0].right < 0) this.#pipes.shift();

    const lastPipe = this.#pipes.at(-1);
    if (lastPipe) {
      const pipeOrNull = lastPipe.nextIfThereIsSpaceTo(this.#canvas.width);
      if (pipeOrNull) this.#pipes.push(pipeOrNull);
    }

    if (this.#bird.bottom >= this.#canvas.height || this.#bird.top <= 0)
      this.#isOver = true;

    if (this.#hitTest()) this.#isOver = true;
  }

  #hitTest() {
    const nextPipe = this.#getNextPipe();
    if (!nextPipe) return false;
    return (
      this.#bird.right >= nextPipe.left &&
      this.#bird.left <= nextPipe.right &&
      (this.#bird.top <= nextPipe.bottomOfTopPart ||
        this.#bird.bottom >= nextPipe.topOfBottomPart)
    );
  }

  #getNextPipe() {
    return [this.#pipes[0], this.#pipes[1]].find(
      (pipe) => pipe.right > this.#bird.position.x
    );
  }

  render() {
    // Draw the bird
    this.#canvas
      .beginPath()
      .circle(this.bird.position, this.bird.size / 2)
      .closePath()
      .fill("#ff0")
      .stroke({ color: "black", width: 2 });

    // Draw the pipes
    for (const pipe of this.#pipes) {
      this.#canvas
        .beginPath()
        .rect({ x: pipe.left, y: 0 }, Pipe.SIZE, pipe.bottomOfTopPart)
        .rect(
          { x: pipe.left, y: pipe.topOfBottomPart },
          Pipe.SIZE,
          this.#canvas.height - pipe.topOfBottomPart
        )
        .closePath()
        .fill("#0f0")
        .stroke({ color: "black", width: 2 });
    }
  }

  get bird() {
    return this.#bird;
  }

  get isOver() {
    return this.#isOver;
  }
}
