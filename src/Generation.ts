export default class Generation<T> {
  #number: number;
  #size: number;
  #population: T[];
  #best: T | null = null;
  #fitness: (entity: T) => number;
  #createEntity: (parent?: T) => T;

  constructor(
    size: number,
    createEntity: (parent?: T) => T,
    fitness: (entity: T) => number
  ) {
    this.#number = 1;
    this.#size = size;
    this.#population = Array.from({ length: size }, createEntity);
    this.#createEntity = createEntity;
    this.#fitness = fitness;
  }

  update() {
    if (this.remaining === 0) return;
    const arguablyBest = this.#population.reduce(
      (best, current) =>
        this.#fitness(current) > this.#fitness(best) ? current : best,
      this.#population[0]
    );

    const arguablyBestFitness = this.#fitness(arguablyBest);
    if (
      arguablyBestFitness > 0 &&
      (!this.#best || arguablyBestFitness > this.#fitness(this.#best))
    ) {
      this.#best = arguablyBest;
    }
  }

  eliminate(index: number) {
    this.#population.splice(index, 1);
  }

  nextGeneration() {
    this.#number++;
    const nextGeneration = [];
    for (let i = 0; i < this.#size; i++) {
      nextGeneration.push(this.#createEntity(this.#best ?? undefined));
    }
    if (this.#best) {
      nextGeneration[0] = this.#best;
    }
    this.#population = nextGeneration;
  }

  get number() {
    return this.#number;
  }

  get population() {
    return this.#population;
  }

  get best() {
    return this.#best;
  }

  get remaining() {
    return this.#population.length;
  }
}
