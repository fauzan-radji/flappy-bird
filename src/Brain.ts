import Edge from "./Edge";
import Layer, { SimpleLayer } from "./Layer";
import Node from "./Node";

interface SimpleBrain {
  input: number;
  hidden: number[];
  output: number;
  layers: SimpleLayer[];
}

export default class Brain {
  #inputSize: number;
  #hiddenSizes: number[];
  #outputSize: number;
  #layers: Layer[];

  constructor(input: number, hidden: number[], output: number) {
    this.#inputSize = input;
    this.#hiddenSizes = hidden;
    this.#outputSize = output;

    const inputLayer = new Layer(
      Array.from({ length: input }, () => new Node([], 0))
    );
    const hiddenLayers = [
      new Layer(
        Array.from(
          { length: hidden[0] },
          () => new Node(Array.from({ length: input }, () => new Edge()))
        )
      ),
    ];
    for (let i = 1; i < hidden.length; i++) {
      hiddenLayers.push(
        new Layer(
          Array.from(
            { length: hidden[i - 1] },
            () => new Node(Array.from({ length: input }, () => new Edge()))
          )
        )
      );
    }
    const outputLayer = new Layer(
      Array.from(
        { length: output },
        () =>
          new Node(
            Array.from({ length: hidden[hidden.length - 1] }, () => new Edge())
          )
      )
    );

    this.#layers = [inputLayer, ...hiddenLayers, outputLayer];
  }

  feedForward(inputs: number[]): number[] {
    this.#layers[0].nodes.forEach((node, i) => {
      node.value = inputs[i];
    });

    for (let i = 1; i < this.#layers.length; i++) {
      this.#layers[i].feedForward(this.#layers[i - 1]);
    }

    return this.#layers[this.#layers.length - 1].nodes.map(
      (node) => node.value
    );
  }

  mutate(rate: number): Brain {
    const newBrain = new Brain(
      this.#inputSize,
      this.#hiddenSizes,
      this.#outputSize
    );
    for (let i = 1; i < this.#layers.length; i++) {
      newBrain.#layers[i] = this.#layers[i].mutate(rate);
    }

    return newBrain;
  }

  toJSON(): SimpleBrain {
    return {
      input: this.#inputSize,
      hidden: this.#hiddenSizes,
      output: this.#outputSize,
      layers: this.#layers.map((layer) => layer.toJSON()),
    };
  }

  get layers() {
    return this.#layers;
  }

  static from(brainString: string) {
    const { input, hidden, output, layers } = JSON.parse(
      brainString
    ) as SimpleBrain;

    const newBrain = new Brain(input, hidden, output);
    for (let i = 0; i < layers.length; i++) {
      newBrain.#layers[i] = Layer.create(layers[i]);
    }
    return newBrain;
  }
}
