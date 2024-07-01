import Layer from "./Layer";
import Level from "./Level";
export default class Brain {
    #private;
    constructor(inputs: number, hidden: number[], outputs: number);
    feedForward(inputs: number[]): number[];
    get levels(): Level[];
    get layers(): Layer[];
}
