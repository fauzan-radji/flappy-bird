import Node from "./Node";

export default class Layer {
  #nodes: Node[] = [];

  constructor(size: number, bias?: number) {
    for (let i = 0; i < size; i++) {
      this.#nodes.push(
        new Node(typeof bias === "number" ? bias : Math.random() * 2 - 1)
      );
    }
  }

  get nodes() {
    return this.#nodes;
  }
}
