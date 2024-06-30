import type Kanvas from "kanvasgl";
import Bird from "./Bird";
import Pipe from "./Pipe";
import Rectangle from "./Rectangle";

export default class Game {
  #canvas: Kanvas;
  #bird: Bird;
  #highScore = 0;
  #pipes: Pipe[] = [];
  #isOver: boolean = false;
  #speed: number;
  #passedTheNextPipe = false;
  #top: number;
  #bottom: number;
  #ceiling: Rectangle;
  #floor: Rectangle;

  constructor(canvas: Kanvas) {
    const floorHeight = 20;
    const ceilingHeight = 20;
    this.#top = ceilingHeight;
    this.#bottom = canvas.height - floorHeight;
    this.#ceiling = new Rectangle(
      { x: 0, y: 0 },
      { x: canvas.width, y: this.#top }
    );
    this.#floor = new Rectangle(
      { x: 0, y: this.#bottom },
      { x: canvas.width, y: canvas.height }
    );
    Pipe.TOP_BOUNDARY = this.#top;
    Pipe.BOTTOM_BOUNDARY = this.#bottom;
    this.#speed = Game.#SPEED;

    this.#canvas = canvas;
    this.#bird = new Bird(canvas.center.copy({ x: 100 }));
    this.#pipes = this.#generatePipes();

    window.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "ArrowUp") this.#bird.jump();
    });
    window.addEventListener("click", () => this.#bird.jump());

    this.load();
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
    this.save();
    if (this.#bird.score > this.#highScore) this.#highScore = this.#bird.score;
    this.#bird.reset();
    this.#isOver = false;
    this.#pipes = this.#generatePipes();
    this.#speed = Game.#SPEED;
  }

  save() {
    localStorage.setItem(Game.#KEY_HIGHSCORE, this.#highScore.toString());
  }

  load() {
    this.#highScore = +(localStorage.getItem(Game.#KEY_HIGHSCORE) ?? 0);
  }

  update(deltaTime: number) {
    this.#speed += 0.001;
    this.#bird.update();
    for (const pipe of this.#pipes) {
      pipe.update(deltaTime, this.#speed);
    }
    if (this.#pipes[0].right < 0) this.#pipes.shift();

    const lastPipe = this.#pipes.at(-1);
    if (lastPipe) {
      const pipeOrNull = lastPipe.nextIfThereIsSpaceTo(this.#canvas.width);
      if (pipeOrNull) this.#pipes.push(pipeOrNull);
    }

    if (this.#ceiling.collide(this.#bird) || this.#floor.collide(this.#bird))
      this.#isOver = true;

    const nextPipe = this.#getNextPipe();
    if (nextPipe) {
      if (nextPipe === this.#pipes[1]) {
        if (!this.#passedTheNextPipe) {
          this.#bird.incrementScore();
          this.#passedTheNextPipe = true;
        }
      } else {
        this.#passedTheNextPipe = false;
      }
      if (this.#hitTest(nextPipe)) this.#isOver = true;
    }

    if (this.#isOver) this.reset();
  }

  #hitTest({ top, bottom }: Pipe) {
    return top.collide(this.#bird) || bottom.collide(this.#bird);
  }

  #getNextPipe() {
    return [this.#pipes[0], this.#pipes[1]].find(
      (pipe) => pipe.right > this.#bird.left
    );
  }

  render() {
    // Draw the floor
    this.#canvas
      .beginPath()
      .rect(this.#ceiling.topLeft, this.#ceiling.width, this.#ceiling.height)
      .rect(this.#floor.topLeft, this.#floor.width, this.#floor.height)
      .closePath()
      .fill("#0f0")
      .stroke({ color: "#000", width: 2 });

    // Draw the pipes
    for (const { top, bottom } of this.#pipes) {
      this.#canvas
        .beginPath()
        .rect(top.topLeft, top.width, top.height)
        .rect(bottom.topLeft, bottom.width, bottom.height)
        .closePath()
        .fill("#0f0")
        .stroke({ color: "black", width: 2 });
    }

    // Draw the bird
    this.#canvas
      .beginPath()
      .circle(this.#bird.position, this.#bird.size / 2)
      .closePath()
      .fill("#ff0")
      .stroke({ color: "black", width: 2 });

    // Draw the score
    this.#canvas
      .text({
        text: `Best score: ${this.#highScore}`,
        at: this.#canvas.center.copy().subtract({ x: 0, y: 130 }),
        fillStyle: "#fff",
        strokeStyle: "transparent",
      })
      .text({
        text: this.#bird.score.toString(),
        at: this.#canvas.center.copy().subtract({ x: 0, y: 100 }),
        size: 36,
        fillStyle: "#fff",
        strokeStyle: "#fff",
      });
  }

  get bird() {
    return this.#bird;
  }

  get isOver() {
    return this.#isOver;
  }

  static #SPEED = 1;
  static #KEY_HIGHSCORE = "highscore";
}
