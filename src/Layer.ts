import Node, { type SimpleNode } from "./Node";

export type SimpleLayer = SimpleNode[];

export default class Layer {
  #nodes: Node[] = [];

  constructor(nodes: Node[]) {
    this.#nodes = nodes;
  }

  feedForward(input: Layer) {
    for (const node of this.#nodes) {
      node.feedForward(input.#nodes);
    }
  }

  mutate(rate: number): Layer {
    return new Layer(this.#nodes.map((node) => node.mutate(rate)));
  }

  toJSON(): SimpleLayer {
    return this.#nodes.map((node) => node.toJSON());
  }

  get nodes() {
    return this.#nodes;
  }

  static create(nodes: SimpleLayer) {
    return new Layer(nodes.map((node) => Node.create(node)));
  }
}
