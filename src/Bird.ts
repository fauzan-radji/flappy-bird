import { type Vec2d } from "kanvasgl";

export default class Bird {
  #initialPosition: Vec2d;
  #position: Vec2d;
  #size: number;
  #velocity = 0;
  #score = 0;

  constructor(position: Vec2d, size: number = 20) {
    this.#initialPosition = position;
    this.#position = position.copy();
    this.#size = size;
  }

  reset() {
    this.#position.set(this.#initialPosition);
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
    this.#position.add({ x: 0, y: this.#velocity });
  }

  incrementScore() {
    this.#score++;
  }

  get position() {
    return this.#position;
  }

  get size() {
    return this.#size;
  }

  get left() {
    return this.#position.x - this.#size / 2;
  }

  get right() {
    return this.#position.x + this.#size / 2;
  }

  get top() {
    return this.#position.y - this.#size / 2;
  }

  get bottom() {
    return this.#position.y + this.#size / 2;
  }

  get score() {
    return this.#score;
  }

  static #MAX_VELOCITY = 40;
  static #MIN_VELOCITY = -8;
  static #GRAVITY = 0.5;
}
