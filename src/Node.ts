export default class Node {
  #value: number = 0;
  #bias: number = 0;

  constructor(bias: number) {
    this.#bias = bias;
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
}
