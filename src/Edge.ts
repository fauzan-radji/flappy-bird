function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export type SimpleEdge = number;

export default class Edge {
  #weight: number;

  constructor() {
    this.#weight = Math.random() * 2 - 1;
  }

  mutate(rate: number): Edge {
    const newEdge = new Edge();
    newEdge.#weight = lerp(this.#weight, Math.random() * 2 - 1, rate);
    return newEdge;
  }

  toJSON(): SimpleEdge {
    return this.#weight;
  }

  get weight() {
    return this.#weight;
  }

  static create(weight: SimpleEdge) {
    const newEdge = new Edge();
    newEdge.#weight = weight;
    return newEdge;
  }
}
