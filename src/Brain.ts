import Layer from "./Layer";
import Level from "./Level";

export default class Brain {
  #levels: Level[];
  #layers: Layer[];

  constructor(inputs: number, hidden: number[], outputs: number) {
    this.#layers = [
      new Layer(inputs, 0),
      ...hidden.map((size) => new Layer(size)),
      new Layer(outputs),
    ];
    this.#levels = [];
    for (let i = 0; i < this.#layers.length - 1; i++) {
      this.#levels.push(new Level(this.#layers[i], this.#layers[i + 1]));
    }
  }

  feedForward(inputs: number[]): number[] {
    this.#layers[0].nodes.forEach((node, i) => {
      node.value = inputs[i];
    });

    for (const level of this.#levels) {
      level.feedForward();
    }

    return this.#layers[this.#layers.length - 1].nodes.map(
      (node) => node.value
    );
  }

  get levels() {
    return this.#levels;
  }

  get layers() {
    return this.#layers;
  }
}
