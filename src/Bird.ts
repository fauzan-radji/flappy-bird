import { type Vec2d } from "kanvasgl";

export default class Bird {
  #initialPosition: Vec2d;
  #position: Vec2d;
  #size: number;
  #velocity: number = 0;

  constructor(position: Vec2d, size: number = 20) {
    this.#initialPosition = position;
    this.#position = position.copy();
    this.#size = size;
  }

  reset() {
    this.#position.set(this.#initialPosition);
    this.#velocity = 0;
  }

  jump() {
    if (this.#velocity < 0) return;
    this.#velocity = -8;
  }

  update() {
    this.#velocity = Math.min(this.#velocity + 0.5, Bird.#MAX_VELOCITY);
    this.#position.add({ x: 0, y: this.#velocity });
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

  static #MAX_VELOCITY = 40;
}
