import type Kanvas from "kanvasgl";
import Bird from "./Bird";
import Pipe from "./Pipe";
import Rectangle from "./Rectangle";
import Brain from "./Brain";
import Generation from "./Generation";

export enum GAME_MODE {
  TRAIN,
  TEST,
  COMPETE,
  PLAY,
}

export default class Game {
  #viewport: Rectangle;
  #canvas: Kanvas;
  #highScore = 0;
  #pipes: Pipe[] = [];
  #isOver: boolean = false;
  #speed: number;
  #passedTheNextPipe = false;
  #top: number;
  #bottom: number;
  #ceiling: Rectangle;
  #floor: Rectangle;
  #bestBrain: Brain;
  #generation: Generation<Bird>;
  #ai: Bird;
  #player: Bird;
  #mode: GAME_MODE = GAME_MODE.TEST;

  constructor(canvas: Kanvas, brainString: string) {
    this.load();
    this.#bestBrain = Brain.load(brainString);

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
    this.#pipes = this.#generatePipes();

    this.#ai = this.#generateBird(this.#bestBrain);
    this.#player = this.#generateBird();
    this.#generation = new Generation(
      Game.#GENERATION_SIZE,
      (parent) =>
        this.#generateBird(
          parent && parent.brain
            ? parent.brain.mutate(Game.#BRAIN_MUTATION_RATE)
            : this.#bestBrain
            ? this.#bestBrain.mutate(Game.#BRAIN_MUTATION_RATE)
            : new Brain(
                Game.#BRAIN_INPUT,
                Game.#BRAIN_HIDDEN,
                Game.#BRAIN_OUTPUT
              )
        ),
      (bird) => bird.score
    );
    this.#generation.population[0] = this.#generateBird(this.#bestBrain);
  }

  #generateBird(brain?: Brain): Bird {
    return new Bird({
      position: this.#viewport.position.copy({ x: 100 }),
      brain,
    });
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
    let score = 0;
    if (this.#mode === GAME_MODE.TRAIN) {
      const bestBird = this.#generation.best;
      if (bestBird) {
        score = bestBird.score;
        bestBird.reset();
      }
      this.#generation.nextGeneration();
    } else if (this.#mode === GAME_MODE.TEST) {
      score = this.#ai.score;
      this.#ai.reset();
    } else if (this.#mode === GAME_MODE.PLAY) {
      score = this.#player.score;
      this.#player.reset();
    } else if (this.#mode === GAME_MODE.COMPETE) {
      score = Math.max(this.#player.score, this.#ai.score);
      this.#player.reset();
      this.#ai.reset();
    }

    if (score > this.#highScore) this.#highScore = score;
    this.#isOver = false;
    this.#pipes = this.#generatePipes();
    this.#speed = Game.#SPEED;
  }

  save() {
    localStorage.setItem(Game.#KEY_HIGHSCORE, this.#highScore.toString());
    if (this.#generation.best && this.#generation.best.brain) {
      this.#bestBrain = this.#generation.best.brain;
      this.#bestBrain.save();
    }
  }

  load() {
    this.#highScore = +(localStorage.getItem(Game.#KEY_HIGHSCORE) ?? 0);
  }

  update(deltaTime: number) {
    this.#speed += 0.0001;
    for (const pipe of this.#pipes) {
      pipe.update(deltaTime, this.#speed);
    }
    if (this.#pipes[0].right < this.#viewport.left) this.#pipes.shift();
    const lastPipe = this.#pipes.at(-1);
    if (lastPipe) {
      const pipeOrNull = lastPipe.nextIfThereIsSpaceTo(this.#viewport.right);
      if (pipeOrNull) this.#pipes.push(pipeOrNull);
    }
    const nextPipe = this.#getNextPipe();

    if (this.#mode === GAME_MODE.TRAIN) {
      this.#generation.population.forEach((bird, index) => {
        this.#updateBird(bird, nextPipe);
        if (this.#ceiling.collide(bird) || this.#floor.collide(bird))
          this.#generation.eliminate(index);
        if (this.#hitTest(nextPipe, bird)) this.#generation.eliminate(index);
      });
      this.#generation.update();
    } else if (this.#mode === GAME_MODE.TEST) {
      this.#updateBird(this.#ai, nextPipe);
      if (this.#ceiling.collide(this.#ai) || this.#floor.collide(this.#ai))
        this.#isOver = true;
      if (this.#hitTest(nextPipe, this.#ai)) this.#isOver = true;
    }

    if (nextPipe === this.#pipes[1]) {
      if (!this.#passedTheNextPipe) {
        if (this.#mode === GAME_MODE.TRAIN) {
          for (const bird of this.#generation.population) {
            bird.incrementScore();
          }
        } else if (this.#mode === GAME_MODE.TEST) {
          this.#ai.incrementScore();
        }
        this.#passedTheNextPipe = true;
      }
    } else {
      this.#passedTheNextPipe = false;
    }

    if (this.#mode === GAME_MODE.TRAIN && this.#generation.remaining === 0)
      this.#isOver = true;
    if (this.#isOver) this.reset();
  }

  #updateBird(bird: Bird, nextPipe: Pipe) {
    bird.update();
    const output = bird.brain?.feedForward([
      bird.top / this.#viewport.height,
      bird.bottom / this.#viewport.height,
      bird.normalizedVelocity,
      nextPipe.top.bottom / this.#viewport.height,
      nextPipe.bottom.top / this.#viewport.height,
      nextPipe.left / this.#viewport.width,
      nextPipe.right / this.#viewport.width,
    ]) || [0];
    if (output[0] > 0.5) bird.jump();
  }

  #hitTest({ top, bottom }: Pipe, bird: Bird) {
    return top.collide(bird) || bottom.collide(bird);
  }

  #getNextPipe() {
    return [this.#pipes[0], this.#pipes[1]].find(
      (pipe) => pipe.right > this.#generation.population[0].left
    ) as Pipe;
  }

  render() {
    this.#renderFloorAndCeiling();
    this.#renderPipes();

    // Highlight the next pipe
    // const nextPipe = this.#getNextPipe();
    // this.#canvas
    //   .beginPath()
    //   .rect(nextPipe.top.topLeft, nextPipe.top.width, nextPipe.top.height)
    //   .rect(
    //     nextPipe.bottom.topLeft,
    //     nextPipe.bottom.width,
    //     nextPipe.bottom.height
    //   )
    //   .closePath()
    //   .fill("#f00")
    //   .stroke({ color: "black", width: 2 });

    if (this.#mode === GAME_MODE.TRAIN) {
      for (const bird of this.#generation.population) {
        this.#renderBird(bird);
      }
      this.#renderBird(
        this.#generation.best || this.#generation.population[0],
        true
      );

      this.#renderScore(
        this.#highScore,
        this.#generation.best
          ? this.#generation.best.score
          : this.#generation.population[0].score
      );
    } else if (this.#mode === GAME_MODE.TEST) {
      this.#renderBird(this.#ai);
      this.#renderScore(this.#highScore, this.#ai.score);
    }
  }

  #renderFloorAndCeiling() {
    this.#canvas
      .beginPath()
      .rect(this.#ceiling.topLeft, this.#ceiling.width, this.#ceiling.height)
      .rect(this.#floor.topLeft, this.#floor.width, this.#floor.height)
      .closePath()
      .fill("#0f0")
      .stroke({ color: "#000", width: 2 });
  }

  #renderPipes() {
    for (const { top, bottom } of this.#pipes) {
      this.#canvas
        .beginPath()
        .rect(top.topLeft, top.width, top.height)
        .rect(bottom.topLeft, bottom.width, bottom.height)
        .closePath()
        .fill("#0f0")
        .stroke({ color: "black", width: 2 });
    }
  }

  #renderBird(bird: Bird, highlight: boolean = false) {
    this.#canvas
      .beginPath()
      .circle(bird.position, bird.size * 0.5)
      .closePath()
      .fill(highlight ? "#f00" : "#ff0")
      .stroke({ color: "black", width: 2 });
  }

  #renderScore(highScore: number, score: number) {
    this.#canvas
      .text({
        text: `Best score: ${highScore}`,
        at: this.#canvas.center.copy().subtract({ x: 0, y: 130 }),
        fillStyle: "#fff",
        strokeStyle: "transparent",
      })
      .text({
        text: score.toString(),
        at: this.#canvas.center.copy().subtract({ x: 0, y: 100 }),
        size: 36,
        fillStyle: "#fff",
        strokeStyle: "#fff",
      });
  }

  renderNetwork(canvas: Kanvas) {
    if (this.#mode === GAME_MODE.PLAY) return;
    let bird;
    if (this.#mode === GAME_MODE.TRAIN) {
      bird = this.#generation.best || this.#generation.population[0];
    } else {
      bird = this.#ai;
    }
    if (!bird.brain) return;

    const paddingX = 40;
    const paddingTop = this.#mode === GAME_MODE.TRAIN ? 60 : 10;
    const paddingBottom = 10;
    const nodeRadius = 10;
    const viewportWidth = canvas.width - 2 * paddingX - nodeRadius * 2;
    const viewportHeight =
      canvas.height - paddingTop - paddingBottom - nodeRadius * 2;

    if (this.#mode === GAME_MODE.TRAIN) {
      canvas
        .text({
          text: `Generation: ${this.#generation.number}`,
          at: { x: paddingX, y: paddingTop - 20 },
          textAlign: "start",
          fillStyle: "#fff",
          strokeStyle: "transparent",
        })
        .text({
          text: `Population: ${this.#generation.remaining}`,
          at: { x: paddingX, y: paddingTop },
          textAlign: "start",
          fillStyle: "#fff",
          strokeStyle: "transparent",
        });
    }

    const xSpacing = viewportWidth / (bird.brain.layers.length - 1);
    let x = paddingX + nodeRadius;
    // Edges / Connections
    for (let i = 1; i < bird.brain.layers.length; i++) {
      const inputLayer = bird.brain.layers[i - 1];
      const outputLayer = bird.brain.layers[i];
      const xInput = x;
      const xOutput = x + xSpacing;
      const yInputSpacing = viewportHeight / inputLayer.nodes.length;
      const yOutputSpacing = viewportHeight / outputLayer.nodes.length;
      let yInput = paddingTop + yInputSpacing * 0.5 + nodeRadius;

      for (let i = 0; i < inputLayer.nodes.length; i++) {
        let yOutput = paddingTop + yOutputSpacing * 0.5 + nodeRadius;
        for (let j = 0; j < outputLayer.nodes.length; j++) {
          const edge = outputLayer.nodes[j].edges[i];
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

    x = paddingX + nodeRadius;
    // Nodes
    for (const layer of bird.brain.layers) {
      const ySpacing = viewportHeight / layer.nodes.length;
      let y = paddingTop + ySpacing * 0.5 + nodeRadius;

      for (const node of layer.nodes) {
        canvas
          .beginPath()
          .circle({ x, y }, nodeRadius)
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

  get isOver() {
    return this.#isOver;
  }

  static #SPEED = 1;
  static #KEY_HIGHSCORE = "highscore";
  static #BRAIN_INPUT = 7;
  static #BRAIN_HIDDEN = [4];
  static #BRAIN_OUTPUT = 1;
  static #BRAIN_MUTATION_RATE = 0.01;
  static #GENERATION_SIZE = 1000;
}
