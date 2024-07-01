import { type Vec2d } from "kanvasgl";
import Rectangle from "./Rectangle";
import type Brain from "./Brain";

export default class Bird extends Rectangle {
  #size: number;
  #velocity = 0;
  #score = 0;
  #brain: Brain | null = null;

  constructor({
    position,
    size = 20,
    brain,
  }: {
    position: Vec2d;
    size?: number;
    brain?: Brain;
  }) {
    const halfSize = size * 0.5;
    super(
      {
        x: position.x - halfSize,
        y: position.y - halfSize,
      },
      {
        x: position.x + halfSize,
        y: position.y + halfSize,
      }
    );

    this.#size = size;
    if (brain) this.#brain = brain;
  }

  reset() {
    super.reset();
    this.#velocity = 0;
    this.#score = 0;
  }

  jump() {
    this.#velocity = Bird.#MIN_VELOCITY;
  }

  update() {
    this.#velocity = Math.max(
      Math.min(this.#velocity + Bird.#GRAVITY, Bird.#MAX_VELOCITY),
      Bird.#MIN_VELOCITY
    );
    const moveVector = { x: 0, y: this.#velocity };
    this.move(moveVector);
  }

  incrementScore() {
    this.#score++;
  }

  get normalizedVelocity() {
    return (this.#velocity - Bird.#MIN_VELOCITY) / Bird.#MAX_VELOCITY;
  }

  get size() {
    return this.#size;
  }

  get score() {
    return this.#score;
  }

  get brain() {
    return this.#brain;
  }

  static #MAX_VELOCITY = 40;
  static #MIN_VELOCITY = -8;
  static #GRAVITY = 0.5;
}
