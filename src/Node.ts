import Edge, { type SimpleEdge } from "./Edge";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export interface SimpleNode {
  edges: SimpleEdge[];
  bias: number;
}

export default class Node {
  #value: number = 0;
  #bias: number = 0;
  #edges: Edge[] = [];

  constructor(edges: Edge[], bias?: number) {
    this.#bias = typeof bias === "number" ? bias : Math.random() * 2 - 1;
    this.#edges = edges;
  }

  mutate(rate: number) {
    return new Node(
      this.#edges.map((edge) => edge.mutate(rate)),
      lerp(this.#bias, Math.random() * 2 - 1, rate)
    );
  }

  toJSON(): SimpleNode {
    return {
      bias: this.#bias,
      edges: this.#edges.map((edge) => edge.toJSON()),
    };
  }

  set value(value: number) {
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  get bias() {
    return this.#bias;
  }

  get edges() {
    return this.#edges;
  }

  static create({ bias, edges }: SimpleNode) {
    return new Node(
      edges.map((edge) => Edge.create(edge)),
      bias
    );
  }
}
