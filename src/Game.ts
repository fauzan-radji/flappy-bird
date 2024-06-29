import type Kanvas from "kanvasgl";
import Bird from "./Bird";
import Pipe from "./Pipe";

export default class Game {
  #canvas: Kanvas;
  #bird: Bird;
  #highScore = 0;
  #pipes: Pipe[] = [];
  #isOver: boolean = false;
  #speed: number;
  #passedTheNextPipe = false;

  constructor(canvas: Kanvas) {
    Pipe.TOP_BOUNDARY = 0;
    Pipe.BOTTOM_BOUNDARY = canvas.height;
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
    this.#speed += 0.0001;
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

    if (this.#bird.bottom >= this.#canvas.height || this.#bird.top <= 0)
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

  #hitTest(pipe: Pipe) {
    return (
      this.#bird.right >= pipe.left &&
      this.#bird.left <= pipe.right &&
      (this.#bird.top <= pipe.bottomOfTopPart ||
        this.#bird.bottom >= pipe.topOfBottomPart)
    );
  }

  #getNextPipe() {
    return [this.#pipes[0], this.#pipes[1]].find(
      (pipe) => pipe.right > this.#bird.left
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
