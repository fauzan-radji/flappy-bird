export type SimpleEdge = number;
export default class Edge {
    #private;
    constructor();
    mutate(rate: number): Edge;
    toJSON(): SimpleEdge;
    get weight(): number;
    static create(weight: SimpleEdge): Edge;
}
