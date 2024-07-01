import Edge from "./Edge";
import type Layer from "./Layer";

export default class Level {
  #inputLayer: Layer;
  #outputLayer: Layer;
  #edges: Edge[];

  constructor(inputLayer: Layer, outputLayer: Layer) {
    this.#inputLayer = inputLayer;
    this.#outputLayer = outputLayer;
    this.#edges = [];
    for (const inputNode of inputLayer.nodes) {
      for (const outputNode of outputLayer.nodes) {
        this.#edges.push(
          new Edge(inputNode, outputNode, Math.random() * 2 - 1)
        );
      }
    }
  }

  feedForward() {
    for (const edge of this.#edges) {
      edge.to.value += edge.from.value * edge.weight;
    }
    for (const node of this.#outputLayer.nodes) {
      // Sigmoid activation function
      node.value = 1 / (1 + Math.exp(-node.value - node.bias));
    }
  }

  get inputLayer() {
    return this.#inputLayer;
  }

  get outputLayer() {
    return this.#outputLayer;
  }

  get edges() {
    return this.#edges;
  }
}
