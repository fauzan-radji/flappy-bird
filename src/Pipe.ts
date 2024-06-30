import { Vec2d } from "kanvasgl";
import Rectangle from "./Rectangle";

export default class Pipe {
  #position: Vec2d;
  #top: Rectangle;
  #bottom: Rectangle;

  constructor(x: number, y: number) {
    y = Math.min(
      Pipe.#BOTTOM_BOUNDARY - Pipe.#GAP / 2 - Pipe.#PADDING,
      Math.max(Pipe.#TOP_BOUNDARY + Pipe.#GAP / 2 + Pipe.#PADDING, y)
    );
    this.#position = new Vec2d(x, y);
    const halfSize = Pipe.#SIZE * 0.5;
    const halfGap = Pipe.#GAP * 0.5;
    this.#top = new Rectangle(
      {
        x: x - halfSize,
        y: Pipe.#TOP_BOUNDARY,
      },
      {
        x: x + halfSize,
        y: y - halfGap,
      }
    );
    this.#bottom = new Rectangle(
      {
        x: x - halfSize,
        y: y + halfGap,
      },
      {
        x: x + halfSize,
        y: Pipe.#BOTTOM_BOUNDARY,
      }
    );
  }

  update(deltaTime: number, speed: number) {
    const moveVector = Vec2d.multiply({ x: -2, y: 0 }, deltaTime * speed);
    this.#top.move(moveVector);
    this.#bottom.move(moveVector);
    this.#position.add(moveVector);
  }

  nextIfThereIsSpaceTo(rightBorder: number): Pipe | null {
    const nextPipePosition = this.#calculateNextPipePosition();
    if (nextPipePosition.x < rightBorder + Pipe.#SIZE / 2) {
      return new Pipe(nextPipePosition.x, nextPipePosition.y);
    }
    return null;
  }

  #calculateNextPipePosition() {
    const nextX = this.#position.x + Pipe.#SIZE + Pipe.#GAP_BETWEEN_PIPES;
    const deltaY = Math.random() * 100 + 100;
    const alreadyAtTop =
      this.#position.y - deltaY <
      Pipe.#TOP_BOUNDARY + Pipe.#GAP / 2 + Pipe.#PADDING;
    const alreadyAtBottom =
      this.#position.y + deltaY >
      Pipe.#BOTTOM_BOUNDARY - Pipe.#GAP / 2 - Pipe.#PADDING;
    let nextY = this.#position.y;
    if (alreadyAtTop) {
      nextY += deltaY;
    } else if (alreadyAtBottom) {
      nextY -= deltaY;
    } else {
      nextY += deltaY * Math.sign(Math.random() - 0.5);
    }

    return { x: nextX, y: nextY };
  }

  get left() {
    return this.#position.x - Pipe.#SIZE / 2;
  }

  get right() {
    return this.#position.x + Pipe.#SIZE / 2;
  }

  get top() {
    return this.#top;
  }

  get bottom() {
    return this.#bottom;
  }

  static #GAP = 150;
  static #SIZE = 50;
  static #GAP_BETWEEN_PIPES = 300;
  static #TOP_BOUNDARY = 0;
  static #BOTTOM_BOUNDARY = 0;
  static #PADDING = 20;

  static set TOP_BOUNDARY(value: number) {
    Pipe.#TOP_BOUNDARY = value;
  }

  static set BOTTOM_BOUNDARY(value: number) {
    Pipe.#BOTTOM_BOUNDARY = value;
  }

  static get SIZE() {
    return Pipe.#SIZE;
  }
}
