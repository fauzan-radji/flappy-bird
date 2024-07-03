export default class Generation<T> {
    #private;
    constructor(size: number, createEntity: (parent?: T) => T, fitness: (entity: T) => number);
    update(): void;
    eliminate(index: number): void;
    nextGeneration(): void;
    get number(): number;
    get population(): T[];
    get best(): T | null;
    get remaining(): number;
}
