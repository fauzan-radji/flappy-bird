import { Vec2d, type Point2d } from "kanvasgl";

export default class Rectangle {
  #initialPosition: Vec2d;
  #position: Vec2d;
  #width: number;
  #height: number;
  #halfWidth: number;
  #halfHeight: number;

  constructor(topLeft: Point2d, bottomRight: Point2d) {
    this.#width = Math.abs(bottomRight.x - topLeft.x);
    this.#height = Math.abs(bottomRight.y - topLeft.y);
    this.#halfWidth = this.#width / 2;
    this.#halfHeight = this.#height / 2;
    this.#initialPosition = new Vec2d(
      this.#halfWidth + topLeft.x,
      this.#halfHeight + topLeft.y
    );
    this.#position = this.#initialPosition.copy();
  }

  reset() {
    this.#position = this.#initialPosition.copy();
  }

  move(direction: Point2d) {
    this.#position.add(direction);
  }

  collide(other: Rectangle) {
    return (
      other.left < this.right &&
      other.right > this.left &&
      other.top < this.bottom &&
      other.bottom > this.top
    );
  }

  get position() {
    return this.#position;
  }

  get topLeft() {
    return Vec2d.subtract(this.#position, {
      x: this.#halfWidth,
      y: this.#halfHeight,
    });
  }

  get bottomRight() {
    return Vec2d.add(this.#position, {
      x: this.#halfWidth,
      y: this.#halfHeight,
    });
  }

  get top() {
    return this.#position.y - this.#halfHeight;
  }

  get bottom() {
    return this.#position.y + this.#halfHeight;
  }

  get left() {
    return this.#position.x - this.#halfWidth;
  }

  get right() {
    return this.#position.x + this.#halfWidth;
  }

  get x() {
    return this.#position.x;
  }

  get y() {
    return this.#position.y;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }
}
