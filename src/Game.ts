import type Kanvas from "kanvasgl";
import Bird from "./Bird";
import Pipe from "./Pipe";
import Rectangle from "./Rectangle";
import Brain from "./Brain";

export default class Game {
  #viewport: Rectangle;
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
    this.#viewport = new Rectangle(
      { x: 0, y: 0 },
      { x: canvas.width, y: canvas.height }
    );
    const floorHeight = 20;
    const ceilingHeight = 20;
    this.#top = this.#viewport.top + ceilingHeight;
    this.#bottom = this.#viewport.bottom - floorHeight;
    this.#ceiling = new Rectangle(
      { x: 0, y: 0 },
      { x: this.#viewport.right, y: this.#top }
    );
    this.#floor = new Rectangle(
      { x: 0, y: this.#bottom },
      { x: this.#viewport.right, y: this.#viewport.bottom }
    );
    Pipe.TOP_BOUNDARY = this.#top;
    Pipe.BOTTOM_BOUNDARY = this.#bottom;
    this.#speed = Game.#SPEED;

    this.#canvas = canvas;
    this.#bird = new Bird({
      position: this.#viewport.position.copy({ x: 100 }),
      brain: new Brain(7, [4], 1),
    });
    this.#pipes = this.#generatePipes();

    window.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "ArrowUp") this.#bird.jump();
    });
    window.addEventListener("click", () => this.#bird.jump());

    this.load();
  }

  #generatePipes() {
    const pipes = [];
    let lastPipe = new Pipe(
      this.#viewport.position.x,
      this.#viewport.position.y
    );
    pipes.push(lastPipe);
    while (true) {
      const nextPipe = lastPipe.nextIfThereIsSpaceTo(this.#viewport.right);
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
    const nextPipe = this.#getNextPipe();

    const output = this.#bird.brain?.feedForward([
      this.#bird.top / this.#viewport.height,
      this.#bird.bottom / this.#viewport.height,
      this.#bird.normalizedVelocity,
      nextPipe.top.bottom / this.#viewport.height,
      nextPipe.bottom.top / this.#viewport.height,
      nextPipe.left / this.#viewport.width,
      nextPipe.right / this.#viewport.width,
    ]) || [0];
    if (output[0] > 0.5) this.#bird.jump();

    const lastPipe = this.#pipes.at(-1);
    if (lastPipe) {
      const pipeOrNull = lastPipe.nextIfThereIsSpaceTo(this.#viewport.right);
      if (pipeOrNull) this.#pipes.push(pipeOrNull);
    }

    if (this.#ceiling.collide(this.#bird) || this.#floor.collide(this.#bird))
      this.#isOver = true;

    if (nextPipe === this.#pipes[1]) {
      if (!this.#passedTheNextPipe) {
        this.#bird.incrementScore();
        this.#passedTheNextPipe = true;
      }
    } else {
      this.#passedTheNextPipe = false;
    }
    if (this.#hitTest(nextPipe)) this.#isOver = true;

    if (this.#isOver) this.reset();
  }

  #hitTest({ top, bottom }: Pipe) {
    return top.collide(this.#bird) || bottom.collide(this.#bird);
  }

  #getNextPipe() {
    return [this.#pipes[0], this.#pipes[1]].find(
      (pipe) => pipe.right > this.#bird.left
    ) as Pipe;
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

    // Draw the next pipe
    const nextPipe = this.#getNextPipe();
    this.#canvas
      .beginPath()
      .rect(nextPipe.top.topLeft, nextPipe.top.width, nextPipe.top.height)
      .rect(
        nextPipe.bottom.topLeft,
        nextPipe.bottom.width,
        nextPipe.bottom.height
      )
      .closePath()
      .fill("#f00")
      .stroke({ color: "black", width: 2 });

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

  renderNetwork(canvas: Kanvas) {
    if (!this.#bird.brain) return;

    const paddingX = 40;
    const paddingY = 10;
    const viewportWidth = canvas.width - 2 * paddingX;
    const viewportHeight = canvas.height - 2 * paddingY;

    const xSpacing = viewportWidth / (this.#bird.brain.layers.length - 1);
    let x = paddingX;
    // Edges / Connections
    for (const level of this.#bird.brain.levels) {
      const xInput = x;
      const xOutput = x + xSpacing;
      const yInputSpacing = viewportHeight / level.inputLayer.nodes.length;
      const yOutputSpacing = viewportHeight / level.outputLayer.nodes.length;
      let yInput = paddingY + yInputSpacing / 2;

      for (let i = 0; i < level.inputLayer.nodes.length; i++) {
        let yOutput = paddingY + yOutputSpacing / 2;
        for (let j = 0; j < level.outputLayer.nodes.length; j++) {
          const edge = level.edges[i * level.outputLayer.nodes.length + j];
          canvas
            .beginPath()
            .line({ x: xInput, y: yInput }, { x: xOutput, y: yOutput })
            .closePath()
            .stroke({
              color: edge.weight < 0 ? "#f00" : "#00f",
              width: Math.abs(edge.weight * 2) + 1,
            });

          yOutput += yOutputSpacing;
        }
        yInput += yInputSpacing;
      }

      x += xSpacing;
    }

    x = paddingX;
    // Nodes
    for (const layer of this.#bird.brain.layers) {
      const ySpacing = viewportHeight / layer.nodes.length;
      let y = paddingY + ySpacing / 2;

      for (const node of layer.nodes) {
        canvas
          .beginPath()
          .circle({ x, y }, 10)
          .closePath()
          .fill(`#012`)
          .fill(`rgba(255, 255, 0, ${Math.abs(node.value).toFixed(2)})`)
          .stroke({
            color: node.bias < 0 ? "#f00" : "#00f",
            width: 2,
          });

        y += ySpacing;
      }

      x += xSpacing;
    }
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
