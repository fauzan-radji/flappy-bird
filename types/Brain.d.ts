import Layer, { SimpleLayer } from "./Layer";
interface SimpleBrain {
    input: number;
    hidden: number[];
    output: number;
    layers: SimpleLayer[];
}
export default class Brain {
    #private;
    constructor(input: number, hidden: number[], output: number);
    feedForward(inputs: number[]): number[];
    mutate(rate: number): Brain;
    toJSON(): SimpleBrain;
    get layers(): Layer[];
    static from(brainString: string): Brain;
}
export {};
