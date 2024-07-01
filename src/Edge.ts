import Node from "./Node";

export default class Edge {
  #from: Node;
  #to: Node;
  #weight: number;

  constructor(from: Node, to: Node, weight: number) {
    this.#from = from;
    this.#to = to;
    this.#weight = weight;
  }

  get from() {
    return this.#from;
  }

  get to() {
    return this.#to;
  }

  get weight() {
    return this.#weight;
  }
}
