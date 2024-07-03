import Node, { type SimpleNode } from "./Node";

export type SimpleLayer = SimpleNode[];

export default class Layer {
  #nodes: Node[] = [];

  constructor(nodes: Node[]) {
    this.#nodes = nodes;
  }

  // TODO: Maybe I can move this to the Node class
  feedForward(input: Layer) {
    for (const node of this.#nodes) {
      const sum = node.edges.reduce(
        (sum, edge, i) => sum + input.#nodes[i].value * edge.weight,
        0
      );
      node.value = 1 / (1 + Math.exp(-sum - node.bias));
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
